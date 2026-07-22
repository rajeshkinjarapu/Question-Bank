import { createClient } from '@supabase/supabase-js'

// Using service role key because workers bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * This file represents the logic that would run on your background Render Worker.
 */
export async function processJob(jobId: string) {
  try {
    // 1. Mark as processing
    await updateJob(jobId, { status: 'processing', progress: 5 })

    // 2. Fetch Job
    const { data: job, error: jobErr } = await supabase.from('jobs').select('*').eq('id', jobId).single()
    if (jobErr) throw jobErr

    const { type, payload } = job
    const { questionIds, ...targetData } = payload

    // 3. Snapshot Current State for Undo
    const { data: currentRows } = await supabase.from('questions').select('*').in('id', questionIds)
    if (currentRows && currentRows.length > 0) {
      await supabase.from('bulk_operation_logs').insert({
        job_id: jobId,
        affected_ids: questionIds,
        previous_state: currentRows
      })
    }

    // 4. Execute Logic based on Type
    if (type === 'bulk_move_chapter') {
      await handleFastUpdate(jobId, questionIds, { chapter_id: targetData.targetChapterId })
    } 
    else if (type === 'bulk_ai_correction') {
      await handleSlowAITask(jobId, questionIds, 'correction')
    }
    // ... handle other types

  } catch (error: any) {
    console.error(`[Worker] Job ${jobId} failed:`, error)
    await updateJob(jobId, { status: 'failed', result: { error: error.message } })
  }
}

// ------------------------------------------------------------------
// Internal Worker Handlers
// ------------------------------------------------------------------

async function handleFastUpdate(jobId: string, ids: string[], updates: any) {
  // A standard UPDATE ... WHERE id IN (...)
  const { error } = await supabase.from('questions').update(updates).in('id', ids)
  if (error) throw error
  await updateJob(jobId, { status: 'completed', progress: 100, result: { message: `Successfully updated ${ids.length} rows.` } })
}

async function handleSlowAITask(jobId: string, ids: string[], aiTask: string) {
  // Simulates calling an LLM API sequentially or in small batches to avoid rate limits
  const total = ids.length
  
  for (let i = 0; i < total; i++) {
    // Mock 1 second delay per AI call
    await new Promise(res => setTimeout(res, 1000))
    
    // Update progress in DB (UI will poll this)
    const currentProgress = Math.floor(((i + 1) / total) * 100)
    await updateJob(jobId, { progress: currentProgress })
  }

  await updateJob(jobId, { status: 'completed', progress: 100, result: { message: `AI Processed ${total} questions.` } })
}

async function updateJob(id: string, data: any) {
  await supabase.from('jobs').update(data).eq('id', id)
}
