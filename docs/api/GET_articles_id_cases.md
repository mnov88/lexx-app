# Article Case Law API - GET /api/articles/{id}/cases

## Endpoint Information
- **Path**: `/api/articles/{id}/cases`
- **Method**: `GET`
- **Description**: Retrieve all CJEU cases that interpret a specific EU legal article, with their relevant operative parts
- **Version**: `v1.0`
- **Last Updated**: `2024-07-21`

## Authentication
- **Required**: `No` ⚠️ *Should be implemented for production*
- **Type**: `None`
- **Scope**: `read`

## Request

### URL Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| id | `string` | ✅ | Article UUID identifier | `uuid-article-6-gdpr` |

### Request Examples

#### Basic Request
```bash
curl -X GET "http://localhost:3000/api/articles/uuid-article-6-gdpr/cases" \
  -H "Accept: application/json"
```

#### JavaScript/Fetch
```javascript
const response = await fetch('/api/articles/uuid-article-6-gdpr/cases')
const interpretingCases = await response.json()
```

#### Legal Research Context
```javascript
// Lawyer researching case law interpreting GDPR Article 6
const cases = await fetch('/api/articles/uuid-article-6-gdpr/cases')
  .then(res => res.json())

cases.forEach(case => {
  console.log(`${case.case_id_text}: ${case.title}`)
  case.operative_parts.forEach(op => {
    console.log(`  - Part ${op.part_number}: ${op.simplified_text}`)
  })
})
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
  case_id_text: string | null    // "C-131/12"
  title: string
  court: string | null           // "Court of Justice", "General Court"
  date_of_judgment: string | null
  parties: string | null
  summary_text: string | null
  html_content: string | null
  plaintext_content: string | null
  html_content_link: string | null
  plaintext_content_link: string | null
  source_url: string | null
  operative_parts_combined: string | null
  operative_parts_individual: any | null
  created_at: string
  updated_at: string
}

interface OperativePart {
  id: string
  case_law_id: string
  part_number: number
  verbatim_text: string | null
  simplified_text: string | null
  markdown_content: string | null
  created_at: string
  updated_at: string
}
```

### Response Examples

#### GDPR Article 6 Case Law
```json
[
  {
    "id": "uuid-case-facebook-ireland",
    "celex_number": "62019CJ0645",
    "case_id_text": "C-645/19",
    "title": "Facebook Ireland and Others",
    "court": "Court of Justice",
    "date_of_judgment": "2021-06-04",
    "parties": "Facebook Ireland Limited, Facebook Inc., Maximillian Schrems",
    "summary_text": "The Court ruled on the adequacy of safeguards for data transfers to third countries and the powers of national supervisory authorities.",
    "html_content": "<div>Full case HTML content...</div>",
    "plaintext_content": "Full case text content...",
    "html_content_link": "https://curia.europa.eu/juris/document/document.jsf?docid=243615",
    "plaintext_content_link": "https://curia.europa.eu/juris/document/document_print.jsf?docid=243615",
    "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62019CJ0645",
    "operative_parts_combined": "1. National supervisory authorities have the power to suspend data flows to third countries. 2. The adequacy decision alone is not sufficient to ensure GDPR compliance.",
    "operative_parts_individual": [
      "National supervisory authorities have the power to suspend data flows to third countries",
      "The adequacy decision alone is not sufficient to ensure GDPR compliance"
    ],
    "created_at": "2024-01-15T14:30:00Z",
    "updated_at": "2024-01-15T14:30:00Z",
    "operative_parts": [
      {
        "id": "uuid-op-facebook-1",
        "case_law_id": "uuid-case-facebook-ireland",
        "part_number": 1,
        "verbatim_text": "National supervisory authorities retain the power to suspend data flows to a third country pursuant to point (h) of Article 58(2) of Regulation 2016/679, including where the Commission has adopted an adequacy decision in respect of that third country.",
        "simplified_text": "National supervisory authorities have the power to suspend data flows to third countries.",
        "markdown_content": "**National supervisory authorities** retain the power to suspend data flows to a third country pursuant to point (h) of **Article 58(2) of Regulation 2016/679**, including where the Commission has adopted an adequacy decision in respect of that third country.",
        "created_at": "2024-01-15T14:30:00Z",
        "updated_at": "2024-01-15T14:30:00Z"
      },
      {
        "id": "uuid-op-facebook-2",
        "case_law_id": "uuid-case-facebook-ireland",
        "part_number": 2,
        "verbatim_text": "The existence of an adequacy decision does not prevent a supervisory authority from exercising the powers conferred on it by Article 58 of that regulation.",
        "simplified_text": "The adequacy decision alone is not sufficient to ensure GDPR compliance.",
        "markdown_content": "The existence of an **adequacy decision** does not prevent a supervisory authority from exercising the powers conferred on it by **Article 58** of that regulation.",
        "created_at": "2024-01-15T14:30:00Z",
        "updated_at": "2024-01-15T14:30:00Z"
      }
    ]
  },
  {
    "id": "uuid-case-planet49",
    "celex_number": "62017CJ0673",
    "case_id_text": "C-673/17",
    "title": "Planet49",
    "court": "Court of Justice",
    "date_of_judgment": "2019-10-01",
    "parties": "Planet49 GmbH, Bundesverband der Verbraucherzentralen und Verbraucherverbände",
    "summary_text": "The Court clarified requirements for valid consent under GDPR, particularly regarding pre-ticked boxes.",
    "html_content": "<div>Full case HTML content...</div>",
    "plaintext_content": "Full case text content...",
    "html_content_link": "https://curia.europa.eu/juris/document/document.jsf?docid=218462",
    "plaintext_content_link": "https://curia.europa.eu/juris/document/document_print.jsf?docid=218462",
    "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62017CJ0673",
    "operative_parts_combined": "1. Consent cannot be obtained through pre-ticked boxes. 2. Consent must be specific and informed for all processing purposes.",
    "operative_parts_individual": [
      "Consent cannot be obtained through pre-ticked boxes",
      "Consent must be specific and informed for all processing purposes"
    ],
    "created_at": "2024-01-15T13:20:00Z",
    "updated_at": "2024-01-15T13:20:00Z",
    "operative_parts": [
      {
        "id": "uuid-op-planet49-1",
        "case_law_id": "uuid-case-planet49",
        "part_number": 1,
        "verbatim_text": "Consent within the meaning of Article 4(11) of Regulation 2016/679 cannot be obtained by means of a pre-ticked checkbox which the data subject must untick to refuse his or her consent.",
        "simplified_text": "Consent cannot be obtained through pre-ticked boxes.",
        "markdown_content": "**Consent** within the meaning of Article 4(11) of Regulation 2016/679 **cannot be obtained by means of a pre-ticked checkbox** which the data subject must untick to refuse his or her consent.",
        "created_at": "2024-01-15T13:20:00Z",
        "updated_at": "2024-01-15T13:20:00Z"
      }
    ]
  }
]
```

#### Empty Response (No Cases Found)
```json
[]
```

## Error Responses

### 400 - Invalid Article ID
```json
{
  "error": "Invalid article ID format",
  "code": "INVALID_PARAMETER"
}
```

**When this occurs**: Article ID is not a valid UUID format

### 500 - Database Error
```json
{
  "error": "Database query failed",
  "code": "DATABASE_ERROR"
}
```

**When this occurs**: Supabase connection issues or complex join query errors

### 500 - Internal Server Error
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

**When this occurs**: Unexpected server errors during data processing

## Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Cases retrieved successfully (including empty array) |
| 400 | Bad Request | Invalid article ID format |
| 500 | Server Error | Database or server error |

**Note**: This endpoint returns 200 with an empty array if no cases interpret the article, rather than 404.

## Data Processing

### Complex Database Query
The endpoint uses a sophisticated query to find cases through the junction table:

```sql
-- Simplified representation of the query
SELECT 
  case_laws.*,
  operative_parts.*
FROM operative_part_interprets_article
JOIN operative_parts ON operative_parts.id = operative_part_interprets_article.operative_part_id
JOIN case_laws ON case_laws.id = operative_parts.case_law_id
WHERE operative_part_interprets_article.article_id = $1
```

### Data Aggregation
The endpoint performs client-side aggregation:

1. **Operative Parts Collection**: Gathers all operative parts that interpret the article
2. **Case Grouping**: Groups operative parts by their parent case
3. **Deduplication**: Ensures each case appears once with all relevant operative parts
4. **Structure Transformation**: Converts relational data to nested case/operative-parts structure

## Performance Considerations

- **Complex Join Query**: Three-table join with potential for large result sets
- **Client-Side Processing**: JavaScript aggregation of database results
- **Memory Usage**: All cases and operative parts held in memory during processing
- **Response Size**: Can be large for frequently interpreted articles

⚠️ **Performance Concerns**:
- No pagination for cases (could return 100+ cases for popular articles)
- No query optimization beyond basic Supabase indexing
- Large operative parts text content increases response size

## Legal Research Context

### Use Cases

1. **Case Law Research**
   ```javascript
   // Lawyer researching how GDPR Article 6 has been interpreted
   const cases = await fetch('/api/articles/uuid-article-6-gdpr/cases')
     .then(res => res.json())
   
   // Analyze judicial interpretation trends
   cases.forEach(case => {
     console.log(`${case.date_of_judgment}: ${case.title}`)
     case.operative_parts.forEach(op => {
       console.log(`Ruling: ${op.simplified_text}`)
     })
   })
   ```

2. **Legal Precedent Analysis**
   ```javascript
   // Finding binding precedents for specific legal provision
   const article7Cases = await fetch('/api/articles/uuid-article-7-charter/cases')
     .then(res => res.json())
   
   // Sort by date to see evolution of interpretation
   const chronologicalCases = article7Cases.sort((a, b) => 
     new Date(a.date_of_judgment) - new Date(b.date_of_judgment)
   )
   ```

3. **Judicial Interpretation Comparison**
   ```javascript
   // Comparing different courts' interpretations
   const cases = await fetchArticleCases(articleId)
   
   const courtOfJusticeCases = cases.filter(c => c.court === 'Court of Justice')
   const generalCourtCases = cases.filter(c => c.court === 'General Court')
   
   console.log(`Court of Justice: ${courtOfJusticeCases.length} cases`)
   console.log(`General Court: ${generalCourtCases.length} cases`)
   ```

4. **Legal Writing & Citations**
   ```javascript
   // Generating citations for legal documents
   const cases = await fetchArticleCases(articleId)
   
   const recentCases = cases
     .filter(c => new Date(c.date_of_judgment) > new Date('2020-01-01'))
     .map(c => `${c.title}, Case ${c.case_id_text}, ${c.date_of_judgment}`)
   ```

### Legal Significance

This endpoint is crucial for legal research because:

- **Judicial Interpretation**: Shows how courts have interpreted specific legal provisions
- **Legal Precedent**: Identifies binding precedents for legal arguments
- **Compliance Guidance**: Provides practical guidance on how law is applied
- **Legal Evolution**: Tracks how interpretation has evolved over time

### Data Relationships
- **Article → Operative Parts**: Many-to-many via junction table
- **Operative Parts → Cases**: Many-to-one (parts belong to cases)
- **Legal Hierarchy**: Case law interprets and applies legislative provisions
- **Precedent Chain**: Later cases often reference earlier interpretations

## Security Considerations

⚠️ **SECURITY PLACEHOLDER NOTES**:

1. **No Access Control**: Anyone can see which cases interpret any article
2. **Data Exposure**: Full case content and operative parts exposed
3. **No Rate Limiting**: Complex query can be repeatedly executed
4. **Information Disclosure**: May reveal patterns in legal interpretations

## Caching Recommendations

⚠️ **NOT CURRENTLY IMPLEMENTED**:

```javascript
// High-value caching target due to complex query
const cacheConfig = {
  duration: '6 hours',        // Cases added infrequently
  invalidation: 'on_case_update', // When new cases added
  vary: ['article_id'],       // Cache per article
  tags: ['article_cases', articleId],
  compression: true           // Large response sizes
}
```

## Testing

### Unit Tests
```typescript
describe('GET /api/articles/:id/cases', () => {
  it('should return cases interpreting the article', async () => {
    const response = await request(app)
      .get('/api/articles/article-with-cases/cases')
      .expect(200)
    
    expect(Array.isArray(response.body)).toBe(true)
    
    if (response.body.length > 0) {
      const firstCase = response.body[0]
      expect(firstCase.id).toBeDefined()
      expect(firstCase.operative_parts).toBeDefined()
      expect(Array.isArray(firstCase.operative_parts)).toBe(true)
    }
  })

  it('should return empty array for articles with no cases', async () => {
    const response = await request(app)
      .get('/api/articles/article-without-cases/cases')
      .expect(200)
    
    expect(response.body).toEqual([])
  })

  it('should group operative parts by case correctly', async () => {
    const response = await request(app)
      .get('/api/articles/article-with-multiple-parts/cases')
      .expect(200)
    
    // Verify that cases with multiple operative parts are grouped
    const casesWithMultipleParts = response.body.filter(
      case => case.operative_parts.length > 1
    )
    
    if (casesWithMultipleParts.length > 0) {
      const case = casesWithMultipleParts[0]
      expect(case.operative_parts.length).toBeGreaterThan(1)
      
      // All operative parts should belong to the same case
      case.operative_parts.forEach(op => {
        expect(op.case_law_id).toBe(case.id)
      })
    }
  })

  it('should handle non-existent article ID gracefully', async () => {
    const response = await request(app)
      .get('/api/articles/non-existent-uuid/cases')
      .expect(200)
    
    expect(response.body).toEqual([])
  })
})
```

### Integration Tests
- Test with articles that have many interpreting cases
- Verify correct grouping of operative parts within cases
- Test with articles from different legislation types
- Validate data consistency with `/api/cases/{id}` endpoint

## Known Issues & Limitations

⚠️ **CURRENT LIMITATIONS**:

1. **No Pagination**: Could return hundreds of cases for popular articles
2. **No Sorting Options**: Cases returned in database order, not chronological
3. **No Filtering**: Cannot filter by court, date range, or case type
4. **Large Responses**: Can return very large JSON for articles with many interpretations
5. **No Summary Stats**: Doesn't provide count or summary information
6. **Duplicate Content**: Full case content included (may be excessive for some use cases)

## Integration with Other Endpoints

### Typical Research Workflow
```javascript
// Complete legal research workflow
// 1. Get article details
const article = await fetch('/api/articles/uuid-article-6-gdpr')
  .then(res => res.json())

// 2. Get interpreting cases (this endpoint)
const cases = await fetch(`/api/articles/${article.id}/cases`)
  .then(res => res.json())

// 3. Deep-dive into specific case
const detailedCase = await fetch(`/api/cases/${cases[0].id}`)
  .then(res => res.json())

// 4. Generate research report
const report = await fetch('/api/reports/generate', {
  method: 'POST',
  body: JSON.stringify({
    title: `Case Law Analysis: ${article.article_number_text}`,
    articles: [article.id],
    includeOperativeParts: true,
    operativePartsMode: 'simplified'
  })
})
```

## Changelog

### v1.0.0 (Current)
- Complex junction table query to find interpreting cases
- Client-side aggregation to group operative parts by case
- Full case and operative part details in response
- Error handling for database query failures

### Future Enhancements
- **Pagination Support**: Paginate through large case lists
- **Sorting Options**: Sort by date, relevance, court type
- **Filtering Capabilities**: Filter by date range, court, case type
- **Summary Information**: Include case count and interpretation statistics
- **Response Optimization**: Option to return summary data only

---

*Endpoint: `/src/app/api/articles/[id]/cases/route.ts`*  
*Last Updated: July 21, 2025*  
*Status: Production Ready - Core Legal Research Functionality*