import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withValidation, commonSchemas } from '@/lib/validation'

// Enhanced validation schema for search
const searchSchema = {
  ...commonSchemas.search,
  ...commonSchemas.pagination,
  context: {
    type: 'uuid' as const, // Optional legislation_id for scoped search
    required: false
  }
}

async function searchHandler(request: NextRequest, validatedData: any) {
  try {
    const { q: query, type, limit = 10, context } = validatedData

    const results = []

    // Search legislation
    if (!type || type === 'all' || type === 'legislation') {
      const { data: legislations, error: legError } = await supabase
        .from('legislations')
        .select('id, title, celex_number, summary, document_type')
        .textSearch('title', query)
        .limit(type === 'legislation' ? limit : Math.floor(limit / 3))

      if (!legError && legislations) {
        results.push(...legislations.map(item => ({
          id: item.id,
          title: item.title,
          type: 'legislation' as const,
          subtitle: item.celex_number,
          snippet: item.summary,
          metadata: { document_type: item.document_type }
        })))
      }
    }

    // Search case laws
    if (!type || type === 'all' || type === 'cases') {
      const { data: cases, error: casesError } = await supabase
        .from('case_laws')
        .select('id, title, case_id_text, parties, summary_text, court')
        .textSearch('title', query)
        .limit(type === 'cases' ? limit : Math.floor(limit / 3))

      if (!casesError && cases) {
        results.push(...cases.map(item => ({
          id: item.id,
          title: item.title,
          type: 'case' as const,
          subtitle: item.case_id_text,
          snippet: item.summary_text || item.parties,
          metadata: { court: item.court }
        })))
      }
    }

    // Search articles
    if (!type || type === 'all' || type === 'articles') {
      let articlesQuery = supabase
        .from('articles')
        .select(`
          id, 
          title, 
          article_number_text, 
          markdown_content,
          legislation:legislations(title, celex_number)
        `)
        .textSearch('title', query)

      // Apply context filter if searching within specific legislation
      if (context) {
        articlesQuery = articlesQuery.eq('legislation_id', context)
      }

      const { data: articles, error: articlesError } = await articlesQuery
        .limit(type === 'articles' ? limit : Math.floor(limit / 3))

      if (!articlesError && articles) {
        results.push(...articles.map((item: any) => ({
          id: item.id,
          title: `${item.article_number_text}${item.title ? ` - ${item.title}` : ''}`,
          type: 'article' as const,
          subtitle: item.legislation?.title || 'Unknown legislation',
          snippet: item.markdown_content?.substring(0, 150) + '...',
          metadata: { 
            celex_number: item.legislation?.celex_number,
            article_number_text: item.article_number_text 
          }
        })))
      }
    }

    // Sort results by relevance (simple title match scoring for now)
    const scoredResults = results.map(result => ({
      ...result,
      score: calculateRelevanceScore(result.title, query)
    })).sort((a, b) => b.score - a.score)

    return NextResponse.json({
      query,
      results: scoredResults.slice(0, limit),
      total: scoredResults.length
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

function calculateRelevanceScore(title: string, query: string): number {
  const titleLower = title.toLowerCase()
  const queryLower = query.toLowerCase()
  
  // Exact match gets highest score
  if (titleLower.includes(queryLower)) {
    return 10
  }
  
  // Word match scoring
  const queryWords = queryLower.split(' ')
  const titleWords = titleLower.split(' ')
  
  let score = 0
  queryWords.forEach(queryWord => {
    titleWords.forEach(titleWord => {
      if (titleWord.includes(queryWord)) {
        score += queryWord.length / titleWord.length
      }
    })
  })
  
  return score
}

// Export the validated handler
export const GET = withValidation(searchSchema, searchHandler)