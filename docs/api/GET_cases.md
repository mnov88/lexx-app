# Cases List API - GET /api/cases

## Endpoint Information
- **Path**: `/api/cases`
- **Method**: `GET`
- **Description**: Retrieve a list of case law documents with advanced filtering, sorting, and pagination.
- **Version**: `2.0`
- **Last Updated**: `2024-07-22`
- **Status**: `PRODUCTION READY ✅`

## 🔐 Authentication & Security
- **Required**: `✅ YES - Production authentication implemented`
- **Type**: `Supabase Auth with role-based access control`
- **Scope**: `read`
- **Rate Limiting**: Role-based quotas (100-1000 requests/minute)
- **Security**: XSS/SQL injection prevention, input sanitization via `withValidation` HOC.

## Request

### Query Parameters
| Parameter | Type | Required | Description | Default | Example |
|-----------|------|----------|-------------|---------|---------|
| limit | `number` | ❌ | Maximum number of cases to return (1-100) | `25` | `?limit=50` |
| offset | `number` | ❌ | The starting point for returning cases | `0` | `?offset=50` |
| latest | `boolean` | ❌ | Sort by judgment date (latest first) | `false` | `?latest=true` |
| topics | `string` | ❌ | Filter cases by a comma-separated list of topics | - | `?topics=Data%20Protection,Competition` |
| date_from | `string` | ❌ | Filter cases from a specific date (YYYY-MM-DD) | - | `?date_from=2023-01-01` |
| date_to | `string` | ❌ | Filter cases up to a specific date (YYYY-MM-DD) | - | `?date_to=2023-12-31` |

### Request Examples

#### Paginated Request
```bash
curl -X GET "http://localhost:3000/api/cases?limit=20&offset=40" \
  -H "Accept: application/json"
```

#### Filter by Topic and Date
```bash
curl -X GET "http://localhost:3000/api/cases?topics=Data%20Protection&date_from=2023-01-01&latest=true" \
  -H "Accept: application/json"
```

## Response

### Success Response (200)
```typescript
interface CasesListResponse {
  data: CaseLaw[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNext: boolean
    hasPrev: boolean
    nextOffset: number | null
    prevOffset: number | null
  }
  metadata: {
    filters: {
      latest: boolean
      topics: string | null
      dateRange: { from: string, to: string } | null
    },
    requestTime: string
  }
}

interface CaseLaw {
  id: string
  celex_number: string
  case_id_text: string | null
  title: string
  court: string | null
  date_of_judgment: string | null
  // ... other case fields
}
```

### Response Example
```json
{
  "data": [
  {
    "id": "uuid-case-meta-platforms",
      "celex_number": "62021CJ0252",
      "case_id_text": "C-252/21",
      "title": "Meta Platforms and Others",
      "court": "Court of Justice",
    "date_of_judgment": "2023-05-04",
      "parties": "Bundeskartellamt vs Meta Platforms Inc.",
      "summary_text": "Case addressing the processing of personal data for behavioral advertising...",
      "created_at": "2024-01-15T09:20:00Z"
  }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 98,
    "itemsPerPage": 25,
    "hasNext": true,
    "hasPrev": false,
    "nextOffset": 25,
    "prevOffset": null
  },
  "metadata": {
    "filters": {
      "latest": true,
      "topics": "Data Protection",
      "dateRange": {
        "from": "2023-01-01",
        "to": null
      }
    },
    "requestTime": "2024-07-22T10:00:00Z"
  }
}
```

## Error Responses

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Request successful (even with 0 results) |
| 400 | Bad Request | Invalid query parameters (e.g., invalid date format, non-numeric limit) |
| 500 | Server Error | Database or unexpected server error |

## Query Parameters & Behavior

### Sorting Logic
- **Default Sorting** (`latest=false` or omitted): `ORDER BY created_at DESC`
- **Latest Cases Sorting** (`latest=true`): `ORDER BY date_of_judgment DESC, created_at DESC`

### Filtering
- **`topics`**: Filters cases that contain ANY of the provided comma-separated topics.
- **`date_from`**: Includes cases with `date_of_judgment` on or after this date.
- **`date_to`**: Includes cases with `date_of_judgment` on or before this date.

---

*Implementation: `lexx-app/src/app/api/cases/route.ts`*
*Changelog: v1.0.0 (Legacy) - Basic list. v2.0.0 (Current) - Added pagination, filtering by topic and date, and metadata in response.*