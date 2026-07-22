'use server'

import { createClient } from '@/lib/supabase/server'
import { QuestionFormValues, QuestionSchema } from '../schema/validation'

export async function createQuestion(data: QuestionFormValues) {
  const supabase = await createClient()
  const parsed = QuestionSchema.parse(data)
  const { data: { user } } = await supabase.auth.getUser()

  const { data: question, error } = await supabase
    .from('questions')
    .insert({
      type_id: parsed.typeId,
      difficulty_id: parsed.difficultyId,
      language_id: parsed.languageId,
      content: parsed.content,
      options: parsed.options || null,
      explanation: parsed.explanation || null,
      solution: parsed.solution || null,
      marks_positive: parsed.marksPositive,
      marks_negative: parsed.marksNegative,
      estimated_solving_time: parsed.estimatedSolvingTime,
      source: parsed.source,
      created_by: user?.id,
      status: 'published'
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return question
}

export async function softDeleteQuestion(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('questions')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    
  if (error) throw new Error(error.message)
  return true
}

export async function cloneQuestion(id: string) {
  const supabase = await createClient()
  
  // Fetch original
  const { data: original, error: fetchErr } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchErr || !original) throw new Error('Original question not found')

  // Prepare clone data (strip id, dates, update source)
  const { id: _, created_at, updated_at, deleted_at, ...cloneData } = original
  cloneData.source = `${original.source || 'Original'} (Cloned)`

  const { data: clone, error: insertErr } = await supabase
    .from('questions')
    .insert(cloneData)
    .select()
    .single()

  if (insertErr) throw new Error(insertErr.message)
  return clone
}
