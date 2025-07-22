# Legislation Cases API - GET /api/legislations/{id}/cases

## Endpoint Information
- **Path**: `/api/legislations/{id}/cases`
- **Method**: `GET`
- **Description**: Retrieve all cases that interpret any articles within a specific EU legislation document
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
curl -X GET "http://localhost:3000/api/legislations/uuid-gdpr-123/cases" \
  -H "Accept: application/json"
```

#### JavaScript/Fetch
```javascript
const response = await fetch('/api/legislations/uuid-gdpr-123/cases')
const interpretingCases = await response.json()
```

#### Legal Research Context
```javascript
// Lawyer researching all case law interpreting GDPR
const gdprCases = await fetch('/api/legislations/uuid-gdpr-123/cases')
  .then(res => res.json())

console.log(`${gdprCases.length} cases interpret GDPR articles`)

// Group cases by court or year for analysis
const byYear = gdprCases.reduce((acc, case_law) => {
  const year = new Date(case_law.judgement_date).getFullYear()
  acc[year] = (acc[year] || 0) + 1
  return acc
}, {})

console.log('Cases by year:', byYear)
```

## Response

### Success Response (200)
```typescript
type LegislationCasesResponse = CaseLaw[]

interface CaseLaw {
  id: string
  case_number: string             // "C-131/12", "T-604/18", etc.
  case_name: string              // "Google Spain SL and Google Inc."
  judgement_date: string | null  // ISO date string
  summary: string | null
  topics: string[] | null        // ["Data Protection", "Right to be forgotten"]
  source_url: string | null      // Curia or EUR-Lex URL
  html_content: string | null    // Full case content in HTML
  plain_text_content: string | null // Plain text version
  created_at: string            // ISO timestamp
  updated_at: string            // ISO timestamp
}
```

### Response Examples

#### GDPR Interpreting Cases
```json
[
  {
    "id": "uuid-case-google-spain",
    "case_number": "C-131/12",
    "case_name": "Google Spain SL and Google Inc. v. Agencia Española de Protección de Datos",
    "judgement_date": "2014-05-13",
    "summary": "Landmark case establishing the 'right to be forgotten' under EU data protection law, requiring search engines to remove inadequate or irrelevant personal data from search results.",
    "topics": ["Data Protection", "Right to be forgotten", "Search engines", "Personal data"],
    "source_url": "https://curia.europa.eu/juris/document/document.jsf?text=&docid=152065",
    "html_content": "<div class=\"judgment\"><h1>JUDGMENT OF THE COURT (Grand Chamber)</h1><p>13 May 2014</p><p>In Case C‑131/12...</p></div>",
    "plain_text_content": "JUDGMENT OF THE COURT (Grand Chamber)\n13 May 2014\nIn Case C‑131/12...",
    "created_at": "2024-01-10T10:30:00Z",
    "updated_at": "2024-01-10T10:30:00Z"
  },
  {
    "id": "uuid-case-facebook-schrems",
    "case_number": "C-311/18",
    "case_name": "Data Protection Commissioner v. Facebook Ireland Limited and Maximillian Schrems",
    "judgement_date": "2020-07-16",
    "summary": "Schrems II case invalidating the EU-US Privacy Shield framework and establishing stringent requirements for international data transfers under GDPR.",
    "topics": ["Data Protection", "International transfers", "Privacy Shield", "Standard Contractual Clauses"],
    "source_url": "https://curia.europa.eu/juris/document/document.jsf?text=&docid=228677",
    "html_content": "<div class=\"judgment\"><h1>JUDGMENT OF THE COURT (Grand Chamber)</h1><p>16 July 2020</p><p>In Case C‑311/18...</p></div>",
    "plain_text_content": "JUDGMENT OF THE COURT (Grand Chamber)\n16 July 2020\nIn Case C‑311/18...",
    "created_at": "2024-01-12T15:45:00Z",
    "updated_at": "2024-01-12T15:45:00Z"
  },
  {
    "id": "uuid-case-opinion-121",
    "case_number": "C-252/21",
    "case_name": "Meta Platforms and Others",
    "judgement_date": "2023-05-04",
    "summary": "Case addressing the processing of personal data for behavioral advertising and the legal basis requirements under GDPR Article 6.",
    "topics": ["Data Protection", "Behavioral advertising", "Legal basis", "Consent"],
    "source_url": "https://curia.europa.eu/juris/document/document.jsf?text=&docid=273799",
    "html_content": "<div class=\"judgment\"><h1>JUDGMENT OF THE COURT (Grand Chamber)</h1><p>4 May 2023</p><p>In Case C‑252/21...</p></div>",
    "plain_text_content": "JUDGMENT OF THE COURT (Grand Chamber)\n4 May 2023\nIn Case C‑252/21...",
    "created_at": "2024-01-15T09:20:00Z",
    "updated_at": "2024-01-15T09:20:00Z"
  }
]
```

#### Digital Services Act Cases (Newer Legislation)
```json
[
  {
    "id": "uuid-case-dsa-preliminary",
    "case_number": "C-102/23",
    "case_name": "Digital Platform Oversight Case",
    "judgement_date": "2024-03-15",
    "summary": "Early case interpreting Digital Services Act provisions on content moderation obligations for very large online platforms.",
    "topics": ["Digital Services", "Content moderation", "Platform liability", "Very Large Online Platforms"],
    "source_url": "https://curia.europa.eu/juris/document/document.jsf?text=&docid=280145",
    "html_content": "<div class=\"judgment\"><h1>JUDGMENT OF THE COURT</h1><p>15 March 2024</p><p>In Case C‑102/23...</p></div>",
    "plain_text_content": "JUDGMENT OF THE COURT\n15 March 2024\nIn Case C‑102/23...",
    "created_at": "2024-03-20T11:15:00Z",
    "updated_at": "2024-03-20T11:15:00Z"
  }
]
```

#### Legislation With No Interpreting Cases
```json
[]
```

## Error Responses

### 400 - Invalid Legislation ID
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
  "error": "Database query failed",
  "code": "DATABASE_ERROR"
}
```

**When this occurs**: Supabase connection issues or complex query execution errors

### 500 - Internal Server Error
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

**When this occurs**: Unexpected server errors during cross-reference query processing

## Status Codes

| Code | Meaning | When Used |
|------|---------| ----------|
| 200 | OK | Cases retrieved successfully (including empty array) |
| 400 | Bad Request | Invalid legislation ID format |
| 500 | Server Error | Database or server error |

**Note**: This endpoint returns 200 with an empty array if no cases interpret the legislation, rather than 404.

## Data Structure & Query Logic

### Cross-Reference Resolution
The endpoint uses a complex join query to find cases through article interpretations:

```sql
-- Simplified version of the query logic
SELECT DISTINCT case_laws.*
FROM case_laws
JOIN case_law_interprets_article ON case_laws.id = case_law_interprets_article.case_law_id
JOIN articles ON case_law_interprets_article.article_id = articles.id
WHERE articles.legislation_id = :legislation_id
```

### Deduplication Process
The endpoint performs automatic deduplication because:
- A single case may interpret multiple articles from the same legislation
- The join query returns one row per case-article interpretation
- The response consolidates to unique cases only

### Case Information Completeness
- **`html_content`**: May be null for cases without stored HTML content
- **`plain_text_content`**: May be null, plain text alternative to HTML
- **`topics`**: Array of legal topic tags, may be null or empty
- **`summary`**: Human-readable case summary, may be null

## Performance Considerations

- **Complex Join Query**: Crosses three tables with filtering
- **Response Size**: Varies greatly by legislation popularity (0-100+ cases)
- **Database Load**: Moderate complexity query suitable for regular use
- **Deduplication**: In-memory deduplication adds minimal overhead

⚠️ **Performance Notes**:
- **Popular Legislation**: GDPR and other major laws may return 50+ cases
- **Query Complexity**: Join across case_law_interprets_article junction table
- **No Pagination**: Returns all interpreting cases at once
- **No Content Control**: Always includes full case content fields
- **No Caching**: Every request executes full database query

## Legal Research Context

### Use Cases

1. **Comprehensive Legislation Analysis**
   ```javascript
   // Legal researcher studying complete GDPR interpretation
   const gdprCases = await fetch('/api/legislations/uuid-gdpr-123/cases')
     .then(res => res.json())
   
   // Analyze judicial interpretation patterns
   const interpretationTrends = gdprCases.reduce((acc, case_law) => {
     const year = new Date(case_law.judgement_date).getFullYear()
     const topics = case_law.topics || []
     
     if (!acc[year]) acc[year] = { total: 0, topics: {} }
     acc[year].total++
     
     topics.forEach(topic => {
       acc[year].topics[topic] = (acc[year].topics[topic] || 0) + 1
     })
     
     return acc
   }, {})
   
   console.log('GDPR interpretation trends by year:', interpretationTrends)
   ```

2. **Legal Precedent Research**
   ```javascript
   // Finding key precedent cases for specific legislation
   const dualUseCases = await fetch('/api/legislations/uuid-dual-use-regulation/cases')
     .then(res => res.json())
   
   // Identify landmark cases by citation frequency or legal significance
   const landmarkCases = dualUseCases.filter(case_law => 
     case_law.summary?.toLowerCase().includes('landmark') ||
     case_law.summary?.toLowerCase().includes('precedent') ||
     case_law.case_number.startsWith('C-') // Grand Chamber cases often landmark
   )
   
   console.log(`${landmarkCases.length} landmark cases found`)
   ```

3. **Cross-Jurisdictional Analysis**
   ```javascript
   // Analyzing how different courts interpret the same legislation
   const charterCases = await fetchLegislationCases('uuid-charter-123')
   
   // Group by court type based on case number format
   const courtAnalysis = charterCases.reduce((acc, case_law) => {
     const courtType = case_law.case_number.startsWith('C-') ? 'CJEU' : 
                      case_law.case_number.startsWith('T-') ? 'General Court' : 
                      'Other'
     
     if (!acc[courtType]) acc[courtType] = []
     acc[courtType].push(case_law)
     return acc
   }, {})
   
   // Identify patterns in interpretation by court level
   Object.entries(courtAnalysis).forEach(([court, cases]) => {
     console.log(`${court}: ${cases.length} cases`)
   })
   ```

4. **Temporal Legal Evolution Analysis**
   ```javascript
   // Studying how interpretation of legislation evolves over time
   const dsaCases = await fetchLegislationCases('uuid-dsa-456')
   
   // Sort cases chronologically to trace legal evolution
   const chronologicalCases = dsaCases
     .filter(c => c.judgement_date)
     .sort((a, b) => new Date(a.judgement_date) - new Date(b.judgement_date))
   
   // Analyze interpretation development
   const evolutionAnalysis = chronologicalCases.map((case_law, index) => ({
     case: case_law.case_number,
     date: case_law.judgement_date,
     topics: case_law.topics,
     chronologicalPosition: index + 1,
     isEarlyInterpretation: index < 3
   }))
   
   console.log('DSA interpretation evolution:', evolutionAnalysis)
   ```

### Legal Significance
This endpoint enables lawyers to:
- **Understand Judicial Evolution**: See how courts interpret legislation over time
- **Identify Key Precedents**: Find landmark cases shaping legislative understanding
- **Cross-Reference Research**: Connect legislative provisions to judicial interpretation
- **Build Legal Arguments**: Reference comprehensive case law supporting positions

### Integration with Legal Workflows
```javascript
// Complete legislation interpretation research workflow
// 1. Get legislation details
const legislation = await fetch('/api/legislations/uuid-gdpr-123')
  .then(res => res.json())

// 2. Get all interpreting cases (this endpoint)
const allCases = await fetch(`/api/legislations/${legislation.id}/cases`)
  .then(res => res.json())

// 3. Get specific articles within legislation
const articles = await fetch(`/api/legislations/${legislation.id}/articles`)
  .then(res => res.json())

// 4. Cross-reference: which specific articles are most interpreted?
const articleInterpretationFrequency = await Promise.all(
  articles.slice(0, 10).map(async article => ({
    article: article,
    interpretingCases: await fetch(`/api/articles/${article.id}/cases`)
      .then(res => res.json())
  }))
)

// Find most judicially active articles
const mostInterpreted = articleInterpretationFrequency
  .sort((a, b) => b.interpretingCases.length - a.interpretingCases.length)
  .slice(0, 5)

// 5. Generate comprehensive legal research report
const report = await fetch('/api/reports/generate', {
  method: 'POST',
  body: JSON.stringify({
    title: `Judicial Interpretation Analysis: ${legislation.title}`,
    legislations: [legislation.id],
    articles: mostInterpreted.map(m => m.article.id),
    includeOperativeParts: true,
    includeCaseSummaries: true,
    template: 'comprehensive_analysis'
  })
})
```

## Database Query Analysis

### Current Implementation Details
```typescript
// The actual query structure used
const query = supabase
  .from('case_law_interprets_article')
  .select(`
    case_law:case_laws(*),
    article:articles!inner(*)
  `)
  .eq('article.legislation_id', id)
```

### Junction Table Usage
- **Primary Table**: `case_law_interprets_article` (convenience relationship)
- **Joined Tables**: `case_laws` (case details) and `articles` (article filtering)
- **Filter Logic**: Inner join ensures only articles from target legislation
- **Result Processing**: Manual deduplication of cases in application code

⚠️ **Database Note**: The query uses the convenience table `case_law_interprets_article`. The primary relationship is actually through `operative_part_interprets_article`, which this convenience table summarizes.

## Security Considerations

⚠️ **SECURITY PLACEHOLDER NOTES**:

1. **No Access Control**: Anyone can discover all case law interpreting any legislation
2. **Data Exposure**: Complete case content returned without restrictions
3. **No Rate Limiting**: Can be used to scrape entire case law database
4. **Query Performance**: Complex joins could be exploited for DoS

## Caching Recommendations

⚠️ **NOT CURRENTLY IMPLEMENTED**:

```javascript
// Ideal caching strategy for legislation cases
const cacheConfig = {
  duration: '6 hours',         // Cases change infrequently
  invalidation: 'manual',      // When new cases added
  compression: 'gzip',         // Large responses with case content
  tags: ['legislation_cases', legislationId],
  vary: ['Accept-Encoding'],
  sizeLimit: '20MB'           // Handle legislation with many cases
}
```

## Pagination Recommendations

⚠️ **NOT CURRENTLY IMPLEMENTED**:

```javascript
// Recommended for legislation with many interpreting cases
const paginationParams = {
  limit: 20,                  // Cases per page
  offset: 0,                  // Skip N cases
  include_content: false,     // Option to exclude large case content
  sort_by: 'judgement_date',  // Sort by date, relevance, etc.
  sort_order: 'desc'          // Most recent first
}

// Paginated response structure
const response = {
  data: [...],                // Case array
  pagination: {
    total: 67,                // Total cases interpreting legislation
    limit: 20,
    offset: 0,
    hasMore: true
  },
  metadata: {
    legislation_id: 'uuid',
    legislation_title: 'GDPR',
    earliest_case: '2014-05-13',
    latest_case: '2023-12-15'
  }
}
```

## Testing

### Unit Tests
```typescript
describe('GET /api/legislations/:id/cases', () => {
  it('should return cases interpreting legislation articles', async () => {
    const response = await request(app)
      .get('/api/legislations/legislation-with-cases/cases')
      .expect(200)
    
    expect(Array.isArray(response.body)).toBe(true)
    
    if (response.body.length > 0) {
      const case_law = response.body[0]
      expect(typeof case_law.id).toBe('string')
      expect(typeof case_law.case_number).toBe('string')
      expect(typeof case_law.case_name).toBe('string')
    }
  })

  it('should return empty array for legislation with no interpreting cases', async () => {
    const response = await request(app)
      .get('/api/legislations/legislation-without-cases/cases')
      .expect(200)
    
    expect(response.body).toEqual([])
  })

  it('should return unique cases only (no duplicates)', async () => {
    const response = await request(app)
      .get('/api/legislations/legislation-with-multi-article-cases/cases')
      .expect(200)
    
    const caseIds = response.body.map(c => c.id)
    const uniqueIds = [...new Set(caseIds)]
    
    expect(caseIds.length).toBe(uniqueIds.length) // No duplicates
  })

  it('should include all required case fields', async () => {
    const response = await request(app)
      .get('/api/legislations/legislation-with-cases/cases')
      .expect(200)
    
    if (response.body.length > 0) {
      const case_law = response.body[0]
      
      // Required fields
      expect(typeof case_law.id).toBe('string')
      expect(typeof case_law.case_number).toBe('string')
      expect(typeof case_law.case_name).toBe('string')
      expect(typeof case_law.created_at).toBe('string')
      expect(typeof case_law.updated_at).toBe('string')
      
      // Optional fields
      expect(['string', 'object']).toContain(typeof case_law.judgement_date)
      expect(['string', 'object']).toContain(typeof case_law.summary)
      expect(['object']).toContain(typeof case_law.topics) // array or null
      expect(['string', 'object']).toContain(typeof case_law.html_content)
    }
  })

  it('should handle non-existent legislation gracefully', async () => {
    const response = await request(app)
      .get('/api/legislations/non-existent-uuid/cases')
      .expect(200)
    
    expect(response.body).toEqual([])
  })
})
```

### Integration Tests
- Test with legislation that has articles interpreted by multiple cases
- Verify consistency with `/api/articles/{id}/cases` endpoint data
- Test performance with popular legislation (GDPR, Charter)
- Validate deduplication logic across multiple articles per case

### Performance Tests
```javascript
describe('GET /api/legislations/:id/cases - Performance', () => {
  it('should handle popular legislation efficiently', async () => {
    const start = Date.now()
    
    const response = await request(app)
      .get('/api/legislations/popular-legislation-uuid/cases')
      .expect(200)
    
    const duration = Date.now() - start
    expect(duration).toBeLessThan(3000) // 3 second max
    
    // Should return reasonable number of cases
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body.length).toBeLessThan(200) // Sanity check
  })
})
```

## Known Issues & Limitations

⚠️ **CURRENT LIMITATIONS**:

1. **No Pagination**: Returns all interpreting cases regardless of count (can be 50+)
2. **Large Responses**: Cases with full content can make responses 5-20MB
3. **Complex Query**: Join across multiple tables may be slow for large datasets
4. **No Filtering**: Cannot filter cases by date, topic, or court type
5. **No Sorting**: Cases returned in database order, not legal relevance
6. **No Content Control**: Cannot exclude large case content fields
7. **In-Memory Deduplication**: Could be inefficient for very large result sets

## Integration with Other Endpoints

### Complete Legislation Research Workflow
```javascript
// Comprehensive legislative interpretation research
// 1. Get legislation details
const legislation = await fetch('/api/legislations/uuid-gdpr-123')
  .then(res => res.json())

// 2. Get all interpreting cases (this endpoint)
const allCases = await fetch(`/api/legislations/${legislation.id}/cases`)
  .then(res => res.json())

// 3. Get specific articles for detailed analysis
const keyArticles = await fetch(`/api/legislations/${legislation.id}/articles`)
  .then(res => res.json())
  .then(articles => articles.filter(a => [6, 7, 17, 25].includes(a.article_number)))

// 4. Get case details for each significant case
const detailedCases = await Promise.all(
  allCases.slice(0, 10).map(case_law =>
    fetch(`/api/cases/${case_law.id}`).then(res => res.json())
  )
)

// 5. Cross-reference specific article interpretations
const articleCaseAnalysis = await Promise.all(
  keyArticles.map(async article => ({
    article: article,
    cases: await fetch(`/api/articles/${article.id}/cases`).then(res => res.json()),
    detailedAnalysis: true
  }))
)

// 6. Generate comprehensive interpretation report
const interpretationReport = await fetch('/api/reports/generate', {
  method: 'POST',
  body: JSON.stringify({
    title: `Complete Judicial Interpretation: ${legislation.title}`,
    legislations: [legislation.id],
    articles: keyArticles.map(a => a.id),
    includeOperativeParts: true,
    includeCaseSummaries: true,
    includeTemporalAnalysis: true
  })
})
```

## Changelog

### v1.0.0 (Current)
- Basic case retrieval for legislation via article interpretation links
- Automatic deduplication of cases interpreting multiple articles
- Complete case metadata and content inclusion
- Error handling for database failures

### Future Enhancements
- **Pagination Support**: Handle legislation with many interpreting cases
- **Content Control**: Option to exclude large case content fields
- **Advanced Filtering**: Filter by date range, court type, legal topics
- **Sorting Options**: Sort by relevance, date, legal significance
- **Performance Optimization**: Database-level deduplication and indexing
- **Temporal Analysis**: Built-in analysis of interpretation evolution over time

---

*Endpoint: `/src/app/api/legislations/[id]/cases/route.ts`*  
*Last Updated: July 21, 2025*  
*Status: Production Ready - Core Cross-Reference Research, Needs Pagination & Filtering*