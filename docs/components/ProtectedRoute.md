# ProtectedRoute Component

## Overview

The `ProtectedRoute` component provides comprehensive route-level access control for the legal research platform. It handles authentication checks, role-based permissions, loading states, and automatic redirects. The component also includes a higher-order component version and a permissions hook for flexible usage patterns.

- **File**: `lexx-app/src/components/auth/ProtectedRoute.tsx`
- **Dependencies**: `AuthProvider`, `useRouter` from Next.js
- **Type**: Access Control Component with HOC and Hook utilities

## Architecture

The component implements a three-stage protection model:
1. **Loading State**: Shows loading UI while authentication status is being determined
2. **Authentication Check**: Redirects unauthenticated users to login
3. **Authorization Check**: Validates user roles against required permissions

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | ✅ | - | Content to render when access is granted |
| `requiredRole` | `UserRole` | ❌ | `UserRole.READONLY` | Minimum role required to access the content |
| `fallbackUrl` | `string` | ❌ | `'/auth'` | URL to redirect unauthenticated users |
| `loadingComponent` | `ReactNode` | ❌ | Default spinner | Custom loading component |
| `unauthorizedComponent` | `ReactNode` | ❌ | Default error page | Custom unauthorized access component |

## Key Features

### 🔐 Multi-Level Access Control
- **Authentication Check**: Ensures user is logged in
- **Role-Based Authorization**: Validates user permissions
- **Hierarchical Roles**: Admin > Lawyer > Readonly permission levels
- **Flexible Requirements**: Configurable role requirements per route

### 🔄 Smart Redirects
- **Login Redirect**: Automatically redirects to auth page with return URL
- **Return Path Preservation**: Maintains original destination after login
- **Fallback Handling**: Configurable redirect destinations
- **Browser History**: Proper navigation history management

### 🎨 Professional Error Handling
- **Loading States**: Elegant loading animations during auth checks
- **Access Denied UI**: Professional unauthorized access messaging
- **Role Information**: Shows user's current role and requirements
- **Navigation Actions**: "Go Back" button for user convenience

### ⚡ Performance Optimized
- **Lazy Evaluation**: Only checks permissions when needed
- **Conditional Rendering**: Minimal DOM impact during loading
- **State Synchronization**: Integrates with auth context efficiently

## Usage Examples

### Basic Route Protection
```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  )
}
```

### Custom Loading and Error Components  
```tsx
function ReportsPage() {
  return (
    <ProtectedRoute 
      requiredRole="lawyer"
      loadingComponent={<CustomSpinner />}
      unauthorizedComponent={<CustomAccessDenied />}
    >
      <ReportBuilder />
    </ProtectedRoute>
  )
}
```

### Higher-Order Component Usage
```tsx
import { withAuth } from '@/components/auth/ProtectedRoute'

const AdminOnlyComponent = withAuth(AdminPanel, 'admin')
const LawyerComponent = withAuth(ReportBuilder, 'lawyer')

function App() {
  return (
    <div>
      <AdminOnlyComponent />
      <LawyerComponent />
    </div>
  )
}
```

### Permissions Hook Usage
```tsx
import { usePermissions } from '@/components/auth/ProtectedRoute'

function MyComponent() {
  const { 
    canViewReports, 
    canAdmin, 
    isLawyer, 
    userRole 
  } = usePermissions()

  return (
    <div>
      {canViewReports && <ReportsButton />}
      {canAdmin && <AdminSettings />}
      {isLawyer && <AdvancedFeatures />}
      <p>Your role: {userRole}</p>
    </div>
  )
}
```

## Access Control Flow

### 1. Loading State
```typescript
if (loading) {
  return loadingComponent || <DefaultLoadingSpinner />
}
```

### 2. Authentication Check
```typescript
if (!isAuthenticated) {
  const currentPath = window.location.pathname
  const redirectUrl = `${fallbackUrl}?redirect=${encodeURIComponent(currentPath)}`
  router.push(redirectUrl)
  return null
}
```

### 3. Authorization Check
```typescript
if (requiredRole && !hasRole(requiredRole)) {
  return unauthorizedComponent || <DefaultUnauthorizedPage />
}
```

### 4. Access Granted
```typescript
return <>{children}</>
```

## Role Hierarchy

```
Admin (UserRole.ADMIN)
├── Full system access
├── User management capabilities
├── All lawyer and readonly features
└── Administrative settings

Lawyer (UserRole.LAWYER)  
├── Report generation
├── Advanced search features
├── Export capabilities
└── All readonly features

Readonly (UserRole.READONLY)
├── View legislation and cases
├── Basic search functionality
└── Read-only access to content
```

## Higher-Order Component (HOC)

### Purpose
Provides a declarative way to protect entire components with authentication requirements.

### Usage
```typescript
// Protect component at definition time
const ProtectedAdminPanel = withAuth(AdminPanel, 'admin')
const ProtectedReportBuilder = withAuth(ReportBuilder, 'lawyer')

// Use protected components directly
<ProtectedAdminPanel />
<ProtectedReportBuilder />
```

### Implementation
```typescript
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
```

## Permissions Hook

### Purpose
Provides fine-grained permission checking within components for conditional rendering.

### Available Permissions
```typescript
interface PermissionsHook {
  canViewReports: boolean     // Lawyer or Admin
  canUseAI: boolean          // Lawyer or Admin  
  canAdmin: boolean          // Admin only
  isLawyer: boolean          // Exactly Lawyer role
  isAdmin: boolean           // Exactly Admin role
  isReadOnly: boolean        // Exactly Readonly role
  userRole: UserRole | undefined // Current user role
}
```

### Usage Patterns
```tsx
function ConditionalFeatures() {
  const { canViewReports, canAdmin, userRole } = usePermissions()

  return (
    <div>
      {/* Feature-based rendering */}
      {canViewReports && (
        <button>Generate Report</button>
      )}
      
      {/* Admin-only features */}
      {canAdmin && (
        <AdminMenu />
      )}
      
      {/* Role-based messaging */}
      <p>Welcome, {userRole} user!</p>
    </div>
  )
}
```

## Default UI Components

### Loading Component
- **Spinner**: Centered loading spinner with blue theme
- **Message**: "Checking authentication..." text
- **Full Screen**: Covers entire viewport during loading
- **Dark Mode**: Complete dark theme support

### Unauthorized Component
- **Error Card**: Red-themed error message card
- **Icon**: Warning triangle icon for visual emphasis
- **Role Information**: Shows current role and requirements
- **Navigation**: "Go Back" button for user convenience
- **Responsive**: Centered layout with mobile optimization

## Error States and Handling

### Authentication Errors
- **Redirect**: Automatic redirect to login page
- **Return Path**: Preserves intended destination
- **URL Parameters**: Passes redirect parameter for post-login navigation

### Authorization Errors  
- **Visual Feedback**: Clear error messaging with role information
- **User Guidance**: Explains permission requirements
- **Navigation Options**: Provides way to navigate back
- **Role Display**: Shows current user role for clarity

## Integration with Next.js

### Router Usage
```typescript
import { useRouter } from 'next/navigation'

const router = useRouter()

// Redirect with return path
const redirectUrl = `${fallbackUrl}?redirect=${encodeURIComponent(currentPath)}`
router.push(redirectUrl)

// Navigation actions
router.back() // Go back functionality
```

### SSR Considerations
- **Client-side Only**: Uses 'use client' directive
- **Window Access**: Safe window object access with checks
- **Hydration**: Handles server-client rendering differences

## Security Considerations

### Client-side Security
- **Role Validation**: Client-side checks are for UX only
- **Server Validation**: All API calls must validate permissions server-side
- **Token Security**: Auth tokens handled securely by Supabase
- **Route Protection**: Prevents unauthorized component rendering

### Best Practices
- Always validate permissions on the server
- Use the most restrictive role necessary
- Implement proper error boundaries
- Log security events for monitoring

## Related Components

- **[`AuthProvider.tsx`](./AuthProvider.md)**: Provides authentication context and state
- **[`LoginForm.tsx`](./LoginForm.md)**: Authentication form for login redirects
- **`/lib/auth.ts`**: Authentication utilities and role definitions

## Performance Considerations

- **Lazy Loading**: Only loads protected content after authorization
- **State Synchronization**: Efficient integration with auth context
- **Conditional Rendering**: Minimal DOM impact during checks
- **Route Optimization**: Fast redirects without unnecessary renders