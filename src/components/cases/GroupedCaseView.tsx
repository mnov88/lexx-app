'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { CaseInfoCard } from './CaseInfoCard'
import { useThemeStore } from '@/stores/useThemeStore'
import { Article, CaseInfoCardData } from '@/types/database'

interface GroupedCaseData {
  article: Article
  cases: CaseInfoCardData[]
}

interface GroupedCaseViewProps {
  legislationId: string
}

export function GroupedCaseView({ legislationId }: GroupedCaseViewProps) {
  const [groupedData, setGroupedData] = useState<GroupedCaseData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set())
  
  const { operativePartsVisible, operativePartsSimplified } = useThemeStore()

  useEffect(() => {
    const fetchGroupedData = async () => {
      try {
        // Fetch articles for the legislation
        const articlesResponse = await fetch(`/api/legislations/${legislationId}/articles`)
        if (!articlesResponse.ok) return

        const articles = await articlesResponse.json()

        // For each article, fetch cases that interpret it
        const groupedPromises = articles.map(async (article: Article) => {
          try {
            const casesResponse = await fetch(`/api/articles/${article.id}/cases`)
            if (!casesResponse.ok) return null

            const casesData = await casesResponse.json()
            
            if (casesData.length === 0) return null

            // Transform to CaseInfoCardData format
            const transformedCases = casesData.map((caseData: any) => ({
              case_law: caseData,
              operative_parts: caseData.operative_parts || [],
              context: 'article' as const
            }))

            return {
              article,
              cases: transformedCases
            }
          } catch (error) {
            console.error(`Error fetching cases for article ${article.id}:`, error)
            return null
          }
        })

        const results = await Promise.all(groupedPromises)
        const validResults = results.filter(Boolean) as GroupedCaseData[]
        
        // Sort by article number
        validResults.sort((a, b) => (a.article.article_number || 0) - (b.article.article_number || 0))
        
        setGroupedData(validResults)
        
        // Expand first few articles by default
        const initialExpanded = new Set(validResults.slice(0, 3).map(item => item.article.id))
        setExpandedArticles(initialExpanded)
      } catch (error) {
        console.error('Error fetching grouped case data:', error)
        setGroupedData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroupedData()
  }, [legislationId])

  const toggleArticleExpansion = (articleId: string) => {
    const newExpanded = new Set(expandedArticles)
    if (newExpanded.has(articleId)) {
      newExpanded.delete(articleId)
    } else {
      newExpanded.add(articleId)
    }
    setExpandedArticles(newExpanded)
  }

  const expandAll = () => {
    setExpandedArticles(new Set(groupedData.map(item => item.article.id)))
  }

  const collapseAll = () => {
    setExpandedArticles(new Set())
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-16 mb-4"></div>
            <div className="space-y-3 ml-6">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-24"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (groupedData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No articles with interpreting cases found for this legislation.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {groupedData.length} article{groupedData.length !== 1 ? 's' : ''} with interpreting cases
        </div>
        <div className="flex space-x-2">
          <button
            onClick={expandAll}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Expand all
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={collapseAll}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Collapse all
          </button>
        </div>
      </div>

      {/* Grouped Articles */}
      <div className="space-y-8">
        {groupedData.map(({ article, cases }) => {
          const isExpanded = expandedArticles.has(article.id)
          
          return (
            <div key={article.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Article Header */}
              <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => toggleArticleExpansion(article.id)}
                  className="w-full p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/articles/${article.id}`}
                          className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {article.article_number_text}
                          {article.title && (
                            <span className="font-normal italic ml-2">
                              {article.title}
                            </span>
                          )}
                        </Link>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {cases.length} case{cases.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {article.markdown_content && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
                          {article.markdown_content.substring(0, 200)}...
                        </p>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </button>
              </div>

              {/* Cases List */}
              {isExpanded && (
                <div className="p-4 space-y-4">
                  {cases.map((caseData, index) => (
                    <CaseInfoCard
                      key={`${caseData.case_law.id}-${index}`}
                      data={caseData}
                      showOperativeParts={operativePartsVisible}
                      simplified={operativePartsSimplified}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}