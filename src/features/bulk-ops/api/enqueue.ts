'use server'

import { createClient } from '@/lib/supabase/server'

export type JobType = 'bulk_move_chapter' | 'bulk_move_subject' | 'bulk_ai_correction' | 'bulk_translate' | 'bulk_delete' | 'undo_operation'

/**
 * Pushes a new bulk operation onto the database Job Queue.
 * Returns the Job ID instantly so the UI can mount the progress bar.
 */
export async function enqueueBulkOperation(type: JobType, questionIds: string[], targetData: any = {}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const payload = {
    questionIds,
    ...targetData
  }

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      type,
      payload,
      status: 'pending',
      created_by: user.id
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  // NOTE: In production, you would trigger your Render Worker via a webhook here, 
  // or the Render Worker would be constantly polling the `jobs` table (Redis/BullMQ style).
  // For now, we simulate the worker kicking off in the background.
  triggerMockWorker(data.id).catch(console.error)

  return data.id
}

// ------------------------------------------------------------------
// MOCK WORKER TRIGGER (Just for local architecture simulation)
// ------------------------------------------------------------------
async function triggerMockWorker(jobId: string) {
  // In a real app, this function lives on a separate Node.js Render server.
  // We dynamic import to avoid circular dependencies in Next.js Server Actions
  const { processJob } = await import('../worker/handlers')
  await processJob(jobId)
}
