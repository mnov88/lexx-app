# LatestCases Component

## Overview
The `LatestCases` component displays the most recent legal cases. It's typically used on the home page to show users the latest legal developments and provide quick access to recent case law.

## Import
```typescript
import { LatestCases } from '@/components/ui/LatestCases'
```

## Usage Examples

### Basic Usage
```tsx
// In lexx-app/src/app/page.tsx
import { LatestCases } from '@/components/ui/LatestCases'

export default function HomePage() {
  return (
    <div>
      <h2>Latest Cases</h2>
      <LatestCases />
    </div>
  )
}
```

## Functionality

- **Data Fetching:** Fetches the latest 5 cases from the API.
- **Case Display:** Renders each case with its ID, date, title, parties, and summary.
- **Navigation:** Each case is a clickable link that navigates to the full case page.
- **Loading State:** Shows skeleton loading placeholders while data is being fetched.
- **Empty State:** Displays a message when no cases are found.
- **Error Handling:** Includes comprehensive error handling and logging for debugging.

## Dependencies

- **next/link:** For client-side navigation.
- **lucide-react:** Provides icons.
- **@/types/database:** For the `CaseLaw` type. 