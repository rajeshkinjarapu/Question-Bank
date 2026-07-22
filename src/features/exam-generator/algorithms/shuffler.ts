import { SeededRandom } from './prng'

export interface OptionMap {
  originalIndex: number
  newIndex: number
  optionId: string
}

/**
 * Shuffles an array in-place using the Fisher-Yates algorithm,
 * but locks specific indices in place if requested.
 */
export function shuffleArray<T>(
  array: T[], 
  rng: SeededRandom, 
  lockedIndices: Set<number> = new Set()
): T[] {
  const result = [...array]
  
  // Find all indices that are allowed to be shuffled
  const movableIndices = []
  for (let i = 0; i < result.length; i++) {
    if (!lockedIndices.has(i)) movableIndices.push(i)
  }

  // Fisher-Yates on movable indices only
  for (let i = movableIndices.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i)
    
    const indexI = movableIndices[i]
    const indexJ = movableIndices[j]

    // Swap
    const temp = result[indexI]
    result[indexI] = result[indexJ]
    result[indexJ] = temp
  }

  return result
}

/**
 * Shuffles the options of a question and tracks their movement.
 * Essential for generating the Answer Key for different sets.
 */
export function shuffleOptions(options: any[], seedStr: string): { shuffledOptions: any[], mapping: OptionMap[] } {
  const rng = new SeededRandom(seedStr)
  
  // Create an array of objects to track original positions
  const trackableOptions = options.map((opt, idx) => ({ ...opt, _originalIndex: idx }))
  
  // Shuffle
  const shuffled = shuffleArray(trackableOptions, rng)
  
  // Generate Mapping
  const mapping: OptionMap[] = shuffled.map((opt, newIdx) => ({
    originalIndex: opt._originalIndex,
    newIndex: newIdx,
    optionId: opt.id
  }))
  
  // Clean up private tracking property
  const cleanedOptions = shuffled.map(opt => {
    const { _originalIndex, ...rest } = opt
    return rest
  })

  return { shuffledOptions: cleanedOptions, mapping }
}
