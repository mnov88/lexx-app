'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { authClient, authHelpers, UserProfile, UserRole } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData?: {
    full_name?: string
    organization?: string
    role?: UserRole
  }) => Promise<void>
  signOut: () => Promise<void>
  hasRole: (requiredRole: UserRole) => boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Load initial session
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session }, error } = await authClient.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
      } else {
        setSession(session)
        setUser(session?.user || null)
        
        if (session?.user) {
          const userProfile = await authHelpers.getUserProfile()
          setProfile(userProfile)
        }
      }
      
      setLoading(false)
    }

    getInitialSession()
  }, [])

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = authClient.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user || null)
        
        if (session?.user) {
          const userProfile = await authHelpers.getUserProfile()
          setProfile(userProfile)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      await authHelpers.signIn(email, password)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signUp = async (email: string, password: string, userData?: {
    full_name?: string
    organization?: string
    role?: UserRole
  }) => {
    setLoading(true)
    try {
      await authHelpers.signUp(email, password, userData)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await authHelpers.signOut()
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!profile) return false
    return authHelpers.hasRole(profile.role, requiredRole)
  }

  const isAuthenticated = !!user

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}