# SearchBar Component

## Overview

The `SearchBar` component provides a powerful, real-time search experience for the entire application. It features a debounced search-as-you-type interface, contextual search capabilities, and keyboard navigation with comprehensive result display.

- **File**: `lexx-app/src/components/ui/SearchBar.tsx`
- **Dependencies**: `lucide-react`, `cn` (utility), `useDebounce` (hook), `useRouter` from Next.js
- **Type**: Interactive Search Component with Real-time Results

## Key Features

### 🔍 Advanced Search Capabilities
- **Debounced Search**: 300ms delay prevents excessive API calls while maintaining responsiveness
- **Multi-Entity Results**: Searches across legislation, cases, and articles simultaneously
- **Contextual Search**: Can be scoped to specific legislation using context prop
- **Minimum Query Length**: Requires 2+ characters to prevent overly broad searches
- **Result Limiting**: Returns up to 8 results for optimal performance

### 🎯 Interactive User Experience
- **Real-time Dropdown**: Live search results appear as user types
- **Visual Result Icons**: Legislation (📜), Cases (⚖️), Articles (📄) for quick identification
- **Rich Result Display**: Shows title, subtitle, and snippet for each result
- **Loading States**: Spinner animation during search operations
- **Empty State Handling**: User-friendly "No results found" messaging

### ⌨️ Keyboard & Navigation
- **Escape Key**: Closes search results dropdown
- **Click Outside**: Closes dropdown when clicking elsewhere
- **Auto Focus**: Optional auto-focus on component mount
- **Smart Navigation**: Automatically routes to correct page based on result type
- **Query Clearing**: Clears search input after navigation

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `placeholder` | `string` | ❌ | The placeholder text for the search input. Defaults to "Search...". |
| `className` | `string` | ❌ | Additional CSS classes to be applied to the component. |
| `context` | `string` | ❌ | An optional legislation ID to scope the search to that legislation. |
| `autoFocus` | `boolean`| ❌ | If `true`, the search input will be focused on mount. Defaults to `false`. |

## Usage Example

### Standard Search Bar
```tsx
import { SearchBar } from '@/components/ui/SearchBar';

export function MyPage() {
  return (
    <div>
      <SearchBar />
    </div>
  );
}
```

### Contextual Search Bar
```tsx
import { SearchBar } from '@/components/ui/SearchBar';

export function LegislationPage({ legislationId }: { legislationId: string }) {
  return (
    <div>
      {/* This will search only within the given legislation */}
      <SearchBar context={legislationId} placeholder="Search within this legislation..." />
    </div>
  );
}
```

### Auto-Focus Search Bar
```tsx
import { SearchBar } from '@/components/ui/SearchBar';

export function HomePage() {
  return (
    <div>
      <SearchBar 
        placeholder="Search legislation, cases, and articles..."
        autoFocus={true}
        className="max-w-2xl mx-auto"
      />
    </div>
  );
}
```

## Search Result Structure

```typescript
interface SearchResult {
  id: string                    // Unique identifier
  title: string                 // Main result title
  type: 'legislation' | 'case' | 'article'  // Result type
  subtitle?: string             // Optional secondary information
  snippet?: string              // Text excerpt preview
  score?: number               // Relevance score
  metadata?: Record<string, unknown>  // Additional result data
}
```

## Navigation Behavior

### Route Mapping
- **Legislation**: `/legislation/{id}` - Individual legislation viewer
- **Case**: `/cases/{id}` - Case law viewer with three-pane layout
- **Article**: `/articles/{id}` - Article viewer with interpreting cases

### Post-Navigation Actions
- Closes search dropdown immediately
- Clears search input for clean slate
- Uses Next.js router for client-side navigation

## Performance Optimizations

### Debouncing Strategy
```typescript
const debouncedQuery = useDebounce(query, 300)

// Only triggers search after 300ms of no typing
useEffect(() => {
  if (debouncedQuery) {
    handleSearch(debouncedQuery)
  }
}, [debouncedQuery, context])
```

### API Integration
- **Endpoint**: `/api/search` with query parameters
- **Context Scoping**: Appends legislation context when provided
- **Error Handling**: Graceful fallback with console logging
- **Result Caching**: Leverages API-level caching for repeated searches

## Styling & Theming

### Input Design
- **Large Input**: 4rem padding with lg text size for prominent search
- **Search Icon**: Left-aligned magnifying glass with gray-400 color
- **Loading Spinner**: Right-aligned with blue-500 theme during searches
- **Focus States**: Blue ring with transparent border on focus
- **Dark Mode**: Complete dark theme support with proper contrast

### Dropdown Styling
- **Positioning**: Absolute positioning below input with z-index 50
- **Shadow**: Large shadow for prominent dropdown appearance
- **Max Height**: 24rem (96) with scroll for many results
- **Hover States**: Subtle gray background changes on result hover
- **Border Separation**: Gray borders between individual results

## Event Handling

### User Interactions
```typescript
// Input changes trigger debounced search
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setQuery(e.target.value)
}

// Result clicks navigate and clean up
const navigateToResult = (result: SearchResult) => {
  router.push(path)
  setIsOpen(false)
  setQuery('')
}

// Escape key closes dropdown
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Escape') {
    setIsOpen(false)
  }
}
```

### Outside Click Detection
```typescript
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])
``` 