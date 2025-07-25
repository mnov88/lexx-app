# LoginForm Component

## Overview

The `LoginForm` component provides a comprehensive authentication interface that handles both sign-in and sign-up functionality for the legal research platform. It features role-based registration, form validation, and seamless integration with the authentication system.

- **File**: `lexx-app/src/components/auth/LoginForm.tsx`
- **Dependencies**: `AuthProvider` (via `useAuth` hook)
- **Type**: Form Component with Authentication Logic

## Architecture

The component operates in two modes:
1. **Sign In Mode**: Simple email/password authentication
2. **Sign Up Mode**: Extended form with user profile information and role selection

It integrates directly with the `AuthProvider` context to handle authentication operations and loading states.

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `mode` | `'signin' \| 'signup'` | ✅ | Current form mode (sign-in or sign-up) |
| `onToggleMode` | `() => void` | ✅ | Callback to switch between sign-in and sign-up modes |
| `onSuccess` | `() => void` | ❌ | Optional callback executed after successful authentication |

## Key Features

### 🔐 Dual Authentication Modes
- **Sign In**: Streamlined login with email and password
- **Sign Up**: Comprehensive registration with profile data
- **Mode Toggle**: Seamless switching between modes
- **State Persistence**: Form data preserved during mode switches

### 📋 Comprehensive Form Fields
**Sign In Fields**:
- Email address (required)
- Password (required)

**Sign Up Additional Fields**:
- Full name (optional)
- Organization (optional)
- Account type/role (required, defaults to Lawyer)
- Confirm password (required)

### ✅ Form Validation
- **Client-side Validation**: Real-time validation with user feedback
- **Password Matching**: Confirms password match during registration
- **Password Strength**: Minimum 6 character requirement
- **Email Format**: Built-in HTML5 email validation
- **Error Display**: Clear error messages with styled error states

### 👥 Role-Based Registration
- **Legal Professional**: Full access to research and report features
- **Research Access Only**: Read-only access for viewing content
- **Admin Role**: Not available in self-registration (requires admin invitation)

### 🎨 Professional UI/UX
- **Card Layout**: Clean, centered form design
- **Loading States**: Spinner animation during authentication
- **Dark Mode Support**: Complete dark theme integration
- **Responsive Design**: Optimized for desktop and mobile
- **Accessibility**: Proper labels, focus states, and keyboard navigation

## Usage Example

```tsx
import { LoginForm } from '@/components/auth/LoginForm'
import { useState } from 'react'

function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  const handleToggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
  }

  const handleSuccess = () => {
    // Redirect to dashboard or close modal
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm
        mode={mode}
        onToggleMode={handleToggleMode}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
```

## Form Data Structure

```typescript
interface FormData {
  email: string
  password: string
  confirmPassword: string    // Sign-up only
  fullName: string          // Sign-up only
  organization: string      // Sign-up only  
  role: UserRole           // Sign-up only, defaults to LAWYER
}
```

## Authentication Flow

### Sign In Process
1. User enters email and password
2. Form validates required fields
3. Calls `signIn()` from AuthProvider
4. Shows loading state during authentication
5. Redirects on success or shows error message

### Sign Up Process
1. User fills registration form
2. Client-side validation:
   - Password length (minimum 6 characters)
   - Password confirmation match
   - Required field validation
3. Calls `signUp()` with user profile data
4. Creates user account and profile record
5. Automatically signs in new user

## Validation Logic

### Password Validation
```typescript
// Password length check
if (formData.password.length < 6) {
  setError('Password must be at least 6 characters')
  return
}

// Password confirmation check
if (formData.password !== formData.confirmPassword) {
  setError('Passwords do not match')
  return
}
```

### Real-time Error Clearing
```typescript
const handleInputChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }))
  if (error) setError(null) // Clear error on input change
}
```

## Component Structure

### Header Section
- Dynamic title based on mode
- Centered, prominent heading
- Consistent branding with "Lexx" platform name

### Form Fields Section  
- **Email**: Always visible, HTML5 email validation
- **Full Name**: Sign-up only, optional field
- **Organization**: Sign-up only, optional for freelance lawyers
- **Role Selection**: Sign-up only, dropdown with Legal Professional/Research Only options
- **Password**: Always visible, password input type
- **Confirm Password**: Sign-up only, validation against primary password

### Error Display
- Red-themed error box
- Clear, user-friendly error messages
- Automatic clearing on form interaction

### Submit Button
- Full-width, prominent blue button
- Loading state with spinner animation
- Disabled during authentication operations
- Dynamic text based on mode and loading state

### Mode Toggle Section
- Separator border above toggle
- Clear call-to-action text
- Blue link styling for mode switch button

### Legal Notice (Sign-up only)
- Terms of service and privacy policy reference
- Platform usage disclaimer
- Professional use context

## Error Handling

### Client-side Errors
- Password too short
- Password mismatch
- Missing required fields
- Invalid email format

### Server-side Errors
- Invalid credentials
- Email already registered
- Network connectivity issues
- Rate limiting

### Error Display
```typescript
{error && (
  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md">
    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
  </div>
)}
```

## Loading States

### Visual Indicators
- Disabled form fields during submission
- Spinner animation in submit button
- Dynamic button text ("Signing In...", "Creating Account...")
- Prevents multiple submissions

### Implementation
```typescript
<button
  type="submit"
  disabled={loading}
  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400..."
>
  {loading ? (
    <span className="flex items-center justify-center">
      <svg className="animate-spin...">...</svg>
      {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
    </span>
  ) : (
    mode === 'signin' ? 'Sign In' : 'Create Account'
  )}
</button>
```

## CSS Classes & Styling

### Layout
- **Container**: `max-w-md mx-auto` for centered, responsive width
- **Card**: White/gray card with border and rounded corners
- **Form**: Vertical spacing with `space-y-4`

### Form Controls
- **Input Fields**: Consistent styling with focus states
- **Labels**: Semantic typography with proper contrast
- **Button**: Full-width, blue theme with hover states

### Error States
- **Error Box**: Red-themed with proper borders and background
- **Error Text**: Red text with appropriate contrast ratios

### Dark Mode
- Complete dark theme support with `dark:` prefixed classes
- Proper contrast ratios for accessibility
- Consistent theming with rest of application

## Related Components

- **[`AuthProvider.tsx`](./AuthProvider.md)**: Provides authentication context and methods
- **[`ProtectedRoute.tsx`](./ProtectedRoute.md)**: Route protection using auth state
- **`/lib/auth.ts`**: Authentication utility functions and types

## Security Considerations

- **Password Security**: Minimum length requirements
- **Input Validation**: Both client and server-side validation
- **HTTPS**: Secure transmission in production
- **Error Messages**: Generic messages to prevent username enumeration
- **Role Security**: Server-side role validation and enforcement

## Accessibility Features

- **Semantic HTML**: Proper form structure with labels
- **Focus Management**: Logical tab order and focus states
- **Screen Reader Support**: Descriptive labels and error messages
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color combinations