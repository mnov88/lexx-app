# Legislation Details API - GET /api/legislations/{id}

## Endpoint Information
- **Path**: `/api/legislations/{id}`
- **Method**: `GET`
- **Description**: Retrieve detailed information about a specific EU legislation document.
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
curl -X GET "http://localhost:3000/api/legislations/uuid-gdpr-123" \
  -H "Accept: application/json"
```

## Response

### Success Response (200)
```typescript
interface LegislationDetailsResponse extends Legislation {
  // All legislation fields are included.
}

interface Legislation {
  id: string
  celex_number: string
  title: string
  publication_date: string | null
  document_type: string | null
  summary: string | null
  full_markdown_content: string | null
  // ... other legislation fields
}
```

### Response Example
```json
{
  "id": "uuid-gdpr-123",
  "celex_number": "32016R0679",
  "title": "General Data Protection Regulation",
  "publication_date": "2016-05-04",
  "document_type": "Regulation",
  "summary": "Regulation on the protection of natural persons with regard to the processing of personal data...",
  "full_markdown_content": "# REGULATION (EU) 2016/679..."
}
```

## Error Responses

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Legislation found and returned successfully |
| 404 | Not Found | Legislation with the specified ID does not exist |
| 500 | Server Error | Database or unexpected server error |

---

*Implementation: `lexx-app/src/app/api/legislations/[id]/route.ts`*
*Changelog: v1.0.0 (Legacy) - Basic legislation retrieval. v2.0.0 (Current) - Aligned with production security and authentication standards.*