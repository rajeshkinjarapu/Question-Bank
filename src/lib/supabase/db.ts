import { createClient } from './server'

/**
 * Reusable Data Access API Layer
 * This acts as the base repository for the application.
 */

export async function fetchItems<T>(tableName: string, query?: Record<string, any>) {
  const supabase = await createClient()
  let request = supabase.from(tableName).select('*')

  if (query) {
    Object.keys(query).forEach(key => {
      request = request.eq(key, query[key])
    })
  }

  const { data, error } = await request
  if (error) throw new Error(error.message)
  return data as T[]
}

export async function fetchItemById<T>(tableName: string, id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single()
  
  if (error) throw new Error(error.message)
  return data as T
}

export async function insertItem<T>(tableName: string, payload: Record<string, any>) {
  const supabase = await createClient()
  const { data, error } = await supabase.from(tableName).insert(payload).select().single()
  
  if (error) throw new Error(error.message)
  return data as T
}

export async function updateItem<T>(tableName: string, id: string, payload: Record<string, any>) {
  const supabase = await createClient()
  const { data, error } = await supabase.from(tableName).update(payload).eq('id', id).select().single()
  
  if (error) throw new Error(error.message)
  return data as T
}

export async function softDeleteItem(tableName: string, id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from(tableName).update({ deleted_at: new Date().toISOString() }).eq('id', id).select().single()
  
  if (error) throw new Error(error.message)
  return data
}

export async function hardDeleteItem(tableName: string, id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from(tableName).delete().eq('id', id).select().single()
  
  if (error) throw new Error(error.message)
  return data
}
