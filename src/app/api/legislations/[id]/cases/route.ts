import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '25'), 100)
    const offset = Math.max(parseInt(url.searchParams.get('offset') || '0'), 0)

    // First, get unique case IDs that interpret articles from this legislation
    // This is much more efficient than the complex join
    const { data: caseIds, error: caseIdsError } = await supabase
      .rpc('get_cases_interpreting_legislation', { 
        legislation_id: id,
        result_limit: limit,
        result_offset: offset
      })

    if (caseIdsError) {
      console.log('RPC not available, falling back to standard query')
      
      // Fallback: Get case IDs directly with a simpler query
      const { data: interpretData, error: interpretError } = await supabase
        .from('operative_part_interprets_article')
        .select(`
          operative_part:operative_parts!inner(
            case_law_id
          ),
          article:articles!inner(legislation_id)
        `)
        .eq('article.legislation_id', id)
        .limit(limit * 2) // Get more to account for duplicates
        .range(offset, offset + limit + 50)

      if (interpretError) {
        console.error('Database error:', interpretError)
        return NextResponse.json({ error: interpretError.message }, { status: 500 })
      }

      // Extract unique case IDs
      const uniqueCaseIds = [...new Set(
        interpretData
          ?.map((item: any) => item.operative_part?.case_law_id)
          .filter(Boolean)
      )]

      if (uniqueCaseIds.length === 0) {
        return NextResponse.json([])
      }

      // Get the actual case data
      const { data: cases, error: casesError } = await supabase
        .from('case_laws')
        .select('*')
        .in('id', uniqueCaseIds.slice(0, limit))
        .order('created_at', { ascending: false })

      if (casesError) {
        console.error('Cases query error:', casesError)
        return NextResponse.json({ error: casesError.message }, { status: 500 })
      }

      return NextResponse.json(cases || [])
    }

    // If RPC succeeded, get the case data
    const { data: cases, error: casesError } = await supabase
      .from('case_laws')
      .select('*')
      .in('id', caseIds)
      .order('created_at', { ascending: false })

    if (casesError) {
      console.error('Cases query error:', casesError)
      return NextResponse.json({ error: casesError.message }, { status: 500 })
    }

    return NextResponse.json(cases || [])
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}