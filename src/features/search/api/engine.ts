'use server'

import { createClient } from '@/lib/supabase/server'
import { SearchFilters, SearchFiltersSchema } from '../types/filters'

export async function executeAdvancedSearch(rawFilters: Partial<SearchFilters>) {
  const supabase = await createClient()
  const filters = SearchFiltersSchema.parse(rawFilters)

  let query = supabase
    .from('questions')
    .select('id, content, marks_positive, status, type:question_types(name), difficulty:difficulty_levels(name)', { count: 'exact' })
    .is('deleted_at', null)

  // 1. Text Search Engine (Typo Correction / Fuzzy)
  if (filters.query) {
    if (filters.isFuzzy) {
      // Use pg_trgm similarity logic. Note: Suppabase PostgREST exposes 'ilike' which uses the GIN trgm index,
      // but for strict similarity threshold we would ideally use a custom RPC or the `SIMILAR TO` operator if exposed.
      // For standard client chaining, we use `ilike` wrapped in `%` which hits the trgm index perfectly.
      query = query.or(`content.ilike.%${filters.query}%,formula_search_vector.ilike.%${filters.query}%`)
    } else {
      // Standard Exact FTS
      const ftsQuery = filters.query.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(Boolean).join(' & ')
      if (ftsQuery) query = query.textSearch('fts', ftsQuery)
    }

    // Log History asynchronously (fire and forget)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('search_history').insert({ user_id: user.id, query: filters.query }).then()
      }
    })
  }

  // 2. Exact Match Taxonomy Combos
  if (filters.examId) query = query.eq('exam_id', filters.examId)
  if (filters.subjectId) query = query.eq('subject_id', filters.subjectId)
  if (filters.chapterId) query = query.eq('chapter_id', filters.chapterId)
  if (filters.topicId) query = query.eq('topic_id', filters.topicId)
  if (filters.difficultyId) query = query.eq('difficulty_id', filters.difficultyId)
  if (filters.typeId) query = query.eq('type_id', filters.typeId)
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.createdBy) query = query.eq('created_by', filters.createdBy)

  // 3. Ranges
  if (filters.marksMin !== undefined) query = query.gte('marks_positive', filters.marksMin)
  if (filters.marksMax !== undefined) query = query.lte('marks_positive', filters.marksMax)
  if (filters.aiConfidenceMin !== undefined) query = query.gte('ai_confidence_score', filters.aiConfidenceMin)

  // Pagination
  const from = (filters.page - 1) * filters.limit
  const to = from + filters.limit - 1
  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, count, error } = await query

  if (error) {
    console.error('[Search Engine Error]', error)
    throw new Error('Failed to execute search query')
  }

  return {
    data,
    total: count || 0,
    page: filters.page,
    totalPages: count ? Math.ceil(count / filters.limit) : 0
  }
}
