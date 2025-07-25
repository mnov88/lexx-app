# Legislation Articles API - GET /api/legislations/{id}/articles

## Endpoint Information
- **Path**: `/api/legislations/{id}/articles`
- **Method**: `GET`
- **Description**: Retrieve all articles within a specific EU legislation document, ordered by article number.
- **Version**: `2.0`
- **Last Updated**: `2024-07-22`
- **Status**: `PRODUCTION READY ✅`

## 🔐 Authentication & Security
- **Required**: `✅ YES - Production authentication implemented`
- **Type**: `Supabase Auth with role-based access control`
- **Scope**: `read`
- **Rate Limiting**: Role-based quotas (100-1000 requests/minute)
- **Security**: XSS/SQL injection prevention, input sanitization.

## Request

### URL Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| id | `string` | ✅ | Legislation UUID identifier | `uuid-gdpr-123-456` |

### Request Example
```bash
curl -X GET "http://localhost:3000/api/legislations/uuid-gdpr-123/articles" \
  -H "Accept: application/json"
```

## Response

### Success Response (200)
```typescript
type LegislationArticlesResponse = Article[]

interface Article {
  id: string
  legislation_id: string
  article_number: number | null
  article_number_text: string
  title: string
  markdown_content: string | null
  // ... other article fields
}
```

### Response Example
```json
[
  {
    "id": "uuid-article-1-gdpr",
    "legislation_id": "uuid-gdpr-123",
    "article_number": 1,
    "article_number_text": "Article 1",
    "title": "Subject-matter and objectives",
    "markdown_content": "1. This Regulation lays down rules..."
  },
  {
    "id": "uuid-article-2-gdpr",
    "legislation_id": "uuid-gdpr-123",
    "article_number": 2,
    "article_number_text": "Article 2",
    "title": "Material scope",
    "markdown_content": "1. This Regulation applies to the processing..."
  }
]
```

## Error Responses

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Articles retrieved successfully (including an empty array) |
| 500 | Server Error | Database or unexpected server error |

---

*Implementation: `lexx-app/src/app/api/legislations/[id]/articles/route.ts`*
*Changelog: v1.0.0 (Legacy) - Basic article retrieval. v2.0.0 (Current) - Aligned with production security and authentication standards.*