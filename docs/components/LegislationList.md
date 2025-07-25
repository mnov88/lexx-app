# LegislationList Component

## Overview
The `LegislationList` component is a UI component for displaying a list of legislations. It fetches and displays all available legal documents with their metadata and provides navigation to individual legislation pages.

## Import
```typescript
import { LegislationList } from '@/components/legislation/LegislationList'
```

## Usage Examples

### Basic Usage
```tsx
// In lexx-app/src/app/legislation/page.tsx
import { LegislationList } from '@/components/legislation/LegislationList'

export default function LegislationPage() {
  return <LegislationList />
}
```

## Functionality

- **Data Fetching:** Fetches the list of legislations from the API.
- **Legislation Display:** Renders each legislation with its type, CELEX number, publication date, title, and summary.
- **Navigation:** Each legislation is a clickable link that navigates to the full legislation page.
- **Loading State:** Shows skeleton loading placeholders while data is being fetched.
- **Empty State:** Displays a message when no legislations are found.

## Dependencies

- **next/link:** For client-side navigation.
- **lucide-react:** Provides icons.
- **@/types/database:** For the `Legislation` type. 