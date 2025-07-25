# ArticlesSidebar Component

## Overview

The `ArticlesSidebar` component is the right panel of the three-pane case viewer system. It displays the legislative articles that are interpreted by the current case, organized by legislation, and provides cross-reference navigation between cases and the legislation they interpret.

- **File**: `lexx-app/src/components/cases/ArticlesSidebar.tsx`
- **Dependencies**: `lucide-react`, Next.js `Link`
- **Parent Component**: `CaseViewer.tsx`

## Architecture

The component organizes and displays three main sections:
1. **Articles Interpreted**: Legislative articles grouped by their parent legislation
2. **Referenced Cases**: Placeholder for future case-to-case references
3. **Case Summary**: Statistical overview of the case's scope and content

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `caseData` | `CaseViewerData` | ✅ | Complete case data including interpreted articles and operative parts |
| `isMobile` | `boolean` | ❌ | Flag for mobile layout adjustments. Defaults to `false` |

## Key Features

### 📖 Legislative Articles Display
- **Legislation Grouping**: Articles organized by their parent legislation
- **Article Details**: Shows article numbers, titles, and operative part associations
- **Cross-Reference Navigation**: Direct links to legislation and individual articles
- **Sorting**: Articles sorted numerically within each legislation

### 🔗 Cross-Reference System
- **Bidirectional Navigation**: Links from cases to articles and from articles back to cases
- **Operative Part Mapping**: Shows which specific operative parts interpret each article
- **External Link Indicators**: Visual cues for navigation to other pages

### 📊 Summary Statistics
- **Case Metrics**: Displays counts of operative parts, interpreted articles, and legislation pieces
- **Quick Overview**: Provides context about the case's scope and impact
- **Real-time Calculation**: Statistics calculated from actual case data

### 🎛️ Collapsible Sections
- **Section Management**: Each section can be independently expanded/collapsed
- **State Persistence**: Section states maintained during user interaction
- **Visual Indicators**: Chevron icons show expand/collapse state

## Functionality

### Article Grouping
```typescript
// Groups articles by their parent legislation
const articlesByLegislation = new Map()
caseData.interpreted_articles?.forEach(article => {
  const legId = article.legislation.id
  if (!articlesByLegislation.has(legId)) {
    articlesByLegislation.set(legId, {
      legislation: article.legislation,
      articles: []
    })
  }
  articlesByLegislation.get(legId).articles.push(article)
})
```

### Navigation Links
- **Legislation Links**: Navigate to `/legislation/{id}` for full legislation view
- **Article Links**: Navigate to `/articles/{id}` for individual article detail
- **External Link Styling**: Consistent hover states and visual indicators

### Operative Part Associations
- **Part Badges**: Shows which operative parts of the case interpret each article
- **Visual Mapping**: Helps users understand the relationship between rulings and legislation
- **Cross-Reference**: Enables understanding of case impact on specific articles

## Usage Example

```tsx
// Used within CaseViewer three-pane layout
import { ArticlesSidebar } from '@/components/cases/ArticlesSidebar'

function CaseViewer({ caseId }: { caseId: string }) {
  const [caseData, setCaseData] = useState<CaseViewerData | null>(null)
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Sidebar */}
      <div className="lg:col-span-1">
        <OperativePartsSidebar caseData={caseData} />
      </div>
      
      {/* Main Content */}
      <div className="lg:col-span-2">
        <CaseBody caseData={caseData} />
      </div>
      
      {/* Right Sidebar - Articles & Cross-References */}
      <div className="lg:col-span-1">
        <ArticlesSidebar 
          caseData={caseData}
          isMobile={isMobile}
        />
      </div>
    </div>
  )
}
```

## Component Sections

### Articles Interpreted Section
**Purpose**: Shows which legislative articles this case interprets
**Features**:
- Legislation grouping with title and CELEX number
- Article listing with numbers and titles
- Operative part badges showing interpretation mapping
- Direct navigation links to legislation and articles

**Data Structure**:
```typescript
interface ArticleGroup {
  legislation: {
    id: string
    title: string
    celex_number: string
  }
  articles: Array<{
    id: string
    article_number_text: string
    title?: string
    operative_parts: Array<{ id: string, part_number: number }>
  }>
}
```

### Referenced Cases Section
**Purpose**: Future implementation for case-to-case references
**Current State**: Placeholder with "coming soon" message
**Planned Features**:
- Cases cited within the current case's text
- Precedent relationships
- Related case recommendations

### Case Summary Section
**Purpose**: Statistical overview of the case
**Metrics Displayed**:
- Total operative parts count
- Total interpreted articles count
- Number of different legislation pieces affected

## State Management

### Local State
- `articlesExpanded`: Controls Articles Interpreted section visibility
- `referencesExpanded`: Controls Referenced Cases section visibility

### Data Processing
- **Article Grouping**: Dynamic grouping of articles by legislation
- **Sorting**: Articles sorted numerically within each legislation group
- **Counting**: Real-time calculation of summary statistics

## Related Components

- **`CaseViewer.tsx`**: Parent container managing the three-pane layout
- **`CaseBody.tsx`**: Main content panel displaying the full case text
- **`OperativePartsSidebar.tsx`**: Left panel showing case navigation and operative parts
- **`ArticleViewer.tsx`**: Target component when users navigate to specific articles
- **`LegislationViewer.tsx`**: Target component when users navigate to legislation

## CSS Classes & Styling

### Layout
- **Sticky Behavior**: `sticky top-6 max-h-screen overflow-y-auto` for desktop
- **Card Layout**: Standard white/gray cards with consistent spacing
- **Grid Organization**: Structured layout for grouped content

### Interactive Elements
- **Hover States**: Smooth transitions on all clickable elements
- **Focus States**: Keyboard navigation support
- **Link Styling**: Consistent external link indicators
- **Badge Styling**: Operative part badges with proper contrast

### Typography
- **Hierarchical Text**: Proper heading levels and text sizing
- **Color Schemes**: Semantic color usage for different content types
- **Truncation**: `line-clamp-2` for long legislation titles

## Performance Considerations

- **Efficient Grouping**: Uses Map for O(1) lookup during article grouping
- **Sorted Display**: Articles sorted once during render for optimal display
- **Sticky Positioning**: CSS sticky positioning for optimal sidebar behavior
- **Conditional Rendering**: Only renders sections when expanded to reduce DOM size

## Future Enhancements

### Referenced Cases Implementation
The "Referenced Cases" section is prepared for future implementation to show:
- Cases cited within the current case's text
- Precedent relationships and case law chains
- Related cases with similar interpretations
- Court hierarchy and appeal relationships

### Additional Cross-References
Planned enhancements include:
- Direct links to specific operative parts
- Visual indicators for interpretation strength
- Filtering options for article types
- Enhanced metadata display for legislation