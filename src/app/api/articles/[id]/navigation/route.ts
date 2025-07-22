import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // First, get the current article to find its legislation and article number
    const { data: currentArticle, error: currentError } = await supabase
      .from('articles')
      .select('legislation_id, article_number, article_number_text')
      .eq('id', id)
      .single()

    if (currentError || !currentArticle) {
      console.error('Error fetching current article:', currentError)
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Get all articles from the same legislation, ordered by article number
    const { data: allArticles, error: allError } = await supabase
      .from('articles')
      .select('id, article_number, article_number_text, title')
      .eq('legislation_id', currentArticle.legislation_id)
      .order('article_number', { ascending: true })

    if (allError) {
      console.error('Error fetching legislation articles:', allError)
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
    }

    // Find the index of the current article
    const currentIndex = allArticles.findIndex(article => article.id === id)
    
    if (currentIndex === -1) {
      return NextResponse.json({ error: 'Article not found in legislation' }, { status: 404 })
    }

    // Get previous and next articles
    const previousArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null
    const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null

    // Calculate position info
    const position = {
      current: currentIndex + 1,
      total: allArticles.length
    }

    return NextResponse.json({
      previous: previousArticle,
      next: nextArticle,
      position
    })

  } catch (error) {
    console.error('Error fetching article navigation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}