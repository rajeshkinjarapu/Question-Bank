'use server'

import { createClient } from '@/lib/supabase/server'
import { PaperConfigValues, PaperConfigSchema } from '../schema/config'
// import { generateRandomPaper, generateFromBlueprint } from '@/features/exam-generator/api/engine' // From Phase 8

/**
 * Validates the full wizard state and routes the request to the correct engine function.
 */
export async function generatePaper(rawState: Partial<PaperConfigValues>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Strict Validation
  const config = PaperConfigSchema.parse(rawState)

  let generatedPaperId: string | null = null

  // 2. Route to specific engine logic (Built in Phase 8)
  try {
    switch (config.mode) {
      case 'random':
        // generatedPaperId = await generateRandomPaper(config)
        console.log('Routing to Random Engine...')
        break
      case 'manual':
        // For manual, we usually create a blank draft and redirect to a drag-and-drop builder UI
        console.log('Creating Blank Draft for Manual Builder...')
        break
      case 'blueprint':
        // generatedPaperId = await generateFromBlueprint(config.blueprintId, config)
        console.log('Routing to Blueprint Engine...')
        break
      case 'ai_suggested':
        // Enqueue an AI generation job (Phase 13 pattern)
        console.log('Enqueuing AI Generation Job...')
        break
      default:
        throw new Error('Invalid generation mode')
    }

    // Returning mock ID for UI continuation
    return generatedPaperId || `paper_${Date.now()}`
  } catch (error: any) {
    console.error('[Generator Engine Error]', error)
    throw new Error('Failed to generate paper. ' + error.message)
  }
}
