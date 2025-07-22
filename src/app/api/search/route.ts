import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withValidation, commonSchemas } from '@/lib/validation'
import { withCache } from '@/lib/cache'

// Enhanced validation schema for search
const searchSchema = {
  ...commonSchemas.search,
  ...commonSchemas.pagination,
  context: {
    type: 'uuid' as const, // Optional legislation_id for scoped search
    required: false
  },
  semantic: {
    type: 'boolean' as const, // Use vector similarity search
    required: false
  }
}

async function searchHandler(request: NextRequest, validatedData: any) {
  try {
    const { q: query, type, limit = 10, context, semantic = true } = validatedData

    const results = []
    
    // Enhanced legal search combining traditional and vector similarity
    if (semantic && (!type || type === 'all' || type === 'semantic')) {
      try {
        // First, get an embedding for the search query
        // Note: In production, you'd use OpenAI or similar service to generate embeddings
        // For now, we'll use Supabase's match_documents function if available
        
        const { data: semanticResults, error: semanticError } = await supabase
          .rpc('search_documents_semantic', {
            query_text: query,
            match_threshold: 0.7,
            match_count: Math.floor(limit / 2)
          })

        if (!semanticError && semanticResults) {
          // Process semantic search results
          for (const item of semanticResults) {
            const result = await processSemanticResult(item, query)
            if (result) results.push(result)
          }
        }
      } catch (semanticError) {
        console.log('Semantic search not available, falling back to text search')
      }
    }

    // Enhanced text-based search across all entities
    await Promise.all([
      searchLegislation(query, type, limit, results),
      searchCases(query, type, limit, context, results),
      searchArticles(query, type, limit, context, results),
      searchOperativeParts(query, type, limit, results)
    ])

    // Advanced relevance scoring combining multiple factors
    const scoredResults = results
      .map(result => ({
        ...result,
        score: calculateAdvancedRelevanceScore(result, query)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    // Remove duplicates based on ID and type
    const uniqueResults = scoredResults.filter((result, index, self) => 
      index === self.findIndex(r => r.id === result.id && r.type === result.type)
    )

    return NextResponse.json({
      query,
      results: uniqueResults,
      total: uniqueResults.length,
      metadata: {
        semantic_enabled: semantic,
        context_filter: context,
        search_type: type || 'all'
      }
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

async function searchLegislation(query: string, type: string | undefined, limit: number, results: any[]) {
  if (!type || type === 'all' || type === 'legislation') {
    const { data: legislations, error } = await supabase
      .from('legislations')
      .select('id, title, celex_number, summary, document_type, publication_date')
      .or(`title.ilike.%${query}%,celex_number.ilike.%${query}%,summary.ilike.%${query}%`)
      .order('publication_date', { ascending: false })
      .limit(type === 'legislation' ? limit : Math.floor(limit / 4))

    if (!error && legislations) {
      results.push(...legislations.map(item => ({
        id: item.id,
        title: item.title,
        type: 'legislation' as const,
        subtitle: item.celex_number,
        snippet: item.summary?.substring(0, 200) + '...' || 'EU Legislation',
        metadata: { 
          document_type: item.document_type,
          publication_date: item.publication_date,
          celex_number: item.celex_number
        }
      })))
    }
  }
}

async function searchCases(query: string, type: string | undefined, limit: number, context: string | undefined, results: any[]) {
  if (!type || type === 'all' || type === 'cases') {
    let casesQuery = supabase
      .from('case_laws')
      .select('id, title, case_id_text, parties, summary_text, court, date_of_judgment')
      .or(`title.ilike.%${query}%,case_id_text.ilike.%${query}%,parties.ilike.%${query}%,summary_text.ilike.%${query}%`)

    // Context filtering for cases related to specific legislation
    if (context) {
      // Get case IDs that interpret articles from specific legislation
      const { data: caseIds } = await supabase
        .from('case_law_interprets_article')
        .select(`
          case_law_id,
          article:articles!inner(legislation_id)
        `)
        .eq('article.legislation_id', context)
      
      if (caseIds && caseIds.length > 0) {
        casesQuery = casesQuery.in('id', caseIds.map(item => item.case_law_id))
      } else {
        // No cases found for this legislation, return empty
        casesQuery = casesQuery.eq('id', 'none')
      }
    }

    const { data: cases, error } = await casesQuery
      .order('date_of_judgment', { ascending: false })
      .limit(type === 'cases' ? limit : Math.floor(limit / 4))

    if (!error && cases) {
      results.push(...cases.map(item => ({
        id: item.id,
        title: item.title,
        type: 'case' as const,
        subtitle: `${item.case_id_text} • ${item.court}`,
        snippet: item.summary_text?.substring(0, 200) + '...' || item.parties,
        metadata: { 
          court: item.court,
          case_id_text: item.case_id_text,
          date_of_judgment: item.date_of_judgment,
          parties: item.parties
        }
      })))
    }
  }
}

async function searchArticles(query: string, type: string | undefined, limit: number, context: string | undefined, results: any[]) {
  if (!type || type === 'all' || type === 'articles') {
    let articlesQuery = supabase
      .from('articles')
      .select(`
        id, 
        title, 
        article_number_text, 
        markdown_content,
        legislation_id,
        legislation:legislations(title, celex_number)
      `)
      .or(`title.ilike.%${query}%,article_number_text.ilike.%${query}%,markdown_content.ilike.%${query}%`)

    if (context) {
      articlesQuery = articlesQuery.eq('legislation_id', context)
    }

    const { data: articles, error } = await articlesQuery
      .order('article_number')
      .limit(type === 'articles' ? limit : Math.floor(limit / 4))

    if (!error && articles) {
      results.push(...articles.map((item: any) => ({
        id: item.id,
        title: `${item.article_number_text}${item.title ? ` - ${item.title}` : ''}`,
        type: 'article' as const,
        subtitle: item.legislation?.title || 'Unknown legislation',
        snippet: extractRelevantSnippet(item.markdown_content, query),
        metadata: { 
          celex_number: item.legislation?.celex_number,
          article_number_text: item.article_number_text,
          legislation_id: item.legislation_id
        }
      })))
    }
  }
}

async function searchOperativeParts(query: string, type: string | undefined, limit: number, results: any[]) {
  if (!type || type === 'all' || type === 'operative_parts') {
    const { data: operativeParts, error } = await supabase
      .from('operative_parts')
      .select(`
        id,
        verbatim_text,
        simplified_text,
        part_number,
        case_law:case_laws(id, title, case_id_text, court)
      `)
      .or(`verbatim_text.ilike.%${query}%,simplified_text.ilike.%${query}%`)
      .order('part_number')
      .limit(Math.floor(limit / 4))

    if (!error && operativeParts) {
      results.push(...operativeParts.map((item: any) => ({
        id: item.id,
        title: `Operative Part ${item.part_number} - ${item.case_law?.case_id_text}`,
        type: 'operative_part' as const,
        subtitle: item.case_law?.title || 'Unknown case',
        snippet: extractRelevantSnippet(item.simplified_text || item.verbatim_text, query),
        metadata: { 
          part_number: item.part_number,
          case_id: item.case_law?.id,
          case_id_text: item.case_law?.case_id_text,
          court: item.case_law?.court
        }
      })))
    }
  }
}

async function processSemanticResult(item: any, query: string) {
  // Process semantic search results from vector similarity
  try {
    if (item.case_law_id) {
      const { data: caseData } = await supabase
        .from('case_laws')
        .select('id, title, case_id_text, court')
        .eq('id', item.case_law_id)
        .single()

      if (caseData) {
        return {
          id: caseData.id,
          title: caseData.title,
          type: 'case' as const,
          subtitle: `${caseData.case_id_text} • Semantic match`,
          snippet: item.chunk_text?.substring(0, 200) + '...',
          metadata: { 
            similarity_score: item.similarity,
            semantic_match: true,
            court: caseData.court
          }
        }
      }
    }

    if (item.article_id) {
      const { data: articleData } = await supabase
        .from('articles')
        .select(`
          id, title, article_number_text,
          legislation:legislations(title, celex_number)
        `)
        .eq('id', item.article_id)
        .single()

      if (articleData) {
        return {
          id: articleData.id,
          title: `${articleData.article_number_text} - ${articleData.title}`,
          type: 'article' as const,
          subtitle: `${(articleData.legislation as any)?.title || 'Unknown'} • Semantic match`,
          snippet: item.chunk_text?.substring(0, 200) + '...',
          metadata: { 
            similarity_score: item.similarity,
            semantic_match: true,
            celex_number: (articleData.legislation as any)?.celex_number
          }
        }
      }
    }
  } catch (error) {
    console.error('Error processing semantic result:', error)
  }
  return null
}

function extractRelevantSnippet(content: string, query: string, maxLength = 200): string {
  if (!content) return ''
  
  const queryLower = query.toLowerCase()
  const contentLower = content.toLowerCase()
  
  // Find the position of the query in the content
  const queryPos = contentLower.indexOf(queryLower)
  
  if (queryPos === -1) {
    // Query not found, return beginning of content
    return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '')
  }
  
  // Calculate start position to center the query in the snippet
  const start = Math.max(0, queryPos - Math.floor(maxLength / 3))
  const end = Math.min(content.length, start + maxLength)
  
  let snippet = content.substring(start, end)
  if (start > 0) snippet = '...' + snippet
  if (end < content.length) snippet = snippet + '...'
  
  return snippet
}

function calculateAdvancedRelevanceScore(result: any, query: string): number {
  const title = result.title.toLowerCase()
  const snippet = result.snippet?.toLowerCase() || ''
  const queryLower = query.toLowerCase()
  
  let score = 0
  
  // Exact title match gets highest score
  if (title === queryLower) {
    score += 100
  } else if (title.includes(queryLower)) {
    score += 50
  }
  
  // Semantic match bonus
  if (result.metadata?.semantic_match) {
    score += (result.metadata.similarity_score * 30) || 20
  }
  
  // Content type weighting (legislation and articles are more important)
  switch (result.type) {
    case 'legislation':
      score += 10
      break
    case 'article':
      score += 8
      break
    case 'case':
      score += 6
      break
    case 'operative_part':
      score += 5
      break
  }
  
  // Boost score for matches in different parts
  const queryWords = queryLower.split(' ')
  queryWords.forEach(word => {
    if (word.length > 2) {
      if (title.includes(word)) score += 5
      if (snippet.includes(word)) score += 2
      if (result.subtitle?.toLowerCase().includes(word)) score += 3
    }
  })
  
  // Legal document specific scoring
  if (result.metadata?.celex_number?.toLowerCase().includes(queryLower)) {
    score += 15 // CELEX number matches are very relevant
  }
  
  if (result.metadata?.case_id_text?.toLowerCase().includes(queryLower)) {
    score += 15 // Case ID matches are very relevant
  }
  
  return Math.max(0, score)
}

// Export the validated and cached handler
export const GET = withCache(
  {
    duration: 5 * 60 * 1000, // 5 minutes cache
    maxSize: 500,
    compression: true,
    tags: ['search']
  },
  withValidation(searchSchema, searchHandler)
)