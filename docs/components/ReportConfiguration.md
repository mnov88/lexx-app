# ReportConfiguration Component

## Overview

The `ReportConfiguration` component is a comprehensive form interface for configuring legal research reports. It provides a rich UI for selecting legislation, articles, and customizing report content and formatting options. This component is the first step in the report generation workflow.

- **File**: `lexx-app/src/components/reports/ReportConfiguration.tsx`
- **Dependencies**: `lucide-react`
- **Parent Component**: `ReportBuilder.tsx`

## Architecture

The component consists of four main configuration sections:
1. **Report Settings**: Basic report metadata (title, description, template)
2. **Content Selection**: Dual-panel selection for legislation and articles
3. **Content Options**: Checkboxes and dropdowns for output customization
4. **Generation Control**: Final button to trigger report generation

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `config` | `ReportConfig` | ✅ | Current report configuration state |
| `setConfig` | `(config: ReportConfig) => void` | ✅ | Function to update report configuration |
| `legislations` | `Legislation[]` | ✅ | Available legislations from the API |
| `onGenerate` | `() => void` | ✅ | Callback function to trigger report generation |
| `isGenerating` | `boolean` | ✅ | Loading state during report generation |

## Key Features

### 📋 Report Metadata Configuration
- **Title Field**: Customizable report title with placeholder
- **Description Field**: Optional multiline description textarea
- **Template Selection**: Standard, Detailed, or Summary templates
- **Form Validation**: Real-time validation with visual feedback

### 📚 Dual-Panel Content Selection
- **Legislation Panel**: 
  - Available legislation list with search/scroll
  - Selected legislation with removal capability
  - CELEX number display for identification
  - Color-coded selection (blue theme)

- **Articles Panel**:
  - Dynamic loading based on selected legislation
  - Individual article selection from available pool
  - Article number and title display
  - Color-coded selection (green theme)
  - Cascade removal when parent legislation is removed

### ⚙️ Content Customization Options
- **Include Article Text**: Toggle for full article content
- **Include Operative Parts**: Toggle for case rulings
- **Include Case Summaries**: Toggle for case summary text
- **Operative Parts Mode**: Choice between simplified and verbatim text
- **Output Format**: HTML or PDF format selection

### 🔄 Dynamic Data Management
- **Article Loading**: Automatically fetches articles when legislation is selected
- **Cascade Effects**: Removing legislation removes associated articles
- **State Synchronization**: Keeps all selections in sync
- **Error Handling**: Graceful handling of API failures

## Functionality

### Legislation Management
```typescript
const addLegislation = (legislationId: string) => {
  if (!config.legislations.includes(legislationId)) {
    setConfig({
      ...config,
      legislations: [...config.legislations, legislationId]
    })
  }
}

const removeLegislation = (legislationId: string) => {
  setConfig({
    ...config,
    legislations: config.legislations.filter(id => id !== legislationId),
    // Cascade: Remove articles from removed legislation
    articles: config.articles.filter(articleId => {
      const article = availableArticles.find(a => a.id === articleId)
      return article && article.legislation_id !== legislationId
    })
  })
}
```

### Article Management
```typescript
const addArticle = (articleId: string) => {
  if (!config.articles.includes(articleId)) {
    setConfig({
      ...config,
      articles: [...config.articles, articleId]
    })
  }
}

const removeArticle = (articleId: string) => {
  setConfig({
    ...config,
    articles: config.articles.filter(id => id !== articleId)
  })
}
```

### Dynamic Article Loading
```typescript
useEffect(() => {
  const fetchArticles = async () => {
    if (config.legislations.length === 0) {
      setAvailableArticles([])
      return
    }

    try {
      const articlePromises = config.legislations.map(legislationId =>
        fetch(`/api/legislations/${legislationId}/articles`).then(res => res.json())
      )
      
      const articlesResults = await Promise.all(articlePromises)
      const allArticles = articlesResults.flat()
      setAvailableArticles(allArticles)
    } catch (error) {
      console.error('Error fetching articles:', error)
      setAvailableArticles([])
    }
  }

  fetchArticles()
}, [config.legislations])
```

## Usage Example

```tsx
import { ReportConfiguration } from '@/components/reports/ReportConfiguration'
import { ReportConfig, Legislation } from '@/types/database'

function ReportBuilder() {
  const [config, setConfig] = useState<ReportConfig>({
    title: 'Legal Research Report',
    description: '',
    legislations: [],
    articles: [],
    includeOperativeParts: true,
    operativePartsMode: 'simplified',
    includeArticleText: true,
    includeCaseSummaries: true,
    format: 'html',
    template: 'standard'
  })
  const [legislations, setLegislations] = useState<Legislation[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Report generation logic
    setIsGenerating(false)
  }

  return (
    <ReportConfiguration
      config={config}
      setConfig={setConfig}
      legislations={legislations}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
    />
  )
}
```

## Component Sections

### 1. Report Settings Section
**Fields**:
- `title`: Text input for report title
- `description`: Textarea for optional description
- `template`: Dropdown for template selection (standard/detailed/summary)

**Styling**: White card with settings icon and form controls

### 2. Content Selection Section
**Layout**: Two-column grid on large screens

**Left Panel - Legislation**:
- Selected legislation list (blue theme)
- Available legislation list with add buttons
- CELEX number display
- Remove buttons (X icons)

**Right Panel - Articles**:
- Dependent on legislation selection
- Selected articles list (green theme) 
- Available articles list with add buttons
- Article number and title display

### 3. Content Options Section
**Left Column**:
- Include article text (checkbox)
- Include operative parts (checkbox)
- Include case summaries (checkbox)

**Right Column**:
- Operative parts mode (dropdown - conditional)
- Output format (dropdown - HTML/PDF)

### 4. Generation Control
- Large blue button with loading state
- Disabled when no content selected
- Loading spinner and text during generation

## State Management

### Local State
- `availableArticles`: Articles for selected legislations
- `selectedLegislationDetails`: Full objects for selected legislations

### Props State
- `config`: Complete report configuration
- `isGenerating`: Loading state from parent

### Computed Values
- `selectedArticles`: Articles matching selected IDs
- `unselectedLegislations`: Available legislations not yet selected
- `unselectedArticles`: Available articles not yet selected

## Validation & UX

### Form Validation
- Generate button disabled when no content selected
- Required field indicators
- Real-time validation feedback

### Loading States
- Loading spinner during report generation
- Disabled button states
- Progress indication

### Error Handling
- API failure graceful handling
- Empty state messages
- Network error recovery

## Related Components

- **[`ReportBuilder.tsx`](./ReportBuilder.md)**: Parent container component
- **[`ReportPreview.tsx`](./ReportPreview.md)**: Next step in the workflow
- **API Endpoints**: `/api/legislations`, `/api/legislations/[id]/articles`

## CSS Classes & Styling

### Layout
- **Grid System**: Responsive grid layouts with breakpoints
- **Card Design**: Consistent white/gray card styling
- **Icon Integration**: Lucide icons for visual hierarchy

### Interactive Elements
- **Selection Lists**: Hover states and transition animations
- **Form Controls**: Focus states and border styling
- **Buttons**: Consistent button styling with loading states

### Color Coding
- **Legislation**: Blue theme (`bg-blue-50`, `border-blue-200`)
- **Articles**: Green theme (`bg-green-50`, `border-green-200`)
- **Form Elements**: Standard gray theme with blue focus

## Performance Considerations

- **Efficient API Calls**: Batched article fetching for multiple legislations
- **State Updates**: Minimal re-renders through proper state management
- **List Rendering**: Scrollable containers for large datasets
- **Memory Management**: Proper cleanup of unused article data