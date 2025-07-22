# Legislation List API - GET /api/legislations

## Endpoint Information
- **Path**: `/api/legislations`
- **Method**: `GET`
- **Description**: Retrieve a complete list of all EU legislation documents in the database, sorted alphabetically by title
- **Version**: `v1.0`
- **Last Updated**: `2024-07-21`

## Authentication
- **Required**: `No` ⚠️ *Should be implemented for production*
- **Type**: `None`
- **Scope**: `read`

## Request

### Query Parameters
⚠️ **LIMITATION**: This endpoint currently accepts no query parameters (no pagination, filtering, or search)

### Request Examples

#### Basic Request
```bash
curl -X GET "http://localhost:3000/api/legislations" \
  -H "Accept: application/json"
```

#### JavaScript/Fetch
```javascript
const response = await fetch('/api/legislations')
const legislations = await response.json()
```

#### Legal Research Context
```javascript
// Lawyer browsing available EU legislation
const legislations = await fetch('/api/legislations')
  .then(res => res.json())

// Filter by document type
const regulations = legislations.filter(leg => leg.document_type === 'Regulation')
const directives = legislations.filter(leg => leg.document_type === 'Directive')

console.log(`${regulations.length} Regulations, ${directives.length} Directives available`)
```

## Response

### Success Response (200)
```typescript
type LegislationsResponse = Legislation[]

interface Legislation {
  id: string
  celex_number: string            // EU CELEX identifier (e.g., "32016R0679")
  title: string
  publication_date: string | null // ISO date string
  document_type: string | null    // "Regulation", "Directive", "Charter", etc.
  summary: string | null
  source_url: string | null       // EUR-Lex URL
  full_markdown_content: string | null
  created_at: string             // ISO timestamp
  updated_at: string             // ISO timestamp
}
```

### Response Examples

#### Complete Legislation List
```json
[
  {
    "id": "uuid-charter-123",
    "celex_number": "12012P/TXT",
    "title": "Charter of Fundamental Rights of the European Union",
    "publication_date": "2012-10-26",
    "document_type": "Charter",
    "summary": "The Charter sets out the fundamental rights and freedoms recognised in the EU and which EU institutions and national governments must respect when implementing EU law.",
    "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:12012P/TXT",
    "full_markdown_content": null,
    "created_at": "2024-01-10T08:00:00Z",
    "updated_at": "2024-01-10T08:00:00Z"
  },
  {
    "id": "uuid-dmca-789",
    "celex_number": "32022R2065",
    "title": "Digital Markets Act",
    "publication_date": "2022-11-12",
    "document_type": "Regulation",
    "summary": "Regulation on contestable and fair markets in the digital sector, targeting large digital platforms acting as gatekeepers.",
    "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2065",
    "full_markdown_content": null,
    "created_at": "2024-01-12T10:00:00Z",
    "updated_at": "2024-01-12T10:00:00Z"
  },
  {
    "id": "uuid-dsa-456",
    "celex_number": "32022R2065",
    "title": "Digital Services Act",
    "publication_date": "2022-10-19",
    "document_type": "Regulation",
    "summary": "Regulation on a Single Market For Digital Services and amending Directive 2000/31/EC, establishing harmonised rules for digital service providers.",
    "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2065",
    "full_markdown_content": null,
    "created_at": "2024-01-12T11:00:00Z",
    "updated_at": "2024-01-12T11:00:00Z"
  },
  {
    "id": "uuid-gdpr-123",
    "celex_number": "32016R0679",
    "title": "General Data Protection Regulation",
    "publication_date": "2016-05-04",
    "document_type": "Regulation",
    "summary": "Regulation on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC.",
    "source_url": "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
    "full_markdown_content": null,
    "created_at": "2024-01-10T09:00:00Z",
    "updated_at": "2024-01-10T09:00:00Z"
  }
]
```

#### Empty Database Response
```json
[]
```

## Error Responses

### 500 - Database Error
```json
{
  "error": "Database connection failed",
  "code": "DATABASE_ERROR"
}
```

**When this occurs**: Supabase connection issues or query execution problems

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
| 200 | OK | Legislations retrieved successfully (including empty array) |
| 500 | Server Error | Database or server error |

**Note**: This endpoint always returns 200 for successful database queries, even if no legislations exist.

## Data Structure

### CELEX Number Format
EU legislation uses standardized CELEX identifiers:

| Format | Example | Description |
|--------|---------|-------------|
| Regulations | `32016R0679` | Year + R + sequential number |
| Directives | `32016L0680` | Year + L + sequential number |
| Treaties | `12012E/TXT` | 1 + year + E + format |
| Charter | `12012P/TXT` | 1 + year + P + format |

### Document Types
Common EU legal document types:

| Type | Description | Examples |
|------|-------------|----------|
| `Regulation` | Directly applicable in all Member States | GDPR, DSA, DMA |
| `Directive` | Must be transposed into national law | ePrivacy, NIS2 |
| `Charter` | Fundamental rights framework | Charter of Fundamental Rights |
| `Treaty` | Primary EU law | TEU, TFEU |
| `Decision` | Binding on specific parties | Individual decisions |

### Sorting
Legislations are returned sorted alphabetically by title, ensuring:
- Consistent ordering across requests
- Easy browsing for legal professionals
- Predictable API behavior

## Performance Considerations

- **Simple Query**: Basic SELECT with ORDER BY
- **No Joins**: Single table query for optimal performance
- **Response Size**: Can be large with many legislations (typically 50-200 documents)
- **Database Load**: Lightweight query suitable for frequent requests

⚠️ **Performance Limitations**:
- **No Pagination**: Returns all legislations at once
- **No Caching**: Every request hits the database
- **Large Content**: `full_markdown_content` field can be very large (MB-sized)
- **No Compression**: Large responses not compressed

## Legal Research Context

### Use Cases

1. **Legal Research Overview**
   ```javascript
   // Lawyer getting overview of available EU legislation
   const legislations = await fetch('/api/legislations')
     .then(res => res.json())
   
   // Group by document type for organized browsing
   const byType = legislations.reduce((acc, leg) => {
     acc[leg.document_type] = acc[leg.document_type] || []
     acc[leg.document_type].push(leg)
     return acc
   }, {})
   
   console.log('Available legislation types:', Object.keys(byType))
   ```

2. **Recent Legislation Analysis**
   ```javascript
   // Finding recently enacted EU legislation
   const legislations = await fetchLegislations()
   
   const recentLegislation = legislations
     .filter(leg => leg.publication_date > '2020-01-01')
     .sort((a, b) => new Date(b.publication_date) - new Date(a.publication_date))
   
   console.log('Recent EU legislation:', recentLegislation.slice(0, 5))
   ```

3. **Digital Rights Research**
   ```javascript
   // Legal researcher focusing on digital rights and data protection
   const legislations = await fetchLegislations()
   
   const digitalRightsLaws = legislations.filter(leg => 
     leg.title.toLowerCase().includes('data') ||
     leg.title.toLowerCase().includes('digital') ||
     leg.title.toLowerCase().includes('privacy')
   )
   ```

4. **Legal Citation Building**
   ```javascript
   // Building proper legal citations
   const legislations = await fetchLegislations()
   
   const gdpr = legislations.find(leg => leg.celex_number === '32016R0679')
   const citation = `${gdpr.title}, ${gdpr.celex_number}, OJ L 119, 4.5.2016`
   ```

### Legal Hierarchy Context
This endpoint provides the foundation for understanding EU legal hierarchy:

1. **Primary Law**: Treaties, Charter of Fundamental Rights
2. **Secondary Law**: Regulations, Directives, Decisions
3. **Case Law**: CJEU interpretations (accessed via other endpoints)

### Data Relationships
- **Legislation → Articles**: One-to-many (accessible via `/api/legislations/{id}/articles`)
- **Legislation → Cases**: Many-to-many via articles (accessible via `/api/legislations/{id}/cases`)
- **Legal Framework**: Provides entry point to entire legal research workflow

## Security Considerations

⚠️ **SECURITY PLACEHOLDER NOTES**:

1. **No Access Control**: Complete legislation database accessible to anyone
2. **Data Exposure**: All legislation metadata exposed without restrictions
3. **No Rate Limiting**: Expensive query can be executed repeatedly
4. **Information Disclosure**: May reveal complete scope of legal database

## Caching Recommendations

⚠️ **NOT CURRENTLY IMPLEMENTED**:

```javascript
// Ideal caching strategy for this endpoint
const cacheConfig = {
  duration: '24 hours',        // Legislation changes infrequently
  invalidation: 'manual',      // When new legislation added
  compression: 'gzip',         // Compress large responses
  tags: ['legislations_list'], // For cache invalidation
  vary: ['Accept-Encoding']    // Support compression negotiation
}
```

## Pagination Recommendations

⚠️ **NOT CURRENTLY IMPLEMENTED**:

```javascript
// Recommended pagination for large legislation databases
const paginationParams = {
  limit: 20,                   // Reasonable page size
  offset: 0,                   // Skip N results
  total: true,                 // Include total count
  sort: 'title',               // Sort field
  order: 'asc'                 // Sort direction
}

// Example paginated response structure
const paginatedResponse = {
  data: [...],                 // Legislation array
  pagination: {
    total: 150,
    limit: 20,
    offset: 0,
    hasMore: true,
    pages: 8
  }
}
```

## Testing

### Unit Tests
```typescript
describe('GET /api/legislations', () => {
  it('should return array of legislations', async () => {
    const response = await request(app)
      .get('/api/legislations')
      .expect(200)
    
    expect(Array.isArray(response.body)).toBe(true)
    
    if (response.body.length > 0) {
      const firstLegislation = response.body[0]
      expect(firstLegislation.id).toBeDefined()
      expect(firstLegislation.celex_number).toBeDefined()
      expect(firstLegislation.title).toBeDefined()
    }
  })

  it('should return legislations sorted by title', async () => {
    const response = await request(app)
      .get('/api/legislations')
      .expect(200)
    
    const titles = response.body.map(leg => leg.title)
    const sortedTitles = [...titles].sort()
    
    expect(titles).toEqual(sortedTitles)
  })

  it('should include all required legislation fields', async () => {
    const response = await request(app)
      .get('/api/legislations')
      .expect(200)
    
    if (response.body.length > 0) {
      const legislation = response.body[0]
      
      // Required fields
      expect(typeof legislation.id).toBe('string')
      expect(typeof legislation.celex_number).toBe('string')
      expect(typeof legislation.title).toBe('string')
      expect(typeof legislation.created_at).toBe('string')
      expect(typeof legislation.updated_at).toBe('string')
      
      // Optional fields (can be null)
      expect(['string', 'object']).toContain(typeof legislation.publication_date)
      expect(['string', 'object']).toContain(typeof legislation.document_type)
      expect(['string', 'object']).toContain(typeof legislation.summary)
    }
  })

  it('should handle empty database gracefully', async () => {
    // This test would need a clean database state
    const response = await request(app)
      .get('/api/legislations')
      .expect(200)
    
    expect(Array.isArray(response.body)).toBe(true)
  })
})
```

### Integration Tests
- Test with large numbers of legislation documents
- Verify sorting consistency across database changes
- Test response time with full content fields
- Validate CELEX number format consistency

### Performance Tests
```javascript
describe('GET /api/legislations - Performance', () => {
  it('should respond within acceptable time limit', async () => {
    const start = Date.now()
    
    await request(app)
      .get('/api/legislations')
      .expect(200)
    
    const duration = Date.now() - start
    expect(duration).toBeLessThan(2000) // 2 second max
  })
  
  it('should handle concurrent requests', async () => {
    const requests = Array(10).fill().map(() =>
      request(app).get('/api/legislations')
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

1. **No Pagination**: Returns entire legislation database (can be 100+ documents)
2. **No Filtering**: Cannot filter by document type, date, or other criteria
3. **No Search**: Cannot search legislation titles or content
4. **Large Responses**: `full_markdown_content` can make responses very large
5. **No Sorting Options**: Fixed alphabetical sorting by title only
6. **No Field Selection**: Always returns all fields, even when not needed
7. **Performance Impact**: Large responses slow down client applications

## Integration with Other Endpoints

### Typical Legal Research Workflow
```javascript
// Complete legislation research workflow
// 1. Browse available legislation (this endpoint)
const legislations = await fetch('/api/legislations')
  .then(res => res.json())

// 2. Select specific legislation for detailed study
const gdpr = legislations.find(leg => leg.title.includes('General Data Protection'))

// 3. Get detailed legislation information
const legislationDetails = await fetch(`/api/legislations/${gdpr.id}`)
  .then(res => res.json())

// 4. Get all articles within the legislation
const articles = await fetch(`/api/legislations/${gdpr.id}/articles`)
  .then(res => res.json())

// 5. Find cases interpreting the legislation
const interpretingCases = await fetch(`/api/legislations/${gdpr.id}/cases`)
  .then(res => res.json())
```

### Client-Side Enhancement Recommendations
```javascript
// Recommended client-side enhancements for better UX
class LegislationBrowser {
  async getFilteredLegislations(filters = {}) {
    const allLegislations = await fetch('/api/legislations').then(res => res.json())
    
    return allLegislations.filter(leg => {
      if (filters.type && leg.document_type !== filters.type) return false
      if (filters.year && !leg.publication_date?.startsWith(filters.year)) return false
      if (filters.search && !leg.title.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
  }
  
  async getPaginatedLegislations(page = 1, limit = 20) {
    const allLegislations = await fetch('/api/legislations').then(res => res.json())
    const start = (page - 1) * limit
    const end = start + limit
    
    return {
      data: allLegislations.slice(start, end),
      total: allLegislations.length,
      page,
      limit,
      hasMore: end < allLegislations.length
    }
  }
}
```

## Future Enhancements

### Planned Improvements ⚠️ **NOT IMPLEMENTED**:

1. **Pagination Support**
   ```javascript
   GET /api/legislations?limit=20&offset=40&total=true
   ```

2. **Filtering Capabilities**
   ```javascript
   GET /api/legislations?type=Regulation&year=2022&search=digital
   ```

3. **Field Selection**
   ```javascript
   GET /api/legislations?fields=id,title,celex_number,document_type
   ```

4. **Sorting Options**
   ```javascript
   GET /api/legislations?sort=publication_date&order=desc
   ```

5. **Response Optimization**
   ```javascript
   GET /api/legislations?exclude_content=true  // Exclude large markdown fields
   ```

## Changelog

### v1.0.0 (Current)
- Basic legislation listing with alphabetical sorting
- Complete legislation metadata in response
- Error handling for database failures
- Simple, reliable implementation

### Future Versions
- **v1.1.0**: Add pagination and basic filtering
- **v1.2.0**: Add field selection and response optimization
- **v1.3.0**: Add full-text search capabilities
- **v2.0.0**: Comprehensive query parameter support with breaking changes

---

*Endpoint: `/src/app/api/legislations/route.ts`*  
*Last Updated: July 21, 2025*  
*Status: Production Ready - Core Functionality, Needs Scaling Features*