# LegislationViewer Component

## Overview
The `LegislationViewer` component is a comprehensive component that displays a single piece of legislation along with its articles and interpreting cases. It provides a complete view of a legal document, including metadata, search functionality, and navigation to related content.

## Import
```typescript
import { LegislationViewer } from '@/components/legislation/LegislationViewer'
```

## Props/Parameters

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `legislationId` | `string` | ✅ | - | The UUID of the legislation to be displayed. |

## Usage Examples

### Basic Usage
```tsx
// In lexx-app/src/app/legislation/[id]/page.tsx
import { LegislationViewer } from '@/components/legislation/LegislationViewer'

interface LegislationPageProps {
  params: Promise<{ id: string }>
}

export default async function LegislationPage({ params }: LegislationPageProps) {
  const { id } = await params
  
  return <LegislationViewer legislationId={id} />
}
```

## Functionality

- **Data Fetching:** Fetches legislation data, articles, and cases in parallel from the API.
- **Breadcrumb Navigation:** Provides breadcrumb navigation to help users understand their location.
- **Search Integration:** Includes a search bar that's scoped to the current legislation.
- **Content Display:** Shows the legislation's metadata (type, CELEX number, publication date) and displays its articles and interpreting cases.
- **Progressive Disclosure:** Initially shows only 5 articles and 5 cases, with options to show all.
- **Loading and Error States:** Provides appropriate loading and error states.

## Dependencies

- **lucide-react:** Provides icons.
- **next/link:** For client-side navigation.
- **@/components/ui/SearchBar:** The search component.
- **@/components/ui/Breadcrumbs:** The breadcrumb navigation component.
- **@/components/articles/ArticleList:** The component for displaying articles.
- **@/components/cases/CaseList:** The component for displaying cases.
- **@/types/database:** For the `Legislation`, `Article`, and `CaseLaw` types. 