'use server'

import { createClient } from '@/lib/supabase/server'
import { executeAiQuery } from '../core/router'
import { METADATA_SYSTEM_PROMPT, buildMetadataPrompt } from '../prompts/metadata'
import { GENERATION_SYSTEM_PROMPT, buildSimilarQuestionPrompt } from '../prompts/generation'

/**
 * Server Action: Generates metadata for a question synchronously.
 */
export async function generateQuestionMetadata(questionHtml: string, optionsHtml: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const response = await executeAiQuery({
    systemPrompt: METADATA_SYSTEM_PROMPT,
    userPrompt: buildMetadataPrompt(questionHtml, optionsHtml),
    temperature: 0.1 // Low temperature for deterministic metadata
  })

  // Log usage
  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action_type: 'AI_USAGE',
    entity_type: 'token_cost',
    user_agent: `provider:${response.provider},tokens:${response.usage.promptTokens + response.usage.completionTokens}`
  })

  try {
    return JSON.parse(response.content)
  } catch (e) {
    console.error("Failed to parse AI JSON:", response.content)
    throw new Error("AI returned invalid data format.")
  }
}

/**
 * Server Action: Enqueues a job to generate similar questions in the background.
 */
export async function enqueueSimilarQuestionGeneration(originalQuestionId: string, count: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Insert job into the background queue (Phase 13 infrastructure)
  const { data, error } = await supabase
    .from('jobs')
    .insert({
      type: 'ai_generate_similar',
      payload: { originalQuestionId, count },
      status: 'pending',
      created_by: user.id
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  return data.id
}
