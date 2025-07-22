# Search API - GET /api/search

## Endpoint Information
- **Path**: `/api/search`
- **Method**: `GET`
- **Description**: Search across EU legislation, case law, and articles with relevance scoring
- **Version**: `v1.0`
- **Last Updated**: `2024-07-21`

## Authentication
- **Required**: `No` ⚠️ *Should be implemented for production*
- **Type**: `None`
- **Scope**: `read`

## Request

### Query Parameters  
| Parameter | Type | Required | Default | Description | Example |
|-----------|------|----------|---------|-------------|---------|
| q | `string` | ✅ | - | Search query (min 2 characters) | `data protection` |
| type | `string` | ❌ | `all` | Content type filter | `legislation`, `cases`, `articles`, `all` |
| limit | `number` | ❌ | `10` | Max results to return (1-100) | `20` |
| context | `string` | ❌ | - | Scope search to specific legislation ID | `uuid-legislation-123` |

### Request Examples

#### Basic Search
```bash
curl -X GET "http://localhost:3000/api/search?q=gdpr" \
  -H "Accept: application/json"
```

#### Search with Type Filter
```bash
curl -X GET "http://localhost:3000/api/search?q=data%20protection&type=legislation&limit=5" \
  -H "Accept: application/json"
```

#### Contextual Search (within specific legislation)
```bash
curl -X GET "http://localhost:3000/api/search?q=consent&context=uuid-gdpr-123&type=articles" \
  -H "Accept: application/json"
```

## Response

### Success Response (200)
```typescript
interface SearchResponse {
  query: string
  results: SearchResult[]
  total: number
}

interface SearchResult {
  id: string
  title: string
  type: 'legislation' | 'case' | 'article'
  subtitle: string
  snippet: string
  score: number
  metadata: Record<string, any>
}
```

### Response Examples

#### Mixed Search Results
```json
{
  "query": "data protection",
  "results": [
    {
      "id": "uuid-gdpr-123",
      "title": "General Data Protection Regulation",
      "type": "legislation",
      "subtitle": "32016R0679",
      "snippet": "The protection of natural persons in relation to the processing of personal data...",
      "score": 10,
      "metadata": {
        "document_type": "Regulation"
      }
    },
    {
      "id": "uuid-case-456",
      "title": "Digital Rights Ireland and Others",
      "type": "case",
      "subtitle": "C-293/12",
      "snippet": "The Court ruled on the validity of Directive 2006/24/EC...",
      "score": 8.5,
      "metadata": {
        "court": "Court of Justice"
      }
    },
    {
      "id": "uuid-article-789",
      "title": "Article 6 - Lawfulness of processing",
      "type": "article",
      "subtitle": "General Data Protection Regulation",
      "snippet": "Processing shall be lawful only if and to the extent that at least one of the following applies...",
      "score": 7.2,
      "metadata": {
        "celex_number": "32016R0679",
        "article_number_text": "Article 6"
      }
    }
  ],
  "total": 3
}
```

#### No Results Found
```json
{
  "query": "nonexistent legal term",
  "results": [],
  "total": 0
}
```

## Error Responses

### 400 - Bad Request (Short Query)
```json
{
  "error": "Query must be at least 2 characters",
  "code": "VALIDATION_ERROR"
}
```

**When this occurs**: Query parameter `q` is missing, empty, or less than 2 characters

### 400 - Bad Request (Invalid Type)
```json
{
  "error": "Invalid type parameter. Must be: legislation, cases, articles, or all",
  "code": "INVALID_PARAMETER"
}
```

**When this occurs**: `type` parameter is not one of the allowed values

### 400 - Bad Request (Invalid Limit)
```json
{
  "error": "Limit must be between 1 and 100",
  "code": "INVALID_PARAMETER"
}
```

**When this occurs**: `limit` parameter is outside acceptable range

### 500 - Internal Server Error
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

**When this occurs**: Database connection issues or unexpected server errors

## Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Search completed successfully (even with 0 results) |
| 400 | Bad Request | Invalid query parameters |
| 500 | Server Error | Database or server error |

## Search Algorithm

### Relevance Scoring
The API uses a basic relevance scoring algorithm:

1. **Exact Match**: Score of 10 for exact query match in title
2. **Word Matching**: Proportional scoring based on word overlap
3. **Results Sorted**: By score descending, then by title

⚠️ **PLACEHOLDER**: This is a simple algorithm and should be enhanced for production

### Search Scope by Type

| Type | Searches | Fields |
|------|----------|--------|
| `legislation` | legislations table | title (full-text search) |
| `cases` | case_laws table | title (full-text search) |
| `articles` | articles table | title (full-text search) |
| `all` | All tables | title fields across all content types |

## Performance Considerations

- **Database Queries**: Uses PostgreSQL full-text search via Supabase
- **Concurrent Searches**: No rate limiting (⚠️ should be added)
- **Result Limits**: Automatically divides limit across content types for `all` searches
- **Query Optimization**: Uses indexed text search columns

## Legal Research Context

### Use Cases

1. **Finding Relevant Legislation**
   ```bash
   # Lawyer searching for GDPR-related regulations
   curl "/api/search?q=general%20data%20protection&type=legislation"
   ```

2. **Case Law Research**
   ```bash
   # Finding cases about specific legal concepts
   curl "/api/search?q=right%20to%20be%20forgotten&type=cases"
   ```

3. **Article-Level Research**
   ```bash
   # Finding specific articles within known legislation
   curl "/api/search?q=consent&context=uuid-gdpr-123&type=articles"
   ```

4. **Cross-Reference Research**
   ```bash
   # Broad search to find all related content
   curl "/api/search?q=privacy%20breach&type=all&limit=50"
   ```

### Data Relationships
- **Legislation → Articles**: Articles belong to legislation documents
- **Cases → Operative Parts**: Cases contain multiple operative parts
- **Operative Parts → Articles**: Many-to-many relationship via junction table
- **Cross-References**: Search results can show related content across types

## Security Considerations

⚠️ **SECURITY PLACEHOLDER NOTES**:

1. **No Input Sanitization**: Relies on Supabase for SQL injection protection
2. **No Rate Limiting**: Open to abuse and DoS attacks
3. **No Authentication**: Anyone can search (may expose sensitive legal data)
4. **Query Logging**: No logging of search queries (may be needed for analytics)

## Caching Recommendations

⚠️ **NOT CURRENTLY IMPLEMENTED**:

- **Popular Searches**: Cache common legal terms
- **Type-Specific Results**: Different cache durations by content type
- **User-Specific**: Consider caching based on user research patterns
- **Invalidation**: Clear cache when legal content is updated

## Testing

### Unit Tests
```typescript
describe('GET /api/search', () => {
  it('should return results for valid query', async () => {
    const response = await request(app)
      .get('/api/search?q=data%20protection')
      .expect(200)
    
    expect(response.body.query).toBe('data protection')
    expect(Array.isArray(response.body.results)).toBe(true)
  })

  it('should reject queries under 2 characters', async () => {
    await request(app)
      .get('/api/search?q=a')
      .expect(400)
  })

  it('should filter by type correctly', async () => {
    const response = await request(app)
      .get('/api/search?q=gdpr&type=legislation')
      .expect(200)
    
    response.body.results.forEach(result => {
      expect(result.type).toBe('legislation')
    })
  })
})
```

### Integration Tests
- Test with real legal content database
- Verify cross-content-type search accuracy
- Test contextual search within legislation
- Validate relevance scoring accuracy

## Known Issues & Limitations

⚠️ **CURRENT LIMITATIONS**:

1. **Basic Scoring**: Simple text matching, no semantic search
2. **No Fuzzy Search**: Typos will return no results
3. **Language Support**: Only supports exact language matches
4. **No Search Analytics**: No tracking of popular terms or user patterns
5. **Limited Metadata**: Search doesn't include content from markdown_content fields
6. **Performance**: No query optimization for complex searches

## Changelog

### v1.0.0 (Current)
- Basic full-text search across legislation, cases, and articles
- Type filtering and result limiting
- Contextual search within legislation
- Simple relevance scoring algorithm

---

*Endpoint: `/src/app/api/search/route.ts`*  
*Last Updated: July 21, 2025*  
*Status: Development - Needs Production Enhancements*