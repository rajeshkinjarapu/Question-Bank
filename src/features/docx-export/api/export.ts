'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Enqueues a DOCX generation job into the background queue.
 * Similar to how Bulk Operations work (Phase 13).
 */
export async function exportPaperToDocx(paperId: string, config: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Insert job into the queue
  const { data, error } = await supabase
    .from('jobs')
    .insert({
      type: 'export_docx',
      payload: { paperId, config },
      status: 'pending',
      created_by: user.id
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  // In production, this would be picked up by the Render worker pulling from the queue.
  return data.id
}
