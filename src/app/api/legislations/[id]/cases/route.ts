import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get cases that interpret articles from this legislation
    const { data, error } = await supabase
      .from('case_law_interprets_article')
      .select(`
        case_law:case_laws(*),
        article:articles!inner(*)
      `)
      .eq('article.legislation_id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Extract unique case laws
    const uniqueCases = new Map()
    data?.forEach((item: any) => {
      if (item.case_law && !uniqueCases.has(item.case_law.id)) {
        uniqueCases.set(item.case_law.id, item.case_law)
      }
    })

    return NextResponse.json(Array.from(uniqueCases.values()))
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}