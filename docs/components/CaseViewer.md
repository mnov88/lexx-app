# CaseViewer Component

## Overview

The `CaseViewer` component is the main container for the three-pane case law research interface. It orchestrates the display of detailed legal case information through three specialized child components, providing a comprehensive and responsive legal document reading experience.

- **File**: `lexx-app/src/components/cases/CaseViewer.tsx`
- **Dependencies**: `lucide-react`, `useThemeStore`, Next.js `Link`
- **Child Components**:
    - [`CaseBody.tsx`](./CaseBody.md): The central pane displaying the main case content
    - [`OperativePartsSidebar.tsx`](./OperativePartsSidebar.md): The left sidebar with navigation and operative parts
    - [`ArticlesSidebar.tsx`](./ArticlesSidebar.md): The right sidebar showing interpreted articles

## Architecture

The `CaseViewer` component serves as both a data fetcher and layout manager:

### Desktop Layout (≥1024px)
- **12-column CSS Grid**: `lg:grid-cols-12` for precise layout control
- **3-6-3 Distribution**: Left sidebar (3 cols), main content (6 cols), right sidebar (3 cols)
- **Sticky Positioning**: Sidebars use sticky positioning for optimal reading experience

### Mobile Layout (<1024px)
- **Single Column**: Main content displayed full-width
- **Modal Sidebars**: Left and right panels accessible via modal overlays
- **Touch-Optimized**: Control buttons for accessing sidebar content
- **Header Simplification**: Mobile-specific header with case metadata

### State Integration
- **Theme Store Integration**: Uses `useThemeStore` for operative parts preferences
- **Data Distribution**: Fetches case data once and distributes to all child components
- **Loading States**: Provides skeleton loading animations during data fetch

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `caseId` | `string` | ✅ | The UUID of the case to be displayed |

## Key Features

### 📱 Responsive Design
- **Adaptive Layout**: Automatically switches between desktop three-pane and mobile single-pane layouts
- **Modal Sidebars**: Mobile users access sidebars through full-screen modals
- **Touch Controls**: Mobile-optimized buttons for sidebar access
- **Breakpoint Management**: Uses Tailwind's `lg:` breakpoint (1024px) for layout switching

### 📊 Data Management
- **Single Fetch**: Fetches complete case data once from `/api/cases/[id]` endpoint
- **State Distribution**: Distributes data to all child components efficiently
- **Loading States**: Provides skeleton animations during data loading
- **Error Handling**: Graceful handling of missing or invalid case data

### 🎛️ State Management
- **Local State**: Manages loading state and mobile sidebar visibility
- **Global State**: Integrates with theme store for user preferences
- **Modal Control**: Independent state for left and right sidebar modals

### 🎨 Theme Integration
- **Operative Parts Preferences**: Connects to global theme store for visibility and text mode
- **Dark Mode Support**: Complete dark mode styling throughout the interface
- **User Preferences**: Persistent settings for operative parts display

## Functionality

### Data Fetching
```typescript
const fetchCaseData = async () => {
  try {
    const response = await fetch(`/api/cases/${caseId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch case: ${response.status}`)
    }
    const data = await response.json()
    setCaseData(data)
  } catch (error) {
    console.error('Error fetching case data:', error)
    setCaseData(null)
  } finally {
    setIsLoading(false)
  }
}
```

### Layout Management
- **Desktop Grid**: 12-column CSS Grid with 3-6-3 distribution
- **Mobile Stack**: Single column with modal overlays for sidebars
- **Responsive Headers**: Different header layouts for desktop and mobile
- **Loading Skeletons**: Animated placeholders during data loading

### Mobile Modal System
- **Left Modal**: Table of Contents and Operative Parts
- **Right Modal**: Articles and Cross-References  
- **Overlay Backgrounds**: Semi-transparent backgrounds with click-to-close
- **Slide Animation**: Sidebars slide in from left/right edges

## State Management

### Local State
```typescript
const [caseData, setCaseData] = useState<CaseViewerData | null>(null)
const [isLoading, setIsLoading] = useState(true)
const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
```

### Global State (Theme Store)
```typescript
const { operativePartsVisible, operativePartsSimplified } = useThemeStore()
```

## Component Integration

### Child Component Props
The `CaseViewer` passes the following props to its child components:

**To CaseBody:**
```typescript
<CaseBody 
  caseData={caseData} 
  isMobile={isMobile} // only on mobile layout
/>
```

**To OperativePartsSidebar:**
```typescript
<OperativePartsSidebar 
  caseData={caseData}
  operativePartsVisible={operativePartsVisible} // from theme store
  simplified={operativePartsSimplified}       // from theme store
  isMobile={isMobile}                         // only in mobile modals
/>
```

**To ArticlesSidebar:**
```typescript
<ArticlesSidebar 
  caseData={caseData}
  isMobile={isMobile} // only in mobile modals
/>
```

## Related Components

- **[`CaseBody.tsx`](./CaseBody.md)**: Main content panel with legal document rendering
- **[`OperativePartsSidebar.tsx`](./OperativePartsSidebar.md)**: Navigation and operative parts display
- **[`ArticlesSidebar.tsx`](./ArticlesSidebar.md)**: Articles interpretation and cross-references
- **`useThemeStore`**: Global state management for user preferences

## Usage Example

```tsx
// In lexx-app/src/app/cases/[id]/page.tsx
import { CaseViewer } from '@/components/cases/CaseViewer'

interface CasePageProps {
  params: Promise<{ id: string }>
}

export default async function CasePage({ params }: CasePageProps) {
  const { id } = await params
  
  return <CaseViewer caseId={id} />
}
``` 