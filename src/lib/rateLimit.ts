import { NextRequest, NextResponse } from 'next/server'
import { UserRole } from '@/lib/auth'

// Rate limit configuration per role
const RATE_LIMITS = {
  [UserRole.READONLY]: {
    requests: 100, // 100 requests
    window: 60 * 1000, // per minute
    burst: 20 // burst of 20 requests
  },
  [UserRole.LAWYER]: {
    requests: 500, // 500 requests  
    window: 60 * 1000, // per minute
    burst: 100 // burst of 100 requests
  },
  [UserRole.ADMIN]: {
    requests: 2000, // 2000 requests
    window: 60 * 1000, // per minute
    burst: 500 // burst of 500 requests
  },
  // For unauthenticated users
  ANONYMOUS: {
    requests: 50, // 50 requests
    window: 60 * 1000, // per minute
    burst: 10 // burst of 10 requests
  }
}

// In-memory store (replace with Redis in production)
interface RateLimitEntry {
  count: number
  resetTime: number
  burstCount: number
  burstResetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now && entry.burstResetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000) // Clean up every 5 minutes

function getClientIdentifier(request: NextRequest, userId?: string): string {
  // Use user ID if authenticated, otherwise use IP + User-Agent
  if (userId) {
    return `user:${userId}`
  }
  
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             '127.0.0.1'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Create a hash of IP + User-Agent for anonymous users
  return `anon:${ip}:${userAgent.slice(0, 50)}`
}

function getRateLimit(userRole?: UserRole) {
  if (!userRole) return RATE_LIMITS.ANONYMOUS
  return RATE_LIMITS[userRole] || RATE_LIMITS[UserRole.READONLY]
}

export function rateLimit(userRole?: UserRole, userId?: string) {
  return (request: NextRequest): NextResponse | null => {
    const now = Date.now()
    const clientId = getClientIdentifier(request, userId)
    const limits = getRateLimit(userRole)
    
    // Get or create rate limit entry
    let entry = rateLimitStore.get(clientId)
    if (!entry) {
      entry = {
        count: 0,
        resetTime: now + limits.window,
        burstCount: 0,
        burstResetTime: now + 10000 // 10 second burst window
      }
      rateLimitStore.set(clientId, entry)
    }
    
    // Reset counters if windows have expired
    if (now >= entry.resetTime) {
      entry.count = 0
      entry.resetTime = now + limits.window
    }
    
    if (now >= entry.burstResetTime) {
      entry.burstCount = 0
      entry.burstResetTime = now + 10000 // 10 seconds
    }
    
    // Check burst limit first (shorter window, stricter limit)
    entry.burstCount++
    if (entry.burstCount > limits.burst) {
      const retryAfter = Math.ceil((entry.burstResetTime - now) / 1000)
      
      return NextResponse.json(
        {
          error: 'Rate limit exceeded - too many requests in short time',
          code: 'RATE_LIMIT_BURST',
          retryAfter: retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': limits.burst.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(entry.burstResetTime).toISOString(),
            'X-RateLimit-Type': 'burst'
          }
        }
      )
    }
    
    // Check regular rate limit
    entry.count++
    if (entry.count > limits.requests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
      
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED', 
          retryAfter: retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': limits.requests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
            'X-RateLimit-Type': 'standard'
          }
        }
      )
    }
    
    // Add rate limit headers to response
    const remaining = Math.max(0, limits.requests - entry.count)
    const resetTime = new Date(entry.resetTime).toISOString()
    
    // Return null to continue processing, with headers to be added
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', limits.requests.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', resetTime)
    response.headers.set('X-RateLimit-Window', (limits.window / 1000).toString())
    
    return null // Continue processing
  }
}

// Higher-order function to wrap API routes with rate limiting
export function withRateLimit<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>,
  getUserRole?: (request: NextRequest, ...args: T) => Promise<{ role?: UserRole; userId?: string }>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      let userRole: UserRole | undefined
      let userId: string | undefined
      
      // Get user role if function provided
      if (getUserRole) {
        const userInfo = await getUserRole(request, ...args)
        userRole = userInfo.role
        userId = userInfo.userId
      }
      
      // Apply rate limiting
      const rateLimitResponse = rateLimit(userRole, userId)(request)
      if (rateLimitResponse) {
        return rateLimitResponse
      }
      
      // Continue with original handler
      return await handler(request, ...args)
    } catch (error) {
      console.error('Rate limiting error:', error)
      // Continue with handler if rate limiting fails
      return await handler(request, ...args)
    }
  }
}

// Utility to get current rate limit status
export function getRateLimitStatus(request: NextRequest, userRole?: UserRole, userId?: string) {
  const clientId = getClientIdentifier(request, userId)
  const limits = getRateLimit(userRole)
  const entry = rateLimitStore.get(clientId)
  
  if (!entry) {
    return {
      limit: limits.requests,
      remaining: limits.requests,
      reset: new Date(Date.now() + limits.window),
      burstLimit: limits.burst,
      burstRemaining: limits.burst,
      burstReset: new Date(Date.now() + 10000)
    }
  }
  
  const now = Date.now()
  const remaining = Math.max(0, limits.requests - entry.count)
  const burstRemaining = Math.max(0, limits.burst - entry.burstCount)
  
  return {
    limit: limits.requests,
    remaining: entry.resetTime > now ? remaining : limits.requests,
    reset: new Date(entry.resetTime),
    burstLimit: limits.burst,
    burstRemaining: entry.burstResetTime > now ? burstRemaining : limits.burst,
    burstReset: new Date(entry.burstResetTime)
  }
}