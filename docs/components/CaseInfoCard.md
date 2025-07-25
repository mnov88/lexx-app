# CaseInfoCard Component

## Overview

The `CaseInfoCard` component is a versatile card used to display a summary of a legal case. It can be used in various contexts, such as in a list of cases or on an article page to show the cases that interpret that article.

- **File**: `lexx-app/src/components/cases/CaseInfoCard.tsx`
- **Dependencies**: `lucide-react`, `Link` (from Next.js)

## Functionality

- **Displays Case Information**: Shows the case ID, date of judgment, title, and parties.
- **Links to Case**: Provides a link to the full case page.
- **Shows Operative Parts**: Can be configured to display the operative parts of the case.
- **Context-Aware**: Can be configured to show either simplified or verbatim text for the operative parts, based on the `simplified` prop.

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `data` | `CaseInfoCardData` | ✅ | The data for the case to be displayed. |
| `showOperativeParts` | `boolean` | ❌ | If `true`, the operative parts of the case will be displayed. Defaults to `true`. |
| `simplified` | `boolean` | ❌ | If `true`, the simplified text of the operative parts will be displayed. Defaults to `false`. |

## `CaseInfoCardData` Interface

```typescript
export interface CaseInfoCardData {
  case_law: CaseLaw
  operative_parts: OperativePart[]
  context: 'legislation' | 'article' | 'case_list'
}
```

## Usage Example

```tsx
import { CaseInfoCard } from '@/components/cases/CaseInfoCard';
import { CaseInfoCardData } from '@/types/database';

export function MyPage({ caseData }: { caseData: CaseInfoCardData }) {
  return (
    <div>
      <CaseInfoCard data={caseData} showOperativeParts={true} simplified={false} />
    </div>
  );
}
``` 