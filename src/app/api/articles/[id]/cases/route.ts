import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get operative parts that interpret this article, along with their cases
    const { data, error } = await supabase
      .from('operative_part_interprets_article')
      .select(`
        operative_part:operative_parts(
          *,
          case_law:case_laws(*)
        )
      `)
      .eq('article_id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform data to include operative parts with their cases
    const casesWithOperativeParts = data?.map((item: any) => ({
      ...item.operative_part?.case_law,
      operative_parts: [item.operative_part]
    })) || []

    // Group by case law to combine operative parts from the same case
    const groupedCases = new Map()
    casesWithOperativeParts.forEach(item => {
      if (item.id) {
        if (groupedCases.has(item.id)) {
          groupedCases.get(item.id).operative_parts.push(...item.operative_parts)
        } else {
          groupedCases.set(item.id, item)
        }
      }
    })

    return NextResponse.json(Array.from(groupedCases.values()))
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}