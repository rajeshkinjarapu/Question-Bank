/**
 * A basic implementation of a Seeded Pseudo-Random Number Generator (PRNG).
 * Uses a linear congruential generator (LCG) algorithm.
 * This guarantees that `random(seed)` will always yield the exact same sequence of numbers.
 */
export class SeededRandom {
  private seed: number

  constructor(seedStr: string) {
    this.seed = this.hashString(seedStr)
  }

  // Simple string hashing to create a numeric seed
  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Returns a pseudo-random float between [0, 1)
   */
  public next(): number {
    // LCG constants (glibc standard)
    this.seed = (this.seed * 1103515245 + 12345) % 2147483648
    return this.seed / 2147483648
  }

  /**
   * Returns a pseudo-random integer between [min, max]
   */
  public nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }
}
