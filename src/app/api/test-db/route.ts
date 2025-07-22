import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Check environment variables first
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const envCheck = {
    url: {
      exists: !!supabaseUrl,
      isPlaceholder: supabaseUrl === 'your_supabase_url_here',
      value: supabaseUrl ? (supabaseUrl.length > 10 ? `${supabaseUrl.substring(0, 10)}...` : supabaseUrl) : null
    },
    anonKey: {
      exists: !!supabaseAnonKey,
      isPlaceholder: supabaseAnonKey === 'your_supabase_anon_key_here',
      value: supabaseAnonKey ? (supabaseAnonKey.length > 10 ? `${supabaseAnonKey.substring(0, 10)}...` : supabaseAnonKey) : null
    }
  }

  // If credentials are missing or placeholders, return diagnostic info
  if (!supabaseUrl || !supabaseAnonKey || envCheck.url.isPlaceholder || envCheck.anonKey.isPlaceholder) {
    return NextResponse.json({
      connection: 'CONFIGURATION_REQUIRED',
      timestamp: new Date().toISOString(),
      environmentCheck: envCheck,
      message: 'Supabase credentials are missing or using placeholder values',
      requiredSteps: [
        'Update .env.local file with real Supabase credentials',
        'Set NEXT_PUBLIC_SUPABASE_URL to your Supabase project URL',
        'Set NEXT_PUBLIC_SUPABASE_ANON_KEY to your Supabase anon key',
        'Restart the development server after updating credentials'
      ],
      expectedDatabaseSchema: {
        tables: [
          'legislations - Main EU legislation documents',
          'articles - Individual articles within legislation', 
          'case_laws - EU court case decisions',
          'operative_parts - Key decision parts from cases',
          'operative_part_interprets_article - Links operative parts to articles',
          'case_law_interprets_article - Links cases to articles',
          'document_chunks - Text chunks for search/embedding'
        ]
      }
    }, { status: 200 })
  }

  try {
    // Dynamic import to avoid initialization errors
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('legislations')
      .select('count')
      .limit(1)

    if (connectionError) {
      throw new Error(`Connection failed: ${connectionError.message}`)
    }

    // Get table information and sample data
    const results: any = {
      connection: 'SUCCESS',
      timestamp: new Date().toISOString(),
      tables: {}
    }

    // Test each table and get row counts + sample data
    const tables = [
      'legislations',
      'articles', 
      'case_laws',
      'operative_parts',
      'operative_part_interprets_article',
      'case_law_interprets_article',
      'document_chunks'
    ]

    for (const table of tables) {
      try {
        // Get count
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (countError) {
          results.tables[table] = { 
            error: `Count error: ${countError.message}`,
            accessible: false 
          }
          continue
        }

        // Get sample data (first 3 rows)
        const { data: sampleData, error: sampleError } = await supabase
          .from(table)
          .select('*')
          .limit(3)

        if (sampleError) {
          results.tables[table] = { 
            count: count || 0,
            error: `Sample data error: ${sampleError.message}`,
            accessible: true 
          }
        } else {
          results.tables[table] = {
            count: count || 0,
            sampleData: sampleData || [],
            accessible: true
          }
        }
      } catch (err) {
        results.tables[table] = { 
          error: `Table access error: ${err instanceof Error ? err.message : 'Unknown error'}`,
          accessible: false 
        }
      }
    }

    return NextResponse.json(results, { status: 200 })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { 
        connection: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}