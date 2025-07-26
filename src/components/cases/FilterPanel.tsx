'use client'

import { useState, useEffect } from 'react'
import { Legislation, Article } from '@/types/database'
import { X, ChevronDown, ChevronRight } from 'lucide-react'

interface FilterPanelProps {
  legislations: Legislation[]
  selectedLegislation: string | null
  selectedArticles: string[]
  onLegislationFilter: (legislationId: string | null) => void
  onArticleFilter: (articleIds: string[]) => void
}

export function FilterPanel({
  legislations,
  selectedLegislation,
  selectedArticles,
  onLegislationFilter,
  onArticleFilter
}: FilterPanelProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [articleCaseCounts, setArticleCaseCounts] = useState<Record<string, number>>({})
  const [isArticlesExpanded, setIsArticlesExpanded] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      if (!selectedLegislation) {
        setArticles([])
        setArticleCaseCounts({})
        return
      }

      try {
        const response = await fetch(`/api/legislations/${selectedLegislation}/articles`)
        if (response.ok) {
          const data = await response.json()
          setArticles(data)
          
          // Fetch case counts for each article using the bulk API
          const articleIds = data.map((article: Article) => article.id)
          if (articleIds.length > 0) {
            const casesResponse = await fetch('/api/articles/cases/bulk', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ articleIds })
            })
            
            if (casesResponse.ok) {
              const casesByArticle = await casesResponse.json()
              const counts: Record<string, number> = {}
              Object.entries(casesByArticle).forEach(([articleId, cases]) => {
                // Count unique cases (not operative parts) per article
                counts[articleId] = (cases as any[]).length
              })
              setArticleCaseCounts(counts)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
        setArticles([])
        setArticleCaseCounts({})
      }
    }

    fetchArticles()
  }, [selectedLegislation])

  const selectedLegislationData = legislations.find(l => l.id === selectedLegislation)

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-6">
      {/* Legislation Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Filter by legislation
        </h3>
        
        {selectedLegislation ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">
                  {selectedLegislationData?.title}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  {selectedLegislationData?.celex_number}
                </div>
              </div>
              <button
                onClick={() => onLegislationFilter(null)}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {legislations.map((legislation) => (
              <button
                key={legislation.id}
                onClick={() => onLegislationFilter(legislation.id)}
                className="w-full text-left p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {legislation.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {legislation.celex_number}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Article Filter - only show when legislation is selected */}
      {selectedLegislation && articles.length > 0 && (
        <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6">
          <button
            onClick={() => setIsArticlesExpanded(!isArticlesExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Filter by article
            </h3>
            {isArticlesExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {isArticlesExpanded && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedArticles.length > 0 && (
                <button
                  onClick={() => onArticleFilter([])}
                  className="w-full text-left p-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  Clear all article filters ({selectedArticles.length} selected)
                </button>
              )}
              
              {articles.map((article) => {
                const isSelected = selectedArticles.includes(article.id)
                const caseCount = articleCaseCounts[article.id] || 0
                
                return (
                  <label
                    key={article.id}
                    className={`flex items-start p-2 rounded text-sm cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onArticleFilter([...selectedArticles, article.id])
                        } else {
                          onArticleFilter(selectedArticles.filter(id => id !== article.id))
                        }
                      }}
                      className="mt-0.5 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {article.article_number_text}
                        </div>
                        {article.title && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                            {article.title}
                          </div>
                        )}
                      </div>
                      {caseCount > 0 && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          {caseCount}
                        </span>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {(selectedLegislation || selectedArticles.length > 0) && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Active filters
            </span>
            <button
              onClick={() => {
                onLegislationFilter(null)
                onArticleFilter([])
              }}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Clear all
            </button>
          </div>
          
          {/* Show selected articles */}
          {selectedArticles.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Articles ({selectedArticles.length}):
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedArticles.map(articleId => {
                  const article = articles.find(a => a.id === articleId)
                  return article ? (
                    <span
                      key={articleId}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                    >
                      {article.article_number_text}
                      <button
                        onClick={() => onArticleFilter(selectedArticles.filter(id => id !== articleId))}
                        className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        ×
                      </button>
                    </span>
                  ) : null
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}