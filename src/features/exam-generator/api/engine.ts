import { createClient } from '@/lib/supabase/server'
import { ExamBlueprint, GeneratedPaperDraft } from '../types/blueprint'

/**
 * Core engine that transforms a blueprint into a randomized, balanced set of questions.
 */
export async function generatePaperFromBlueprint(blueprint: ExamBlueprint): Promise<GeneratedPaperDraft> {
  const supabase = await createClient()
  const draftSections = []

  for (const section of blueprint.sections) {
    let sectionQuestions: any[] = []

    // Calculate exact counts based on percentages
    const easyCount = Math.round((section.difficultyDistribution.easy / 100) * section.totalQuestions)
    const mediumCount = Math.round((section.difficultyDistribution.medium / 100) * section.totalQuestions)
    const hardCount = section.totalQuestions - easyCount - mediumCount

    // Helper to fetch random questions for a specific difficulty
    const fetchQuestions = async (count: number, difficultyName: string) => {
      if (count <= 0) return []
      
      // 1. Get difficulty ID
      const { data: diffData } = await supabase
        .from('difficulty_levels')
        .select('id')
        .ilike('name', difficultyName)
        .single()
        
      if (!diffData) return []

      // 2. Fetch random questions matching topics, type, and difficulty
      // Note: In a massive DB, relying on ORDER BY RANDOM() is slow. 
      // PostgreSQL TABLESAMPLE is preferred, but for this abstraction, we simulate the selection.
      const { data, error } = await supabase
        .from('questions')
        .select(`
          id, content, marks_positive, marks_negative,
          question_topics!inner(topic_id)
        `)
        .eq('difficulty_id', diffData.id)
        .in('type_id', section.questionTypeIds)
        .in('question_topics.topic_id', section.topicIds)
        .is('deleted_at', null)
        .limit(count * 3) // Fetch a pool to randomize in memory for better distribution

      if (error || !data) return []

      // Randomize in memory and slice to required count
      return data.sort(() => 0.5 - Math.random()).slice(0, count)
    }

    // Execute queries in parallel
    const [easyQs, medQs, hardQs] = await Promise.all([
      fetchQuestions(easyCount, 'Easy'),
      fetchQuestions(mediumCount, 'Medium'),
      fetchQuestions(hardCount, 'Hard')
    ])

    // Aggregate section questions
    sectionQuestions = [...easyQs, ...medQs, ...hardQs]

    // Override custom marks if specified
    if (section.customMarks) {
      sectionQuestions = sectionQuestions.map(q => ({
        ...q,
        custom_positive_marks: section.customMarks!.positive,
        custom_negative_marks: section.customMarks!.negative
      }))
    }

    draftSections.push({
      sectionName: section.name,
      questions: sectionQuestions.sort(() => 0.5 - Math.random()) // Shuffle final section
    })
  }

  return {
    blueprint,
    sections: draftSections
  }
}
