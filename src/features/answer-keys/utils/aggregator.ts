import { OptionMap } from '../../exam-generator/algorithms/shuffler'

export interface AnswerKeyRow {
  questionNumber: number
  questionId: string
  correctOptionLetter: string
  marks: number
  negativeMarks: number
  difficulty: string
  chapter: string
  topic: string
}

/**
 * Aggregates raw Question Data and Shuffle OptionMaps to produce 
 * the 100% accurate final answer key for a specific set.
 */
export function buildAnswerKey(
  questions: any[], 
  answerKeyMap: Record<string, OptionMap[]>
): AnswerKeyRow[] {
  
  return questions.map((q, index) => {
    
    let correctLetter = 'N/A' // Fallback for Subjective/Integer types

    // If it's an MCQ and we have a shuffle map for it
    if (q.options && answerKeyMap[q.id]) {
      const mapping = answerKeyMap[q.id]
      
      // 1. Find the original correct option index from the database state
      // (Assuming the database stores options in a consistent order and one is marked correct)
      const originalCorrectIndex = q._originalOptions?.findIndex((opt: any) => opt.isCorrect) 
                                   ?? q.options.findIndex((opt: any) => opt.isCorrect)

      if (originalCorrectIndex !== -1 && originalCorrectIndex !== undefined) {
        // 2. Find where that option moved to
        const movedTo = mapping.find(m => m.originalIndex === originalCorrectIndex)
        if (movedTo) {
          // 3. Convert new index (0,1,2,3) to Letter (A,B,C,D)
          correctLetter = String.fromCharCode(65 + movedTo.newIndex)
        }
      }
    }

    return {
      questionNumber: index + 1,
      questionId: q.id,
      correctOptionLetter: correctLetter,
      marks: q.marks || 4,
      negativeMarks: q.negative_marks || -1,
      difficulty: q.difficulty?.name || 'Medium',
      chapter: q.chapter?.name || 'Unknown Chapter',
      topic: q.topic?.name || 'Unknown Topic'
    }
  })
}
