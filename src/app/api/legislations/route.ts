import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withCache } from '@/lib/cache'

async function legislationsHandler() {
  try {
    const { data, error } = await supabase
      .from('legislations')
      .select('*')
      .order('title')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export const GET = withCache(
  {
    duration: 15 * 60 * 1000, // 15 minutes cache
    maxSize: 1000,
    compression: true,
    tags: ['legislations']
  },
  legislationsHandler
)