# OperativePartsSidebar Component

## Overview

The `OperativePartsSidebar` component is the left panel of the three-pane case viewer system. It provides navigation and displays the key legal rulings (operative parts) of a case. This component serves as both a navigation aid and a focused view of the most important legal content.

- **File**: `lexx-app/src/components/cases/OperativePartsSidebar.tsx`
- **Dependencies**: `react-markdown`, `remark-gfm`, `lucide-react`, `useThemeStore`
- **Parent Component**: `CaseViewer.tsx`

## Architecture

The component consists of two main sections:
1. **Table of Contents**: Generated from the case's markdown content for document navigation
2. **Operative Parts**: The actual legal rulings with interactive controls and article tags

It integrates with the global theme store to manage operative parts visibility and display modes across the application.

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `caseData` | `CaseViewerData` | ✅ | Complete case data including operative parts and content |
| `operativePartsVisible` | `boolean` | ✅ | Controls whether operative parts content is displayed |
| `simplified` | `boolean` | ✅ | Determines whether to show simplified or verbatim text |
| `isMobile` | `boolean` | ❌ | Flag for mobile layout adjustments. Defaults to `false` |

## Key Features

### 📑 Table of Contents Navigation
- **Dynamic Generation**: Creates navigation from Markdown headers in case content
- **Smooth Scrolling**: Implements smooth scroll behavior to document sections
- **ID Sanitization**: Handles special characters in legal document headings
- **Collapsible Interface**: Users can expand/collapse the ToC section

### ⚖️ Operative Parts Display
- **Legal Rulings Focus**: Shows the court's actual rulings and decisions
- **Dual Text Modes**: Toggle between simplified and verbatim text versions
- **Article Associations**: Displays which articles each operative part interprets
- **Interactive Controls**: Visibility toggle and mode switching

### 🎛️ Interactive Controls
- **Visibility Toggle**: Eye/EyeOff icons to show/hide operative parts content
- **Mode Switching**: Button to toggle between "Simplified" and "Verbatim" text
- **Collapsible Sections**: Both ToC and operative parts can be collapsed
- **Theme Integration**: Connected to global theme store for persistent settings

### 🏷️ Article Tagging
- **Article References**: Shows which legislative articles each operative part interprets
- **Badge Display**: Visual badges with article numbers for quick reference
- **Cross-Reference**: Enables understanding of case-to-legislation relationships

## Functionality

### Table of Contents Generation
```typescript
const generateTableOfContents = (content: string): TableOfContentsItem[] => {
  const headers = content.match(/^## .+$/gm) || []
  return headers.map(header => {
    const title = header.replace('## ', '')
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Sanitize special characters
      .replace(/\s+/g, '-')     // Convert spaces to hyphens
      .replace(/-+/g, '-')      // Normalize multiple hyphens
    return { id, title, level: 1, href: `#${id}` }
  })
}
```

### Text Processing
- **Markdown Cleaning**: Removes formatting markers for display in navigation
- **Markdown Rendering**: Renders operative parts with proper legal formatting
- **Text Fallbacks**: Graceful handling when content is unavailable

### Navigation Behavior
- **Smooth Scrolling**: Uses `scrollIntoView` with smooth behavior
- **Error Handling**: Catches and logs invalid CSS selector errors
- **Section Highlighting**: Visual feedback for active sections

## Usage Example

```tsx
// Used within CaseViewer three-pane layout
import { OperativePartsSidebar } from '@/components/cases/OperativePartsSidebar'
import { useThemeStore } from '@/stores/useThemeStore'

function CaseViewer({ caseId }: { caseId: string }) {
  const [caseData, setCaseData] = useState<CaseViewerData | null>(null)
  const { operativePartsVisible, operativePartsSimplified } = useThemeStore()
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Sidebar - Navigation & Operative Parts */}
      <div className="lg:col-span-1">
        <OperativePartsSidebar 
          caseData={caseData}
          operativePartsVisible={operativePartsVisible}
          simplified={operativePartsSimplified}
          isMobile={isMobile}
        />
      </div>
      
      {/* Main Content */}
      <div className="lg:col-span-2">
        <CaseBody caseData={caseData} />
      </div>
      
      {/* Right Sidebar */}
      <div className="lg:col-span-1">
        <ArticlesSidebar caseData={caseData} />
      </div>
    </div>
  )
}
```

## Component Sections

### Table of Contents
- **Purpose**: Document navigation within the case text
- **Features**: Collapsible, smooth scrolling, hierarchical structure
- **Styling**: Hover effects, indentation for sub-sections
- **Fallback**: Message when no ToC is available

### Operative Parts
- **Purpose**: Display the court's actual legal rulings
- **Features**: Numbered parts, article associations, dual text modes
- **Controls**: Visibility toggle, simplified/verbatim mode switch
- **Styling**: Blue-themed highlighting, bordered sections

## State Management

### Local State
- `tocExpanded`: Controls Table of Contents visibility
- `operativePartsExpanded`: Controls operative parts section visibility

### Global State (Theme Store)
- `operativePartsVisible`: Global setting for showing operative parts content
- `operativePartsSimplified`: Global setting for text mode (simplified vs verbatim)
- `toggleOperativeParts()`: Function to toggle visibility
- `toggleOperativePartsMode()`: Function to switch text mode

## Related Components

- **`CaseViewer.tsx`**: Parent container managing the three-pane layout
- **`CaseBody.tsx`**: Main content panel that this component helps navigate
- **`ArticlesSidebar.tsx`**: Right panel showing interpreted articles
- **`useThemeStore`**: Global state management for user preferences

## CSS Classes & Styling

- **Layout**: `sticky top-6 max-h-screen overflow-y-auto` for desktop sidebar behavior
- **Cards**: Standard white/gray cards with border and rounded corners
- **Interactive**: Hover states, focus states, transition animations
- **Typography**: Semantic text sizing and color schemes
- **Badges**: Blue-themed article number badges
- **Highlighting**: Blue borders and backgrounds for operative parts

## Performance Considerations

- **Sticky Positioning**: Desktop version uses CSS sticky for optimal sidebar behavior
- **Markdown Processing**: Efficient ReactMarkdown rendering with custom components
- **Scroll Optimization**: Uses native `scrollIntoView` for smooth navigation
- **State Persistence**: Integrates with theme store for cross-session preference persistence