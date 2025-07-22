# Article Navigation API - GET /api/articles/{id}/navigation

## Endpoint Information
- **Path**: `/api/articles/{id}/navigation`
- **Method**: `GET`
- **Description**: Retrieve navigation context for a specific article, including previous/next articles within the same legislation and position information
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
curl -X GET "http://localhost:3000/api/articles/uuid-article-6-gdpr/navigation" \
  -H "Accept: application/json"
```

#### JavaScript/Fetch
```javascript
const response = await fetch('/api/articles/uuid-article-6-gdpr/navigation')
const navigation = await response.json()
```

#### Legal Research Context
```javascript
// Lawyer navigating through GDPR articles systematically
const articleId = 'uuid-article-6-gdpr'
const navigation = await fetch(`/api/articles/${articleId}/navigation`)
  .then(res => res.json())

console.log(`Article ${navigation.position.current} of ${navigation.position.total}`)

// Navigate to next article for sequential study
if (navigation.next) {
  console.log(`Next: ${navigation.next.article_number_text} - ${navigation.next.title}`)
  // Load next article for continuous reading
  const nextArticle = await fetch(`/api/articles/${navigation.next.id}`)
    .then(res => res.json())
}

// Navigate to previous article for comparison
if (navigation.previous) {
  console.log(`Previous: ${navigation.previous.article_number_text} - ${navigation.previous.title}`)
}
```

## Response

### Success Response (200)
```typescript
interface ArticleNavigationResponse {
  previous: NavigationArticle | null    // Previous article in sequence
  next: NavigationArticle | null        // Next article in sequence
  position: {
    current: number                     // Current position (1-based)
    total: number                       // Total articles in legislation
  }
}

interface NavigationArticle {
  id: string
  article_number: number | null         // Numeric article number
  article_number_text: string          // "Article 6", "Article 6(1)(a)"
  title: string                         // Article title
}
```

### Response Examples

#### GDPR Article 6 Navigation
```json
{
  "previous": {
    "id": "uuid-article-5-gdpr",
    "article_number": 5,
    "article_number_text": "Article 5",
    "title": "Principles relating to processing of personal data"
  },
  "next": {
    "id": "uuid-article-7-gdpr",
    "article_number": 7,
    "article_number_text": "Article 7",
    "title": "Conditions for consent"
  },
  "position": {
    "current": 6,
    "total": 99
  }
}
```

#### First Article in Legislation (No Previous)
```json
{
  "previous": null,
  "next": {
    "id": "uuid-article-2-charter",
    "article_number": 2,
    "article_number_text": "Article 2",
    "title": "Right to life"
  },
  "position": {
    "current": 1,
    "total": 54
  }
}
```

#### Last Article in Legislation (No Next)
```json
{
  "previous": {
    "id": "uuid-article-98-gdpr",
    "article_number": 98,
    "article_number_text": "Article 98",
    "title": "Review of other Union legal acts on data protection"
  },
  "next": null,
  "position": {
    "current": 99,
    "total": 99
  }
}
```

#### Single Article Legislation
```json
{
  "previous": null,
  "next": null,
  "position": {
    "current": 1,
    "total": 1
  }
}
```

#### Complex Article Numbering
```json
{
  "previous": {
    "id": "uuid-article-6-1-gdpr",
    "article_number": 6,
    "article_number_text": "Article 6(1)",
    "title": "Lawfulness of processing - general conditions"
  },
  "next": {
    "id": "uuid-article-6-2-gdpr",
    "article_number": 6,
    "article_number_text": "Article 6(2)",
    "title": "Lawfulness of processing - public interest"
  },
  "position": {
    "current": 12,
    "total": 99
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

### 404 - Article Not Found in Legislation
```json
{
  "error": "Article not found in legislation",
  "code": "NOT_FOUND"
}
```

**When this occurs**: Article exists but couldn't be located within its parent legislation's article sequence

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

**When this occurs**: Unexpected server errors during navigation calculation

## Status Codes

| Code | Meaning | When Used |
|------|---------| ----------|
| 200 | OK | Navigation context retrieved successfully |
| 400 | Bad Request | Invalid article ID format |
| 404 | Not Found | Article doesn't exist |
| 500 | Server Error | Database or server error |

## Navigation Logic & Ordering

### Article Sequence Determination
The navigation follows the same ordering as the legislation's articles endpoint:

```sql
-- Simplified ordering logic
SELECT * FROM articles 
WHERE legislation_id = :legislation_id 
ORDER BY article_number ASC
```

### Position Calculation
- **Current Position**: 1-based index within the ordered article sequence
- **Previous Article**: Article at `current_position - 1`, null if first
- **Next Article**: Article at `current_position + 1`, null if last
- **Total Count**: Total number of articles in the same legislation

### Complex Article Numbering Handling
EU legislation often has complex article numbering:

| Article Number | Sorting Behavior | Navigation Impact |
|---------------|------------------|-------------------|
| `Article 1` | Sorted by numeric value `1` | Standard sequential navigation |
| `Article 6(1)` | Sorted by numeric value `6` | May not be perfectly sequential with subsections |
| `Article 6(2)` | Sorted by numeric value `6` | Groups with other Article 6 subsections |
| `Article 25` | Sorted by numeric value `25` | Continues numerical sequence |

⚠️ **Navigation Note**: Complex article numbering (with subsections) may not navigate in perfect legal reading order due to numeric sorting limitations.

## Performance Considerations

- **Multi-Step Query**: Requires finding current article, then querying all articles in legislation
- **Array Processing**: In-memory position calculation and neighbor identification
- **Database Load**: Moderate complexity, suitable for frequent navigation use
- **Response Size**: Minimal response size with essential navigation data only

⚠️ **Performance Notes**:
- **Two Database Queries**: First for current article, second for all legislation articles
- **Memory Processing**: Full article list loaded for position calculation
- **No Caching**: Navigation context calculated fresh each request
- **Legislation Size Impact**: Performance scales with number of articles in legislation

## Legal Research Context

### Use Cases

1. **Sequential Article Study**
   ```javascript
   // Lawyer systematically studying GDPR article by article
   let currentArticleId = 'uuid-article-1-gdpr'
   const studiedArticles = []
   
   while (currentArticleId) {
     // Study current article
     const article = await fetch(`/api/articles/${currentArticleId}`)
       .then(res => res.json())
     studiedArticles.push(article)
     
     // Get navigation to move to next
     const navigation = await fetch(`/api/articles/${currentArticleId}/navigation`)
       .then(res => res.json())
     
     console.log(`Studied ${navigation.position.current}/${navigation.position.total}: ${article.title}`)
     
     // Move to next article
     currentArticleId = navigation.next?.id || null
   }
   
   console.log(`Completed study of ${studiedArticles.length} articles`)
   ```

2. **Contextual Article Reading**
   ```javascript
   // Legal researcher understanding article in context of surrounding provisions
   const articleId = 'uuid-article-17-gdpr' // Right to erasure
   const navigation = await fetch(`/api/articles/${articleId}/navigation`)
     .then(res => res.json())
   
   // Read current article and its immediate context
   const contextArticles = await Promise.all([
     navigation.previous ? fetch(`/api/articles/${navigation.previous.id}`) : null,
     fetch(`/api/articles/${articleId}`),
     navigation.next ? fetch(`/api/articles/${navigation.next.id}`) : null
   ].filter(Boolean).map(req => req.then(res => res.json())))
   
   console.log('Reading Article 17 with context:')
   if (contextArticles[0] && contextArticles.length === 3) {
     console.log(`Previous: ${contextArticles[0].article_number_text} - ${contextArticles[0].title}`)
     console.log(`Current: ${contextArticles[1].article_number_text} - ${contextArticles[1].title}`)
     console.log(`Next: ${contextArticles[2].article_number_text} - ${contextArticles[2].title}`)
   }
   ```

3. **Article Navigation Interface**
   ```javascript
   // Building article navigation UI for legal research platform
   async function buildArticleNavigator(articleId) {
     const navigation = await fetch(`/api/articles/${articleId}/navigation`)
       .then(res => res.json())
     
     return {
       canGoPrevious: !!navigation.previous,
       canGoNext: !!navigation.next,
       previousLink: navigation.previous ? `/articles/${navigation.previous.id}` : null,
       nextLink: navigation.next ? `/articles/${navigation.next.id}` : null,
       progressIndicator: `${navigation.position.current} of ${navigation.position.total}`,
       breadcrumbs: [
         navigation.previous ? `${navigation.previous.article_number_text}` : null,
         'Current Article',
         navigation.next ? `${navigation.next.article_number_text}` : null
       ].filter(Boolean)
     }
   }
   ```

4. **Legislation Coverage Analysis**
   ```javascript
   // Legal audit checking coverage of legislation study
   async function analyzeLegislationCoverage(startingArticleId) {
     const navigation = await fetch(`/api/articles/${startingArticleId}/navigation`)
       .then(res => res.json())
     
     const totalArticles = navigation.position.total
     const currentProgress = navigation.position.current
     
     return {
       totalArticles: totalArticles,
       currentPosition: currentProgress,
       articlesRemaining: totalArticles - currentProgress,
       percentComplete: Math.round((currentProgress / totalArticles) * 100),
       isFirstArticle: currentProgress === 1,
       isLastArticle: currentProgress === totalArticles,
       needsSystematicReview: totalArticles > 50 // Large legislation needs structured approach
     }
   }
   ```

### Legal Significance
This endpoint enables lawyers to:
- **Navigate Systematically**: Move through legislation in proper legal sequence
- **Maintain Context**: Understand article relationships within legislative structure
- **Track Progress**: Monitor completion of comprehensive legislation study
- **Build Interfaces**: Create user-friendly navigation for legal research tools

### Integration with Legal Workflows
```javascript
// Complete article-by-article legal research workflow
async function comprehensiveArticleStudy(startingArticleId) {
  const researchResults = []
  let currentArticleId = startingArticleId
  
  while (currentArticleId) {
    // 1. Get current article details
    const article = await fetch(`/api/articles/${currentArticleId}`)
      .then(res => res.json())
    
    // 2. Get navigation context (this endpoint)
    const navigation = await fetch(`/api/articles/${currentArticleId}/navigation`)
      .then(res => res.json())
    
    // 3. Get cases interpreting this article
    const interpretingCases = await fetch(`/api/articles/${currentArticleId}/cases`)
      .then(res => res.json())
    
    // 4. Compile comprehensive article analysis
    const articleAnalysis = {
      article: article,
      position: navigation.position,
      interpretingCases: interpretingCases,
      legalContext: {
        previousArticle: navigation.previous?.title,
        nextArticle: navigation.next?.title,
        hasSignificantCaseLaw: interpretingCases.length > 0
      }
    }
    
    researchResults.push(articleAnalysis)
    
    console.log(`Analyzed ${navigation.position.current}/${navigation.position.total}: ${article.title}`)
    console.log(`  Interpreting cases: ${interpretingCases.length}`)
    
    // Move to next article
    currentArticleId = navigation.next?.id || null
  }
  
  // 5. Generate comprehensive legislation analysis report
  const report = await fetch('/api/reports/generate', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Comprehensive Article-by-Article Analysis',
      articles: researchResults.map(r => r.article.id),
      includeOperativeParts: true,
      includeNavigationContext: true,
      includeProgressTracking: true
    })
  })
  
  return {
    totalArticlesAnalyzed: researchResults.length,
    articlesWithCaseLaw: researchResults.filter(r => r.interpretingCases.length > 0).length,
    report: report
  }
}
```

## User Interface Integration

### Navigation Component Example
```javascript
// React component using this endpoint for article navigation
function ArticleNavigator({ articleId }) {
  const [navigation, setNavigation] = useState(null)
  
  useEffect(() => {
    fetch(`/api/articles/${articleId}/navigation`)
      .then(res => res.json())
      .then(setNavigation)
  }, [articleId])
  
  if (!navigation) return <div>Loading...</div>
  
  return (
    <div className="article-navigation">
      <div className="nav-progress">
        Article {navigation.position.current} of {navigation.position.total}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(navigation.position.current / navigation.position.total) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="nav-buttons">
        {navigation.previous ? (
          <Link href={`/articles/${navigation.previous.id}`} className="nav-btn previous">
            ← {navigation.previous.article_number_text}: {navigation.previous.title}
          </Link>
        ) : (
          <div className="nav-btn disabled">← Previous</div>
        )}
        
        {navigation.next ? (
          <Link href={`/articles/${navigation.next.id}`} className="nav-btn next">
            {navigation.next.article_number_text}: {navigation.next.title} →
          </Link>
        ) : (
          <div className="nav-btn disabled">Next →</div>
        )}
      </div>
    </div>
  )
}
```

## Security Considerations

⚠️ **SECURITY PLACEHOLDER NOTES**:

1. **No Access Control**: Anyone can discover article navigation structure
2. **Information Disclosure**: Reveals complete legislation article organization
3. **No Rate Limiting**: Can be used to map entire legislative structures

## Caching Recommendations

⚠️ **NOT CURRENTLY IMPLEMENTED**:

```javascript
// Ideal caching strategy for article navigation
const cacheConfig = {
  duration: '1 hour',          // Article structure changes very rarely
  invalidation: 'manual',      // Only when legislation structure updated
  tags: ['article_navigation', legislationId, articleId],
  vary: ['Accept-Encoding'],
  sizeLimit: '1KB'            // Very small responses
}

// Navigation responses are perfect for aggressive caching
// since article sequences rarely change
```

## Testing

### Unit Tests
```typescript
describe('GET /api/articles/:id/navigation', () => {
  it('should return navigation context for middle article', async () => {
    const response = await request(app)
      .get('/api/articles/middle-article-uuid/navigation')
      .expect(200)
    
    expect(response.body.previous).toBeDefined()
    expect(response.body.next).toBeDefined()
    expect(response.body.position.current).toBeGreaterThan(1)
    expect(response.body.position.total).toBeGreaterThan(response.body.position.current)
  })

  it('should return null previous for first article', async () => {
    const response = await request(app)
      .get('/api/articles/first-article-uuid/navigation')
      .expect(200)
    
    expect(response.body.previous).toBeNull()
    expect(response.body.next).toBeDefined()
    expect(response.body.position.current).toBe(1)
  })

  it('should return null next for last article', async () => {
    const response = await request(app)
      .get('/api/articles/last-article-uuid/navigation')
      .expect(200)
    
    expect(response.body.previous).toBeDefined()
    expect(response.body.next).toBeNull()
    expect(response.body.position.current).toBe(response.body.position.total)
  })

  it('should return valid position information', async () => {
    const response = await request(app)
      .get('/api/articles/valid-article-uuid/navigation')
      .expect(200)
    
    expect(typeof response.body.position.current).toBe('number')
    expect(typeof response.body.position.total).toBe('number')
    expect(response.body.position.current).toBeGreaterThan(0)
    expect(response.body.position.current).toBeLessThanOrEqual(response.body.position.total)
  })

  it('should return 404 for non-existent article', async () => {
    await request(app)
      .get('/api/articles/non-existent-uuid/navigation')
      .expect(404)
  })

  it('should include required navigation article fields', async () => {
    const response = await request(app)
      .get('/api/articles/article-with-neighbors/navigation')
      .expect(200)
    
    if (response.body.previous) {
      expect(typeof response.body.previous.id).toBe('string')
      expect(typeof response.body.previous.article_number_text).toBe('string')
      expect(typeof response.body.previous.title).toBe('string')
    }
    
    if (response.body.next) {
      expect(typeof response.body.next.id).toBe('string')
      expect(typeof response.body.next.article_number_text).toBe('string')
      expect(typeof response.body.next.title).toBe('string')
    }
  })
})
```

### Integration Tests
- Test navigation consistency across different legislation types
- Verify position calculations with various article numbering patterns
- Test navigation chain completeness (previous.next === current === next.previous)
- Validate integration with article details and article listing endpoints

### Performance Tests
```javascript
describe('GET /api/articles/:id/navigation - Performance', () => {
  it('should handle large legislation navigation efficiently', async () => {
    const start = Date.now()
    
    const response = await request(app)
      .get('/api/articles/article-in-large-legislation/navigation')
      .expect(200)
    
    const duration = Date.now() - start
    expect(duration).toBeLessThan(1000) // 1 second max
  })
})
```

## Known Issues & Limitations

⚠️ **CURRENT LIMITATIONS**:

1. **Complex Numbering Sort**: Articles with subsections may not sort in perfect legal reading order
2. **No Skip Navigation**: Cannot jump to specific article numbers or sections directly
3. **No Chapter Awareness**: Navigation doesn't respect legislative chapter/section boundaries
4. **Performance with Large Legislation**: Loads entire article list to calculate position
5. **No Contextual Grouping**: Cannot group related articles (e.g., all Article 6 subsections)

## Integration with Other Endpoints

### Complete Article Navigation Workflow
```javascript
// Building comprehensive article reading interface
async function buildArticleReader(articleId) {
  // 1. Get current article details
  const article = await fetch(`/api/articles/${articleId}`)
    .then(res => res.json())
  
  // 2. Get navigation context (this endpoint)
  const navigation = await fetch(`/api/articles/${articleId}/navigation`)
    .then(res => res.json())
  
  // 3. Get interpreting cases for current article
  const cases = await fetch(`/api/articles/${articleId}/cases`)
    .then(res => res.json())
  
  // 4. Get parent legislation context
  const legislation = await fetch(`/api/legislations/${article.legislation_id}`)
    .then(res => res.json())
  
  return {
    article: article,
    navigation: navigation,
    interpretingCases: cases,
    parentLegislation: legislation,
    
    // Navigation helpers
    hasNavigation: !!(navigation.previous || navigation.next),
    isComplete: navigation.position.current === navigation.position.total,
    progressPercent: Math.round((navigation.position.current / navigation.position.total) * 100),
    
    // Research context
    needsCaseLawReview: cases.length > 0,
    isSignificantProvision: cases.length > 5,
    isFoundationalArticle: navigation.position.current <= 5
  }
}
```

## Changelog

### v1.0.0 (Current)
- Basic article navigation with previous/next articles
- Position tracking within legislation context
- Article sequence following numeric ordering
- Comprehensive navigation context for UI integration

### Future Enhancements
- **Chapter-Aware Navigation**: Navigate by legislative chapters/sections
- **Skip Navigation**: Jump to specific article numbers or sections
- **Smart Ordering**: Improved sorting for complex article numbering
- **Contextual Grouping**: Group related articles (subsections, themes)
- **Performance Optimization**: Cache article sequences per legislation

---

*Endpoint: `/src/app/api/articles/[id]/navigation/route.ts`*  
*Last Updated: July 21, 2025*  
*Status: Production Ready - Core UI Navigation, Needs Smart Ordering Enhancements*