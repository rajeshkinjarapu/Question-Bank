import { Redis } from '@upstash/redis'

/**
 * Enterprise Caching Layer (Upstash Redis)
 * Used for Rate Limiting and caching heavy database aggregations 
 * (like the Productivity Reports or massive Question Bank queries).
 * 
 * Note: Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env
 */

let redisInstance: Redis | null = null

export function getRedisClient(): Redis {
  if (!redisInstance) {
    // Graceful degradation if env vars are missing during local dev
    const url = process.env.UPSTASH_REDIS_REST_URL || 'https://mock-redis.upstash.io'
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || 'mock-token'

    redisInstance = new Redis({
      url,
      token,
    })
  }
  return redisInstance
}

/**
 * Helper to get cached data or fetch and cache it if missing.
 */
export async function getOrCache<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
  const redis = getRedisClient()
  
  try {
    const cached = await redis.get<T>(key)
    if (cached) return cached

    const freshData = await fetcher()
    await redis.setex(key, ttlSeconds, freshData)
    
    return freshData
  } catch (error) {
    console.warn(`Redis Cache Miss/Error for key [${key}]. Falling back to DB fetch.`)
    return fetcher()
  }
}
