# Legislation List API - GET /api/legislations

## Endpoint Information
- **Path**: `/api/legislations`
- **Method**: `GET`
- **Description**: Retrieve a complete list of all EU legislation documents in the database, sorted alphabetically by title.
- **Version**: `2.0`
- **Last Updated**: `2024-07-22`
- **Status**: `PRODUCTION READY ✅`

## 🔐 Authentication & Security
- **Required**: `✅ YES - Production authentication implemented`
- **Type**: `Supabase Auth with role-based access control`
- **Scope**: `read`
- **Rate Limiting**: Role-based quotas (100-1000 requests/minute)
- **Security**: XSS/SQL injection prevention, input sanitization.

## 🚀 Performance & Caching
- **Caching**: This endpoint is cached for 15 minutes to ensure fast response times for frequently accessed data.

## Request

This endpoint does not accept any query parameters. It returns a complete list of all legislations.

### Request Example
```bash
curl -X GET "http://localhost:3000/api/legislations" \
  -H "Accept: application/json"
```

## Response

### Success Response (200)
```typescript
type LegislationsResponse = Legislation[]

interface Legislation {
  id: string
  celex_number: string
  title: string
  publication_date: string | null
  document_type: string | null
  summary: string | null
  // ... other legislation fields
}
```

### Response Example
```json
[
  {
    "id": "uuid-charter-123",
    "celex_number": "12012P/TXT",
    "title": "Charter of Fundamental Rights of the European Union",
    "publication_date": "2012-10-26",
    "document_type": "Charter"
  },
  {
    "id": "uuid-dmca-789",
    "celex_number": "32022R2065",
    "title": "Digital Markets Act",
    "publication_date": "2022-11-12",
    "document_type": "Regulation"
  }
]
```

## Error Responses

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Legislations retrieved successfully (including an empty array) |
| 500 | Server Error | Database or unexpected server error |

---

*Implementation: `lexx-app/src/app/api/legislations/route.ts`*
*Changelog: v1.0.0 (Legacy) - Basic list retrieval. v2.0.0 (Current) - Aligned with production security and authentication standards, and added caching.*