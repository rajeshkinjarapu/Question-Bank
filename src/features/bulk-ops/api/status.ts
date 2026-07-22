'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Used by the frontend UI to poll the progress of an ongoing job.
 */
export async function getJobStatus(jobId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('jobs')
    .select('id, type, status, progress, result')
    .eq('id', jobId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Fetches the user's recent jobs for the "Operation History" dashboard tab,
 * allowing them to see what they did and potentially click 'Undo'.
 */
export async function getRecentJobs() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('jobs')
    .select('*, logs:bulk_operation_logs(id)')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw new Error(error.message)
  return data
}
