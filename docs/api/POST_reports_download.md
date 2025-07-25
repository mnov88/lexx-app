# Report Download API - POST /api/reports/download

## Endpoint Information
- **Path**: `/api/reports/download`
- **Method**: `POST`
- **Description**: Download generated legal research reports in HTML or PDF-optimized HTML format.
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
interface ReportDownloadRequest {
  config: ReportConfig
  reportData: ReportData
  format: 'html' | 'pdf'
}
```

### Request Example
```bash
curl -X POST "http://localhost:3000/api/reports/download" \
  -H "Content-Type: application/json" \
  -d '{
    "config": { "title": "GDPR Analysis", ... },
    "reportData": { ... },
    "format": "html"
  }'
```

## Response

### Success Response (200)
- **Content-Type**: `text/html`
- **Content-Disposition**: `attachment; filename="report_title.html"`

The endpoint returns a complete HTML document with professional styling, ready for download or printing.

## Error Responses

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Report generated and returned successfully |
| 400 | Bad Request | Invalid format or missing required fields |
| 500 | Server Error | Report generation or unexpected server error |

---

*Implementation: `lexx-app/src/app/api/reports/download/route.ts`*
*Changelog: v1.0.0 (Legacy) - Basic report download. v2.0.0 (Current) - Aligned with production security and authentication standards.*