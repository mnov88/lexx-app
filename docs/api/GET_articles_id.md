# Article Details API - GET /api/articles/{id}

## Endpoint Information
- **Path**: `/api/articles/{id}`
- **Method**: `GET`
- **Description**: Retrieve detailed information about a specific EU legal article, including its parent legislation.
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
| id | `string` | ✅ | Article UUID identifier | `uuid-article-123-456` |

### Request Examples

#### Basic Request
```bash
curl -X GET "http://localhost:3000/api/articles/uuid-article-123-456" \
  -H "Accept: application/json"
```

## Response

### Success Response (200)
```typescript
interface ArticleDetailsResponse extends Article {
  legislation: Legislation
}

interface Article {
  id: string
  legislation_id: string
  article_number: number | null
  article_number_text: string
  title: string
  markdown_content: string | null
  // ... other article fields
}

interface Legislation {
  id: string
  celex_number: string
  title: string
  // ... other legislation fields
}
```

### Response Example
```json
{
  "id": "uuid-article-6-gdpr",
  "legislation_id": "uuid-gdpr-123",
  "article_number": 6,
  "article_number_text": "Article 6",
  "title": "Lawfulness of processing",
  "markdown_content": "1. Processing shall be lawful only if...",
  "legislation": {
    "id": "uuid-gdpr-123",
    "celex_number": "32016R0679",
    "title": "General Data Protection Regulation"
  }
}
```

## Error Responses

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Article found and returned successfully |
| 404 | Not Found | Article with the specified ID does not exist |
| 500 | Server Error | Database or unexpected server error |

---

*Implementation: `lexx-app/src/app/api/articles/[id]/route.ts`*
*Changelog: v1.0.0 (Legacy) - Basic article retrieval. v2.0.0 (Current) - Aligned with production security and authentication standards.*