import { z } from 'zod'

// ---------------------------------------------------------
// Step 1: Metadata
// ---------------------------------------------------------
export const MetadataSchema = z.object({
  examId: z.string().uuid('Please select an Exam'),
  classId: z.string().uuid('Please select a Class'),
  subjectId: z.string().uuid('Please select a Subject'),
  difficultyId: z.string().uuid('Please select a Difficulty'),
  languageId: z.string().uuid('Please select a Language'),
  questionCount: z.enum(['25', '50', '75', '100', '150', 'unlimited']),
  durationMinutes: z.number().min(10).max(360),
  marksPositive: z.number().min(0),
  marksNegative: z.number().max(0)
})

// ---------------------------------------------------------
// Step 2: Weightage
// ---------------------------------------------------------
export const WeightageItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  percentage: z.number().min(0).max(100)
})

export const WeightageSchema = z.object({
  chapterWeightages: z.array(WeightageItemSchema),
  topicWeightages: z.array(WeightageItemSchema)
}).superRefine((data, ctx) => {
  const sumChapters = data.chapterWeightages.reduce((sum, item) => sum + item.percentage, 0)
  // Only validate if user added chapters to the weightage list
  if (data.chapterWeightages.length > 0 && sumChapters !== 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Total chapter weightage must equal exactly 100%',
      path: ['chapterWeightages']
    })
  }
})

// ---------------------------------------------------------
// Step 3: Branding & Formatting
// ---------------------------------------------------------
export const BrandingSchema = z.object({
  schoolLogoUrl: z.string().url().optional().or(z.literal('')),
  headerText: z.string().max(100).optional(),
  footerText: z.string().max(100).optional(),
  instructions: z.string().optional(),
  questionNumberFormat: z.enum(['Q1.', '1.', '1)']),
  pageNumberFormat: z.enum(['Page 1 of 5', '1/5', '1', 'None']),
  shuffleQuestions: z.boolean().default(false),
  shuffleOptions: z.boolean().default(false)
})

// ---------------------------------------------------------
// Step 4: Generation Mode
// ---------------------------------------------------------
export const GenerationModeSchema = z.object({
  mode: z.enum(['random', 'manual', 'blueprint', 'ai_suggested']),
  blueprintId: z.string().uuid().optional(),
  aiPrompt: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.mode === 'blueprint' && !data.blueprintId) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Blueprint is required', path: ['blueprintId'] })
  }
  if (data.mode === 'ai_suggested' && !data.aiPrompt) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'AI Prompt is required', path: ['aiPrompt'] })
  }
})

// ---------------------------------------------------------
// Combined Master Schema
// ---------------------------------------------------------
export const PaperConfigSchema = MetadataSchema
  .and(WeightageSchema)
  .and(BrandingSchema)
  .and(GenerationModeSchema)

export type PaperConfigValues = z.infer<typeof PaperConfigSchema>
