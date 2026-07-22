import { z } from 'zod'

// Either percentage (e.g. 20%) or exactCount (e.g. 5 questions)
export const ConstraintItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  percentage: z.number().min(0).max(100).optional(),
  exactCount: z.number().min(0).optional()
}).refine(data => data.percentage !== undefined || data.exactCount !== undefined, {
  message: "Must specify either percentage or exactCount"
})

export const DifficultyDistributionSchema = z.object({
  easy: z.number().min(0).max(100),
  medium: z.number().min(0).max(100),
  hard: z.number().min(0).max(100)
}).refine(data => data.easy + data.medium + data.hard === 100, {
  message: "Difficulty distribution must total 100%"
})

export const BlueprintSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3),
  examId: z.string().uuid(),
  subjectId: z.string().uuid(),
  totalQuestions: z.number().min(1),
  
  constraints: z.object({
    chapters: z.array(ConstraintItemSchema),
    topics: z.array(ConstraintItemSchema).optional(),
    difficulty: DifficultyDistributionSchema,
    questionTypes: z.array(ConstraintItemSchema).optional()
  })
})

export type BlueprintFormValues = z.infer<typeof BlueprintSchema>
export type FeasibilityReport = {
  isFeasible: boolean
  warnings: string[]
  shortfalls: Array<{
    constraint: string
    required: number
    available: number
  }>
}
