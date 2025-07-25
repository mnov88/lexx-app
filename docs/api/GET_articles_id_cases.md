# Article Case Law API - GET /api/articles/{id}/cases

## Endpoint Information
- **Path**: `/api/articles/{id}/cases`
- **Method**: `GET`
- **Description**: Retrieve all CJEU cases that interpret a specific EU legal article, with their relevant operative parts.
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
curl -X GET "http://localhost:3000/api/articles/uuid-article-6-gdpr/cases" \
  -H "Accept: application/json"
```

## Response

### Success Response (200)
```typescript
interface CaseWithOperativeParts extends CaseLaw {
  operative_parts: OperativePart[]
}

type ArticleCasesResponse = CaseWithOperativeParts[]

interface CaseLaw {
  id: string
  celex_number: string
  case_id_text: string | null
  title: string
  // ... other case fields
}

interface OperativePart {
  id: string
  case_law_id: string
  part_number: number
  verbatim_text: string | null
  simplified_text: string | null
  // ... other operative part fields
}
```

### Response Example
```json
[
  {
    "id": "uuid-case-facebook-ireland",
    "celex_number": "62019CJ0645",
    "case_id_text": "C-645/19",
    "title": "Facebook Ireland and Others",
    "operative_parts": [
      {
        "id": "uuid-op-facebook-1",
        "case_law_id": "uuid-case-facebook-ireland",
        "part_number": 1,
        "verbatim_text": "National supervisory authorities retain the power...",
        "simplified_text": "National supervisory authorities have the power to suspend data flows to third countries."
      }
    ]
  }
]
```

## Error Responses

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Cases retrieved successfully (including an empty array if no cases are found) |
| 500 | Server Error | Database or unexpected server error |

---

*Implementation: `lexx-app/src/app/api/articles/[id]/cases/route.ts`*
*Changelog: v1.0.0 (Legacy) - Basic case retrieval. v2.0.0 (Current) - Aligned with production security and authentication standards.*