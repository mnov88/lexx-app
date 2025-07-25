# Case Details API - GET /api/cases/{id}

## Endpoint Information
- **Path**: `/api/cases/{id}`
- **Method**: `GET`
- **Description**: Retrieve detailed information about a specific CJEU case, including its operative parts and the articles it interprets.
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
| id | `string` | ✅ | Case UUID identifier | `uuid-case-123-456` |

### Request Example
```bash
curl -X GET "http://localhost:3000/api/cases/uuid-case-123-456" \
  -H "Accept: application/json"
```

## Response

### Success Response (200)
```typescript
interface CaseDetailsResponse extends CaseLaw {
  operative_parts: OperativePartWithArticles[]
  interpreted_articles: ArticleWithOperativeParts[]
}

interface OperativePartWithArticles extends OperativePart {
  articles: ArticleWithLegislation[]
}

interface ArticleWithOperativeParts extends Article {
  legislation: Legislation
  operative_parts: {
    id: string
    part_number: number
    verbatim_text: string | null
    simplified_text: string | null
  }[]
}
```

### Response Example
```json
{
  "id": "uuid-case-123-456",
  "title": "Digital Rights Ireland and Others",
  "operative_parts": [
    {
      "id": "uuid-op-789",
      "part_number": 1,
      "verbatim_text": "Directive 2006/24/EC... is invalid.",
      "articles": [
        {
          "id": "uuid-article-456",
          "title": "Respect for private and family life",
          "legislation": {
            "title": "Charter of Fundamental Rights of the European Union"
          }
        }
      ]
    }
  ],
  "interpreted_articles": [
    {
      "id": "uuid-article-456",
      "title": "Respect for private and family life",
      "legislation": {
        "title": "Charter of Fundamental Rights of the European Union"
      },
      "operative_parts": [
        {
          "id": "uuid-op-789",
          "part_number": 1,
          "verbatim_text": "Directive 2006/24/EC... is invalid."
        }
      ]
    }
  ]
}
```

## Error Responses

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Case found and returned successfully |
| 404 | Not Found | Case with the specified ID does not exist |
| 500 | Server Error | Database or unexpected server error |

---

*Implementation: `lexx-app/src/app/api/cases/[id]/route.ts`*
*Changelog: v1.0.0 (Legacy) - Basic case retrieval. v2.0.0 (Current) - Aligned with production security and authentication standards, and includes processed `interpreted_articles` field.*