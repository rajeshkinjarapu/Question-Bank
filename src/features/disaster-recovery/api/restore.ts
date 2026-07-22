'use server'

import { createClient } from '@/lib/supabase/server'
import { withPermission } from '../../users/api/auth-middleware'

/**
 * Performs a Partial Restore: takes a single Question JSON object
 * from a past backup and re-inserts it into the database.
 */
export async function restoreSingleQuestion(questionData: any) {
  return withPermission('manage_users', async () => {
    const supabase = await createClient()

    // 1. Remove the old ID to let the database generate a fresh one, 
    // OR try to upsert if you want to overwrite a broken existing record.
    const { id, created_at, ...cleanData } = questionData

    // 2. Insert safely
    const { error } = await supabase.from('questions').insert(cleanData)

    if (error) throw new Error(`Partial Restore failed: ${error.message}`)

    return { success: true }
  })
}
