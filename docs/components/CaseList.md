# CaseList Component

## Overview
The `CaseList` component is a UI component for displaying a list of legal cases. It can be configured to display in a standard or compact layout, and can be virtualized for performance with long lists.

## Import
```typescript
import { CaseList } from '@/components/cases/CaseList'
```

## Props/Parameters

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `cases` | `CaseLaw[]` | ✅ | - | The array of `CaseLaw` objects to display. |
| `showArticleChips` | `boolean` | ❌ | `false` | Whether to display chips for the articles that a case interprets (currently a placeholder). |
| `compact` | `boolean` | ❌ | `false` | Whether to display the list in a compact layout. |
| `virtualized` | `boolean` | ❌ | `false` | Whether to use the `VirtualizedList` component for performance optimization. |
| `onLoadMore` | `() => Promise<CaseLaw[]>` | ❌ | - | A function to call to load more cases when the user scrolls. |
| `hasMore` | `boolean` | ❌ | `false` | Whether there are more cases to load. |
| `isLoadingMore` | `boolean` | ❌ | `false` | Whether the list is currently loading more cases. |

## Usage Examples

### Basic Usage
```tsx
<CaseList cases={cases} />
```

### Compact Layout
```tsx
<CaseList cases={cases} compact={true} />
```

### Virtualized with Infinite Scroll
```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(...)

<CaseList
  cases={data.pages.flatMap((page) => page.data)}
  virtualized={true}
  onLoadMore={fetchNextPage}
  hasMore={hasNextPage}
  isLoadingMore={isFetchingNextPage}
/>
``` 