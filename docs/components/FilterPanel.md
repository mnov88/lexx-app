# FilterPanel Component

## Overview
The `FilterPanel` component provides filtering capabilities for cases based on legislation and articles. It allows users to narrow down their search by selecting specific legal documents and their constituent parts.

## Import
```typescript
import { FilterPanel } from '@/components/cases/FilterPanel'
```

## Props/Parameters

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `legislations` | `Legislation[]` | ✅ | - | The array of available legislations to filter by. |
| `selectedLegislation` | `string \| null` | ✅ | - | The ID of the currently selected legislation, or `null` if none is selected. |
| `selectedArticle` | `string \| null` | ✅ | - | The ID of the currently selected article, or `null` if none is selected. |
| `onLegislationFilter` | `(legislationId: string \| null) => void` | ✅ | - | A function to call when the user selects or deselects a legislation. |
| `onArticleFilter` | `(articleId: string \| null) => void` | ✅ | - | A function to call when the user selects or deselects an article. |

## Usage Examples

### Basic Usage
```tsx
const [selectedLegislation, setSelectedLegislation] = useState<string | null>(null)
const [selectedArticle, setSelectedArticle] = useState<string | null>(null)

<FilterPanel
  legislations={legislations}
  selectedLegislation={selectedLegislation}
  selectedArticle={selectedArticle}
  onLegislationFilter={setSelectedLegislation}
  onArticleFilter={setSelectedArticle}
/>
```

## Functionality

- **Legislation Filter:** Allows users to filter cases by selecting a specific legislation.
- **Article Filter:** When a legislation is selected, allows users to further filter by specific articles within that legislation.
- **Dynamic Article Loading:** Fetches articles for the selected legislation from the API.
- **Clear Filters:** Provides options to clear individual filters or all filters at once.
- **Active Filter Display:** Shows a summary of currently active filters.

## Dependencies

- **lucide-react:** Provides icons.
- **@/types/database:** For the `Legislation` and `Article` types. 