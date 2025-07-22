import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch case with operative parts and related articles
    const { data: caseData, error: caseError } = await supabase
      .from('case_laws')
      .select(`
        *,
        operative_parts(
          *,
          operative_part_interprets_article(
            article:articles(
              *,
              legislation:legislations(*)
            )
          )
        )
      `)
      .eq('id', id)
      .single()

    if (caseError) {
      console.error('Database error:', caseError)
      return NextResponse.json({ error: caseError.message }, { status: 500 })
    }

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    // Process the data to create a clean structure
    const processedCase = {
      ...caseData,
      operative_parts: caseData.operative_parts?.map((op: any) => ({
        ...op,
        articles: op.operative_part_interprets_article?.map((opia: any) => opia.article) || []
      })) || []
    }

    // Get unique articles interpreted by this case
    const articlesMap = new Map()
    processedCase.operative_parts.forEach((op: any) => {
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
      ...processedCase,
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