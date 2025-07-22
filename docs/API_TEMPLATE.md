# API Endpoint Documentation Template

Use this template to document all API endpoints in the Lexx EU Legal Research Platform.

## Template Structure

```markdown
# API Endpoint Name

## Endpoint Information
- **Path**: `/api/endpoint/path`
- **Method**: `GET | POST | PUT | DELETE`
- **Description**: Brief description of what this endpoint does
- **Version**: `v1.0`
- **Last Updated**: `YYYY-MM-DD`

## Authentication
- **Required**: `Yes | No`
- **Type**: `Bearer Token | API Key | None`
- **Scope**: `read | write | admin`

## Request

### URL Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| id | `string` | ✅ | Resource identifier | `uuid-123-456` |
| slug | `string` | ❌ | URL-friendly identifier | `article-1-gdpr` |

### Query Parameters  
| Parameter | Type | Required | Default | Description | Example |
|-----------|------|----------|---------|-------------|---------|
| limit | `number` | ❌ | `10` | Number of results to return | `20` |
| offset | `number` | ❌ | `0` | Number of results to skip | `40` |
| search | `string` | ❌ | - | Search query string | `data protection` |
| type | `string` | ❌ | `all` | Filter by content type | `legislation` |

### Request Body (for POST/PUT)
```typescript
interface RequestBody {
  field1: string
  field2?: number
  field3: {
    nestedField: boolean
  }
}
```

### Request Examples

#### Basic Request
```bash
curl -X GET "https://api.lexx.eu/api/endpoint" \
  -H "Accept: application/json"
```

#### With Query Parameters
```bash
curl -X GET "https://api.lexx.eu/api/endpoint?limit=20&search=gdpr" \
  -H "Accept: application/json"
```

#### POST Request with Body
```bash
curl -X POST "https://api.lexx.eu/api/endpoint" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "field1": "value",
    "field2": 42
  }'
```

## Response

### Success Response (200)
```typescript
interface SuccessResponse {
  data: ResourceType[]
  pagination?: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  metadata?: {
    timestamp: string
    version: string
  }
}
```

### Response Examples

#### Single Resource
```json
{
  "id": "uuid-123-456",
  "title": "Article 6 - Lawfulness of processing",
  "content": "Processing shall be lawful only if...",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T15:45:00Z"
}
```

#### Collection with Pagination
```json
{
  "data": [
    {
      "id": "uuid-123-456",
      "title": "Resource 1"
    },
    {
      "id": "uuid-789-012",
      "title": "Resource 2"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  },
  "metadata": {
    "timestamp": "2024-01-20T15:45:00Z",
    "version": "v1.0"
  }
}
```

## Error Responses

### 400 - Bad Request
```json
{
  "error": "Invalid query parameter",
  "details": "The 'limit' parameter must be between 1 and 100",
  "code": "INVALID_PARAMETER"
}
```

### 401 - Unauthorized
```json
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

### 403 - Forbidden
```json
{
  "error": "Insufficient permissions",
  "code": "FORBIDDEN"
}
```

### 404 - Not Found
```json
{
  "error": "Resource not found",
  "code": "NOT_FOUND"
}
```

### 422 - Validation Error
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ],
  "code": "VALIDATION_ERROR"
}
```

### 429 - Rate Limited
```json
{
  "error": "Rate limit exceeded",
  "details": "Maximum 100 requests per minute allowed",
  "code": "RATE_LIMITED"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

## Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST request |
| 204 | No Content | Successful DELETE request |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Request data validation failed |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Unexpected server error |

## Rate Limiting
- **Limit**: X requests per minute
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

## Caching
- **Cache Headers**: `Cache-Control`, `ETag`
- **Cache Duration**: X seconds/minutes
- **Cache Key**: Description of what determines cache key

## Legal Research Context

### Use Cases
1. **Lawyers researching cases** - How lawyers would use this endpoint
2. **Generating legal reports** - Integration with report workflows
3. **Cross-referencing legislation** - How this fits in legal research

### Data Relationships
- **Parent Resources**: What this resource relates to
- **Child Resources**: What depends on this resource  
- **Cross-References**: Legal connections and interpretations

## Performance Considerations
- **Query Optimization**: Database query patterns used
- **Pagination**: How to efficiently page through results
- **Filtering**: Recommended filtering strategies
- **Caching**: Client-side caching recommendations

## Security Considerations
- **Input Validation**: What inputs are validated and how
- **SQL Injection**: How queries are parameterized
- **Access Control**: What permissions are checked
- **Sensitive Data**: What data requires special handling

## Testing

### Unit Tests
```typescript
describe('/api/endpoint', () => {
  it('should return valid data', async () => {
    // Test implementation
  })
})
```

### Integration Tests
- Test with real database connections
- Verify related endpoint interactions
- Check permission boundaries

### Load Testing
- Expected concurrent users
- Performance benchmarks
- Scaling considerations

## Changelog

### v1.1.0 (2024-01-20)
- Added filtering by type parameter
- Improved error messages
- Added pagination metadata

### v1.0.0 (2024-01-15)
- Initial implementation
- Basic CRUD operations

---

*API Version: v1.0*  
*Documentation Version: 1.0*  
*Last Updated: [Date]*
```

## Documentation Standards

### Required Information
1. **Complete request/response examples** with realistic legal data
2. **All possible error responses** with specific error codes
3. **Authentication requirements** clearly stated
4. **Performance characteristics** documented
5. **Legal context** explaining how lawyers use this endpoint

### File Naming Convention
- Endpoint docs: `API_[METHOD]_[PATH].md`
- Example: `API_GET_cases.md`, `API_POST_reports_generate.md`

### Legal Context Requirements
- Always include how lawyers would use this endpoint
- Explain the legal significance of the data
- Document relationships to EU law and case law
- Include realistic examples with legal terminology

### Error Handling Standards
- Document all possible error conditions
- Include specific error codes for programmatic handling
- Provide clear error messages for debugging
- Document recovery strategies

### Performance Documentation
- Include expected response times
- Document pagination patterns
- Specify caching strategies
- Note any rate limiting