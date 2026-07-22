import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRedisClient } from '@/lib/cache/redis'

/**
 * Global Health Check Endpoint
 * Used by the CI/CD pipeline (GitHub Actions) to verify that a deployment
 * was successful and all microservices (DB, Cache) are operational.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const redis = getRedisClient()

    // 1. Check Database Connectivity
    const { data: dbData, error: dbError } = await supabase.from('profiles').select('id').limit(1)
    if (dbError) throw new Error('Database connection failed')

    // 2. Check Redis Cache Connectivity
    const ping = await redis.ping()
    if (ping !== 'PONG') throw new Error('Redis cache connection failed')

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
        environment: process.env.NODE_ENV
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error("Health Check Failed:", error)
    return NextResponse.json({
      status: 'unhealthy',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
