import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side auth client
export const authClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Server-side auth client for API routes
export const createServerAuth = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// User roles enum
export enum UserRole {
  READONLY = 'readonly',
  LAWYER = 'lawyer', 
  ADMIN = 'admin'
}

// User profile type extending Supabase User
export interface UserProfile {
  id: string
  email: string
  role: UserRole
  organization?: string
  full_name?: string
  created_at: string
  last_sign_in: string
}

// Authentication helpers
export const authHelpers = {
  // Get current user session
  getCurrentUser: async () => {
    const { data: { user }, error } = await authClient.auth.getUser()
    if (error) throw error
    return user
  },

  // Get user profile with role
  getUserProfile: async (): Promise<UserProfile | null> => {
    const { data: { user }, error } = await authClient.auth.getUser()
    if (error || !user) return null

    // Get user profile from user metadata or profiles table
    const profile: UserProfile = {
      id: user.id,
      email: user.email!,
      role: (user.user_metadata?.role as UserRole) || UserRole.READONLY,
      organization: user.user_metadata?.organization,
      full_name: user.user_metadata?.full_name,
      created_at: user.created_at,
      last_sign_in: user.last_sign_in_at || user.created_at
    }

    return profile
  },

  // Sign in with email/password
  signIn: async (email: string, password: string) => {
    const { data, error } = await authClient.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Sign up new user
  signUp: async (email: string, password: string, userData?: {
    full_name?: string
    organization?: string
    role?: UserRole
  }) => {
    const { data, error } = await authClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData?.full_name,
          organization: userData?.organization,
          role: userData?.role || UserRole.READONLY
        }
      }
    })
    
    if (error) throw error
    return data
  },

  // Sign out
  signOut: async () => {
    const { error } = await authClient.auth.signOut()
    if (error) throw error
  },

  // Check if user has required role
  hasRole: (userRole: UserRole, requiredRole: UserRole): boolean => {
    const roleHierarchy = {
      [UserRole.READONLY]: 1,
      [UserRole.LAWYER]: 2,
      [UserRole.ADMIN]: 3
    }
    
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { error } = await authClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    
    if (error) throw error
  }
}

// Auth state change listener
export const onAuthStateChange = (callback: (user: any, session: any) => void) => {
  return authClient.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null, session)
  })
}