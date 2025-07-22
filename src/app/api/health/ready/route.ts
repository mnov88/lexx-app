import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

// Readiness probe - checks if application is ready to serve requests
export async function GET() {
  const start = Date.now()
  
  try {
    // Essential readiness checks
    const readinessChecks = []
    
    // 1. Database connection check
    const dbCheck = (async () => {
      try {
        const { error } = await supabase
          .from('legislations')
          .select('id')
          .limit(1)
        return {
          name: 'database',
          healthy: !error,
          error: error?.message
        }
      } catch (error) {
        return {
          name: 'database',
          healthy: false,
          error: (error as Error).message
        }
      }
    })()
    
    readinessChecks.push(dbCheck)
    
    // 2. Environment variables check
    const envCheck = Promise.resolve({
      name: 'environment',
      healthy: !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ),
      error: !(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) 
        ? 'Missing required environment variables'
        : undefined
    })
    
    readinessChecks.push(envCheck)
    
    // Wait for all checks
    const results = await Promise.all(readinessChecks)
    
    // Determine overall readiness
    const isReady = results.every(check => check.healthy)
    
    const response = {
      ready: isReady,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - start,
      checks: results,
      service: 'lexx-api',
      version: '1.0.0'
    }
    
    // Log readiness check completed
    
    return NextResponse.json(response, { 
      status: isReady ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
    
  } catch (error) {
    logger.error('Readiness check failed', {
      error: (error as Error).message,
      duration: Date.now() - start
    })
    
    return NextResponse.json({
      ready: false,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - start,
      error: (error as Error).message,
      service: 'lexx-api',
      version: '1.0.0'
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}