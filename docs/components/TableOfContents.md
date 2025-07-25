# TableOfContents Component

## Overview
The `TableOfContents` component automatically generates a hierarchical table of contents from a given Markdown string. It is displayed as a modal that can be opened and closed, and it allows users to easily navigate to different sections of the content.

## Import
```typescript
import { TableOfContents } from '@/components/ui/TableOfContents'
```

## Props/Parameters

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `content` | `string` | ✅ | - | The Markdown string to parse for headings. |
| `isOpen` | `boolean` | ✅ | - | Whether the table of contents modal is open. |
| `onClose` | `() => void` | ✅ | - | A function to call when the modal is closed. |
| `className` | `string` | ❌ | `''` | Additional CSS classes to apply to the container. |

## Usage Examples

### Basic Usage
```tsx
const [isTocOpen, setIsTocOpen] = useState(false)

<TableOfContents 
  content={article.markdown_content}
  isOpen={isTocOpen}
  onClose={() => setIsTocOpen(false)}
/>
```

## Functionality

- **Automatic Generation:** Parses a Markdown string and extracts headings to create a hierarchical table of contents.
- **Smooth Scrolling:** Clicking on a heading smoothly scrolls the page to that heading.
- **Expandable Sections:** Top-level sections can be expanded and collapsed.
- **Modal Display:** The table of contents is displayed in a modal.
- **Empty State:** Displays a message if no headings are found.

## Dependencies

- **lucide-react:** Provides icons. 