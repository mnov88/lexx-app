import { NextRequest, NextResponse } from 'next/server'
import { ReportConfig, ReportData } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const { config, reportData, format }: { 
      config: ReportConfig
      reportData: ReportData
      format: 'html' | 'pdf' 
    } = await request.json()

    if (format === 'html') {
      const htmlContent = generateHTMLReport(config, reportData)
      
      return new NextResponse(htmlContent, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `attachment; filename="${config.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html"`
        }
      })
    }

    if (format === 'pdf') {
      // For now, return HTML content that can be converted to PDF client-side
      // In production, you might want to use a service like Puppeteer or similar
      const htmlContent = generateHTMLReport(config, reportData, true)
      
      return new NextResponse(htmlContent, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `attachment; filename="${config.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_print.html"`
        }
      })
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 })

  } catch (error) {
    console.error('Error downloading report:', error)
    return NextResponse.json(
      { error: 'Failed to download report' },
      { status: 500 }
    )
  }
}

function generateHTMLReport(config: ReportConfig, reportData: ReportData, forPrint = false): string {
  const { content } = reportData
  const printStyles = forPrint ? `
    <style>
      @media print {
        .no-print { display: none !important; }
        .page-break { page-break-before: always; }
        body { font-size: 12pt; line-height: 1.4; }
        h1 { font-size: 18pt; }
        h2 { font-size: 16pt; }
        h3 { font-size: 14pt; }
      }
    </style>
  ` : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <style>
        body {
            font-family: 'Crimson Text', Georgia, serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 2rem;
        }
        
        .title {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: #111827;
        }
        
        .subtitle {
            font-size: 1.125rem;
            color: #6b7280;
            margin-bottom: 0.5rem;
        }
        
        .meta {
            font-size: 0.875rem;
            color: #9ca3af;
        }
        
        .summary {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin: 2rem 0;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .summary-item {
            text-align: center;
            padding: 1rem;
            border-radius: 0.375rem;
        }
        
        .summary-item.legislations { background: #dbeafe; }
        .summary-item.articles { background: #dcfce7; }
        .summary-item.cases { background: #fce7f3; }
        
        .summary-number {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 0.25rem;
        }
        
        .summary-label {
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .legislation {
            margin: 3rem 0;
            border-left: 4px solid #3b82f6;
            padding-left: 1.5rem;
        }
        
        .legislation-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            color: #1e40af;
        }
        
        .celex {
            font-size: 0.875rem;
            color: #6b7280;
            margin-bottom: 1rem;
            font-family: 'Courier New', monospace;
        }
        
        .article {
            margin: 2rem 0;
            padding: 1.5rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            background: #f9fafb;
        }
        
        .article-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #059669;
        }
        
        .article-text {
            margin: 1rem 0;
            padding: 1rem;
            background: white;
            border-radius: 0.375rem;
            border-left: 3px solid #10b981;
        }
        
        .cases-section {
            margin-top: 1.5rem;
        }
        
        .cases-title {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #7c3aed;
        }
        
        .case {
            margin: 1rem 0;
            padding: 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            background: white;
        }
        
        .case-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #1f2937;
        }
        
        .case-meta {
            font-size: 0.875rem;
            color: #6b7280;
            margin-bottom: 0.5rem;
        }
        
        .case-summary {
            margin: 0.5rem 0;
            font-style: italic;
        }
        
        .operative-parts {
            margin-top: 1rem;
            padding: 0.75rem;
            background: #f3f4f6;
            border-radius: 0.375rem;
        }
        
        .operative-part {
            margin: 0.5rem 0;
            padding: 0.5rem;
            background: white;
            border-radius: 0.25rem;
            border-left: 2px solid #8b5cf6;
        }
        
        .config-section {
            margin-top: 3rem;
            padding: 1.5rem;
            background: #f9fafb;
            border-radius: 0.5rem;
            border: 1px solid #e5e7eb;
        }
        
        .config-title {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .config-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.5rem;
            font-size: 0.875rem;
        }
        
        .config-item {
            display: flex;
            justify-content: space-between;
        }
        
        .config-label {
            color: #6b7280;
        }
        
        .config-value {
            font-weight: 500;
        }
    </style>
    ${printStyles}
</head>
<body>
    <div class="header">
        <h1 class="title">${config.title}</h1>
        ${config.description ? `<p class="subtitle">${config.description}</p>` : ''}
        <div class="meta">
            Generated on ${new Date(content.generatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
        </div>
    </div>

    <div class="summary">
        <div class="summary-grid">
            <div class="summary-item legislations">
                <div class="summary-number">${content.legislations.length}</div>
                <div class="summary-label">Legislation${content.legislations.length !== 1 ? 's' : ''}</div>
            </div>
            <div class="summary-item articles">
                <div class="summary-number">${content.totalArticles}</div>
                <div class="summary-label">Article${content.totalArticles !== 1 ? 's' : ''}</div>
            </div>
            <div class="summary-item cases">
                <div class="summary-number">${content.totalCases}</div>
                <div class="summary-label">Case${content.totalCases !== 1 ? 's' : ''}</div>
            </div>
        </div>
    </div>

    ${content.legislations.map((legislation, index) => `
        <div class="legislation ${index > 0 ? 'page-break' : ''}">
            <h2 class="legislation-title">${index + 1}. ${legislation.title}</h2>
            <div class="celex">CELEX: ${legislation.celex_number}</div>
            
            ${legislation.summary && config.template === 'detailed' ? `
                <div class="article-text">
                    <strong>Summary:</strong> ${legislation.summary}
                </div>
            ` : ''}

            ${legislation.articles.map(article => `
                <div class="article">
                    <h3 class="article-title">Article ${article.article_number_text}: ${article.title}</h3>
                    
                    ${config.includeArticleText && article.markdown_content ? `
                        <div class="article-text">
                            ${article.markdown_content.replace(/\n/g, '<br>')}
                        </div>
                    ` : ''}

                    ${article.cases.length > 0 ? `
                        <div class="cases-section">
                            <h4 class="cases-title">Interpreting Cases (${article.cases.length})</h4>
                            
                            ${article.cases.map(caseData => `
                                <div class="case">
                                    <div class="case-title">${caseData.title}</div>
                                    <div class="case-meta">
                                        ${caseData.court ? `${caseData.court} • ` : ''}
                                        ${caseData.date_of_judgment ? new Date(caseData.date_of_judgment).toLocaleDateString() : ''}
                                        ${caseData.celex_number ? ` • CELEX: ${caseData.celex_number}` : ''}
                                    </div>
                                    
                                    ${config.includeCaseSummaries && caseData.summary_text ? `
                                        <div class="case-summary">${caseData.summary_text}</div>
                                    ` : ''}

                                    ${config.includeOperativeParts && caseData.operative_parts.length > 0 ? `
                                        <div class="operative-parts">
                                            <strong>Relevant Operative Parts (interpreting this article):</strong>
                                            ${caseData.operative_parts.map(part => `
                                                <div class="operative-part">
                                                    <strong>Part ${part.part_number}:</strong>
                                                    ${config.operativePartsMode === 'simplified' 
                                                      ? (part.simplified_text || part.verbatim_text || 'No text available')
                                                      : (part.verbatim_text || part.simplified_text || 'No text available')
                                                    }
                                                </div>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `).join('')}

    <div class="config-section no-print">
        <h3 class="config-title">Report Configuration</h3>
        <div class="config-grid">
            <div class="config-item">
                <span class="config-label">Template:</span>
                <span class="config-value">${config.template.charAt(0).toUpperCase() + config.template.slice(1)}</span>
            </div>
            <div class="config-item">
                <span class="config-label">Format:</span>
                <span class="config-value">${config.format.toUpperCase()}</span>
            </div>
            <div class="config-item">
                <span class="config-label">Article Text:</span>
                <span class="config-value">${config.includeArticleText ? 'Included' : 'Excluded'}</span>
            </div>
            <div class="config-item">
                <span class="config-label">Operative Parts:</span>
                <span class="config-value">${config.includeOperativeParts ? `${config.operativePartsMode} mode` : 'Excluded'}</span>
            </div>
            <div class="config-item">
                <span class="config-label">Case Summaries:</span>
                <span class="config-value">${config.includeCaseSummaries ? 'Included' : 'Excluded'}</span>
            </div>
        </div>
    </div>
</body>
</html>`

  return html
}