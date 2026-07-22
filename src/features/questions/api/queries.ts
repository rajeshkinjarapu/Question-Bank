'use server'

import { createClient } from '@/lib/supabase/server'

export interface QueryOptions {
  page: number
  limit: number
  search?: string
  subjectId?: string
  difficultyId?: string
  status?: string
}

export async function getQuestions({ page = 1, limit = 20, search, subjectId, difficultyId, status }: QueryOptions) {
  const supabase = await createClient()
  
  let query = supabase
    .from('questions')
    .select('*, difficulty:difficulty_levels(name), type:question_types(name)', { count: 'exact' })
    .is('deleted_at', null)

  if (search) {
    // Utilize the full-text search index created in Phase 3
    const ftsQuery = search.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(Boolean).join(' & ')
    if (ftsQuery) query = query.textSearch('fts', ftsQuery)
  }

  if (difficultyId) query = query.eq('difficulty_id', difficultyId)
  if (status) query = query.eq('status', status)

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, count, error } = await query

  if (error) throw new Error(error.message)

  return {
    data,
    total: count || 0,
    page,
    totalPages: count ? Math.ceil(count / limit) : 0
  }
}
