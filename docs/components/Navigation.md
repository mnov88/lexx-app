# Navigation Component

## Overview

The `Navigation` component serves as the main navigation header for the Lexx EU Legal Research Platform. It provides adaptive navigation based on authentication status, role-based access control, comprehensive user management, and responsive design across all screen sizes.

- **File**: `lexx-app/src/components/layout/Navigation.tsx`
- **Dependencies**: `lucide-react`, `next/link`, `next/navigation`, `AuthProvider`, `ThemeControls`
- **Type**: Layout Component with Authentication Integration

## Import
```typescript
import { Navigation } from '@/components/layout/Navigation'
```

## Key Features

### 🏗️ Adaptive Navigation Structure
- **Dynamic Menu Items**: Navigation items filter based on authentication status and user roles
- **Public Access**: Home, Legislation, and Case law accessible to all users
- **Protected Routes**: Reports and AI assistant require authentication
- **Role-Based Access**: Different features available based on user role (Admin/Lawyer/Readonly)
- **Active State Highlighting**: Current page highlighted with border and color changes

### 👤 User Management Interface
- **Authentication Status**: Shows sign-in link for guests, user menu for authenticated users
- **User Profile Display**: Shows user name, email, and role badge in navigation
- **Role Visualization**: Color-coded role badges (Admin: red, Lawyer: blue, Readonly: gray)
- **Dropdown User Menu**: Complete user information with organization and sign-out functionality
- **Click-Outside Handling**: User menu closes when clicking elsewhere

### 📱 Responsive Design System
- **Mobile Optimization**: Compact layout for mobile devices with hidden text labels
- **Desktop Enhancement**: Full feature set with text labels and expanded information
- **Hydration Safety**: Client-side rendering checks to prevent hydration mismatches
- **Loading States**: Proper loading state handling during authentication checks

### 🎨 Theme Integration
- **Complete Dark Mode**: Comprehensive dark theme support across all elements
- **Theme Controls**: Integrated `ThemeControls` component for user preferences
- **Consistent Styling**: Maintains design consistency with rest of application
- **Accessible Contrast**: Proper color contrast ratios for accessibility

## Usage Examples

### Root Layout Integration
```tsx
// in src/app/layout.tsx
import { Navigation } from '@/components/layout/Navigation'
import { AuthProvider } from '@/components/auth/AuthProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Custom Navigation Wrapper
```tsx
import { Navigation } from '@/components/layout/Navigation'

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="pt-16"> {/* Account for fixed navigation height */}
        {children}
      </div>
    </div>
  )
}
```

## Navigation Structure

### Menu Items Configuration
```typescript
const navigationItems = [
  { href: '/', label: 'Home', icon: Search, public: true },
  { href: '/legislation', label: 'Legislation', icon: Scale, public: true },
  { href: '/cases', label: 'Case law', icon: FileText, public: true },
  { href: '/reports', label: 'Reports', icon: Printer, public: true }, // Testing
  { href: '/chat', label: 'AI assistant', icon: MessageSquare, requiresAuth: true },
]
```

### Access Control Logic
- **Public Items**: Always visible regardless of authentication status
- **Protected Items**: Only visible to authenticated users
- **Loading State**: Navigation items hidden during authentication loading
- **Conditional Rendering**: Items filtered based on authentication and loading states

## User Interface Elements

### Brand Section
- **Logo**: "Lexx" in serif font with prominent styling
- **Link**: Clicking logo navigates to home page
- **Typography**: 2xl size with bold weight for brand recognition

### Navigation Links
- **Icon Integration**: Each link paired with descriptive Lucide icon
- **Active State**: Border-bottom and color change for current page
- **Hover Effects**: Smooth transitions on hover with color changes
- **Responsive Text**: Icons always visible, text hidden on mobile

### User Controls Section
```typescript
// Authenticated user dropdown
<div className="relative" ref={menuRef}>
  <button onClick={() => setShowUserMenu(!showUserMenu)}>
    <User className="h-4 w-4" />
    <span>{profile?.full_name || profile?.email?.split('@')[0]}</span>
    <RoleBadge role={profile?.role} />
  </button>
  
  {showUserMenu && (
    <UserDropdownMenu 
      email={profile?.email}
      organization={profile?.organization}
      onSignOut={signOut}
    />
  )}
</div>
```

### Role Badge System
```typescript
// Role-based color coding
const getRoleBadgeClasses = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
    case UserRole.LAWYER:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
  }
}
```

## Responsive Behavior

### Desktop Layout (sm:flex)
- **Full Navigation**: All items visible with text labels
- **User Information**: Complete user name and role badge displayed
- **Spacious Design**: Adequate spacing between navigation elements

### Mobile Layout (hidden sm:inline)
- **Icon-Only Navigation**: Text labels hidden to save space
- **Compact User Display**: Only user icon visible, name hidden
- **Touch-Friendly**: Appropriate touch targets for mobile interaction

## State Management

### Hydration Handling
```typescript
const [isClient, setIsClient] = useState(false)

useEffect(() => {
  setIsClient(true)
}, [])

// Prevents hydration mismatches
{isClient && !loading && (
  // Render authentication-dependent content
)}
```

### User Menu State
```typescript
const [showUserMenu, setShowUserMenu] = useState(false)
const menuRef = useRef<HTMLDivElement>(null)

// Click outside to close
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowUserMenu(false)
    }
  }
  // Event listener setup
}, [showUserMenu])
```

## Authentication Integration

### Auth Provider Usage
```typescript
const { isAuthenticated, profile, signOut, loading } = useAuth()

// Conditional navigation rendering
.filter(item => item.public || (isClient && !loading && isAuthenticated))

// User profile display
{profile?.full_name || profile?.email?.split('@')[0] || 'User'}
```

### Sign Out Functionality
```typescript
const handleSignOut = async () => {
  await signOut()
  setShowUserMenu(false)
}
```

## Styling & Theme Support

### CSS Classes Structure
- **Container**: `max-w-7xl mx-auto` for centered responsive layout
- **Navigation Bar**: `h-16` fixed height with `border-b` separation
- **Link States**: Different classes for active, inactive, and hover states
- **Dark Mode**: Complete `dark:` prefixed classes for theme support

### Active Link Styling
```typescript
const linkClasses = cn(
  'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
  isActive
    ? 'border-gray-900 text-gray-900 dark:border-white dark:text-white'
    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
)
```

## Dependencies

- **lucide-react**: Icon library (Search, Scale, FileText, BookOpen, Printer, MessageSquare, User, LogOut, LogIn)
- **next/link**: Client-side navigation for performance
- **next/navigation**: Access to current pathname for active state detection
- **@/components/ui/ThemeControls**: Theme switching functionality
- **@/components/auth/AuthProvider**: Authentication state and user profile
- **@/lib/auth**: `UserRole` enum for role-based access control
- **@/lib/utils**: `cn` utility function for conditional CSS classes

## Related Components

- **[`AuthProvider.tsx`](../auth/AuthProvider.md)**: Provides authentication context
- **[`ThemeControls.tsx`](../ui/ThemeControls.md)**: Theme switching functionality  
- **`/lib/auth.ts`**: Authentication utilities and role definitions 