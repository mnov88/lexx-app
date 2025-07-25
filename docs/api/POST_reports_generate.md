# Report Generation API - POST /api/reports/generate

## Endpoint Information
- **Path**: `/api/reports/generate`
- **Method**: `POST`
- **Description**: Generate comprehensive legal research reports based on selected legislations and articles.
- **Version**: `2.0`
- **Last Updated**: `2024-07-22`
- **Status**: `PRODUCTION READY ✅`

## 🔐 Authentication & Security
- **Required**: `✅ YES - Production authentication implemented`
- **Type**: `Supabase Auth with role-based access control`
- **Scope**: `write`
- **Rate Limiting**: Role-based quotas (100-1000 requests/minute)
- **Security**: XSS/SQL injection prevention, input sanitization.

## Request

### Request Body
```typescript
interface ReportGenerationRequest {
  title: string
  legislations: string[] // Array of legislation UUIDs
  articles: string[]     // Array of article UUIDs
}
```

### Request Example
```bash
curl -X POST "http://localhost:3000/api/reports/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "GDPR Compliance Analysis",
    "legislations": ["uuid-gdpr-123"],
    "articles": ["uuid-article-6", "uuid-article-7"]
  }'
```

## Response

### Success Response (200)
Returns a `ReportData` object that can be passed to the `/api/reports/download` endpoint.
```typescript
interface ReportData {
  config: ReportConfig
  content: {
    legislations: LegislationReportData[]
    generatedAt: string
    totalArticles: number
    totalCases: number
  }
}
```

### Response Example
```json
{
  "config": {
    "title": "GDPR Compliance Analysis",
    "legislations": ["uuid-gdpr-123"],
    "articles": ["uuid-article-6", "uuid-article-7"]
  },
  "content": {
    "legislations": [ ... ],
    "generatedAt": "2024-07-22T10:30:00Z",
    "totalArticles": 2,
    "totalCases": 5
  }
}
```

## Error Responses

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Report data generated successfully |
| 400 | Bad Request | Invalid request body or missing required fields |
| 500 | Server Error | Database or unexpected server error |

---

*Implementation: `lexx-app/src/app/api/reports/generate/route.ts`*
*Changelog: v1.0.0 (Legacy) - Basic report generation. v2.0.0 (Current) - Aligned with production security and authentication standards, simplified request body.*