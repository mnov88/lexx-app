# Legislation Cases API - GET /api/legislations/{id}/cases

## Endpoint Information
- **Path**: `/api/legislations/{id}/cases`
- **Method**: `GET`
- **Description**: Retrieve all cases that interpret any articles within a specific EU legislation document.
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
curl -X GET "http://localhost:3000/api/legislations/uuid-gdpr-123/cases" \
  -H "Accept: application/json"
```

## Response

### Success Response (200)
```typescript
type LegislationCasesResponse = CaseLaw[]

interface CaseLaw {
  id: string
  case_number: string
  case_name: string
  judgement_date: string | null
  // ... other case fields
}
```

### Response Example
```json
[
  {
    "id": "uuid-case-google-spain",
    "case_number": "C-131/12",
    "case_name": "Google Spain SL and Google Inc. v. Agencia Española de Protección de Datos",
    "judgement_date": "2014-05-13"
  },
  {
    "id": "uuid-case-facebook-schrems",
    "case_number": "C-311/18",
    "case_name": "Data Protection Commissioner v. Facebook Ireland Limited and Maximillian Schrems",
    "judgement_date": "2020-07-16"
  }
]
```

## Error Responses

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Cases retrieved successfully (including an empty array) |
| 500 | Server Error | Database or unexpected server error |

---

*Implementation: `lexx-app/src/app/api/legislations/[id]/cases/route.ts`*
*Changelog: v1.0.0 (Legacy) - Basic case retrieval. v2.0.0 (Current) - Aligned with production security and authentication standards.*