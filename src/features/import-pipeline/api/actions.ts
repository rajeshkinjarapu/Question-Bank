'use server'

import { createClient } from '@/lib/supabase/server'
import { DuplicateCheckResult } from './duplicate-check'

export async function saveBulkImport(
  fileName: string, 
  questions: DuplicateCheckResult[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Create Import Session
  const { data: session, error: sessionErr } = await supabase
    .from('import_sessions')
    .insert({
      user_id: user.id,
      file_name: fileName,
      total_items: questions.length,
      status: 'completed'
    })
    .select()
    .single()

  if (sessionErr) throw new Error(sessionErr.message)

  // 2. Insert valid non-duplicate questions
  const toInsert = questions
    .filter(q => !q.isDuplicate)
    .map(q => ({
      content: q.content,
      import_session_id: session.id,
      type_id: '...', // Default or mapped type
      difficulty_id: '...',
      language_id: '...'
    }))

  // (Mocking the actual insert since type_id/diff_id FKs need resolving in a real app)
  // const { error: insertErr } = await supabase.from('questions').insert(toInsert)
  // if (insertErr) {
  //   await supabase.from('import_sessions').update({ status: 'failed' }).eq('id', session.id)
  //   throw new Error(insertErr.message)
  // }

  return session
}

export async function undoImport(sessionId: string) {
  const supabase = await createClient()
  
  // Due to ON DELETE CASCADE on questions.import_session_id, 
  // deleting the session (or we can just update status to 'undone' and delete questions manually)
  // Here we explicitly delete questions to trigger Audit Logs properly
  
  const { error: delErr } = await supabase
    .from('questions')
    .delete()
    .eq('import_session_id', sessionId)
    
  if (delErr) throw new Error(delErr.message)

  const { error: updErr } = await supabase
    .from('import_sessions')
    .update({ status: 'undone', undone_at: new Date().toISOString() })
    .eq('id', sessionId)

  if (updErr) throw new Error(updErr.message)
    
  return true
}
