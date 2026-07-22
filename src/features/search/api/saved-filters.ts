'use server'

import { createClient } from '@/lib/supabase/server'
import { SearchFilters } from '../types/filters'

export async function saveFilterPreset(name: string, filterObj: Partial<SearchFilters>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('saved_filters')
    .insert({
      user_id: user.id,
      name,
      filter_json: filterObj
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getSavedFilters() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('saved_filters').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function getSearchHistory() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('search_history')
    .select('query')
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (error) throw new Error(error.message)
  // Deduplicate history
  const unique = Array.from(new Set(data.map(d => d.query)))
  return unique
}
