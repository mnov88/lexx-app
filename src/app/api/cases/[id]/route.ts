import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Optimize: Split into separate queries for better performance
    // First, get the basic case data
    const { data: caseData, error: caseError } = await supabase
      .from('case_laws')
      .select('*')
      .eq('id', id)
      .single()

    if (caseError) {
      console.error('Database error:', caseError)
      return NextResponse.json({ error: caseError.message }, { status: 500 })
    }

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    // Then get operative parts separately for better query performance
    const { data: operativeParts, error: operativePartsError } = await supabase
      .from('operative_parts')
      .select('*')
      .eq('case_law_id', id)
      .order('part_number')

    if (operativePartsError) {
      console.error('Operative parts error:', operativePartsError)
      return NextResponse.json({ error: operativePartsError.message }, { status: 500 })
    }

    // Get interpreted articles with legislation info
    const { data: interpretedArticlesData, error: articlesError } = await supabase
      .from('operative_part_interprets_article')
      .select(`
        operative_part_id,
        article:articles(
          *,
          legislation:legislations(*)
        )
      `)
      .in('operative_part_id', operativeParts?.map(op => op.id) || [])

    if (articlesError) {
      console.error('Articles error:', articlesError)
      // Continue without articles data rather than failing
    }

    // Process and combine the data efficiently
    const operativePartsWithArticles = (operativeParts || []).map((op: any) => {
      const relatedArticles = (interpretedArticlesData || [])
        .filter((item: any) => item.operative_part_id === op.id)
        .map((item: any) => item.article)
        .filter(Boolean)
      
      return {
        ...op,
        articles: relatedArticles
      }
    })

    // Create unique articles list with their interpreting operative parts
    const articlesMap = new Map()
    operativePartsWithArticles.forEach((op: any) => {
      op.articles.forEach((article: any) => {
        if (article && !articlesMap.has(article.id)) {
          articlesMap.set(article.id, {
            ...article,
            operative_parts: []
          })
        }
        if (article) {
          articlesMap.get(article.id).operative_parts.push({
            id: op.id,
            part_number: op.part_number,
            verbatim_text: op.verbatim_text,
            simplified_text: op.simplified_text
          })
        }
      })
    })

    const interpretedArticles = Array.from(articlesMap.values())

    return NextResponse.json({
      ...caseData,
      operative_parts: operativePartsWithArticles,
      interpreted_articles: interpretedArticles
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}