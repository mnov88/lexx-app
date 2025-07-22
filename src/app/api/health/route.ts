import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cacheManager } from '@/lib/cache'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const start = Date.now()
  const checks: Record<string, any> = {}
  let overallStatus = 'healthy'
  
  try {
    // 1. Database Health Check
    try {
      const { data, error } = await supabase
        .from('legislations')
        .select('id')
        .limit(1)
      
      checks.database = {
        status: error ? 'unhealthy' : 'healthy',
        responseTime: Date.now() - start,
        error: error?.message,
        lastCheck: new Date().toISOString()
      }
      
      if (error) overallStatus = 'degraded'
    } catch (error) {
      checks.database = {
        status: 'unhealthy',
        responseTime: Date.now() - start,
        error: (error as Error).message,
        lastCheck: new Date().toISOString()
      }
      overallStatus = 'unhealthy'
    }
    
    // 2. Cache Health Check
    try {
      const cacheStats = cacheManager.getStats()
      checks.cache = {
        status: 'healthy',
        stats: cacheStats,
        lastCheck: new Date().toISOString()
      }
    } catch (error) {
      checks.cache = {
        status: 'unhealthy',
        error: (error as Error).message,
        lastCheck: new Date().toISOString()
      }
      if (overallStatus === 'healthy') overallStatus = 'degraded'
    }
    
    // 3. Memory Usage Check
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage()
      const memoryMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      }
      
      checks.memory = {
        status: memoryMB.heapUsed > 512 ? 'warning' : 'healthy',
        usage: memoryMB,
        lastCheck: new Date().toISOString()
      }
      
      if (memoryMB.heapUsed > 1024 && overallStatus === 'healthy') {
        overallStatus = 'degraded'
      }
    }
    
    // 4. Environment Check
    checks.environment = {
      status: 'healthy',
      nodeEnv: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      lastCheck: new Date().toISOString()
    }
    
    // 5. API Endpoints Sampling
    const sampleChecks = await Promise.allSettled([
      fetch(new URL('/api/legislations?limit=1', request.url).toString()),
      fetch(new URL('/api/cases?limit=1', request.url).toString())
    ])
    
    checks.apiSampling = {
      status: sampleChecks.every(check => 
        check.status === 'fulfilled' && check.value.ok
      ) ? 'healthy' : 'degraded',
      results: sampleChecks.map((check, index) => ({
        endpoint: index === 0 ? '/api/legislations' : '/api/cases',
        status: check.status === 'fulfilled' ? check.value.status : 'error',
        success: check.status === 'fulfilled' && check.value.ok
      })),
      lastCheck: new Date().toISOString()
    }
    
    if (checks.apiSampling.status === 'degraded' && overallStatus === 'healthy') {
      overallStatus = 'degraded'
    }
    
    const totalResponseTime = Date.now() - start
    
    const healthResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: totalResponseTime,
      version: '1.0.0',
      service: 'lexx-api',
      environment: process.env.NODE_ENV || 'development',
      checks
    }
    
    // Log health check completed
    
    // Return appropriate HTTP status based on health
    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503
    
    return NextResponse.json(healthResponse, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    logger.error('Health check failed', {
      error: (error as Error).message,
      duration: Date.now() - start
    })
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - start,
      error: (error as Error).message,
      service: 'lexx-api',
      environment: process.env.NODE_ENV || 'development'
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  }
}