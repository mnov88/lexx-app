# CrossReferencePanel Component

## Overview
The `CrossReferencePanel` component automatically detects and resolves cross-references to articles, legislations, and cases within a given text. It then displays these references in a clear, organized, and expandable panel, allowing users to easily navigate between related legal documents. This is a critical feature for a legal research platform.

## Import
```typescript
import { CrossReferencePanel } from '@/components/ui/CrossReferencePanel'
```

## Props/Parameters

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `content` | `string` | ✅ | - | The text content to scan for cross-references. |
| `currentLegislationId` | `string` | ❌ | - | The ID of the current legislation, used to resolve relative references (e.g., "Article 5"). |
| `className` | `string` | ❌ | `''` | Additional CSS classes to apply to the container. |

### Type Definitions
```typescript
interface CrossReferencePanelProps {
  content: string
  currentLegislationId?: string
  className?: string
}
```

## Usage Examples

### Basic Usage
```tsx
<CrossReferencePanel content={article.markdown_content} />
```

### With Current Legislation Context
```tsx
<CrossReferencePanel 
  content={article.markdown_content}
  currentLegislationId={legislation.id}
/>
```

## Functionality

- **Automatic Detection:** Uses `extractCrossReferences` to find references to articles, legislations, and cases.
- **Automatic Resolution:** Uses `resolveCrossReferences` to fetch details from the API and create clickable links.
- **Grouping and Deduplication:** Groups references by type and removes duplicates.
- **Expandable Panel:** The panel is expandable to save space.
- **Loading and Empty States:** Provides feedback during processing and when no references are found.
- **Context-Aware:** Can be given a `currentLegislationId` to resolve relative references.

## Dependencies

- **lucide-react:** Provides icons.
- **@/lib/crossReferences:** Contains the logic for extracting and resolving references. 