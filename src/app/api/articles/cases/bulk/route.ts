import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { articleIds } = await request.json()

    if (!Array.isArray(articleIds) || articleIds.length === 0) {
      return NextResponse.json({ error: 'Invalid article IDs' }, { status: 400 })
    }

    // Limit to reasonable batch size
    if (articleIds.length > 50) {
      return NextResponse.json({ error: 'Too many article IDs (max 50)' }, { status: 400 })
    }

    // Get operative parts that interpret these articles, along with their cases
    const { data, error } = await supabase
      .from('operative_part_interprets_article')
      .select(`
        article_id,
        operative_part:operative_parts(
          *,
          case_law:case_laws(*)
        )
      `)
      .in('article_id', articleIds)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Group cases by article ID
    const result: Record<string, any[]> = {}
    
    // Initialize all article IDs with empty arrays
    articleIds.forEach(articleId => {
      result[articleId] = []
    })

    // Transform data to include operative parts with their cases
    const casesByArticle = new Map<string, Map<string, any>>()
    
    data?.forEach((item: any) => {
      if (item.operative_part?.case_law && item.article_id) {
        const articleId = item.article_id
        if (!casesByArticle.has(articleId)) {
          casesByArticle.set(articleId, new Map())
        }
        
        const articleCases = casesByArticle.get(articleId)!
        const caseId = item.operative_part.case_law.id
        
        if (articleCases.has(caseId)) {
          // Add operative part to existing case
          articleCases.get(caseId).operative_parts.push(item.operative_part)
        } else {
          // Create new case entry
          articleCases.set(caseId, {
            ...item.operative_part.case_law,
            operative_parts: [item.operative_part]
          })
        }
      }
    })

    // Convert to final format
    casesByArticle.forEach((cases, articleId) => {
      result[articleId] = Array.from(cases.values())
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