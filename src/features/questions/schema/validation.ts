import { z } from 'zod'

export const OptionSchema = z.object({
  id: z.string(),
  content: z.string().min(1, 'Option content is required'),
  isCorrect: z.boolean().default(false)
})

export const QuestionSchema = z.object({
  id: z.string().optional(),
  typeId: z.string().uuid(),
  difficultyId: z.string().uuid(),
  languageId: z.string().uuid(),
  examId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  chapterId: z.string().uuid().optional(),
  topicId: z.string().uuid().optional(),
  
  content: z.string().min(5, 'Question content must be at least 5 characters'),
  options: z.array(OptionSchema).optional(),
  explanation: z.string().optional(),
  solution: z.string().optional(),
  
  marksPositive: z.number().min(0).default(4),
  marksNegative: z.number().max(0).default(-1),
  estimatedSolvingTime: z.number().min(0).default(120), // seconds
  source: z.string().optional(),
  tags: z.array(z.string()).default([])
}).superRefine((data, ctx) => {
  // Validate MCQ logic
  if (data.options && data.options.length > 0) {
    const correctCount = data.options.filter(o => o.isCorrect).length
    
    // If it's supposed to be an MCQ (Single correct), we'd check typeId here in a real app
    // Assuming a generic check: must have at least one correct option if options exist
    if (correctCount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Must select at least one correct option.',
        path: ['options']
      })
    }
  }
})

export type QuestionFormValues = z.infer<typeof QuestionSchema>
