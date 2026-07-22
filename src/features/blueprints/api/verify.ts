'use server'

import { createClient } from '@/lib/supabase/server'
import { BlueprintFormValues, FeasibilityReport } from '../schema/blueprint'

/**
 * Validates a blueprint configuration against the actual PostgreSQL inventory.
 * Translates JSON constraints into dynamic count queries.
 */
export async function verifyBlueprintFeasibility(blueprint: BlueprintFormValues): Promise<FeasibilityReport> {
  const supabase = await createClient()
  const report: FeasibilityReport = { isFeasible: true, warnings: [], shortfalls: [] }
  const total = blueprint.totalQuestions

  // 1. Check Chapter Constraints
  for (const chapter of blueprint.constraints.chapters) {
    const requiredCount = chapter.exactCount 
      ? chapter.exactCount 
      : Math.round(total * (chapter.percentage! / 100))

    // Build query for this specific chapter
    let query = supabase.from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('exam_id', blueprint.examId)
      .eq('subject_id', blueprint.subjectId)
      .eq('chapter_id', chapter.id)
      .is('deleted_at', null)

    const { count, error } = await query

    if (error) throw new Error(error.message)

    if (count === null || count < requiredCount) {
      report.isFeasible = false
      const avail = count || 0
      report.shortfalls.push({ constraint: `Chapter: ${chapter.name}`, required: requiredCount, available: avail })
      report.warnings.push(`Not enough questions for Chapter: ${chapter.name}. Need ${requiredCount}, have ${avail}.`)
    }
  }

  // 2. We would repeat this pattern for Difficulty distributions, building dynamic 
  // `.eq('difficulty_id', ...)` filters and verifying the cross-section counts.
  
  return report
}

export async function markBlueprintVerified(id: string, isVerified: boolean) {
  const supabase = await createClient()
  await supabase.from('blueprints').update({ is_verified: isVerified }).eq('id', id)
}
