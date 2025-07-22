import { NextResponse } from 'next/server'

// Liveness probe - simple check if the application is running
export async function GET() {
  const start = Date.now()
  
  try {
    // Basic liveness indicators
    const checks = {
      server: {
        healthy: true,
        uptime: process.uptime ? Math.floor(process.uptime()) : null,
        pid: process.pid || null
      },
      memory: process.memoryUsage ? {
        healthy: true,
        usage: process.memoryUsage()
      } : {
        healthy: true,
        usage: null
      },
      timestamp: new Date().toISOString()
    }
    
    const response = {
      alive: true,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - start,
      checks,
      service: 'lexx-api',
      version: '1.0.0'
    }
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      alive: false,
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