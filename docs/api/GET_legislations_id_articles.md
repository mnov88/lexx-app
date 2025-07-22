# Legislation Articles API - GET /api/legislations/{id}/articles

## Endpoint Information
- **Path**: `/api/legislations/{id}/articles`
- **Method**: `GET`
- **Description**: Retrieve all articles within a specific EU legislation document, ordered by article number for navigation
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
| id | `string` | ✅ | Legislation UUID identifier | `uuid-gdpr-123-456` |

### Request Examples

#### Basic Request
```bash
curl -X GET "http://localhost:3000/api/legislations/uuid-gdpr-123/articles" \
  -H "Accept: application/json"
```

#### JavaScript/Fetch
```javascript
const response = await fetch('/api/legislations/uuid-gdpr-123/articles')
const articles = await response.json()
```

#### Legal Research Context
```javascript
// Lawyer browsing all GDPR articles for comprehensive study
const gdprArticles = await fetch('/api/legislations/uuid-gdpr-123/articles')
  .then(res => res.json())

console.log(`GDPR contains ${gdprArticles.length} articles`)

// Find specific articles by content
const consentArticles = gdprArticles.filter(article => 
  article.title.toLowerCase().includes('consent') ||
  article.markdown_content?.toLowerCase().includes('consent')
)

console.log(`${consentArticles.length} articles mention consent`)
```

## Response

### Success Response (200)
```typescript
type LegislationArticlesResponse = Article[]

interface Article {
  id: string
  legislation_id: string
  article_number: number | null
  article_number_text: string      // "Article 6", "Article 6(1)(a)"
  title: string
  filename: string | null
  markdown_content: string | null  // Full article text
  created_at: string
  updated_at: string
}
```

### Response Examples

#### GDPR Articles (First 10)
```json
[
  {
    "id": "uuid-article-1-gdpr",
    "legislation_id": "uuid-gdpr-123",
    "article_number": 1,
    "article_number_text": "Article 1",
    "title": "Subject-matter and objectives",
    "filename": "gdpr-article-1.md",
    "markdown_content": "1. This Regulation lays down rules relating to the protection of natural persons with regard to the processing of personal data and rules relating to the free movement of personal data.\n\n2. This Regulation protects fundamental rights and freedoms of natural persons and in particular their right to the protection of personal data.\n\n3. The free movement of personal data within the Union shall be neither restricted nor prohibited for reasons connected with the protection of natural persons with regard to the processing of personal data.",
    "created_at": "2024-01-10T09:10:00Z",
    "updated_at": "2024-01-10T09:10:00Z"
  },
  {
    "id": "uuid-article-2-gdpr",
    "legislation_id": "uuid-gdpr-123",
    "article_number": 2,
    "article_number_text": "Article 2",
    "title": "Material scope",
    "filename": "gdpr-article-2.md",
    "markdown_content": "1. This Regulation applies to the processing of personal data wholly or partly by automated means and to the processing other than by automated means of personal data which form part of a filing system or are intended to form part of a filing system.\n\n2. This Regulation does not apply to the processing of personal data:\n(a) in the course of an activity which falls outside the scope of Union law;\n(b) by the Member States when carrying out activities which fall within the scope of Chapter 2 of Title V of the TEU;\n(c) by a natural person in the course of a purely personal or household activity;\n(d) by competent authorities for the purposes of the prevention, investigation, detection or prosecution of criminal offences or the execution of criminal penalties, including the safeguarding against and the prevention of threats to public security.",
    "created_at": "2024-01-10T09:11:00Z",
    "updated_at": "2024-01-10T09:11:00Z"
  },
  {
    "id": "uuid-article-6-gdpr",
    "legislation_id": "uuid-gdpr-123",
    "article_number": 6,
    "article_number_text": "Article 6",
    "title": "Lawfulness of processing",
    "filename": "gdpr-article-6.md",
    "markdown_content": "1. Processing shall be lawful only if and to the extent that at least one of the following applies:\n(a) the data subject has given consent to the processing of his or her personal data for one or more specific purposes;\n(b) processing is necessary for the performance of a contract to which the data subject is party or in order to take steps at the request of the data subject prior to entering into a contract;\n(c) processing is necessary for compliance with a legal obligation to which the controller is subject;\n(d) processing is necessary in order to protect the vital interests of the data subject or of another natural person;\n(e) processing is necessary for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller;\n(f) processing is necessary for the purposes of the legitimate interests pursued by the controller or by a third party, except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject which require protection of personal data, in particular where the data subject is a child.",
    "created_at": "2024-01-10T09:15:00Z",
    "updated_at": "2024-01-10T09:15:00Z"
  },
  {
    "id": "uuid-article-7-gdpr",
    "legislation_id": "uuid-gdpr-123",
    "article_number": 7,
    "article_number_text": "Article 7",
    "title": "Conditions for consent",
    "filename": "gdpr-article-7.md",
    "markdown_content": "1. Where processing is based on consent, the controller shall be able to demonstrate that the data subject has consented to processing of his or her personal data.\n\n2. If the data subject's consent is given in the context of a written declaration which also concerns other matters, the request for consent shall be presented in a manner which is clearly distinguishable from the other matters, in an intelligible and easily accessible form, using clear and plain language. Any part of such a declaration which constitutes an infringement of this Regulation shall not be binding.\n\n3. The data subject shall have the right to withdraw his or her consent at any time. The withdrawal of consent shall not affect the lawfulness of processing based on consent before its withdrawal. Prior to giving consent, the data subject shall be informed thereof. It shall be as easy to withdraw consent as it is to give consent.\n\n4. When assessing whether consent is freely given, utmost account shall be taken of whether, inter alia, the performance of a contract, including the provision of a service, is conditional on consent to the processing of personal data that is not necessary for the performance of that contract.",
    "created_at": "2024-01-10T09:16:00Z",
    "updated_at": "2024-01-10T09:16:00Z"
  }
]
```

#### Charter Articles Example
```json
[
  {
    "id": "uuid-article-1-charter",
    "legislation_id": "uuid-charter-123",
    "article_number": 1,
    "article_number_text": "Article 1",
    "title": "Human dignity",
    "filename": "charter-article-1.md",
    "markdown_content": "Human dignity is inviolable. It must be respected and protected.",
    "created_at": "2024-01-10T08:01:00Z",
    "updated_at": "2024-01-10T08:01:00Z"
  },
  {
    "id": "uuid-article-7-charter",
    "legislation_id": "uuid-charter-123",
    "article_number": 7,
    "article_number_text": "Article 7",
    "title": "Respect for private and family life",
    "filename": "charter-article-7.md",
    "markdown_content": "Everyone has the right to respect for his or her private and family life, home and communications.",
    "created_at": "2024-01-10T08:07:00Z",
    "updated_at": "2024-01-10T08:07:00Z"
  },
  {
    "id": "uuid-article-8-charter",
    "legislation_id": "uuid-charter-123",
    "article_number": 8,
    "article_number_text": "Article 8",
    "title": "Protection of personal data",
    "filename": "charter-article-8.md",
    "markdown_content": "1. Everyone has the right to the protection of personal data concerning him or her.\n\n2. Such data must be processed fairly for specified purposes and on the basis of the consent of the person concerned or some other legitimate basis laid down by law. Everyone has the right of access to data which has been collected concerning him or her, and the right to have it rectified.\n\n3. Compliance with these rules shall be subject to control by an independent authority.",
    "created_at": "2024-01-10T08:08:00Z",
    "updated_at": "2024-01-10T08:08:00Z"
  }
]
```

#### Empty Response (No Articles)
```json
[]
```

## Error Responses

### 400 - Invalid Legislation ID
```json
{
  "error": "Invalid legislation ID format",
  "code": "INVALID_PARAMETER"
}
```

**When this occurs**: Legislation ID is not a valid UUID format

### 500 - Database Error
```json
{
  "error": "Database query failed",
  "code": "DATABASE_ERROR"
}
```

**When this occurs**: Supabase connection issues or query execution errors

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
| 200 | OK | Articles retrieved successfully (including empty array) |
| 400 | Bad Request | Invalid legislation ID format |
| 500 | Server Error | Database or server error |

**Note**: This endpoint returns 200 with an empty array if the legislation has no articles, rather than 404.

## Data Structure & Ordering

### Article Numbering
EU legislation uses various article numbering patterns:

| Format | Example | Description |
|--------|---------|-------------|
| Sequential | `Article 1`, `Article 2` | Basic sequential numbering |
| Subsections | `Article 6(1)`, `Article 6(2)` | Articles with paragraphs |
| Sub-subsections | `Article 6(1)(a)`, `Article 6(1)(b)` | Detailed breakdowns |
| Complex | `Article 51(1), second subparagraph` | Complex legal references |

### Ordering Logic
Articles are returned in ascending order by `article_number`:
- Null article numbers appear first
- Then numbered articles in ascending order
- Complex numbering (like subsections) may not sort perfectly

⚠️ **Sorting Limitation**: Complex article numbering like "Article 6(1)(a)" may not sort in perfect legal order due to numeric sorting on the `article_number` field only.

### Content Availability
- **`markdown_content`**: May be null for articles without stored content
- **`filename`**: May be null, used for internal reference
- **Size Variation**: Articles range from short (Charter) to very long (complex regulations)

## Performance Considerations

- **Simple Query**: Single table query with WHERE and ORDER BY
- **Response Size**: Varies greatly by legislation (5-200 articles)
- **Content Size**: Large legislation with full article content can be 5MB+
- **Database Load**: Moderate query, suitable for frequent access

⚠️ **Performance Notes**:
- **Large Responses**: Complex legislation like GDPR returns 99 articles with full content
- **No Pagination**: Returns all articles at once
- **No Content Control**: Always includes full `markdown_content` fields
- **No Caching**: Every request hits database

## Legal Research Context

### Use Cases

1. **Legislation Structure Analysis**
   ```javascript
   // Legal researcher studying GDPR structure
   const gdprArticles = await fetch('/api/legislations/uuid-gdpr-123/articles')
     .then(res => res.json())
   
   // Analyze article distribution by chapter
   const chapterAnalysis = gdprArticles.reduce((acc, article) => {
     // Extract chapter info from article number patterns
     const chapterMatch = article.markdown_content?.match(/CHAPTER ([IVX]+)/)
     if (chapterMatch) {
       acc[chapterMatch[1]] = (acc[chapterMatch[1]] || 0) + 1
     }
     return acc
   }, {})
   
   console.log('Articles per chapter:', chapterAnalysis)
   ```

2. **Legal Research Navigation**
   ```javascript
   // Building table of contents for legislation study
   const articles = await fetchLegislationArticles(legislationId)
   
   const tableOfContents = articles.map(article => ({
     id: article.id,
     number: article.article_number_text,
     title: article.title,
     hasContent: !!article.markdown_content
   }))
   
   // Use for navigation in legal research interface
   ```

3. **Thematic Article Grouping**
   ```javascript
   // Grouping articles by legal themes
   const gdprArticles = await fetchGdprArticles()
   
   const thematicGroups = {
     principles: gdprArticles.filter(a => 
       a.article_number >= 1 && a.article_number <= 11),
     lawfulness: gdprArticles.filter(a => 
       a.article_number >= 6 && a.article_number <= 11),
     rights: gdprArticles.filter(a => 
       a.article_number >= 12 && a.article_number <= 23),
     obligations: gdprArticles.filter(a => 
       a.article_number >= 24 && a.article_number <= 43)
   }
   ```

4. **Cross-Reference Research Preparation**
   ```javascript
   // Preparing for comprehensive case law research
   const articles = await fetchLegislationArticles(legislationId)
   
   // Get case law for each article (batch processing)
   const articlesWithCases = await Promise.all(
     articles.slice(0, 10).map(async article => ({
       ...article,
       cases: await fetch(`/api/articles/${article.id}/cases`)
         .then(res => res.json())
     }))
   )
   
   // Identify most interpreted articles
   const mostInterpreted = articlesWithCases
     .sort((a, b) => b.cases.length - a.cases.length)
     .slice(0, 5)
   ```

### Legal Significance
This endpoint enables lawyers to:
- **Navigate Legislation**: Understand the structure and scope of EU laws
- **Identify Key Provisions**: Find relevant articles for specific legal issues
- **Research Comprehensively**: Ensure no relevant provisions are missed
- **Build Legal Arguments**: Reference complete legislative frameworks

### Integration with Legal Workflows
```javascript
// Complete legislation research workflow
// 1. Get legislation overview
const legislation = await fetch('/api/legislations/uuid-gdpr-123')

// 2. Get all articles (this endpoint)
const articles = await fetch(`/api/legislations/${legislation.id}/articles`)

// 3. Focus on specific articles of interest
const keyArticles = articles.filter(a => [6, 7, 17, 25].includes(a.article_number))

// 4. Get case law for key articles
const caseLawResearch = await Promise.all(
  keyArticles.map(article => 
    fetch(`/api/articles/${article.id}/cases`)
  )
)

// 5. Generate comprehensive report
const report = await fetch('/api/reports/generate', {
  method: 'POST',
  body: JSON.stringify({
    title: `${legislation.title} - Key Provisions Analysis`,
    articles: keyArticles.map(a => a.id),
    includeOperativeParts: true
  })
})
```

## Security Considerations

⚠️ **SECURITY PLACEHOLDER NOTES**:

1. **No Access Control**: Anyone can access all articles from any legislation
2. **Data Exposure**: Complete article content exposed without restrictions
3. **No Rate Limiting**: Can be used to scrape entire legislative databases
4. **Information Disclosure**: Reveals complete structure of EU legislation

## Caching Recommendations

⚠️ **NOT CURRENTLY IMPLEMENTED**:

```javascript
// Ideal caching strategy for article lists
const cacheConfig = {
  duration: '12 hours',        // Articles rarely change
  invalidation: 'manual',      // When articles updated or added
  compression: 'gzip',         // Important for large responses
  tags: ['legislation_articles', legislationId],
  vary: ['Accept-Encoding'],
  sizeLimit: '10MB'           // Handle large legislation
}
```

## Pagination Recommendations

⚠️ **NOT CURRENTLY IMPLEMENTED**:

```javascript
// Recommended for large legislation with 100+ articles
const paginationParams = {
  limit: 25,                   // Articles per page
  offset: 0,                   // Skip N articles
  include_content: false,      // Option to exclude large content
  fields: 'id,article_number_text,title' // Field selection
}

// Paginated response structure
const response = {
  data: [...],                 // Article array
  pagination: {
    total: 99,                 // Total articles in legislation
    limit: 25,
    offset: 0,
    hasMore: true
  },
  metadata: {
    legislation_id: 'uuid',
    legislation_title: 'GDPR'
  }
}
```

## Testing

### Unit Tests
```typescript
describe('GET /api/legislations/:id/articles', () => {
  it('should return articles ordered by article number', async () => {
    const response = await request(app)
      .get('/api/legislations/valid-legislation-uuid/articles')
      .expect(200)
    
    expect(Array.isArray(response.body)).toBe(true)
    
    if (response.body.length > 1) {
      const articleNumbers = response.body
        .filter(article => article.article_number !== null)
        .map(article => article.article_number)
      
      // Check ascending order
      for (let i = 1; i < articleNumbers.length; i++) {
        expect(articleNumbers[i]).toBeGreaterThanOrEqual(articleNumbers[i-1])
      }
    }
  })

  it('should return empty array for legislation with no articles', async () => {
    const response = await request(app)
      .get('/api/legislations/legislation-without-articles/articles')
      .expect(200)
    
    expect(response.body).toEqual([])
  })

  it('should include all required article fields', async () => {
    const response = await request(app)
      .get('/api/legislations/legislation-with-articles/articles')
      .expect(200)
    
    if (response.body.length > 0) {
      const article = response.body[0]
      
      expect(typeof article.id).toBe('string')
      expect(typeof article.legislation_id).toBe('string')
      expect(typeof article.article_number_text).toBe('string')
      expect(typeof article.title).toBe('string')
      expect(typeof article.created_at).toBe('string')
      expect(typeof article.updated_at).toBe('string')
      
      // Optional fields
      expect(['number', 'object']).toContain(typeof article.article_number)
      expect(['string', 'object']).toContain(typeof article.markdown_content)
      expect(['string', 'object']).toContain(typeof article.filename)
    }
  })

  it('should handle non-existent legislation ID gracefully', async () => {
    const response = await request(app)
      .get('/api/legislations/non-existent-uuid/articles')
      .expect(200)
    
    expect(response.body).toEqual([])
  })

  it('should handle complex article numbering', async () => {
    const response = await request(app)
      .get('/api/legislations/complex-legislation-uuid/articles')
      .expect(200)
    
    // Should include articles with various numbering formats
    const numberFormats = response.body.map(a => a.article_number_text)
    
    // Verify different numbering patterns exist
    expect(numberFormats.some(n => /^Article \d+$/.test(n))).toBe(true)
    if (numberFormats.length > 10) {
      expect(numberFormats.some(n => /^Article \d+\(\d+\)/.test(n))).toBe(true)
    }
  })
})
```

### Integration Tests
- Test with legislation containing different article number patterns
- Verify consistency with `/api/articles/{id}` endpoint data
- Test performance with large legislation (100+ articles)
- Validate article ordering across different legislation types

### Performance Tests
```javascript
describe('GET /api/legislations/:id/articles - Performance', () => {
  it('should handle large legislation efficiently', async () => {
    const start = Date.now()
    
    const response = await request(app)
      .get('/api/legislations/large-legislation-uuid/articles')
      .expect(200)
    
    const duration = Date.now() - start
    expect(duration).toBeLessThan(3000) // 3 second max
    
    // Should return substantial number of articles
    expect(response.body.length).toBeGreaterThan(50)
  })
})
```

## Known Issues & Limitations

⚠️ **CURRENT LIMITATIONS**:

1. **No Pagination**: Returns all articles regardless of count (can be 100+)
2. **Large Responses**: Complex legislation with full content can be 5-10MB
3. **Imperfect Sorting**: Complex article numbering may not sort in perfect legal order
4. **No Content Control**: Cannot exclude large `markdown_content` fields
5. **No Filtering**: Cannot filter articles by content, chapter, or theme
6. **No Field Selection**: Always returns all article fields
7. **Performance Impact**: Large responses can slow client applications

## Integration with Other Endpoints

### Complete Legislation Study Workflow
```javascript
// Comprehensive legislation research
// 1. Get legislation details
const legislation = await fetch('/api/legislations/uuid-gdpr-123')
  .then(res => res.json())

// 2. Get all articles (this endpoint)
const articles = await fetch(`/api/legislations/${legislation.id}/articles`)
  .then(res => res.json())

// 3. Study specific articles in detail
const keyArticles = articles.filter(a => [6, 7, 17].includes(a.article_number))
const detailedArticles = await Promise.all(
  keyArticles.map(a => fetch(`/api/articles/${a.id}`).then(res => res.json()))
)

// 4. Get case law for each key article
const caseLawAnalysis = await Promise.all(
  keyArticles.map(async article => ({
    article: article,
    cases: await fetch(`/api/articles/${article.id}/cases`).then(res => res.json())
  }))
)

// 5. Generate research report
const report = await fetch('/api/reports/generate', {
  method: 'POST',
  body: JSON.stringify({
    title: `${legislation.title} - Articles ${keyArticles.map(a => a.article_number).join(', ')}`,
    articles: keyArticles.map(a => a.id),
    includeOperativeParts: true,
    includeArticleText: true
  })
})
```

## Changelog

### v1.0.0 (Current)
- Basic article listing for legislation with article number ordering
- Complete article content inclusion
- Error handling for database failures
- Simple, reliable implementation

### Future Enhancements
- **Pagination Support**: Handle large legislation more efficiently
- **Content Control**: Option to exclude large content fields
- **Advanced Sorting**: Proper legal ordering for complex article numbers
- **Filtering Options**: Filter by article themes, chapters, or content
- **Field Selection**: Return only requested article fields
- **Chapter Grouping**: Group articles by legislative chapters/sections

---

*Endpoint: `/src/app/api/legislations/[id]/articles/route.ts`*  
*Last Updated: July 21, 2025*  
*Status: Production Ready - Core Navigation, Needs Optimization Features*