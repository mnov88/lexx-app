'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { UserRole } from '@/lib/auth'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole
  fallbackUrl?: string
  loadingComponent?: ReactNode
  unauthorizedComponent?: ReactNode
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole = UserRole.READONLY,
  fallbackUrl = '/auth',
  loadingComponent,
  unauthorizedComponent
}: ProtectedRouteProps) => {
  const { isAuthenticated, profile, loading, hasRole } = useAuth()
  const router = useRouter()

  // Show loading state while auth is being determined
  if (loading) {
    return loadingComponent || (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
    const redirectUrl = `${fallbackUrl}?redirect=${encodeURIComponent(currentPath)}`
    router.push(redirectUrl)
    return null
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    return unauthorizedComponent || (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">
              Access Denied
            </h3>
            <p className="text-red-700 dark:text-red-400 mb-4">
              You don't have sufficient permissions to access this page. 
              {requiredRole && ` This page requires ${requiredRole} role or higher.`}
            </p>
            <div className="text-sm text-red-600 dark:text-red-400">
              Your role: <span className="font-semibold">{profile?.role || 'unknown'}</span>
            </div>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Higher-order component version
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: UserRole
) {
  const AuthenticatedComponent = (props: P) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  )
  
  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`
  return AuthenticatedComponent
}

// Hook for checking permissions in components
export function usePermissions() {
  const { profile, hasRole } = useAuth()
  
  return {
    canViewReports: hasRole(UserRole.LAWYER),
    canUseAI: hasRole(UserRole.LAWYER),
    canAdmin: hasRole(UserRole.ADMIN),
    isLawyer: profile?.role === UserRole.LAWYER,
    isAdmin: profile?.role === UserRole.ADMIN,
    isReadOnly: profile?.role === UserRole.READONLY,
    userRole: profile?.role
  }
}