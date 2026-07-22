import { SeededRandom } from './prng'
import { shuffleArray, shuffleOptions, OptionMap } from './shuffler'
import { balancedShuffle } from './balancer'

export interface SetConfig {
  numberOfSets: number
  masterSeed: string
  shuffleQuestions: boolean
  shuffleOptions: boolean
  lockedQuestionIds?: string[]
}

export interface GeneratedSet {
  setName: string
  questions: any[]
  answerKeyMap: Record<string, OptionMap[]> // QuestionID -> OptionMap
}

/**
 * Orchestrator function. Takes a master list of questions and generates N unique Sets.
 */
export function generateSets(masterQuestions: any[], config: SetConfig): GeneratedSet[] {
  const sets: GeneratedSet[] = []
  const setNames = ['A', 'B', 'C', 'D', 'E', 'F']

  for (let i = 0; i < config.numberOfSets; i++) {
    const setName = setNames[i] || `Set_${i+1}`
    const setSeed = `${config.masterSeed}_${setName}`
    const rng = new SeededRandom(setSeed)
    
    let setQuestions = [...masterQuestions]

    // 1. Shuffle Questions if requested
    if (config.shuffleQuestions) {
      // Find indices of locked questions
      const lockedIndices = new Set<number>()
      if (config.lockedQuestionIds && config.lockedQuestionIds.length > 0) {
        masterQuestions.forEach((q, idx) => {
          if (config.lockedQuestionIds!.includes(q.id)) {
            lockedIndices.add(idx)
          }
        })
      }
      
      setQuestions = shuffleArray(setQuestions, rng, lockedIndices)
    }

    // 2. Shuffle Options and build the Answer Key Map
    const answerKeyMap: Record<string, OptionMap[]> = {}
    
    if (config.shuffleOptions) {
      setQuestions = setQuestions.map(q => {
        if (q.options && q.options.length > 0) {
          const { shuffledOptions, mapping } = shuffleOptions(q.options, `${setSeed}_${q.id}`)
          answerKeyMap[q.id] = mapping
          return { ...q, options: shuffledOptions }
        }
        return q
      })
    }

    sets.push({
      setName,
      questions: setQuestions,
      answerKeyMap
    })
  }

  return sets
}
