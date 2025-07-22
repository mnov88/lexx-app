# Case Details API - GET /api/cases/{id}

## Endpoint Information
- **Path**: `/api/cases/{id}`
- **Method**: `GET`
- **Description**: Retrieve detailed information about a specific CJEU case including operative parts and interpreted articles
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
| id | `string` | ✅ | Case UUID identifier | `uuid-case-123-456` |

### Request Examples

#### Basic Request
```bash
curl -X GET "http://localhost:3000/api/cases/uuid-case-123-456" \
  -H "Accept: application/json"
```

#### JavaScript/Fetch
```javascript
const response = await fetch('/api/cases/uuid-case-123-456')
const caseData = await response.json()
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

#### Complete Case Details
```json
{
  "id": "uuid-case-123-456",
  "celex_number": "62012CJ0131",
  "case_id_text": "C-131/12",
  "title": "Digital Rights Ireland and Others",
  "court": "Court of Justice",
  "date_of_judgment": "2014-04-08",
  "parties": "Digital Rights Ireland Ltd, Kärntner Landesregierung and Others",
  "summary_text": "Directive 2006/24/EC on the retention of data generated or processed in connection with the provision of publicly available electronic communications services is invalid.",
  "html_content": "<div>Full case HTML content...</div>",
  "plaintext_content": "Full case text content...",
  "html_content_link": "https://curia.europa.eu/juris/document/document.jsf?docid=150642",
  "plaintext_content_link": "https://curia.europa.eu/juris/document/document_print.jsf?docid=150642",
  "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62012CJ0131",
  "operative_parts_combined": "1. Directive 2006/24/EC is invalid. 2. The effects of the invalid directive are maintained until...",
  "operative_parts_individual": [
    "Directive 2006/24/EC is invalid",
    "The effects of the invalid directive are maintained until new legislation is adopted"
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T15:45:00Z",
  "operative_parts": [
    {
      "id": "uuid-op-789",
      "case_law_id": "uuid-case-123-456",
      "part_number": 1,
      "verbatim_text": "Directive 2006/24/EC of the European Parliament and of the Council of 15 March 2006 on the retention of data generated or processed in connection with the provision of publicly available electronic communications services or of public communications networks and amending Directive 2002/58/EC is invalid.",
      "simplified_text": "Directive 2006/24/EC is invalid.",
      "markdown_content": "**Directive 2006/24/EC** is declared invalid.",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "articles": [
        {
          "id": "uuid-article-456",
          "legislation_id": "uuid-charter-123",
          "article_number": 7,
          "article_number_text": "Article 7",
          "title": "Respect for private and family life",
          "filename": "charter-article-7.md",
          "markdown_content": "Everyone has the right to respect for his or her private and family life...",
          "created_at": "2024-01-15T08:00:00Z",
          "updated_at": "2024-01-15T08:00:00Z",
          "legislation": {
            "id": "uuid-charter-123",
            "celex_number": "12012P/TXT",
            "title": "Charter of Fundamental Rights of the European Union",
            "publication_date": "2012-10-26",
            "document_type": "Charter",
            "summary": "The Charter sets out the fundamental rights and freedoms...",
            "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:12012P/TXT",
            "created_at": "2024-01-10T09:00:00Z",
            "updated_at": "2024-01-10T09:00:00Z"
          }
        }
      ]
    }
  ],
  "interpreted_articles": [
    {
      "id": "uuid-article-456",
      "legislation_id": "uuid-charter-123",
      "article_number": 7,
      "article_number_text": "Article 7",
      "title": "Respect for private and family life",
      "filename": "charter-article-7.md",
      "markdown_content": "Everyone has the right to respect for his or her private and family life...",
      "created_at": "2024-01-15T08:00:00Z",
      "updated_at": "2024-01-15T08:00:00Z",
      "legislation": {
        "id": "uuid-charter-123",
        "celex_number": "12012P/TXT",
        "title": "Charter of Fundamental Rights of the European Union",
        "publication_date": "2012-10-26",
        "document_type": "Charter",
        "summary": "The Charter sets out the fundamental rights and freedoms...",
        "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:12012P/TXT",
        "created_at": "2024-01-10T09:00:00Z",
        "updated_at": "2024-01-10T09:00:00Z"
      },
      "operative_parts": [
        {
          "id": "uuid-op-789",
          "part_number": 1,
          "verbatim_text": "Directive 2006/24/EC of the European Parliament and of the Council... is invalid.",
          "simplified_text": "Directive 2006/24/EC is invalid."
        }
      ]
    }
  ]
}
```

## Error Responses

### 404 - Case Not Found
```json
{
  "error": "Case not found",
  "code": "NOT_FOUND"
}
```

**When this occurs**: The case ID doesn't exist in the database

### 400 - Invalid Case ID Format
```json
{
  "error": "Invalid case ID format",
  "code": "INVALID_PARAMETER"
}
```

**When this occurs**: Case ID is not a valid UUID format

### 500 - Database Error
```json
{
  "error": "Database connection failed",
  "code": "DATABASE_ERROR"
}
```

**When this occurs**: Supabase connection issues or query errors

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
| 200 | OK | Case found and returned successfully |
| 400 | Bad Request | Invalid case ID format |
| 404 | Not Found | Case doesn't exist |
| 500 | Server Error | Database or server error |

## Data Processing

### Complex Joins
The endpoint performs complex database joins to gather related data:

```sql
-- Simplified version of the actual query
SELECT 
  case_laws.*,
  operative_parts.*,
  articles.*,
  legislations.*
FROM case_laws
JOIN operative_parts ON operative_parts.case_law_id = case_laws.id
JOIN operative_part_interprets_article ON operative_part_interprets_article.operative_part_id = operative_parts.id
JOIN articles ON articles.id = operative_part_interprets_article.article_id  
JOIN legislations ON legislations.id = articles.legislation_id
WHERE case_laws.id = $1
```

### Data Transformation
The endpoint transforms the relational data into a nested structure:

1. **Operative Parts Enhancement**: Each operative part includes its interpreted articles
2. **Article Aggregation**: Creates a deduplicated list of interpreted articles
3. **Cross-Reference Mapping**: Maps which operative parts interpret which articles

## Performance Considerations

- **Complex Query**: Single query with multiple joins reduces N+1 problems
- **Data Volume**: Large cases with many operative parts may have significant response sizes
- **Processing Time**: JavaScript data transformation adds processing overhead
- **Memory Usage**: Holds full case data in memory during processing

⚠️ **Performance Notes**:
- No caching implemented
- No query optimization beyond basic Supabase capabilities
- Large cases (>100 operative parts) may be slow

## Legal Research Context

### Use Cases

1. **Case Analysis**
   ```javascript
   // Lawyer analyzing a specific CJEU case
   const caseDetails = await fetch(`/api/cases/${caseId}`)
   const { operative_parts, interpreted_articles } = await caseDetails.json()
   
   // Show operative parts with simplified text for readability
   operative_parts.forEach(op => {
     console.log(op.simplified_text || op.verbatim_text)
   })
   ```

2. **Cross-Reference Research**
   ```javascript
   // Finding which articles this case interprets
   const { interpreted_articles } = await caseDetails.json()
   interpreted_articles.forEach(article => {
     console.log(`${article.article_number_text}: ${article.title}`)
     console.log(`From: ${article.legislation.title}`)
   })
   ```

3. **Legal Writing Integration**
   ```javascript
   // Getting citation-ready information
   const { celex_number, case_id_text, title, date_of_judgment } = caseDetails
   const citation = `${title}, Case ${case_id_text}, ECLI:EU:C:${date_of_judgment.split('-').join(':')}`
   ```

4. **Report Generation**
   ```javascript
   // Gathering data for legal reports
   const { operative_parts, interpreted_articles } = caseDetails
   const reportData = {
     caseTitle: title,
     rulings: operative_parts.map(op => ({
       ruling: op.simplified_text,
       articles: op.articles.map(a => a.article_number_text)
     }))
   }
   ```

### Data Relationships
- **Case → Operative Parts**: One-to-many (cases contain multiple rulings)
- **Operative Part → Articles**: Many-to-many via `operative_part_interprets_article`
- **Articles → Legislation**: Many-to-one (articles belong to legislation)
- **Legal Hierarchy**: EU Charter > Treaties > Regulations/Directives > Case Law

## Security Considerations

⚠️ **SECURITY PLACEHOLDER NOTES**:

1. **No Access Control**: Anyone can view any case (may expose sensitive legal data)
2. **No Audit Logging**: No tracking of who accesses which cases
3. **Data Exposure**: Full case content is returned (consider field filtering)
4. **SQL Injection**: Protected by Supabase parameterized queries

## Caching Recommendations

⚠️ **NOT CURRENTLY IMPLEMENTED**:

```javascript
// Recommended caching strategy
const cacheConfig = {
  duration: '1 hour',        // Cases rarely change
  invalidation: 'manual',    // When case content is updated
  vary: ['Accept-Language'], // Future multilingual support
  tags: ['case', caseId]     // For selective invalidation
}
```

## Testing

### Unit Tests
```typescript
describe('GET /api/cases/:id', () => {
  it('should return case with operative parts and articles', async () => {
    const response = await request(app)
      .get('/api/cases/valid-uuid-123')
      .expect(200)
    
    expect(response.body.id).toBe('valid-uuid-123')
    expect(Array.isArray(response.body.operative_parts)).toBe(true)
    expect(Array.isArray(response.body.interpreted_articles)).toBe(true)
  })

  it('should return 404 for non-existent case', async () => {
    await request(app)
      .get('/api/cases/non-existent-uuid')
      .expect(404)
  })

  it('should include article legislation details', async () => {
    const response = await request(app)
      .get('/api/cases/valid-uuid-123')
      .expect(200)
    
    const firstArticle = response.body.interpreted_articles[0]
    expect(firstArticle.legislation).toBeDefined()
    expect(firstArticle.legislation.title).toBeDefined()
  })
})
```

### Integration Tests
- Test with cases that have no operative parts
- Verify cases with multiple articles per operative part
- Test cases with no interpreted articles
- Validate data consistency across related endpoints

## Known Issues & Limitations

⚠️ **CURRENT LIMITATIONS**:

1. **Performance**: No pagination for operative parts (could be hundreds)
2. **Memory Usage**: Large cases load entirely into memory
3. **Data Duplication**: Articles appear in both `operative_parts[].articles` and `interpreted_articles`
4. **No Filtering**: Returns all data regardless of client needs
5. **Language Support**: No multilingual content support
6. **Version Control**: No tracking of case content changes over time

## Changelog

### v1.0.0 (Current)
- Full case details with operative parts and interpreted articles
- Complex join query to minimize database roundtrips
- Data transformation to create clean nested structure
- Error handling for missing cases

---

*Endpoint: `/src/app/api/cases/[id]/route.ts`*  
*Last Updated: July 21, 2025*  
*Status: Development - Needs Production Optimizations*