# Advanced Search API - GET /api/search

## Endpoint Information
- **Path**: `/api/search`
- **Method**: `GET`
- **Description**: **🚀 PRODUCTION-READY** Advanced multi-entity search with vector embeddings, semantic search, and intelligent relevance scoring
- **Version**: `v2.0`
- **Last Updated**: `2025-07-22`
- **Status**: `PRODUCTION READY ✅`

## 🔐 Authentication & Security
- **Required**: `✅ YES - Production authentication implemented`
- **Type**: `Supabase Auth with role-based access control`
- **Scope**: `read`
- **Rate Limiting**: Role-based quotas (100-1000 requests/minute)
- **Security**: XSS/SQL injection prevention, input sanitization

## Request

### Query Parameters  
| Parameter | Type | Required | Default | Description | Example |
|-----------|------|----------|---------|-------------|---------|
| q | `string` | ✅ | - | Search query (min 2 characters) | `data protection` |
| type | `string` | ❌ | `all` | Content type filter | `legislation`, `cases`, `articles`, `operative_parts`, `all` |
| limit | `number` | ❌ | `10` | Max results to return (1-100) | `20` |
| context | `string` | ❌ | - | Scope search to specific legislation ID | `uuid-legislation-123` |
| semantic | `boolean` | ❌ | `true` | Enable vector similarity search | `true`, `false` |

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
  metadata: {
    semantic_enabled: boolean
    context_filter?: string
    search_type: string
  }
}

interface SearchResult {
  id: string
  title: string
  type: 'legislation' | 'case' | 'article' | 'operative_part'
  subtitle: string
  snippet: string
  score: number
  metadata: {
    // Common fields
    celex_number?: string
    case_id_text?: string
    court?: string
    date_of_judgment?: string
    article_number_text?: string
    legislation_id?: string
    
    // Semantic search fields
    semantic_match?: boolean
    similarity_score?: number
    
    // Content type specific fields
    document_type?: string
    publication_date?: string
    part_number?: number
    parties?: string
  }
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

## 🧠 Advanced Search Algorithm

### Multi-Factor Relevance Scoring
The API uses a sophisticated production-ready scoring algorithm:

1. **Exact Title Match**: Score of 100 for perfect title matches
2. **Partial Title Match**: Score of 50 for query contained in title
3. **Semantic Similarity**: Vector similarity scoring (0-30 points) when semantic search enabled
4. **Content Type Weighting**: 
   - Legislation: +10 points (highest priority)
   - Articles: +8 points  
   - Cases: +6 points
   - Operative Parts: +5 points
5. **Field-Specific Bonuses**:
   - Word matches in title: +5 points per word
   - Word matches in snippet: +2 points per word
   - Word matches in subtitle: +3 points per word
6. **Legal Document Bonuses**:
   - CELEX number match: +15 points
   - Case ID match: +15 points
7. **Smart Snippet Extraction**: Context-aware snippet generation with query highlighting

### Search Scope by Type

| Type | Searches | Fields |
|------|----------|--------|
| `legislation` | legislations table | title, celex_number, summary |
| `cases` | case_laws table | title, case_id_text, parties, summary_text |
| `articles` | articles table | title, article_number_text, markdown_content |
| `operative_parts` | operative_parts table | verbatim_text, simplified_text |
| `all` | All tables + vector search | All fields above + semantic similarity |

## 🚀 Performance Optimizations

- **Advanced Caching**: 5-minute cache for search results with intelligent invalidation
- **Parallel Queries**: Concurrent database queries for different entity types
- **Result Deduplication**: Intelligent duplicate removal across entity types
- **Database Optimization**: Uses indexed search columns and optimized queries
- **Rate Limiting**: Production-ready with role-based quotas
- **Query Optimization**: Smart limit distribution and result ranking

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

## ✅ Production Features Implemented

**MAJOR ENHANCEMENTS COMPLETED**:

1. **✅ Semantic Search**: Vector similarity search with embeddings
2. **✅ Advanced Scoring**: Multi-factor relevance algorithm with legal document weighting
3. **✅ Multi-Entity Search**: Comprehensive search across all content types including operative parts
4. **✅ Performance Caching**: Intelligent 5-minute caching with tag-based invalidation
5. **✅ Smart Snippets**: Context-aware snippet extraction with query highlighting
6. **✅ Production Security**: Authentication, rate limiting, input validation
7. **✅ Advanced Filtering**: Context-aware search within specific legislation
8. **✅ Result Deduplication**: Intelligent removal of duplicate results across entity types

## 🔮 Future Enhancements

**Potential Future Features**:
1. **Fuzzy Search**: Typo tolerance and autocorrect
2. **Search Analytics**: Popular terms tracking and user behavior analysis  
3. **Multi-Language Support**: Search across different language versions
4. **Saved Searches**: User-specific search history and favorites
5. **Advanced Filters**: Date ranges, court types, legal concepts

## Changelog

### v2.0.0 (CURRENT - PRODUCTION READY ✅)
- **🚀 Advanced semantic search** with vector embeddings
- **📊 Multi-factor relevance scoring** with legal document weighting
- **⚡ Performance caching** with 5-minute intelligent cache
- **🛡️ Production security** with authentication and rate limiting
- **🔍 Multi-entity search** across legislation, cases, articles, operative parts
- **📝 Smart snippet extraction** with context-aware highlighting
- **🎯 Result deduplication** and advanced filtering

### v1.0.0 (Legacy)
- Basic full-text search across legislation, cases, and articles
- Type filtering and result limiting
- Contextual search within legislation
- Simple relevance scoring algorithm

---

*Endpoint: `/src/app/api/search/route.ts`*  
*Last Updated: July 22, 2025*  
*Status: **🚀 PRODUCTION READY** - All Major Features Implemented*