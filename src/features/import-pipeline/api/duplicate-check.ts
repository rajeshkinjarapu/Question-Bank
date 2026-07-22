import { createClient } from '@/lib/supabase/server'
import { ExtractedQuestion } from '../../ocr/types'

export interface DuplicateCheckResult extends ExtractedQuestion {
  isDuplicate: boolean
  duplicateConfidence?: number
  matchedQuestionId?: string
}

/**
 * Checks for duplicates using PostgreSQL Full Text Search (`fts` column).
 */
export async function flagDuplicates(questions: ExtractedQuestion[]): Promise<DuplicateCheckResult[]> {
  const supabase = await createClient()
  const results: DuplicateCheckResult[] = []

  for (const q of questions) {
    // Basic Exact/FTS match (In production, pgvector embeddings would be used for semantic match)
    // We convert the content to a tsquery compatible string (escaping spaces to '&')
    const query = q.content.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(Boolean).join(' & ')
    
    let isDuplicate = false
    let matchedId = undefined

    if (query) {
      const { data, error } = await supabase
        .from('questions')
        .select('id')
        .textSearch('fts', query)
        .limit(1)

      if (!error && data && data.length > 0) {
        isDuplicate = true
        matchedId = data[0].id
      }
    }

    results.push({
      ...q,
      isDuplicate,
      matchedQuestionId: matchedId,
      duplicateConfidence: isDuplicate ? 1.0 : 0
    })
  }

  return results
}
