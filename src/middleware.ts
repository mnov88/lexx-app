import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from '@/lib/auth'
import { rateLimit } from '@/lib/rateLimit'

// Define route protection rules
const routeProtection = {
  // Public routes (no authentication required)
  public: [
    '/',
    '/auth',
    '/reports', // Temporarily public for testing
    '/api/search',
    '/api/legislations',
    '/api/legislations/:path*',
    '/api/articles/:path*',
    '/api/cases/:path*',
    '/api/reports/:path*', // Temporarily public for testing
    '/api/test-db'
  ],
  
  // Protected routes (authentication required)
  protected: [
    // '/reports', // Temporarily public for testing
    '/chat'
    // '/api/reports/:path*' // Temporarily public for testing
  ],
  
  // Admin-only routes
  admin: [
    '/admin',
    '/api/admin/:path*'
  ]
}

// Role-based API endpoint access
const apiAccess = {
  [UserRole.READONLY]: [
    'GET:/api/search',
    'GET:/api/legislations',
    'GET:/api/legislations/:path*',
    'GET:/api/articles/:path*',
    'GET:/api/cases/:path*'
  ],
  [UserRole.LAWYER]: [
    'GET:/api/search',
    'GET:/api/legislations',
    'GET:/api/legislations/:path*',
    'GET:/api/articles/:path*',
    'GET:/api/cases/:path*',
    'POST:/api/reports/:path*',
    'GET:/api/reports/:path*'
  ],
  [UserRole.ADMIN]: ['*'] // Admin has access to everything
}

function matchRoute(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern === '*') return true
    
    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/:\w+\*/g, '.*') // :path* becomes .*
      .replace(/:\w+/g, '[^/]+') // :id becomes [^/]+
      .replace(/\*/g, '.*') // * becomes .*
    
    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(path)
  })
}

function hasApiAccess(method: string, path: string, userRole: UserRole): boolean {
  const allowedPatterns = apiAccess[userRole] || []
  
  // Check for exact method:path matches first
  const methodPath = `${method}:${path}`
  if (matchRoute(methodPath, allowedPatterns)) {
    return true
  }
  
  // Check for wildcard method matches
  const wildcardPath = `*:${path}`
  if (matchRoute(wildcardPath, allowedPatterns)) {
    return true
  }
  
  // Check for full wildcard
  return allowedPatterns.includes('*')
}

export async function middleware(request: NextRequest) {
  try {
    // Create response object
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // Create Supabase client for middleware
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )
    
    const { pathname } = request.nextUrl
    const method = request.method

    // Skip middleware for static files and Next.js internals
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.includes('.')
    ) {
      return response
    }

    // Get user session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Middleware auth error:', error)
    }

    const user = session?.user
    const userRole = user?.user_metadata?.role as UserRole || UserRole.READONLY

    // Apply rate limiting for API routes
    if (pathname.startsWith('/api/')) {
      const rateLimitResponse = rateLimit(user ? userRole : undefined, user?.id)(request)
      if (rateLimitResponse) {
        return rateLimitResponse
      }
    }

    // Check if route is public
    if (matchRoute(pathname, routeProtection.public)) {
      // For API routes, still check role-based access even if public
      if (pathname.startsWith('/api/')) {
        if (user && !hasApiAccess(method, pathname, userRole)) {
          return NextResponse.json(
            { error: 'Insufficient permissions', code: 'FORBIDDEN' },
            { status: 403 }
          )
        }
      }
      return response
    }

    // Check if route requires admin access
    if (matchRoute(pathname, routeProtection.admin)) {
      if (!user) {
        return NextResponse.redirect(
          new URL(`/auth?redirect=${encodeURIComponent(pathname)}`, request.url)
        )
      }
      
      if (userRole !== UserRole.ADMIN) {
        return NextResponse.json(
          { error: 'Admin access required', code: 'FORBIDDEN' },
          { status: 403 }
        )
      }
      
      return response
    }

    // Check if route is protected
    if (matchRoute(pathname, routeProtection.protected)) {
      if (!user) {
        // Redirect to auth for web pages
        if (!pathname.startsWith('/api/')) {
          return NextResponse.redirect(
            new URL(`/auth?redirect=${encodeURIComponent(pathname)}`, request.url)
          )
        }
        
        // Return 401 for API endpoints
        return NextResponse.json(
          { error: 'Authentication required', code: 'UNAUTHORIZED' },
          { status: 401 }
        )
      }

      // For API routes, check role-based access
      if (pathname.startsWith('/api/')) {
        if (!hasApiAccess(method, pathname, userRole)) {
          return NextResponse.json(
            { error: 'Insufficient permissions', code: 'FORBIDDEN' },
            { status: 403 }
          )
        }
      }

      return response
    }

    return response
    
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}