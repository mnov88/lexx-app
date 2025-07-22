# Report Download API - POST /api/reports/download

## Endpoint Information
- **Path**: `/api/reports/download`
- **Method**: `POST`
- **Description**: Download generated legal research reports in HTML or PDF format with comprehensive styling and professional layout
- **Version**: `v1.0`
- **Last Updated**: `2024-07-21`

## Authentication
- **Required**: `No` ⚠️ *Should be implemented for production*
- **Type**: `None`
- **Scope**: `write`

## Request

### Request Body
```typescript
interface ReportDownloadRequest {
  config: ReportConfig              // Report configuration
  reportData: ReportData           // Generated report content  
  format: 'html' | 'pdf'           // Download format
}

interface ReportConfig {
  title: string                    // Report title
  description?: string             // Optional report description
  template: 'basic' | 'detailed' | 'comprehensive' // Report template
  format: 'html' | 'pdf'          // Output format
  includeArticleText: boolean      // Include full article content
  includeOperativeParts: boolean   // Include case operative parts
  operativePartsMode: 'simplified' | 'verbatim' // Operative parts text mode
  includeCaseSummaries: boolean    // Include case summaries
}

interface ReportData {
  content: {
    generatedAt: string            // ISO timestamp
    legislations: LegislationReport[] // Legislation data
    totalArticles: number          // Total articles covered
    totalCases: number            // Total cases covered
  }
}
```

### Request Examples

#### HTML Report Download
```bash
curl -X POST "http://localhost:3000/api/reports/download" \
  -H "Content-Type: application/json" \
  -H "Accept: text/html" \
  -d '{
    "config": {
      "title": "GDPR Articles 6-7 Analysis",
      "description": "Analysis of lawfulness and consent provisions",
      "template": "comprehensive",
      "format": "html",
      "includeArticleText": true,
      "includeOperativeParts": true,
      "operativePartsMode": "simplified",
      "includeCaseSummaries": true
    },
    "reportData": {
      "content": {
        "generatedAt": "2024-07-21T10:30:00Z",
        "legislations": [...],
        "totalArticles": 2,
        "totalCases": 5
      }
    },
    "format": "html"
  }'
```

#### PDF-Ready Report Download
```bash
curl -X POST "http://localhost:3000/api/reports/download" \
  -H "Content-Type: application/json" \
  -H "Accept: text/html" \
  -d '{
    "config": {
      "title": "Charter Articles 7-8 Case Law",
      "template": "detailed",
      "format": "pdf",
      "includeArticleText": false,
      "includeOperativeParts": true,
      "operativePartsMode": "verbatim",
      "includeCaseSummaries": false
    },
    "reportData": {
      "content": {
        "generatedAt": "2024-07-21T10:30:00Z",
        "legislations": [...],
        "totalArticles": 2,
        "totalCases": 3
      }
    },
    "format": "pdf"
  }'
```

#### JavaScript/Fetch Example
```javascript
// Generate and download comprehensive GDPR report
const reportConfig = {
  title: "GDPR Data Protection Impact Analysis",
  description: "Comprehensive analysis of key GDPR provisions with case law",
  template: "comprehensive",
  format: "html",
  includeArticleText: true,
  includeOperativeParts: true,
  operativePartsMode: "simplified",
  includeCaseSummaries: true
}

// First generate report data (from /api/reports/generate)
const reportData = await fetch('/api/reports/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: reportConfig.title,
    articles: ['uuid-article-6-gdpr', 'uuid-article-7-gdpr'],
    includeOperativeParts: true
  })
}).then(res => res.json())

// Then download formatted report
const response = await fetch('/api/reports/download', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    config: reportConfig,
    reportData: reportData,
    format: 'html'
  })
})

// Handle file download
const htmlContent = await response.text()
const blob = new Blob([htmlContent], { type: 'text/html' })
const url = URL.createObjectURL(blob)

// Trigger download
const link = document.createElement('a')
link.href = url
link.download = 'gdpr_analysis.html'
document.body.appendChild(link)
link.click()
document.body.removeChild(link)
URL.revokeObjectURL(url)
```

#### Legal Research Context
```javascript
// Legal team downloading comprehensive case law analysis
const caseAnalysisConfig = {
  title: "Digital Services Act - Content Moderation Case Law",
  description: "Analysis of early DSA interpretation by European courts",
  template: "comprehensive",
  format: "pdf",
  includeArticleText: true,
  includeOperativeParts: true,
  operativePartsMode: "verbatim",
  includeCaseSummaries: true
}

// Generate report covering DSA articles with case law
const dsaReportData = await generateDSAReport([
  'uuid-article-12-dsa', // Illegal content
  'uuid-article-14-dsa', // Systemic risks
  'uuid-article-16-dsa'  // External auditing
])

// Download professionally formatted report for court submission
const downloadResponse = await fetch('/api/reports/download', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    config: caseAnalysisConfig,
    reportData: dsaReportData,
    format: 'pdf'
  })
})

console.log('Downloaded DSA analysis report for legal proceedings')
```

## Response

### Success Response (200) - HTML Format
**Content-Type**: `text/html`  
**Content-Disposition**: `attachment; filename="report_title.html"`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>GDPR Articles 6-7 Analysis</title>
    <style>
        /* Comprehensive professional styling */
        body {
            font-family: 'Crimson Text', Georgia, serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 2rem;
        }
        
        .title {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: #111827;
        }
        /* ... additional professional styling ... */
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">GDPR Articles 6-7 Analysis</h1>
        <p class="subtitle">Analysis of lawfulness and consent provisions</p>
        <div class="meta">Generated on July 21, 2024 at 10:30 AM</div>
    </div>

    <div class="summary">
        <div class="summary-grid">
            <div class="summary-item legislations">
                <div class="summary-number">1</div>
                <div class="summary-label">Legislation</div>
            </div>
            <div class="summary-item articles">
                <div class="summary-number">2</div>
                <div class="summary-label">Articles</div>
            </div>
            <div class="summary-item cases">
                <div class="summary-number">5</div>
                <div class="summary-label">Cases</div>
            </div>
        </div>
    </div>

    <div class="legislation">
        <h2 class="legislation-title">1. General Data Protection Regulation</h2>
        <div class="celex">CELEX: 32016R0679</div>
        
        <div class="article">
            <h3 class="article-title">Article 6: Lawfulness of processing</h3>
            
            <div class="article-text">
                1. Processing shall be lawful only if and to the extent that at least one of the following applies:
                (a) the data subject has given consent to the processing...
            </div>

            <div class="cases-section">
                <h4 class="cases-title">Interpreting Cases (3)</h4>
                
                <div class="case">
                    <div class="case-title">Meta Platforms and Others</div>
                    <div class="case-meta">CJEU • May 4, 2023 • CELEX: C-252/21</div>
                    <div class="case-summary">Case addressing behavioral advertising legal basis requirements</div>
                    
                    <div class="operative-parts">
                        <strong>Operative Parts:</strong>
                        <div class="operative-part">
                            <strong>Part 1:</strong> Processing for behavioral advertising requires appropriate legal basis under Article 6(1)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="config-section">
        <h3 class="config-title">Report Configuration</h3>
        <div class="config-grid">
            <div class="config-item">
                <span class="config-label">Template:</span>
                <span class="config-value">Comprehensive</span>
            </div>
            <div class="config-item">
                <span class="config-label">Format:</span>
                <span class="config-value">HTML</span>
            </div>
        </div>
    </div>
</body>
</html>
```

### Success Response (200) - PDF Format
**Content-Type**: `text/html`  
**Content-Disposition**: `attachment; filename="report_title_print.html"`

Returns HTML with additional print-optimized CSS:
```css
@media print {
    .no-print { display: none !important; }
    .page-break { page-break-before: always; }
    body { font-size: 12pt; line-height: 1.4; }
    h1 { font-size: 18pt; }
    h2 { font-size: 16pt; }
    h3 { font-size: 14pt; }
}
```

⚠️ **PDF Note**: Currently returns print-optimized HTML. True PDF generation requires additional processing (Puppeteer, headless Chrome, etc.)

## Error Responses

### 400 - Invalid Format
```json
{
  "error": "Invalid format",
  "code": "INVALID_FORMAT"
}
```

**When this occurs**: Format parameter is not 'html' or 'pdf'

### 400 - Missing Required Fields
```json
{
  "error": "Missing required config or reportData",
  "code": "MISSING_REQUIRED_FIELDS"
}
```

**When this occurs**: Request body missing config, reportData, or format fields

### 500 - Report Generation Error
```json
{
  "error": "Failed to download report",
  "code": "REPORT_GENERATION_ERROR"
}
```

**When this occurs**: Error during HTML generation or template processing

### 500 - Internal Server Error
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

**When this occurs**: Unexpected server errors during report processing

## Status Codes

| Code | Meaning | When Used |
|------|---------| ----------|
| 200 | OK | Report generated and returned successfully |
| 400 | Bad Request | Invalid format or missing required fields |
| 500 | Server Error | Report generation or server error |

## Report Formatting & Styling

### Professional Design Features
- **Typography**: Crimson Text serif font for legal document readability
- **Layout**: Centered 800px max-width with generous margins
- **Color Scheme**: Professional grays with subtle accent colors
- **Structure**: Clear hierarchy with headers, summaries, and sections
- **Print Optimization**: Print-specific CSS for PDF-ready output

### Template Variations
Currently uses single comprehensive template with conditional content based on config:

| Template | Article Text | Case Summaries | Operative Parts | Use Case |
|----------|-------------|----------------|-----------------|----------|
| `basic` | Optional | Optional | Optional | Quick overview |
| `detailed` | Included | Included | Optional | Research summary |
| `comprehensive` | Included | Included | Included | Complete analysis |

### Content Sections

#### 1. Header Section
- Report title and description
- Generation timestamp
- Professional title styling

#### 2. Summary Section  
- Legislation count
- Article count
- Case count
- Visual summary grid

#### 3. Legislation Sections
- Legislation title and CELEX number
- Optional legislation summary
- Article subsections

#### 4. Article Subsections
- Article number and title
- Optional full article text
- Interpreting cases section

#### 5. Case Subsections
- Case title and metadata
- Optional case summaries
- Optional operative parts

#### 6. Configuration Section
- Report settings (hidden in print mode)
- Template and format information

### Styling Features
```css
/* Key styling elements */
.legislation { border-left: 4px solid #3b82f6; }      /* Blue legislation accent */
.article { background: #f9fafb; border: 1px solid #e5e7eb; } /* Light article background */
.case { background: white; border: 1px solid #d1d5db; }      /* White case background */
.operative-part { border-left: 2px solid #8b5cf6; }          /* Purple operative part accent */

/* Color-coded summary items */
.legislations { background: #dbeafe; } /* Blue */
.articles { background: #dcfce7; }     /* Green */  
.cases { background: #fce7f3; }        /* Pink */
```

## File Download Behavior

### HTML Downloads
- **Filename**: Sanitized title + `.html`
- **Content-Type**: `text/html`
- **Disposition**: `attachment` (forces download)
- **Character Encoding**: UTF-8

### PDF Downloads
- **Filename**: Sanitized title + `_print.html`
- **Print Styles**: Included for PDF conversion
- **Page Breaks**: Automatic between legislations
- **Print Optimization**: Optimized fonts and spacing

⚠️ **PDF Limitation**: Currently returns print-optimized HTML. Client-side conversion to PDF required using browser print or tools like Puppeteer.

## Performance Considerations

- **Template Processing**: In-memory HTML generation with string interpolation
- **Response Size**: Varies greatly based on content (5KB-5MB)
- **Processing Time**: Fast for small reports, slower for comprehensive reports
- **Memory Usage**: Proportional to report content size

⚠️ **Performance Notes**:
- **Large Reports**: Comprehensive reports with many articles/cases can be 1-5MB
- **Template Processing**: Complex template logic may slow generation
- **No Streaming**: Entire report generated in memory before response
- **No Caching**: Reports generated fresh each request

## Legal Document Standards

### Professional Formatting
- **Font Choice**: Serif font appropriate for legal documents
- **Line Spacing**: 1.6 line height for readability
- **Margins**: Generous margins suitable for printing and binding
- **Hierarchy**: Clear visual hierarchy for different content levels

### Citation Standards
- **CELEX Numbers**: Properly formatted EU legal identifiers
- **Case Citations**: Court, date, and case number format
- **Article References**: Proper article numbering display
- **Source URLs**: Included for verification and further research

### Print Readiness
- **Page Breaks**: Automatic page breaks between major sections
- **Print Styles**: Optimized typography and spacing for printing
- **No-Print Elements**: Configuration section excluded from printing
- **Font Sizes**: Point-based sizing for consistent print output

## Legal Research Integration

### Use Cases

1. **Court Submission Preparation**
   ```javascript
   // Preparing comprehensive legal analysis for court proceedings
   const courtSubmissionConfig = {
     title: "Legal Analysis: GDPR Article 6 Interpretation",
     description: "Comprehensive analysis for pending data protection case",
     template: "comprehensive",
     format: "pdf",
     includeArticleText: true,
     includeOperativeParts: true,
     operativePartsMode: "verbatim",
     includeCaseSummaries: true
   }
   
   // Download print-ready report for submission
   const reportBlob = await downloadFormattedReport(courtSubmissionConfig, reportData)
   ```

2. **Client Advisory Documents**
   ```javascript
   // Creating client-friendly report with simplified operative parts
   const clientReportConfig = {
     title: "Data Protection Compliance Guidance",
     description: "Key GDPR provisions and court interpretations",
     template: "detailed",
     format: "html",
     includeArticleText: false,
     includeOperativeParts: true,
     operativePartsMode: "simplified",
     includeCaseSummaries: true
   }
   ```

3. **Internal Research Documentation**
   ```javascript
   // Comprehensive internal research documentation
   const researchConfig = {
     title: "Internal Research: Digital Services Act Analysis",
     template: "comprehensive",
     format: "html",
     includeArticleText: true,
     includeOperativeParts: true,
     operativePartsMode: "verbatim",
     includeCaseSummaries: true
   }
   ```

### Integration Workflow
```javascript
// Complete report generation and download workflow
async function generateAndDownloadReport(articleIds, title) {
  // 1. Generate report data
  const reportData = await fetch('/api/reports/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: title,
      articles: articleIds,
      includeOperativeParts: true,
      includeCaseSummaries: true
    })
  }).then(res => res.json())
  
  // 2. Configure report format
  const config = {
    title: title,
    description: `Analysis of ${articleIds.length} articles with case law`,
    template: "comprehensive",
    format: "html",
    includeArticleText: true,
    includeOperativeParts: true,
    operativePartsMode: "simplified",
    includeCaseSummaries: true
  }
  
  // 3. Download formatted report (this endpoint)
  const response = await fetch('/api/reports/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      config: config,
      reportData: reportData,
      format: 'html'
    })
  })
  
  // 4. Handle file download
  const htmlContent = await response.text()
  downloadFile(htmlContent, `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`, 'text/html')
}
```

## Security Considerations

⚠️ **SECURITY PLACEHOLDER NOTES**:

1. **No Access Control**: Anyone can generate and download reports
2. **Data Exposure**: Complete legislative and case content in downloadable format
3. **No Rate Limiting**: Could be used to generate excessive server load
4. **File Generation**: Potential for abuse through large report generation

## Caching Recommendations

⚠️ **NOT CURRENTLY IMPLEMENTED**:

```javascript
// Reports should generally not be cached due to personalization
const cacheConfig = {
  duration: 'none',              // Reports are typically unique
  invalidation: 'immediate',     // No caching for personalized content
  compression: 'gzip',           // Important for large HTML responses
  tags: ['report_download'],
  sizeLimit: '10MB'             // Handle large comprehensive reports
}

// Consider caching common report templates separately
const templateCacheConfig = {
  duration: '1 hour',           // Template structures can be cached
  tags: ['report_templates'],
  vary: ['Report-Template']
}
```

## Testing

### Unit Tests
```typescript
describe('POST /api/reports/download', () => {
  it('should generate HTML report with correct headers', async () => {
    const reportRequest = {
      config: { title: 'Test Report', template: 'basic', format: 'html' },
      reportData: mockReportData,
      format: 'html'
    }
    
    const response = await request(app)
      .post('/api/reports/download')
      .send(reportRequest)
      .expect(200)
    
    expect(response.headers['content-type']).toContain('text/html')
    expect(response.headers['content-disposition']).toContain('attachment')
    expect(response.text).toContain('Test Report')
  })

  it('should generate PDF-optimized HTML with print styles', async () => {
    const reportRequest = {
      config: { title: 'PDF Report', template: 'comprehensive', format: 'pdf' },
      reportData: mockReportData,
      format: 'pdf'
    }
    
    const response = await request(app)
      .post('/api/reports/download')
      .send(reportRequest)
      .expect(200)
    
    expect(response.text).toContain('@media print')
    expect(response.text).toContain('page-break-before')
    expect(response.headers['content-disposition']).toContain('_print.html')
  })

  it('should return 400 for invalid format', async () => {
    const reportRequest = {
      config: { title: 'Test', template: 'basic' },
      reportData: mockReportData,
      format: 'invalid'
    }
    
    await request(app)
      .post('/api/reports/download')
      .send(reportRequest)
      .expect(400)
  })

  it('should include all configured content sections', async () => {
    const reportRequest = {
      config: {
        title: 'Full Report',
        template: 'comprehensive',
        format: 'html',
        includeArticleText: true,
        includeOperativeParts: true,
        includeCaseSummaries: true
      },
      reportData: mockCompleteReportData,
      format: 'html'
    }
    
    const response = await request(app)
      .post('/api/reports/download')
      .send(reportRequest)
      .expect(200)
    
    expect(response.text).toContain('article-text')
    expect(response.text).toContain('operative-parts')
    expect(response.text).toContain('case-summary')
  })
})
```

### Integration Tests
- Test with real report data from `/api/reports/generate`
- Verify HTML validity and CSS styling
- Test file download behavior in different browsers
- Validate print output quality for PDF format

### Performance Tests
```javascript
describe('POST /api/reports/download - Performance', () => {
  it('should handle large reports efficiently', async () => {
    const largeReportRequest = {
      config: { title: 'Large Report', template: 'comprehensive', format: 'html' },
      reportData: mockLargeReportData, // 50+ articles, 200+ cases
      format: 'html'
    }
    
    const start = Date.now()
    
    const response = await request(app)
      .post('/api/reports/download')
      .send(largeReportRequest)
      .expect(200)
    
    const duration = Date.now() - start
    expect(duration).toBeLessThan(5000) // 5 second max
    
    // Should generate substantial content
    expect(response.text.length).toBeGreaterThan(100000) // 100KB+
  })
})
```

## Known Issues & Limitations

⚠️ **CURRENT LIMITATIONS**:

1. **PDF Generation**: Returns HTML, not true PDF files
2. **Template Variety**: Single template with conditional content only
3. **No Streaming**: Large reports generated entirely in memory
4. **Limited Customization**: Fixed styling and layout options
5. **No Preview**: Cannot preview report before download
6. **File Size**: No compression or optimization for large reports
7. **Browser Dependency**: PDF conversion requires client-side processing

## Future Enhancements

### Planned Improvements
- **True PDF Generation**: Server-side PDF generation using Puppeteer or similar
- **Multiple Templates**: Distinct templates for different use cases
- **Streaming Generation**: Stream large reports to reduce memory usage
- **Custom Styling**: User-customizable themes and layouts
- **Preview Mode**: Preview reports before download
- **Compression**: Automatic compression for large reports
- **Batch Downloads**: Multiple format downloads in single request

## Changelog

### v1.0.0 (Current)
- HTML report generation with professional styling
- PDF-optimized HTML with print styles
- Configurable content inclusion (articles, cases, operative parts)
- Professional legal document formatting
- File download with proper headers and naming

### Future Versions
- **v1.1**: True PDF generation with server-side processing
- **v1.2**: Multiple report templates and custom styling
- **v1.3**: Report preview and streaming generation
- **v2.0**: Advanced customization and batch processing

---

*Endpoint: `/src/app/api/reports/download/route.ts`*  
*Last Updated: July 21, 2025*  
*Status: Production Ready - Core Report Download, Needs True PDF Generation*