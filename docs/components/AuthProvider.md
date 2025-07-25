# AuthProvider Component

## Overview

The `AuthProvider` component is the core authentication context provider for the application. It manages user authentication state, session handling, and provides authentication methods throughout the app using React Context. This component integrates with Supabase Auth and provides role-based access control for legal professionals.

- **File**: `lexx-app/src/components/auth/AuthProvider.tsx`
- **Dependencies**: `@supabase/supabase-js`, `@/lib/auth`
- **Type**: Context Provider Component

## Architecture

The component creates a React Context that wraps the entire application, providing:
1. **State Management**: User, session, and profile state
2. **Authentication Methods**: Sign in, sign up, sign out functions
3. **Role-Based Access**: Permission checking and role validation
4. **Session Persistence**: Automatic session recovery and state synchronization

## Context Interface

```typescript
interface AuthContextType {
  user: User | null                    // Supabase user object
  session: Session | null              // Current auth session
  profile: UserProfile | null          // Extended user profile data
  loading: boolean                     // Authentication loading state
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData?: UserData) => Promise<void>
  signOut: () => Promise<void>
  hasRole: (requiredRole: UserRole) => boolean
  isAuthenticated: boolean             // Computed authentication status
}
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `children` | `ReactNode` | ✅ | Child components that need access to auth context |

## Key Features

### 🔐 Authentication State Management
- **User State**: Tracks current authenticated user from Supabase
- **Session State**: Manages active authentication session
- **Profile State**: Extended user profile with role and organization data
- **Loading State**: Indicates when authentication operations are in progress

### 👥 Role-Based Access Control
- **User Roles**: Support for `lawyer`, `admin`, and `readonly` roles
- **Permission Checking**: `hasRole()` method for access control
- **Profile Integration**: Automatic profile loading with role information
- **Hierarchical Permissions**: Admin > Lawyer > Readonly access levels

### ⚡ Session Management
- **Automatic Recovery**: Restores session on app load
- **State Synchronization**: Listens for auth state changes
- **Profile Loading**: Fetches user profile data when authenticated
- **Cleanup**: Proper session cleanup on sign out

### 🔄 Real-time Updates
- **Auth State Listener**: Responds to authentication changes
- **Profile Sync**: Updates profile data when session changes
- **Loading Management**: Handles loading states during transitions
- **Error Handling**: Graceful error handling for auth operations

## Usage

### Setup (App Level)
```tsx
// In your root layout or main app component
import { AuthProvider } from '@/components/auth/AuthProvider'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Using the Auth Hook
```tsx
import { useAuth } from '@/components/auth/AuthProvider'

function MyComponent() {
  const { 
    user, 
    profile, 
    loading, 
    isAuthenticated, 
    signIn, 
    signOut, 
    hasRole 
  } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!isAuthenticated) {
    return <LoginForm onSignIn={signIn} />
  }

  return (
    <div>
      <h1>Welcome, {profile?.full_name || user?.email}</h1>
      {hasRole('admin') && (
        <AdminPanel />
      )}
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Role-Based Rendering
```tsx
function ProtectedFeature() {
  const { hasRole, profile } = useAuth()

  if (hasRole('admin')) {
    return <AdminDashboard />
  }

  if (hasRole('lawyer')) {
    return <LawyerDashboard />
  }

  return <ReadOnlyDashboard />
}
```

## Authentication Methods

### Sign In
```typescript
const signIn = async (email: string, password: string) => {
  setLoading(true)
  try {
    await authHelpers.signIn(email, password)
    // State updated automatically via auth state listener
  } catch (error) {
    setLoading(false)
    throw error // Re-throw for component error handling
  }
}
```

### Sign Up
```typescript
const signUp = async (email: string, password: string, userData?: {
  full_name?: string
  organization?: string  
  role?: UserRole
}) => {
  setLoading(true)
  try {
    await authHelpers.signUp(email, password, userData)
    // Creates user account and profile record
  } catch (error) {
    setLoading(false)
    throw error
  }
}
```

### Sign Out
```typescript
const signOut = async () => {
  setLoading(true)
  try {
    await authHelpers.signOut()
    // Clears session and redirects to login
  } catch (error) {
    setLoading(false)
    throw error
  }
}
```

## State Lifecycle

### Initial Load
1. Component mounts and calls `getInitialSession()`
2. Checks for existing Supabase session
3. If session exists, loads user profile data
4. Sets loading to false

### Authentication Changes
1. Auth state change detected via Supabase listener
2. Updates user and session state
3. Loads or clears profile data accordingly
4. Updates loading state

### Error Handling
- Authentication errors are caught and re-thrown
- Loading state is reset on errors
- Profile loading failures are logged but don't break auth

## UserProfile Interface

```typescript
interface UserProfile {
  id: string
  full_name: string | null
  organization: string | null
  role: UserRole                    // 'lawyer' | 'admin' | 'readonly'
  created_at: string
  updated_at: string
}

type UserRole = 'lawyer' | 'admin' | 'readonly'
```

## Role Hierarchy

```
Admin (highest privileges)
├── Full system access
├── User management
├── Configuration settings
└── All lawyer and readonly features

Lawyer (standard user)
├── Create and edit reports
├── Access all legal research features
├── Export and download capabilities
└── All readonly features

Readonly (limited access)
├── View legislation and cases
├── Browse legal content
└── Limited search capabilities
```

## Integration with Auth Library

The component relies on `/lib/auth.ts` for:
- **authClient**: Supabase client instance
- **authHelpers**: Authentication utility functions
- **UserProfile**: Type definitions
- **UserRole**: Role enumeration

## Error Boundaries

The provider includes error handling for:
- Session recovery failures
- Profile loading errors
- Authentication operation errors
- Network connectivity issues

## Security Considerations

- **Session Validation**: Automatic session validation on app load
- **Role Verification**: Server-side role validation in API calls
- **Token Management**: Handled automatically by Supabase
- **Logout Security**: Complete session cleanup on sign out

## Performance Considerations

- **Initial Load**: Single session check on app startup
- **State Updates**: Efficient state updates via React Context
- **Memory Management**: Proper cleanup of auth listeners
- **Profile Caching**: Profile data cached during session

## Related Components

- **[`LoginForm.tsx`](./LoginForm.md)**: Authentication form component
- **[`ProtectedRoute.tsx`](./ProtectedRoute.md)**: Route protection wrapper
- **`/lib/auth.ts`**: Authentication utility library
- **Supabase Auth**: Backend authentication service

## Best Practices

### Usage Guidelines
- Always use the `useAuth` hook instead of accessing context directly
- Handle loading states in components that depend on auth data
- Use role-based rendering for conditional UI elements
- Implement proper error boundaries for auth failures

### Security Best Practices
- Never store sensitive data in auth context
- Validate user permissions on both client and server
- Use HTTPS in production environments
- Implement proper session timeout handling