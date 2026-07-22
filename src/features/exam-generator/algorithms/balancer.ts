import { SeededRandom } from './prng'
import { shuffleArray } from './shuffler'

/**
 * Ensures questions are distributed evenly so you don't get 10 'Hard' questions in a row.
 * Weaves them together by grouping.
 */
export function balancedShuffle(
  questions: any[], 
  seedStr: string,
  groupByKey: string = 'difficulty_id'
): any[] {
  const rng = new SeededRandom(seedStr)
  
  // 1. Group questions into buckets
  const buckets: Record<string, any[]> = {}
  for (const q of questions) {
    const key = q[groupByKey] || 'default'
    if (!buckets[key]) buckets[key] = []
    buckets[key].push(q)
  }

  // 2. Shuffle each bucket internally
  for (const key in buckets) {
    buckets[key] = shuffleArray(buckets[key], rng)
  }

  // 3. Weave buckets together (Round Robin)
  const result: any[] = []
  const bucketKeys = Object.keys(buckets)
  
  let i = 0
  let itemsRemaining = true
  
  while (itemsRemaining) {
    itemsRemaining = false
    for (const key of bucketKeys) {
      if (buckets[key][i]) {
        result.push(buckets[key][i])
        itemsRemaining = true
      }
    }
    i++
  }

  return result
}
