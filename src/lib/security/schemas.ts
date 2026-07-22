import { z } from 'zod'

/**
 * Enterprise Data Validation Schemas
 * Used to validate incoming API requests and Server Actions to prevent
 * malformed data or NoSQL-style injection attacks.
 */

export const OptionSchema = z.object({
  id: z.string().uuid().optional(),
  content: z.string().min(1, "Option content cannot be empty"),
  isCorrect: z.boolean()
})

export const QuestionPayloadSchema = z.object({
  examId: z.string().uuid(),
  subjectId: z.string().uuid(),
  chapterId: z.string().uuid(),
  topicId: z.string().uuid().optional(),
  
  difficultyId: z.string().uuid(),
  typeId: z.string().uuid(),
  
  marks: z.number().min(1).max(10),
  negativeMarks: z.number().min(-5).max(0),
  estimatedTimeSeconds: z.number().min(10).max(600).optional(),
  
  statement: z.string().min(10, "Question statement must be at least 10 characters long"),
  options: z.array(OptionSchema).min(2).max(10).optional(),
  solution: z.string().optional()
})

export type QuestionPayload = z.infer<typeof QuestionPayloadSchema>

/**
 * Utility function to validate and sanitize a payload.
 * Throws a strict Error if validation fails.
 */
export function validateQuestionPayload(payload: any): QuestionPayload {
  const result = QuestionPayloadSchema.safeParse(payload)
  
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    throw new Error(`Data Validation Failed: ${errors}`)
  }

  return result.data
}
