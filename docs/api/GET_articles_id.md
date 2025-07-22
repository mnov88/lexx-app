# Article Details API - GET /api/articles/{id}

## Endpoint Information
- **Path**: `/api/articles/{id}`
- **Method**: `GET`
- **Description**: Retrieve detailed information about a specific EU legal article including its parent legislation
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
| id | `string` | ✅ | Article UUID identifier | `uuid-article-123-456` |

### Request Examples

#### Basic Request
```bash
curl -X GET "http://localhost:3000/api/articles/uuid-article-123-456" \
  -H "Accept: application/json"
```

#### JavaScript/Fetch
```javascript
const response = await fetch('/api/articles/uuid-article-6-gdpr')
const articleData = await response.json()
```

#### Legal Research Context
```javascript
// Lawyer researching GDPR Article 6 (lawfulness of processing)
const articleResponse = await fetch('/api/articles/uuid-article-6-gdpr')
const article = await articleResponse.json()

console.log(`Researching: ${article.article_number_text} - ${article.title}`)
console.log(`From: ${article.legislation.title}`)
```

## Response

### Success Response (200)
```typescript
interface ArticleDetailsResponse extends Article {
  legislation: Legislation
}

interface Article {
  id: string
  legislation_id: string
  article_number: number | null
  article_number_text: string      // "Article 6", "Article 6(1)(a)"
  title: string
  filename: string | null
  markdown_content: string | null  // Full article text in markdown
  created_at: string
  updated_at: string
}

interface Legislation {
  id: string
  celex_number: string            // EU CELEX identifier
  title: string
  publication_date: string | null
  document_type: string | null    // "Regulation", "Directive", etc.
  summary: string | null
  source_url: string | null
  full_markdown_content: string | null
  created_at: string
  updated_at: string
}
```

### Response Examples

#### GDPR Article 6 Example
```json
{
  "id": "uuid-article-6-gdpr",
  "legislation_id": "uuid-gdpr-123",
  "article_number": 6,
  "article_number_text": "Article 6",
  "title": "Lawfulness of processing",
  "filename": "gdpr-article-6.md",
  "markdown_content": "1. Processing shall be lawful only if and to the extent that at least one of the following applies:\n\n(a) the data subject has given consent to the processing of his or her personal data for one or more specific purposes;\n\n(b) processing is necessary for the performance of a contract to which the data subject is party or in order to take steps at the request of the data subject prior to entering into a contract;\n\n(c) processing is necessary for compliance with a legal obligation to which the controller is subject;\n\n(d) processing is necessary in order to protect the vital interests of the data subject or of another natural person;\n\n(e) processing is necessary for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller;\n\n(f) processing is necessary for the purposes of the legitimate interests pursued by the controller or by a third party, except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject which require protection of personal data, in particular where the data subject is a child.",
  "created_at": "2024-01-10T09:15:00Z",
  "updated_at": "2024-01-10T09:15:00Z",
  "legislation": {
    "id": "uuid-gdpr-123",
    "celex_number": "32016R0679",
    "title": "General Data Protection Regulation",
    "publication_date": "2016-05-04",
    "document_type": "Regulation",
    "summary": "Regulation on the protection of natural persons with regard to the processing of personal data and on the free movement of such data",
    "source_url": "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
    "full_markdown_content": null,
    "created_at": "2024-01-10T09:00:00Z",
    "updated_at": "2024-01-10T09:00:00Z"
  }
}
```

#### Charter Article 7 Example
```json
{
  "id": "uuid-article-7-charter",
  "legislation_id": "uuid-charter-123",
  "article_number": 7,
  "article_number_text": "Article 7",
  "title": "Respect for private and family life",
  "filename": "charter-article-7.md",
  "markdown_content": "Everyone has the right to respect for his or her private and family life, home and communications.",
  "created_at": "2024-01-10T08:00:00Z",
  "updated_at": "2024-01-10T08:00:00Z",
  "legislation": {
    "id": "uuid-charter-123",
    "celex_number": "12012P/TXT",
    "title": "Charter of Fundamental Rights of the European Union",
    "publication_date": "2012-10-26",
    "document_type": "Charter",
    "summary": "The Charter sets out the fundamental rights and freedoms recognised in the EU",
    "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:12012P/TXT",
    "full_markdown_content": null,
    "created_at": "2024-01-10T08:00:00Z",
    "updated_at": "2024-01-10T08:00:00Z"
  }
}
```

#### Complex Article Number Example
```json
{
  "id": "uuid-article-6-1-a-gdpr",
  "legislation_id": "uuid-gdpr-123",
  "article_number": 6,
  "article_number_text": "Article 6(1)(a)",
  "title": "Consent as legal basis",
  "filename": "gdpr-article-6-1-a.md",
  "markdown_content": "the data subject has given consent to the processing of his or her personal data for one or more specific purposes;",
  "created_at": "2024-01-10T09:16:00Z",
  "updated_at": "2024-01-10T09:16:00Z",
  "legislation": {
    "id": "uuid-gdpr-123",
    "celex_number": "32016R0679",
    "title": "General Data Protection Regulation",
    "publication_date": "2016-05-04",
    "document_type": "Regulation",
    "summary": "Regulation on the protection of natural persons with regard to the processing of personal data and on the free movement of such data",
    "source_url": "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
    "full_markdown_content": null,
    "created_at": "2024-01-10T09:00:00Z",
    "updated_at": "2024-01-10T09:00:00Z"
  }
}
```

## Error Responses

### 404 - Article Not Found
```json
{
  "error": "Article not found",
  "code": "NOT_FOUND"
}
```

**When this occurs**: The article ID doesn't exist in the database

### 400 - Invalid Article ID Format
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

**When this occurs**: Unexpected server errors during data retrieval

## Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Article found and returned successfully |
| 400 | Bad Request | Invalid article ID format |
| 404 | Not Found | Article doesn't exist |
| 500 | Server Error | Database or server error |

## Data Structure

### Article Number Handling
The API handles various EU legal article numbering formats:

| Format | Example | Description |
|--------|---------|-------------|
| Simple | `Article 6` | Basic article number |
| Subsection | `Article 6(1)` | Article with paragraph |
| Sub-subsection | `Article 6(1)(a)` | Article with paragraph and point |
| Complex | `Article 51(1), second subparagraph` | Complex legal references |

### Legislation Types
Common EU document types included:

| Document Type | Description | Example |
|---------------|-------------|---------|
| `Regulation` | Directly applicable EU law | GDPR, DSA |
| `Directive` | Must be transposed by Member States | ePrivacy Directive |
| `Charter` | Fundamental rights | Charter of Fundamental Rights |
| `Treaty` | Primary EU law | TFEU, TEU |

## Performance Considerations

- **Simple Query**: Single database query with join
- **Response Size**: Varies based on article content length
- **Cache Friendly**: Article content rarely changes
- **Database Load**: Lightweight query, suitable for high frequency

⚠️ **Performance Notes**:
- No caching implemented
- Markdown content can be large (10KB+ for complex articles)
- No content compression

## Legal Research Context

### Use Cases

1. **Article Analysis**
   ```javascript
   // Lawyer studying specific GDPR provision
   const article = await fetch('/api/articles/uuid-article-6-gdpr')
     .then(res => res.json())
   
   // Display full article text for analysis
   console.log(article.markdown_content)
   
   // Get legislation context
   console.log(`Source: ${article.legislation.title} (${article.legislation.celex_number})`)
   ```

2. **Legal Citation Generation**
   ```javascript
   // Generate proper legal citation
   const article = await fetchArticle(articleId)
   const citation = `${article.article_number_text} of ${article.legislation.title}`
   // Result: "Article 6 of General Data Protection Regulation"
   ```

3. **Cross-Reference Research**
   ```javascript
   // Starting point for finding related cases
   const article = await fetchArticle('uuid-article-7-charter')
   
   // Next: fetch interpreting case law
   const cases = await fetch(`/api/articles/${article.id}/cases`)
   ```

4. **Legal Writing Integration**
   ```javascript
   // Incorporating article text into legal documents
   const article = await fetchArticle(articleId)
   
   const legalText = `
   As established in ${article.article_number_text} of the ${article.legislation.title}:
   
   ${article.markdown_content}
   `
   ```

### Data Relationships
- **Article → Legislation**: Many-to-one (articles belong to legislation)
- **Article → Cases**: Many-to-many via `operative_part_interprets_article`
- **Legal Hierarchy**: Treaty > Charter > Regulation/Directive > Case Law

## Security Considerations

⚠️ **SECURITY PLACEHOLDER NOTES**:

1. **No Access Control**: Anyone can view any article
2. **Data Exposure**: Full article content returned (no field filtering)
3. **No Audit Logging**: No tracking of article access
4. **Content Injection**: Markdown content not sanitized (potential XSS risk)

## Caching Recommendations

⚠️ **NOT CURRENTLY IMPLEMENTED**:

```javascript
// Recommended caching strategy
const cacheConfig = {
  duration: '24 hours',       // Articles change infrequently
  invalidation: 'manual',     // When article content updated
  vary: ['Accept-Language'],  // Future multilingual support
  tags: ['article', articleId, legislationId]
}
```

## Testing

### Unit Tests
```typescript
describe('GET /api/articles/:id', () => {
  it('should return article with legislation details', async () => {
    const response = await request(app)
      .get('/api/articles/valid-article-uuid')
      .expect(200)
    
    expect(response.body.id).toBe('valid-article-uuid')
    expect(response.body.legislation).toBeDefined()
    expect(response.body.legislation.title).toBeDefined()
  })

  it('should return 404 for non-existent article', async () => {
    await request(app)
      .get('/api/articles/non-existent-uuid')
      .expect(404)
  })

  it('should include article content when available', async () => {
    const response = await request(app)
      .get('/api/articles/article-with-content')
      .expect(200)
    
    expect(response.body.markdown_content).toBeDefined()
    expect(typeof response.body.markdown_content).toBe('string')
  })

  it('should handle articles with complex numbering', async () => {
    const response = await request(app)
      .get('/api/articles/complex-article-uuid')
      .expect(200)
    
    expect(response.body.article_number_text).toMatch(/Article \d+(\(\d+\))?(\([a-z]\))?/)
  })
})
```

### Integration Tests
- Test with articles from different legislation types
- Verify legislation data consistency
- Test articles with various numbering formats
- Validate markdown content rendering

## Known Issues & Limitations

⚠️ **CURRENT LIMITATIONS**:

1. **No Multilingual Support**: Only one language version per article
2. **Large Content**: No truncation for very long articles
3. **Markdown Safety**: Content not sanitized for XSS protection
4. **No Versioning**: No historical versions of article content
5. **Limited Metadata**: Missing amendment dates, cross-references
6. **File References**: Filename field present but not used for actual file serving

## Integration with Other Endpoints

### Related Endpoint Workflows
```javascript
// Complete article research workflow
const article = await fetch('/api/articles/uuid-article-6-gdpr')
const articleData = await article.json()

// Get cases interpreting this article
const cases = await fetch(`/api/articles/${articleData.id}/cases`)
const casesData = await cases.json()

// Get navigation context (previous/next articles)
const navigation = await fetch(`/api/articles/${articleData.id}/navigation`)
const navData = await navigation.json()

// Include in comprehensive report
const report = await fetch('/api/reports/generate', {
  method: 'POST',
  body: JSON.stringify({
    title: `Analysis of ${articleData.article_number_text}`,
    articles: [articleData.id],
    includeOperativeParts: true
  })
})
```

## Changelog

### v1.0.0 (Current)
- Basic article retrieval with legislation details
- Support for complex article numbering formats
- Error handling for missing articles
- Join query to include parent legislation

### Future Enhancements
- **Multilingual Support**: Multiple language versions
- **Amendment Tracking**: Historical changes to articles
- **Cross-References**: Automatic linking to referenced articles
- **Content Sanitization**: XSS protection for markdown content

---

*Endpoint: `/src/app/api/articles/[id]/route.ts`*  
*Last Updated: July 21, 2025*  
*Status: Production Ready - Core Functionality Complete*