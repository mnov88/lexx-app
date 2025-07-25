# ReportPreview Component

## Overview

The `ReportPreview` component displays a comprehensive preview of a generated legal research report and provides download functionality. It serves as the final step in the report generation workflow, showing users exactly what their report contains before downloading it in their preferred format.

- **File**: `lexx-app/src/components/reports/ReportPreview.tsx`
- **Dependencies**: `lucide-react`
- **Parent Component**: `ReportBuilder.tsx`

## Architecture

The component is structured into three main sections:
1. **Report Summary**: Statistics and configuration overview
2. **Content Preview**: Hierarchical preview of the report structure
3. **Download Actions**: Buttons to download the report in different formats

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `reportData` | `ReportData` | ✅ | Complete generated report data including config and content |
| `onDownloadHtml` | `() => void` | ✅ | Callback function to download HTML version |
| `onDownloadPdf` | `() => void` | ✅ | Callback function to download PDF version |

## Key Features

### 📊 Report Statistics Dashboard
- **Metric Cards**: Color-coded cards showing legislation, articles, and cases counts
- **Generation Timestamp**: When the report was generated
- **Configuration Summary**: Template, format, and content options display
- **Visual Hierarchy**: Icons and color coding for different content types

### 👁️ Content Structure Preview  
- **Hierarchical Display**: Legislation → Articles → Cases structure
- **Limited Preview**: Shows first 3 articles per legislation with "...and N more" indicators
- **Metadata Display**: CELEX numbers, article numbers, case counts
- **Scrollable Container**: Handles large reports with scroll overflow

### 📥 Download Interface
- **Dual Format Support**: HTML and PDF download options
- **Primary Action**: PDF download emphasized with blue styling
- **Secondary Action**: HTML download with outline styling
- **Consistent Icons**: FileText and Download icons for clarity

### 🎨 Professional Styling
- **Legal Typography**: Serif fonts for report titles and headers
- **Color Coding**: Blue for legislation, green for articles, purple for cases
- **Card-based Layout**: Clean white cards with proper spacing
- **Dark Mode Support**: Complete dark theme integration

## Functionality

### Data Structure Processing
```typescript
const { config, content } = reportData

// Statistics calculation
const legislationCount = content.legislations.length
const totalArticles = content.totalArticles
const totalCases = content.totalCases

// Configuration display
const templateName = config.template // standard, detailed, summary
const outputFormat = config.format   // html, pdf
const contentOptions = {
  includeArticleText: config.includeArticleText,
  includeOperativeParts: config.includeOperativeParts,
  operativePartsMode: config.operativePartsMode // simplified, verbatim
}
```

### Preview Rendering
```typescript
// Hierarchical content preview
content.legislations.map((legislation, index) => (
  <div key={legislation.id} className="border-l-4 border-blue-200">
    <h2>{index + 1}. {legislation.title}</h2>
    <div>CELEX: {legislation.celex_number}</div>
    
    {legislation.articles.slice(0, 3).map(article => (
      <div key={article.id}>
        Article {article.article_number_text}: {article.title}
        <div>{article.cases.length} interpreting cases</div>
      </div>
    ))}
  </div>
))
```

### Download Actions
```typescript
// Download handlers passed from parent
<button onClick={onDownloadHtml}>
  <FileText className="w-4 h-4 mr-2" />
  Download HTML
</button>

<button onClick={onDownloadPdf}>
  <Download className="w-4 h-4 mr-2" />
  Download PDF
</button>
```

## Usage Example

```tsx
import { ReportPreview } from '@/components/reports/ReportPreview'
import { ReportData } from '@/types/database'

function ReportBuilder() {
  const [reportData, setReportData] = useState<ReportData | null>(null)

  const handleDownloadHtml = async () => {
    try {
      const response = await fetch('/api/reports/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: reportData.config,
          reportData: reportData,
          format: 'html'
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${reportData.config.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
        a.click()
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleDownloadPdf = async () => {
    // Similar implementation for PDF
  }

  if (!reportData) return null

  return (
    <ReportPreview
      reportData={reportData}
      onDownloadHtml={handleDownloadHtml}
      onDownloadPdf={handleDownloadPdf}
    />
  )
}
```

## Component Sections

### 1. Report Summary Section
**Header**:
- Eye icon + "Report Preview" title
- Generation timestamp with clock icon

**Statistics Grid** (3 columns):
- **Legislation Card**: Blue theme, Scale icon, count display
- **Articles Card**: Green theme, Book icon, count display  
- **Cases Card**: Purple theme, FileText icon, count display

**Configuration Display**:
- Template type (Standard/Detailed/Summary)
- Output format (HTML/PDF)
- Content inclusion settings
- Operative parts mode (if enabled)

### 2. Content Preview Section
**Structure**:
- Professional report header with title and description
- Generation date display
- Scrollable content area (max-height: 384px)

**Content Hierarchy**:
```
Legislation 1
├── CELEX: 32012R1215
├── Articles (5)
│   ├── Article 3: Authorities assimilated to courts
│   │   └── 2 interpreting cases
│   ├── Article 4: General provisions
│   │   └── 1 interpreting case
│   └── ... and 2 more articles
```

**Preview Limitations**:
- Shows first 3 articles per legislation
- Displays case counts but not full case details
- Truncation indicators for large reports

### 3. Download Actions Section
**Button Layout**: Centered with spacing

**HTML Download**:
- Outline button style
- FileText icon
- Secondary action positioning

**PDF Download**:
- Solid blue button style
- Download icon  
- Primary action emphasis

## State Management

### Props Data
- `reportData.config`: Report configuration settings
- `reportData.content`: Generated content structure

### Computed Values
- Legislation count from `content.legislations.length`
- Total articles from `content.totalArticles`
- Total cases from `content.totalCases`
- Formatted generation date from `content.generatedAt`

## Related Components

- **[`ReportBuilder.tsx`](./ReportBuilder.md)**: Parent container managing the workflow
- **[`ReportConfiguration.tsx`](./ReportConfiguration.md)**: Previous step in workflow
- **API Endpoints**: `/api/reports/download` for file generation

## CSS Classes & Styling

### Layout
- **Grid System**: Responsive 3-column grid for statistics
- **Card Design**: White cards with border and shadow
- **Scroll Container**: `max-h-96 overflow-y-auto` for content preview

### Color Theming
- **Legislation**: Blue theme (`bg-blue-50`, `text-blue-600`)
- **Articles**: Green theme (`bg-green-50`, `text-green-600`)
- **Cases**: Purple theme (`bg-purple-50`, `text-purple-600`)

### Typography
- **Report Title**: `text-2xl font-serif font-bold` for professional appearance
- **Section Headers**: Consistent hierarchy with proper font weights
- **Metadata**: Smaller text with muted colors

### Interactive Elements
- **Button Styling**: Consistent with design system
- **Hover States**: Smooth transitions on interactive elements
- **Focus States**: Keyboard navigation support

## Performance Considerations

- **Preview Truncation**: Shows only first 3 articles to prevent DOM bloat
- **Efficient Rendering**: Avoids rendering full report content in preview
- **Scroll Optimization**: Fixed height containers for large reports
- **Memory Management**: Proper cleanup of generated URLs after download

## Data Flow

### Input Processing
1. Receives complete `ReportData` from parent
2. Extracts `config` and `content` for display
3. Calculates statistics from content structure

### User Interactions
1. User reviews preview and statistics
2. User clicks download button (HTML or PDF)
3. Parent component handles download API call
4. File download initiated via browser

### Error Handling
- Graceful display when no content available
- Empty state messaging for missing data
- Download error handling in parent component