import { SeededRandom } from '../prng'
import { shuffleArray, shuffleOptions } from '../shuffler'

describe('Shuffle Engine', () => {

  describe('SeededRandom', () => {
    it('should generate the exact same sequence for the same seed', () => {
      const rng1 = new SeededRandom('MasterKey123')
      const rng2 = new SeededRandom('MasterKey123')
      
      expect(rng1.next()).toBe(rng2.next())
      expect(rng1.nextInt(0, 100)).toBe(rng2.nextInt(0, 100))
    })

    it('should generate different sequences for different seeds', () => {
      const rng1 = new SeededRandom('Set_A')
      const rng2 = new SeededRandom('Set_B')
      
      expect(rng1.next()).not.toBe(rng2.next())
    })
  })

  describe('shuffleArray with Locks', () => {
    it('should shuffle an array while keeping locked indices in place', () => {
      const rng = new SeededRandom('TestSeed')
      const array = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']
      
      // Lock Q3 (index 2)
      const lockedIndices = new Set([2])
      
      const shuffled = shuffleArray(array, rng, lockedIndices)
      
      expect(shuffled.length).toBe(5)
      expect(shuffled[2]).toBe('Q3') // Must remain exactly where it was
      // Other elements should be rearranged
      expect(shuffled).toContain('Q1')
      expect(shuffled).toContain('Q5')
    })
  })

  describe('shuffleOptions', () => {
    it('should shuffle options and output a correct tracking map', () => {
      const options = [
        { id: 'optA', content: 'Apple', isCorrect: true },
        { id: 'optB', content: 'Banana', isCorrect: false },
        { id: 'optC', content: 'Cherry', isCorrect: false }
      ]

      const { shuffledOptions, mapping } = shuffleOptions(options, 'TestSeed')

      expect(shuffledOptions.length).toBe(3)
      expect(mapping.length).toBe(3)

      // Verify the mapping matches reality
      const newPosOfOptA = mapping.find(m => m.optionId === 'optA')?.newIndex
      expect(newPosOfOptA).toBeDefined()
      expect(shuffledOptions[newPosOfOptA!].id).toBe('optA')
      expect(shuffledOptions[newPosOfOptA!].content).toBe('Apple')
    })
  })
})
