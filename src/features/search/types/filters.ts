import { z } from 'zod'

export const SearchFiltersSchema = z.object({
  query: z.string().optional(),
  isFuzzy: z.boolean().default(true),
  
  // Taxonomy
  examId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  chapterId: z.string().uuid().optional(),
  topicId: z.string().uuid().optional(),
  
  // Attributes
  difficultyId: z.string().uuid().optional(),
  typeId: z.string().uuid().optional(),
  languageId: z.string().uuid().optional(),
  
  // Ranges
  marksMin: z.number().optional(),
  marksMax: z.number().optional(),
  aiConfidenceMin: z.number().optional(),
  
  // Booleans
  hasImage: z.boolean().optional(),
  hasDiagram: z.boolean().optional(),
  
  // Metadata
  status: z.enum(['published', 'draft', 'archived', 'review']).optional(),
  createdBy: z.string().uuid().optional(),
  
  // Pagination
  page: z.number().default(1),
  limit: z.number().default(20)
})

export type SearchFilters = z.infer<typeof SearchFiltersSchema>
