import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get articles that are interpreted by operative parts of this case
    const { data, error } = await supabase
      .from('operative_part_interprets_article')
      .select(`
        article:articles(
          id,
          article_number_text,
          title
        ),
        operative_part:operative_parts!inner(
          case_law_id
        )
      `)
      .eq('operative_part.case_law_id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Extract unique articles (a case might interpret the same article through multiple operative parts)
    const uniqueArticles = new Map()
    data?.forEach((item: any) => {
      if (item.article) {
        uniqueArticles.set(item.article.id, item.article)
      }
    })

    return NextResponse.json(Array.from(uniqueArticles.values()))
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}