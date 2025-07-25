# VirtualizedList Component

## Overview
The `VirtualizedList` component is a performance-optimization component that efficiently renders long lists of items. It uses a technique called "windowing" to only render the items that are currently visible in the viewport, plus a few extra items above and below (overscan) to ensure smooth scrolling. This is a crucial component for displaying long lists of legal documents, such as cases or articles, without impacting the performance of the application.

## Import
```typescript
import { VirtualizedList } from '@/components/ui/VirtualizedList'
```

## Props/Parameters

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `items` | `T[]` | ✅ | - | The array of items to render. |
| `renderItem` | `(item: T, index: number) => React.ReactNode` | ✅ | - | A function that renders a single item in the list. |
| `itemHeight` | `number` | ✅ | - | The height of each item in the list, in pixels. |
| `containerHeight` | `number` | ✅ | - | The height of the list container, in pixels. |
| `overscan` | `number` | ❌ | `5` | The number of extra items to render above and below the visible area. |
| `className` | `string` | ❌ | `''` | Additional CSS classes to apply to the container. |
| `onLoadMore` | `() => void` | ❌ | - | A function to call when the user scrolls to the bottom of the list, to load more items. |
| `hasNextPage` | `boolean` | ❌ | `false` | Whether there are more items to load. |
| `isLoadingMore` | `boolean` | ❌ | `false` | Whether the list is currently loading more items. |

## Usage Examples

### Basic Usage
```tsx
<VirtualizedList
  items={cases}
  renderItem={(caseData) => <CaseInfoCard data={caseData} />}
  itemHeight={150}
  containerHeight={800}
/>
```

### With Infinite Scroll
```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(...)

<VirtualizedList
  items={data.pages.flatMap((page) => page.data)}
  renderItem={(caseData) => <CaseInfoCard data={caseData} />}
  itemHeight={150}
  containerHeight={800}
  onLoadMore={fetchNextPage}
  hasNextPage={hasNextPage}
  isLoadingMore={isFetchingNextPage}
/>
``` 