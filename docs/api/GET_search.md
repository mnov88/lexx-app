# Advanced Search API - GET /api/search

## Endpoint Information
- **Path**: `/api/search`
- **Method**: `GET`
- **Description**: **🚀 PRODUCTION-READY** Advanced multi-entity search with vector embeddings, semantic search, and intelligent relevance scoring. This endpoint searches across legislation, cases, articles, and operative parts, using a combination of full-text search and semantic vector search to provide highly relevant results.
- **Version**: `2.0`
- **Last Updated**: `2024-07-22`
- **Status**: `PRODUCTION READY ✅`

## 🔐 Authentication & Security
- **Required**: `✅ YES - Production authentication implemented`
- **Type**: `Supabase Auth with role-based access control`
- **Scope**: `read`
- **Rate Limiting**: Role-based quotas (100-1000 requests/minute)
- **Security**: XSS/SQL injection prevention, input sanitization via `withValidation` HOC.

## Request

### Query Parameters  
| Parameter | Type | Required | Default | Description | Example |
|-----------|------|----------|---------|-------------|---------|
| q | `string` | ✅ | - | Search query (min 2 characters) | `data protection` |
| type | `string` | ❌ | `all` | Content type filter. Allowed values: `legislation`, `cases`, `articles`, `operative_parts`, `semantic`, `all` | `legislation` |
| limit | `number` | ❌ | `10` | Max results to return (1-100) | `20` |
| context | `string` | ❌ | - | Scope search to a specific legislation ID (UUID format) | `uuid-legislation-123` |
| semantic | `boolean` | ❌ | `true` | Enable/disable vector similarity search | `false` |

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
    }
  ],
  "total": 2
}
```

## Error Responses

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Search completed successfully (even with 0 results) |
| 400 | Bad Request | Invalid query parameters (e.g., query too short, invalid type) |
| 500 | Server Error | Database or unexpected server error |

## 🧠 Advanced Search Algorithm

### Multi-Factor Relevance Scoring
The API uses a sophisticated production-ready scoring algorithm:

1. **Exact Title Match**: Score of 100 for perfect title matches
2. **Partial Title Match**: Score of 50 for query contained in title
3. **Semantic Similarity**: Vector similarity scoring (0-30 points) when semantic search enabled
4. **Content Type Weighting**: 
   - Legislation: +10 points
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
| `legislation` | `legislations` table | `title`, `celex_number`, `summary` |
| `cases` | `case_laws` table | `title`, `case_id_text`, `parties`, `summary_text` |
| `articles` | `articles` table | `title`, `article_number_text`, `markdown_content` |
| `operative_parts` | `operative_parts` table | `verbatim_text`, `simplified_text` |
| `all` | All tables + vector search | All fields above + semantic similarity |

## 🚀 Performance Optimizations

- **Advanced Caching**: 5-minute cache for search results with intelligent invalidation.
- **Parallel Queries**: Concurrent database queries for different entity types.
- **Result Deduplication**: Intelligent duplicate removal across entity types.
- **Database Optimization**: Uses indexed search columns and the `search_documents_semantic` RPC for vector search.

---

*Implementation: `lexx-app/src/app/api/search/route.ts`*
*Changelog: v1.0.0 (Legacy) - Basic full-text search. v2.0.0 (Current) - Added semantic search, advanced scoring, and multi-entity search.*