# Legislation Details API - GET /api/legislations/{id}

## Endpoint Information
- **Path**: `/api/legislations/{id}`
- **Method**: `GET`
- **Description**: Retrieve detailed information about a specific EU legislation document, including full content if available
- **Version**: `v1.0`
- **Last Updated**: `2024-07-21`

## Authentication
- **Required**: `No` ⚠️ *Should be implemented for production*
- **Type**: `None`
- **Scope**: `read`

## Request

### URL Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| id | `string` | ✅ | Legislation UUID identifier | `uuid-gdpr-123-456` |

### Request Examples

#### Basic Request
```bash
curl -X GET "http://localhost:3000/api/legislations/uuid-gdpr-123" \
  -H "Accept: application/json"
```

#### JavaScript/Fetch
```javascript
const response = await fetch('/api/legislations/uuid-gdpr-123')
const legislationData = await response.json()
```

#### Legal Research Context
```javascript
// Lawyer researching GDPR in detail
const gdprResponse = await fetch('/api/legislations/uuid-gdpr-123')
const gdpr = await gdprResponse.json()

console.log(`${gdpr.title} (${gdpr.celex_number})`)
console.log(`Published: ${gdpr.publication_date}`)
console.log(`Type: ${gdpr.document_type}`)

// Get full content if available
if (gdpr.full_markdown_content) {
  console.log('Full legislation text available')
}
```

## Response

### Success Response (200)
```typescript
interface LegislationDetailsResponse extends Legislation {
  // All legislation fields included
}

interface Legislation {
  id: string
  celex_number: string            // EU CELEX identifier
  title: string
  publication_date: string | null // ISO date string
  document_type: string | null    // "Regulation", "Directive", "Charter", etc.
  summary: string | null
  source_url: string | null       // EUR-Lex URL
  full_markdown_content: string | null // Complete legislation text
  created_at: string             // ISO timestamp
  updated_at: string             // ISO timestamp
}
```

### Response Examples

#### GDPR Legislation Details
```json
{
  "id": "uuid-gdpr-123",
  "celex_number": "32016R0679",
  "title": "General Data Protection Regulation",
  "publication_date": "2016-05-04",
  "document_type": "Regulation",
  "summary": "Regulation on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (Data Protection Directive).",
  "source_url": "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
  "full_markdown_content": "# REGULATION (EU) 2016/679 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL\n\nof 27 April 2016\n\non the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC\n\n(General Data Protection Regulation)\n\n## CHAPTER I - GENERAL PROVISIONS\n\n### Article 1 - Subject-matter and objectives\n\n1. This Regulation lays down rules relating to the protection of natural persons with regard to the processing of personal data and rules relating to the free movement of personal data.\n\n2. This Regulation protects fundamental rights and freedoms of natural persons and in particular their right to the protection of personal data.\n\n3. The free movement of personal data within the Union shall be neither restricted nor prohibited for reasons connected with the protection of natural persons with regard to the processing of personal data.\n\n### Article 2 - Material scope\n\n1. This Regulation applies to the processing of personal data wholly or partly by automated means and to the processing other than by automated means of personal data which form part of a filing system or are intended to form part of a filing system.\n\n[... continues with full regulation text ...]",
  "created_at": "2024-01-10T09:00:00Z",
  "updated_at": "2024-01-10T09:00:00Z"
}
```

#### Digital Services Act Example
```json
{
  "id": "uuid-dsa-456",
  "celex_number": "32022R2065",
  "title": "Digital Services Act",
  "publication_date": "2022-10-19",
  "document_type": "Regulation",
  "summary": "Regulation on a Single Market For Digital Services and amending Directive 2000/31/EC (Digital Services Act). This regulation establishes harmonised rules on the provision of intermediary services in the internal market.",
  "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2065",
  "full_markdown_content": "# REGULATION (EU) 2022/2065 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL\n\nof 19 October 2022\n\non a Single Market For Digital Services and amending Directive 2000/31/EC\n\n(Digital Services Act)\n\n## CHAPTER I - GENERAL PROVISIONS\n\n### Article 1 - Subject matter and scope\n\n1. This Regulation lays down harmonised rules on the provision of intermediary services in the internal market.\n\n[... continues with full regulation text ...]",
  "created_at": "2024-01-12T11:00:00Z",
  "updated_at": "2024-01-12T11:00:00Z"
}
```

#### Charter of Fundamental Rights Example
```json
{
  "id": "uuid-charter-123",
  "celex_number": "12012P/TXT",
  "title": "Charter of Fundamental Rights of the European Union",
  "publication_date": "2012-10-26",
  "document_type": "Charter",
  "summary": "The Charter sets out the fundamental rights and freedoms recognised in the EU and which EU institutions and national governments must respect when implementing EU law.",
  "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:12012P/TXT",
  "full_markdown_content": "# CHARTER OF FUNDAMENTAL RIGHTS OF THE EUROPEAN UNION\n\n## PREAMBLE\n\nThe peoples of Europe, in creating an ever closer union among them, are resolved to share a peaceful future based on common values.\n\nConscious of its spiritual and moral heritage, the Union is founded on the indivisible, universal values of human dignity, freedom, equality and solidarity; it is based on the principles of democracy and the rule of law.\n\n## TITLE I - DIGNITY\n\n### Article 1 - Human dignity\n\nHuman dignity is inviolable. It must be respected and protected.\n\n### Article 2 - Right to life\n\n1. Everyone has the right to life.\n2. No one shall be condemned to the death penalty, or executed.\n\n[... continues with full Charter text ...]",
  "created_at": "2024-01-10T08:00:00Z",
  "updated_at": "2024-01-10T08:00:00Z"
}
```

#### Legislation Without Full Content
```json
{
  "id": "uuid-directive-123",
  "celex_number": "32016L0680",
  "title": "ePrivacy Directive",
  "publication_date": "2016-07-15",
  "document_type": "Directive", 
  "summary": "Directive concerning the processing of personal data and the protection of privacy in the electronic communications sector.",
  "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016L0680",
  "full_markdown_content": null,
  "created_at": "2024-01-11T14:00:00Z",
  "updated_at": "2024-01-11T14:00:00Z"
}
```

## Error Responses

### 404 - Legislation Not Found
```json
{
  "error": "Legislation not found",
  "code": "NOT_FOUND"
}
```

**When this occurs**: The legislation ID doesn't exist in the database

### 400 - Invalid Legislation ID Format
```json
{
  "error": "Invalid legislation ID format",
  "code": "INVALID_PARAMETER"
}
```

**When this occurs**: Legislation ID is not a valid UUID format

### 500 - Database Error
```json
{
  "error": "Database connection failed",
  "code": "DATABASE_ERROR"
}
```

**When this occurs**: Supabase connection issues or query errors

### 500 - Internal Server Error
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

**When this occurs**: Unexpected server errors during data retrieval

## Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Legislation found and returned successfully |
| 400 | Bad Request | Invalid legislation ID format |
| 404 | Not Found | Legislation doesn't exist |
| 500 | Server Error | Database or server error |

## Data Structure & Content

### Full Content Availability
The `full_markdown_content` field may contain:

- **Complete Legislation Text**: Full articles, chapters, and provisions
- **Structured Markdown**: Headers, lists, and formatting for readability
- **Large Content**: Can be several MB for complex legislation
- **null Value**: Not all legislation has full content stored

### Content Format Examples

#### Structured Regulation Content
```markdown
# REGULATION (EU) 2016/679

## CHAPTER I - GENERAL PROVISIONS

### Article 1 - Subject-matter and objectives
1. This Regulation lays down rules relating to...
2. This Regulation protects fundamental rights...

### Article 2 - Material scope
1. This Regulation applies to the processing...
```

#### Charter Content Structure  
```markdown
# CHARTER OF FUNDAMENTAL RIGHTS

## TITLE I - DIGNITY

### Article 1 - Human dignity
Human dignity is inviolable. It must be respected and protected.

### Article 2 - Right to life
1. Everyone has the right to life.
2. No one shall be condemned to the death penalty, or executed.
```

### CELEX Number Patterns
Understanding CELEX identifiers for different document types:

| Pattern | Example | Document Type |
|---------|---------|---------------|
| `3YYYYR####` | `32016R0679` | Regulation (GDPR) |
| `3YYYYL####` | `32016L0680` | Directive |
| `12012P/TXT` | `12012P/TXT` | Charter |
| `12012E/TXT` | `12012E/TXT` | Treaty |

## Performance Considerations

- **Simple Query**: Single table lookup with primary key
- **Variable Response Size**: Can range from 5KB (metadata only) to 5MB+ (full content)
- **Database Load**: Lightweight query, very fast execution
- **Memory Usage**: Large documents consume significant response bandwidth

⚠️ **Performance Notes**:
- **Large Content**: Full legislation text can be 1-5MB per response
- **No Compression**: Large text content not compressed
- **No Caching**: Every request hits database
- **Client Impact**: Large responses can slow client applications

## Legal Research Context

### Use Cases

1. **Detailed Legislation Study**
   ```javascript
   // Lawyer studying complete GDPR text
   const gdpr = await fetch('/api/legislations/uuid-gdpr-123')
     .then(res => res.json())
   
   // Access full regulation content
   if (gdpr.full_markdown_content) {
     console.log('Full GDPR text available for detailed analysis')
     
     // Extract specific chapters or articles for focused study
     const chapters = gdpr.full_markdown_content.split('## CHAPTER')
     console.log(`GDPR has ${chapters.length - 1} chapters`)
   }
   ```

2. **Legal Citation and References**
   ```javascript
   // Building proper legal citations
   const legislation = await fetchLegislation(legislationId)
   
   const fullCitation = `${legislation.title}, ${legislation.celex_number}, ` +
     `OJ L [number], ${new Date(legislation.publication_date).toLocaleDateString()}`
   
   const shortCitation = `${legislation.document_type} ${legislation.celex_number}`
   ```

3. **Cross-Reference Analysis**
   ```javascript
   // Finding references within legislation text
   const dsa = await fetchLegislation('uuid-dsa-456')
   
   if (dsa.full_markdown_content) {
     // Find references to other EU legislation
     const gdprReferences = dsa.full_markdown_content
       .match(/Regulation \(EU\) 2016\/679/g)?.length || 0
     
     console.log(`DSA references GDPR ${gdprReferences} times`)
   }
   ```

4. **Legal Document Preparation**
   ```javascript
   // Preparing legal documents with legislative references
   const charter = await fetchLegislation('uuid-charter-123')
   
   const fundamentalRights = charter.full_markdown_content
     .split('## TITLE')[1] // Get TITLE I - DIGNITY
     .split('## TITLE')[0] // Stop at TITLE II
   
   // Use in legal argument about fundamental rights
   ```

### Document Hierarchy Understanding
This endpoint helps lawyers understand EU legal hierarchy:

1. **Primary Law**: Treaties, Charter (highest authority)
2. **Secondary Law**: Regulations, Directives (derived from primary law)
3. **Implementation**: National transposition (for Directives)
4. **Interpretation**: Case law (accessible via other endpoints)

### Legal Research Integration
```javascript
// Complete legislation research workflow
const legislation = await fetchLegislation(legislationId)

// Get individual articles within this legislation
const articles = await fetch(`/api/legislations/${legislationId}/articles`)

// Find cases that interpret this legislation
const interpretingCases = await fetch(`/api/legislations/${legislationId}/cases`)

// Generate comprehensive analysis report
const report = await fetch('/api/reports/generate', {
  method: 'POST',
  body: JSON.stringify({
    title: `Analysis of ${legislation.title}`,
    legislations: [legislationId],
    includeOperativeParts: true,
    includeArticleText: true
  })
})
```

## Security Considerations

⚠️ **SECURITY PLACEHOLDER NOTES**:

1. **No Access Control**: Anyone can access complete legislation texts
2. **Large Data Exposure**: Full content returned regardless of need
3. **No Content Filtering**: Cannot exclude large content fields
4. **Potential DoS**: Large responses can impact server/client performance

## Caching Recommendations

⚠️ **NOT CURRENTLY IMPLEMENTED**:

```javascript
// Highly recommended caching due to large, stable content
const cacheConfig = {
  duration: '24 hours',        // Legislation rarely changes
  invalidation: 'manual',      // Only when content updated
  compression: 'gzip',         // Essential for large content
  tags: ['legislation', legislationId],
  vary: ['Accept-Encoding'],   // Support compression negotiation
  sizeLimit: '10MB'           // Handle large documents
}
```

## Content Optimization Recommendations

⚠️ **NOT CURRENTLY IMPLEMENTED**:

```javascript
// Recommended query parameter for content control
GET /api/legislations/{id}?include_content=false  // Exclude large content
GET /api/legislations/{id}?content_format=summary // Return summary only
GET /api/legislations/{id}?content_sections=1,2,3 // Specific chapters only
```

## Testing

### Unit Tests
```typescript
describe('GET /api/legislations/:id', () => {
  it('should return legislation details', async () => {
    const response = await request(app)
      .get('/api/legislations/valid-legislation-uuid')
      .expect(200)
    
    expect(response.body.id).toBe('valid-legislation-uuid')
    expect(response.body.celex_number).toBeDefined()
    expect(response.body.title).toBeDefined()
    expect(response.body.document_type).toBeDefined()
  })

  it('should return 404 for non-existent legislation', async () => {
    await request(app)
      .get('/api/legislations/non-existent-uuid')
      .expect(404)
  })

  it('should handle legislation with full content', async () => {
    const response = await request(app)
      .get('/api/legislations/legislation-with-content')
      .expect(200)
    
    if (response.body.full_markdown_content) {
      expect(typeof response.body.full_markdown_content).toBe('string')
      expect(response.body.full_markdown_content.length).toBeGreaterThan(100)
    }
  })

  it('should handle legislation without full content', async () => {
    const response = await request(app)
      .get('/api/legislations/legislation-without-content')
      .expect(200)
    
    expect(response.body.full_markdown_content).toBeNull()
  })

  it('should include all required metadata fields', async () => {
    const response = await request(app)
      .get('/api/legislations/valid-legislation-uuid')
      .expect(200)
    
    const legislation = response.body
    
    // Required fields
    expect(typeof legislation.id).toBe('string')
    expect(typeof legislation.celex_number).toBe('string')
    expect(typeof legislation.title).toBe('string')
    expect(typeof legislation.created_at).toBe('string')
    expect(typeof legislation.updated_at).toBe('string')
  })
})
```

### Integration Tests
- Test with different document types (Regulation, Directive, Charter, Treaty)
- Verify CELEX number format consistency
- Test large content handling and response times
- Validate integration with articles and cases endpoints

### Performance Tests
```javascript
describe('GET /api/legislations/:id - Performance', () => {
  it('should handle large content efficiently', async () => {
    const start = Date.now()
    
    const response = await request(app)
      .get('/api/legislations/large-legislation-uuid')
      .expect(200)
    
    const duration = Date.now() - start
    expect(duration).toBeLessThan(5000) // 5 second max for large content
  })

  it('should handle concurrent requests for same legislation', async () => {
    const requests = Array(5).fill().map(() =>
      request(app).get('/api/legislations/popular-legislation-uuid')
    )
    
    const responses = await Promise.all(requests)
    responses.forEach(response => {
      expect(response.status).toBe(200)
    })
  })
})
```

## Known Issues & Limitations

⚠️ **CURRENT LIMITATIONS**:

1. **Large Responses**: Full content can be 5MB+, impacting performance
2. **No Content Control**: Cannot exclude large content fields when not needed
3. **No Compression**: Large text content not compressed
4. **No Sectional Access**: Cannot retrieve specific chapters/articles only
5. **No Version History**: Only current version available
6. **Limited Metadata**: Missing amendment history, cross-references
7. **No Language Options**: Single language version only

## Integration with Other Endpoints

### Related Endpoints Workflow
```javascript
// Complete legislation analysis workflow
// 1. Get legislation details (this endpoint)
const legislation = await fetch('/api/legislations/uuid-gdpr-123')
  .then(res => res.json())

// 2. Get all articles within this legislation
const articles = await fetch(`/api/legislations/${legislation.id}/articles`)
  .then(res => res.json())

// 3. Get cases interpreting this legislation
const cases = await fetch(`/api/legislations/${legislation.id}/cases`)
  .then(res => res.json())

// 4. Study specific articles in detail
const articleDetails = await Promise.all(
  articles.slice(0, 5).map(article =>
    fetch(`/api/articles/${article.id}`).then(res => res.json())
  )
)

// 5. Generate comprehensive report
const report = await fetch('/api/reports/generate', {
  method: 'POST',
  body: JSON.stringify({
    title: `Complete Analysis: ${legislation.title}`,
    legislations: [legislation.id],
    includeOperativeParts: true,
    includeArticleText: true,
    includeCaseSummaries: true
  })
})
```

## Changelog

### v1.0.0 (Current)
- Basic legislation details retrieval
- Full content support with markdown formatting
- Error handling for missing legislation
- Complete metadata inclusion

### Future Enhancements
- **Content Control**: Query parameters to exclude/include specific fields
- **Sectional Access**: Retrieve specific chapters or articles only
- **Compression**: Automatic gzip compression for large responses
- **Version History**: Access to historical versions of legislation
- **Cross-References**: Automatic linking to referenced documents

---

*Endpoint: `/src/app/api/legislations/[id]/route.ts`*  
*Last Updated: July 21, 2025*  
*Status: Production Ready - Core Functionality, Needs Performance Optimization*