import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { legislationIds } = await request.json()

    if (!Array.isArray(legislationIds) || legislationIds.length === 0) {
      return NextResponse.json({ error: 'Invalid legislation IDs' }, { status: 400 })
    }

    // Limit to reasonable batch size
    if (legislationIds.length > 20) {
      return NextResponse.json({ error: 'Too many legislation IDs (max 20)' }, { status: 400 })
    }

    // Get articles for these legislations
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .in('legislation_id', legislationIds)
      .order('article_number')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Group articles by legislation ID
    const result: Record<string, any[]> = {}
    
    // Initialize all legislation IDs with empty arrays
    legislationIds.forEach(legislationId => {
      result[legislationId] = []
    })

    // Populate with actual articles
    data?.forEach((article: any) => {
      if (result[article.legislation_id]) {
        result[article.legislation_id].push(article)
      }
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