import { getRedisClient } from '../cache/redis'

/**
 * Fixed Window Rate Limiter
 * Throttles excessive API requests to prevent DDoS attacks and control AI billing.
 */

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
}

export async function rateLimit(
  identifier: string, 
  limit: number = 100, // requests allowed
  windowSeconds: number = 60 // per window
): Promise<RateLimitResult> {
  
  const redis = getRedisClient()
  const currentMinute = Math.floor(Date.now() / 1000 / windowSeconds)
  const key = `ratelimit:${identifier}:${currentMinute}`

  try {
    // Increment the counter for this specific window
    const currentCount = await redis.incr(key)
    
    // If it's the first request in this window, set the expiry
    if (currentCount === 1) {
      await redis.expire(key, windowSeconds)
    }

    const remaining = Math.max(0, limit - currentCount)
    const success = currentCount <= limit

    return {
      success,
      limit,
      remaining,
      resetTime: (currentMinute + 1) * windowSeconds * 1000
    }
  } catch (error) {
    // If Redis fails, fail open (allow the request) so the app doesn't crash completely
    console.warn("Rate limiter redis failure. Failing open.")
    return { success: true, limit, remaining: limit, resetTime: Date.now() + 60000 }
  }
}

/**
 * Middleware Helper
 * Throws an error if the rate limit is exceeded.
 */
export async function enforceRateLimit(ipOrUserId: string, actionType: 'standard' | 'ai_heavy' = 'standard') {
  const limit = actionType === 'ai_heavy' ? 5 : 100 // AI requests are tightly restricted
  const result = await rateLimit(`${actionType}:${ipOrUserId}`, limit, 60)

  if (!result.success) {
    throw new Error(`429 Too Many Requests: Rate limit exceeded for ${actionType}. Please try again later.`)
  }
}
