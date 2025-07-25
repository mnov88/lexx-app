# Article Navigation API - GET /api/articles/{id}/navigation

## Endpoint Information
- **Path**: `/api/articles/{id}/navigation`
- **Method**: `GET`
- **Description**: Retrieve navigation context for a specific article, including previous/next articles within the same legislation and position information.
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
| id | `string` | ✅ | Article UUID identifier | `uuid-article-6-gdpr` |

### Request Example
```bash
curl -X GET "http://localhost:3000/api/articles/uuid-article-6-gdpr/navigation" \
  -H "Accept: application/json"
```

## Response

### Success Response (200)
```typescript
interface ArticleNavigationResponse {
  previous: NavigationArticle | null
  next: NavigationArticle | null
  position: {
    current: number
    total: number
  }
}

interface NavigationArticle {
  id: string
  article_number: number | null
  article_number_text: string
  title: string
}
```

### Response Example
```json
{
  "previous": {
    "id": "uuid-article-5-gdpr",
    "article_number": 5,
    "article_number_text": "Article 5",
    "title": "Principles relating to processing of personal data"
  },
  "next": {
    "id": "uuid-article-7-gdpr",
    "article_number": 7,
    "article_number_text": "Article 7",
    "title": "Conditions for consent"
  },
  "position": {
    "current": 6,
    "total": 99
  }
}
```

## Error Responses

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Navigation context retrieved successfully |
| 404 | Not Found | The specified article does not exist or was not found in its legislation |
| 500 | Server Error | Database or unexpected server error |

---

*Implementation: `lexx-app/src/app/api/articles/[id]/navigation/route.ts`*
*Changelog: v1.0.0 (Legacy) - Basic navigation retrieval. v2.0.0 (Current) - Aligned with production security and authentication standards.*