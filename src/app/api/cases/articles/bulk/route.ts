import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { caseIds } = await request.json()

    if (!Array.isArray(caseIds) || caseIds.length === 0) {
      return NextResponse.json({ error: 'Invalid case IDs' }, { status: 400 })
    }

    // Limit to reasonable batch size
    if (caseIds.length > 50) {
      return NextResponse.json({ error: 'Too many case IDs (max 50)' }, { status: 400 })
    }

    // First get operative parts for these cases
    const { data: operativeParts, error: opError } = await supabase
      .from('operative_parts')
      .select('id, case_law_id')
      .in('case_law_id', caseIds)

    if (opError) {
      console.error('Database error getting operative parts:', opError)
      return NextResponse.json({ error: opError.message }, { status: 500 })
    }

    if (!operativeParts || operativeParts.length === 0) {
      // No operative parts found, return empty result
      const result: Record<string, any[]> = {}
      caseIds.forEach(caseId => { result[caseId] = [] })
      return NextResponse.json(result)
    }

    const operativePartIds = operativeParts.map(op => op.id)

    // Get articles that are interpreted by these operative parts
    const { data, error } = await supabase
      .from('operative_part_interprets_article')
      .select(`
        operative_part_id,
        article:articles(
          id,
          article_number_text,
          title
        )
      `)
      .in('operative_part_id', operativePartIds)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Group articles by case ID
    const result: Record<string, any[]> = {}
    
    // Initialize all case IDs with empty arrays
    caseIds.forEach(caseId => {
      result[caseId] = []
    })

    // Create a map from operative part ID to case ID
    const opToCaseMap = new Map<string, string>()
    operativeParts.forEach(op => {
      opToCaseMap.set(op.id, op.case_law_id)
    })

    // Populate with actual articles
    const articlesByCase = new Map<string, Map<string, any>>()
    
    data?.forEach((item: any) => {
      if (item.article && item.operative_part_id) {
        const caseId = opToCaseMap.get(item.operative_part_id)
        if (caseId) {
          if (!articlesByCase.has(caseId)) {
            articlesByCase.set(caseId, new Map())
          }
          const caseArticles = articlesByCase.get(caseId)!
          caseArticles.set(item.article.id, item.article)
        }
      }
    })

    // Convert to final format
    articlesByCase.forEach((articles, caseId) => {
      result[caseId] = Array.from(articles.values())
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}