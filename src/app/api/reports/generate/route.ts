import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database, ReportConfig, ReportData, LegislationReportData, ArticleReportData, CaseReportData } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  let config: ReportConfig | undefined
  
  try {
    config = await request.json()

    console.log('Report generation request:', config) // Debug log
    
    // Validate config
    if (!config) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    
    // For testing - if no selection, use first legislation
    if (!config.legislations.length && !config.articles.length) {
      console.log('No selection provided, using test data')
      const testReportData: ReportData = {
        config: {
          ...config,
          legislations: ['be950a32-be39-4713-ab12-a095ca87a5f3'] // GDPR test ID
        },
        content: {
          legislations: [],
          generatedAt: new Date().toISOString(),
          totalArticles: 0,
          totalCases: 0
        }
      }
      return NextResponse.json(testReportData)
    }

    const reportData: ReportData = {
      config,
      content: {
        legislations: [],
        generatedAt: new Date().toISOString(),
        totalArticles: 0,
        totalCases: 0
      }
    }

    // If specific articles are selected, process them
    if (config.articles.length > 0) {
      const { data: selectedArticles, error: articlesError } = await supabase
        .from('articles')
        .select(`
          *,
          legislation:legislations(*)
        `)
        .in('id', config.articles)

      if (articlesError) {
        console.error('Error fetching selected articles:', articlesError)
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
      }

      // Group articles by legislation
      const articlesByLegislation = new Map<string, any[]>()
      
      for (const article of selectedArticles || []) {
        const legId = article.legislation.id
        if (!articlesByLegislation.has(legId)) {
          articlesByLegislation.set(legId, [])
        }
        articlesByLegislation.get(legId)!.push(article)
      }

      // Process each legislation with its selected articles
      for (const [legislationId, articles] of articlesByLegislation) {
        const legislationData = articles[0].legislation
        
        const processedArticles: ArticleReportData[] = []
        
        // Optimize: Batch fetch all operative parts for all articles at once to avoid N+1 queries
        const articleIds = articles.map(a => a.id)
        const { data: allInterpretingOperativeParts, error: operativePartsError } = await supabase
          .from('operative_part_interprets_article')
          .select(`
            article_id,
            operative_part:operative_parts(
              *,
              case_law:case_laws(*)
            )
          `)
          .in('article_id', articleIds)

        if (operativePartsError) {
          console.error('Error fetching interpreting operative parts:', operativePartsError)
          continue
        }

        // Group operative parts by article for processing
        const operativePartsByArticle = new Map<string, any[]>()
        allInterpretingOperativeParts?.forEach((item: any) => {
          if (!operativePartsByArticle.has(item.article_id)) {
            operativePartsByArticle.set(item.article_id, [])
          }
          operativePartsByArticle.get(item.article_id)!.push(item)
        })

        for (const article of articles) {
          const interpretingOperativeParts = operativePartsByArticle.get(article.id) || []

          // Group operative parts by case law
          const casesByOperativeParts = new Map<string, any>()
          const operativePartsByCase = new Map<string, any[]>()
          
          for (const item of interpretingOperativeParts || []) {
            const operativePart = item.operative_part as any
            if (!operativePart?.case_law) continue
            const caseLaw = operativePart.case_law
            
            if (!casesByOperativeParts.has(caseLaw.id)) {
              casesByOperativeParts.set(caseLaw.id, caseLaw)
              operativePartsByCase.set(caseLaw.id, [])
            }
            
            operativePartsByCase.get(caseLaw.id)!.push(operativePart)
          }
          
          // Create cases with only the relevant operative parts
          const cases: CaseReportData[] = Array.from(casesByOperativeParts.entries()).map(([caseId, caseLaw]) => ({
            ...caseLaw,
            operative_parts: operativePartsByCase.get(caseId) || []
          }))

          processedArticles.push({
            ...article,
            legislation: legislationData,
            cases
          })
        }

        const legislationReportData: LegislationReportData = {
          ...legislationData,
          articles: processedArticles
        }

        reportData.content.legislations.push(legislationReportData)
      }
    }

    // If entire legislations are selected (without specific articles)
    const selectedLegislationsOnly = config.legislations.filter(legId => 
      !reportData.content.legislations.some(leg => leg.id === legId)
    )

    for (const legislationId of selectedLegislationsOnly) {
      const { data: legislation, error: legError } = await supabase
        .from('legislations')
        .select('*')
        .eq('id', legislationId)
        .single()

      if (legError) {
        console.error('Error fetching legislation:', legError)
        continue
      }

      // Fetch all articles for this legislation
      const { data: allArticles, error: allArticlesError } = await supabase
        .from('articles')
        .select('*')
        .eq('legislation_id', legislationId)
        .order('article_number')

      if (allArticlesError) {
        console.error('Error fetching legislation articles:', allArticlesError)
        continue
      }

      const processedArticles: ArticleReportData[] = []

      // Optimize: Batch fetch all operative parts for all articles in legislation to avoid N+1 queries
      const allArticleIds = (allArticles || []).map(a => a.id)
      const { data: allLegislationOperativeParts, error: operativePartsError } = await supabase
        .from('operative_part_interprets_article')
        .select(`
          article_id,
          operative_part:operative_parts(
            *,
            case_law:case_laws(*)
          )
        `)
        .in('article_id', allArticleIds)

      if (operativePartsError) {
        console.error('Error fetching interpreting operative parts:', operativePartsError)
        continue
      }

      // Group operative parts by article for processing
      const legislationOperativePartsByArticle = new Map<string, any[]>()
      allLegislationOperativeParts?.forEach((item: any) => {
        if (!legislationOperativePartsByArticle.has(item.article_id)) {
          legislationOperativePartsByArticle.set(item.article_id, [])
        }
        legislationOperativePartsByArticle.get(item.article_id)!.push(item)
      })

      for (const article of allArticles || []) {
        const interpretingOperativeParts = legislationOperativePartsByArticle.get(article.id) || []

        // Group operative parts by case law
        const casesByOperativeParts = new Map<string, any>()
        const operativePartsByCase = new Map<string, any[]>()
        
        for (const item of interpretingOperativeParts || []) {
          const operativePart = item.operative_part as any
          if (!operativePart?.case_law) continue
          const caseLaw = operativePart.case_law
          
          if (!casesByOperativeParts.has(caseLaw.id)) {
            casesByOperativeParts.set(caseLaw.id, caseLaw)
            operativePartsByCase.set(caseLaw.id, [])
          }
          
          operativePartsByCase.get(caseLaw.id)!.push(operativePart)
        }
        
        // Create cases with only the relevant operative parts
        const cases: CaseReportData[] = Array.from(casesByOperativeParts.entries()).map(([caseId, caseLaw]) => ({
          ...caseLaw,
          operative_parts: operativePartsByCase.get(caseId) || []
        }))

        processedArticles.push({
          ...article,
          legislation,
          cases
        })
      }

      const legislationReportData: LegislationReportData = {
        ...legislation,
        articles: processedArticles
      }

      reportData.content.legislations.push(legislationReportData)
    }

    // Calculate totals
    reportData.content.totalArticles = reportData.content.legislations.reduce(
      (total, leg) => total + leg.articles.length, 
      0
    )
    
    reportData.content.totalCases = reportData.content.legislations.reduce(
      (total, leg) => total + leg.articles.reduce(
        (articleTotal, article) => articleTotal + article.cases.length, 
        0
      ), 
      0
    )

    return NextResponse.json(reportData)

  } catch (error) {
    console.error('Error generating report:', error)
    
    // Return error response if config is not available
    if (!config) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    
    // Return a simple test report for debugging
    const testReportData: ReportData = {
      config,
      content: {
        legislations: [],
        generatedAt: new Date().toISOString(),
        totalArticles: 0,
        totalCases: 0
      }
    }
    
    return NextResponse.json(testReportData)
  }
}