'use server'

import { createClient } from '@/lib/supabase/server'
import { generatePaperFromBlueprint } from './engine'
import { ExamBlueprint, GeneratedPaperDraft } from '../types/blueprint'

export async function draftPaper(blueprint: ExamBlueprint) {
  try {
    const draft = await generatePaperFromBlueprint(blueprint)
    return { data: draft, error: null }
  } catch (err: any) {
    return { data: null, error: err.message }
  }
}

export async function commitGeneratedPaper(draft: GeneratedPaperDraft) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Calculate total marks
  let totalMarks = 0
  draft.sections.forEach(s => {
    s.questions.forEach(q => {
      totalMarks += Number(q.custom_positive_marks || q.marks_positive || 0)
    })
  })

  // 1. Create Paper Record
  const { data: paper, error: paperErr } = await supabase
    .from('generated_papers')
    .insert({
      exam_id: draft.blueprint.examId,
      title: draft.blueprint.title,
      duration_minutes: draft.blueprint.durationMinutes,
      total_marks: totalMarks,
      status: 'published',
      config: draft.blueprint,
      created_by: user.id
    })
    .select()
    .single()

  if (paperErr) throw new Error(paperErr.message)

  // 2. Insert Paper Questions mapped to sections
  let globalOrder = 1
  const paperQuestions = []
  
  for (const section of draft.sections) {
    for (const q of section.questions) {
      paperQuestions.push({
        paper_id: paper.id,
        question_id: q.id,
        section_name: section.sectionName,
        question_order: globalOrder++,
        custom_positive_marks: q.custom_positive_marks || null,
        custom_negative_marks: q.custom_negative_marks || null
      })
    }
  }

  const { error: pqErr } = await supabase.from('paper_questions').insert(paperQuestions)
  if (pqErr) throw new Error(pqErr.message)

  return paper
}
