import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withValidation, commonSchemas } from '@/lib/validation'
import { withCache, cacheConfigs } from '@/lib/cache'

// Enhanced validation schema for cases endpoint
const casesSchema = {
  ...commonSchemas.pagination,
  latest: {
    type: 'boolean' as const,
    required: false,
    sanitize: (value: any) => {
      if (typeof value === 'boolean') return value
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1'
      }
      return false
    }
  },
  topics: {
    type: 'string' as const,
    required: false,
    max: 500
  },
  date_from: {
    type: 'string' as const,
    required: false,
    pattern: /^\d{4}-\d{2}-\d{2}$/
  },
  date_to: {
    type: 'string' as const,
    required: false,
    pattern: /^\d{4}-\d{2}-\d{2}$/
  }
}

async function casesHandler(request: NextRequest, validatedData: any) {
  try {
    const { 
      limit = 25, 
      offset = 0, 
      latest = false,
      topics,
      date_from,
      date_to 
    } = validatedData

    // Build base query
    let query = supabase
      .from('case_laws')
      .select('*', { count: 'exact' })

    // Apply date filters
    if (date_from) {
      query = query.gte('date_of_judgment', date_from)
    }
    if (date_to) {
      query = query.lte('date_of_judgment', date_to)
    }

    // Apply topic filtering
    if (topics) {
      query = query.contains('topics', [topics])
    }

    // Apply sorting
    if (latest) {
      query = query
        .order('date_of_judgment', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { 
          error: 'Database query failed',
          code: 'DATABASE_ERROR'
        }, 
        { status: 500 }
      )
    }

    // Calculate pagination metadata
    const totalItems = count || 0
    const totalPages = Math.ceil(totalItems / limit)
    const currentPage = Math.floor(offset / limit) + 1
    const hasNext = offset + limit < totalItems
    const hasPrev = offset > 0

    return NextResponse.json({
      data: data || [],
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNext,
        hasPrev,
        nextOffset: hasNext ? offset + limit : null,
        prevOffset: hasPrev ? Math.max(0, offset - limit) : null
      },
      metadata: {
        filters: {
          latest,
          topics: topics || null,
          dateRange: date_from || date_to ? { from: date_from, to: date_to } : null
        },
        requestTime: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }, 
      { status: 500 }
    )
  }
}

// Export the enhanced handler with validation and caching
export const GET = withCache(
  cacheConfigs.cases,
  withValidation(casesSchema, casesHandler),
  'cases'
)