# ThemeControls Component

## Overview
The `ThemeControls` component is a UI component that provides a dropdown menu for controlling the theme and other display settings of the application. It allows users to customize their reading experience.

## Import
```typescript
import { ThemeControls } from '@/components/ui/ThemeControls'
```

## Functionality

- **Theme Toggle:** Allows the user to switch between light and dark themes.
- **Font Size Control:** Allows the user to select from a range of font sizes (sm, base, lg, xl).
- **Typeface Control:** Allows the user to switch between serif and sans-serif typefaces.
- **Operative Parts Control:** Allows the user to toggle the visibility of operative parts in case views, and to switch between simplified and verbatim text.
- **State Management:** Uses a Zustand store (`useThemeStore`) to manage the state of the theme and other settings.

## Usage

The `ThemeControls` component is typically used in the main navigation bar.

```tsx
// in src/components/layout/Navigation.tsx
import { ThemeControls } from '@/components/ui/ThemeControls'

export function Navigation() {
  return (
    <nav>
      ...
      <ThemeControls />
    </nav>
  )
}
```

## Dependencies

- **lucide-react:** Provides icons.
- **@/stores/useThemeStore:** The Zustand store for managing theme state. 