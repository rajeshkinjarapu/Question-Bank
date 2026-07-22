'use server'

import { createClient } from '@/lib/supabase/server'
import { BlueprintFormValues, BlueprintSchema } from '../schema/blueprint'

export async function createBlueprint(data: BlueprintFormValues) {
  const supabase = await createClient()
  const parsed = BlueprintSchema.parse(data)
  const { data: { user } } = await supabase.auth.getUser()

  const { data: blueprint, error } = await supabase
    .from('blueprints')
    .insert({
      name: parsed.name,
      exam_id: parsed.examId,
      subject_id: parsed.subjectId,
      total_questions: parsed.totalQuestions,
      constraints_json: parsed.constraints,
      is_verified: false, // Must be verified by separate API
      created_by: user?.id
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return blueprint
}

export async function getBlueprints() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blueprints')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (error) throw new Error(error.message)
  return data
}
