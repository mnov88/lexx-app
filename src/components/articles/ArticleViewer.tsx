'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, List } from 'lucide-react'
import { CaseInfoCard } from '@/components/cases/CaseInfoCard'
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/Breadcrumbs'
import { TableOfContents } from '@/components/ui/TableOfContents'
import { CrossReferencePanel } from '@/components/ui/CrossReferencePanel'
import { useThemeStore } from '@/stores/useThemeStore'
import { linkifyContent } from '@/lib/crossReferences'
import { ArticleWithLegislation, CaseInfoCardData } from '@/types/database'

interface ArticleNavigation {
  previous: {
    id: string
    article_number: number | null
    article_number_text: string
    title: string
  } | null
  next: {
    id: string
    article_number: number | null
    article_number_text: string
    title: string
  } | null
  position: {
    current: number
    total: number
  }
}

interface ArticleViewerProps {
  articleId: string
}

export function ArticleViewer({ articleId }: ArticleViewerProps) {
  const [article, setArticle] = useState<ArticleWithLegislation | null>(null)
  const [cases, setCases] = useState<CaseInfoCardData[]>([])
  const [navigation, setNavigation] = useState<ArticleNavigation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showToc, setShowToc] = useState(false)
  
  const { operativePartsVisible, operativePartsSimplified } = useThemeStore()
  const router = useRouter()

  // Function to render markdown with anchor links and cross-references
  const renderMarkdownWithAnchors = (content: string): string => {
    // First add anchor links for headings
    let processedContent = content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
      const level = hashes.length
      const id = title.trim().toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-')
      
      return `<h${level} id="${id}" class="scroll-mt-8">${title.trim()}</h${level}>`
    })
    
    // Then add cross-reference links
    processedContent = linkifyContent(processedContent, article?.legislation_id)
    
    return processedContent
  }

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger navigation if user is typing in an input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    // Handle Escape key to close ToC
    if (event.key === 'Escape' && showToc) {
      event.preventDefault()
      setShowToc(false)
      return
    }

    if (!navigation) return

    if (event.key === 'ArrowLeft' && navigation.previous) {
      event.preventDefault()
      router.push(`/articles/${navigation.previous.id}`)
    } else if (event.key === 'ArrowRight' && navigation.next) {
      event.preventDefault()
      router.push(`/articles/${navigation.next.id}`)
    }
  }, [navigation, router, showToc])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const [articleResponse, casesResponse, navigationResponse] = await Promise.all([
          fetch(`/api/articles/${articleId}`),
          fetch(`/api/articles/${articleId}/cases`),
          fetch(`/api/articles/${articleId}/navigation`)
        ])

        if (!articleResponse.ok) {
          throw new Error(`Failed to fetch article: ${articleResponse.status}`)
        }

        const articleData = await articleResponse.json()
        setArticle(articleData)

        if (casesResponse.ok) {
          const casesData = await casesResponse.json()
          // Transform to CaseInfoCardData format
          const transformedCases = casesData.map((caseData: any) => ({
            case_law: caseData,
            operative_parts: caseData.operative_parts || [],
            context: 'article' as const
          }))
          setCases(transformedCases)
        }

        if (navigationResponse.ok) {
          const navigationData = await navigationResponse.json()
          setNavigation(navigationData)
        }
      } catch (error) {
        console.error('Error fetching article data:', error)
        setArticle(null)
        setCases([])
        setNavigation(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticleData()
  }, [articleId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-8 w-32"></div>
        <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-16"></div>
        <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-64"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Article not found
        </h1>
        <Link 
          href="/legislation"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to legislation
        </Link>
      </div>
    )
  }

  // Generate breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      href: '/legislation',
      label: 'Legislation'
    },
    {
      href: `/legislation/${article.legislation.id}`,
      label: article.legislation.title
    },
    {
      href: `/articles/${articleId}`,
      label: `Article ${article.article_number_text}`,
      current: true
    }
  ]

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href={`/legislation/${article.legislation.id}`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {article.legislation.title}
        </Link>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowToc(!showToc)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <List className="w-4 h-4 mr-1" />
            ToC
          </button>
          
          {/* Navigation between articles */}
          {navigation && (
            <div className="flex items-center space-x-1">
              {navigation.previous ? (
                <Link
                  href={`/articles/${navigation.previous.id}`}
                  className="p-1.5 rounded text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title={`Previous: Article ${navigation.previous.article_number_text}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              ) : (
                <div className="p-1.5 rounded text-gray-300 dark:text-gray-600">
                  <ChevronLeft className="w-4 h-4" />
                </div>
              )}
              
              <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 font-mono">
                {navigation.position.current} / {navigation.position.total}
              </span>
              
              {navigation.next ? (
                <Link
                  href={`/articles/${navigation.next.id}`}
                  className="p-1.5 rounded text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title={`Next: Article ${navigation.next.article_number_text}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="p-1.5 rounded text-gray-300 dark:text-gray-600">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
          {article.article_number_text}
          {article.title && (
            <span className="block text-2xl font-normal italic text-gray-700 dark:text-gray-300 mt-2">
              {article.title}
            </span>
          )}
        </h1>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          From {article.legislation.title} ({article.legislation.celex_number})
        </div>
      </div>

      {/* Article Content */}
      {article.markdown_content && (
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8">
            <div 
              className="whitespace-pre-wrap font-serif leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: renderMarkdownWithAnchors(article.markdown_content)
              }}
            />
          </div>
        </div>
      )}

      {/* Cross References */}
      {article?.markdown_content && (
        <CrossReferencePanel 
          content={article.markdown_content}
          currentLegislationId={article.legislation_id}
        />
      )}

      {/* Interpreting Cases */}
      {cases.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white">
            Cases interpreting this article
          </h2>
          
          <div className="space-y-6">
            {cases.map((caseData, index) => (
              <CaseInfoCard
                key={`${caseData.case_law.id}-${index}`}
                data={caseData}
                showOperativeParts={operativePartsVisible}
                simplified={operativePartsSimplified}
              />
            ))}
          </div>
        </div>
      )}

      {cases.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No cases interpreting this article found.
        </div>
      )}

      {/* Bottom Navigation */}
      {navigation && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {navigation.previous ? (
              <Link
                href={`/articles/${navigation.previous.id}`}
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                <div className="text-left">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Previous</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Article {navigation.previous.article_number_text}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-48">
                    {navigation.previous.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div></div>
            )}

            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Article {navigation.position.current} of {navigation.position.total}
              </div>
              <Link
                href={`/legislation/${article?.legislation.id}`}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                View all articles
              </Link>
            </div>

            {navigation.next ? (
              <Link
                href={`/articles/${navigation.next.id}`}
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Next</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Article {navigation.next.article_number_text}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-48">
                    {navigation.next.title}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}

      {/* Table of Contents */}
      <TableOfContents
        content={article?.markdown_content || ''}
        isOpen={showToc}
        onClose={() => setShowToc(false)}
      />
    </div>
  )
}