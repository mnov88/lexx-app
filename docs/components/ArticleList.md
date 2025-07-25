# ArticleList Component

## Overview
The `ArticleList` component is a UI component for displaying a list of articles. It provides a clean, card-based layout for browsing legal articles with preview content and navigation to full article pages.

## Import
```typescript
import { ArticleList } from '@/components/articles/ArticleList'
```

## Props/Parameters

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `articles` | `Article[]` | ✅ | - | The array of `Article` objects to display. |
| `showLegislationInfo` | `boolean` | ❌ | `false` | Whether to display legislation information (currently not implemented). |

## Usage Examples

### Basic Usage
```tsx
<ArticleList articles={articles} />
```

### With Legislation Info (Future Feature)
```tsx
<ArticleList articles={articles} showLegislationInfo={true} />
```

## Functionality

- **Article Display:** Renders a list of `Article` objects, showing the article number, title, and a preview of the content.
- **Navigation:** Each article is a clickable link that navigates to the full article page.
- **Empty State:** Displays a message when no articles are found.
- **Optional Legislation Info:** Has an option to show legislation information, though this feature is not currently implemented.

## Dependencies

- **next/link:** For client-side navigation.
- **lucide-react:** Provides icons.
- **@/types/database:** For the `Article` type. 