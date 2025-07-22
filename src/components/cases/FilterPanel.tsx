'use client'

import { useState, useEffect } from 'react'
import { Legislation, Article } from '@/types/database'
import { X, ChevronDown, ChevronRight } from 'lucide-react'

interface FilterPanelProps {
  legislations: Legislation[]
  selectedLegislation: string | null
  selectedArticle: string | null
  onLegislationFilter: (legislationId: string | null) => void
  onArticleFilter: (articleId: string | null) => void
}

export function FilterPanel({
  legislations,
  selectedLegislation,
  selectedArticle,
  onLegislationFilter,
  onArticleFilter
}: FilterPanelProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [isArticlesExpanded, setIsArticlesExpanded] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      if (!selectedLegislation) {
        setArticles([])
        return
      }

      try {
        const response = await fetch(`/api/legislations/${selectedLegislation}/articles`)
        if (response.ok) {
          const data = await response.json()
          setArticles(data)
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
        setArticles([])
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
              {selectedArticle && (
                <button
                  onClick={() => onArticleFilter(null)}
                  className="w-full text-left p-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  Clear article filter
                </button>
              )}
              
              {articles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => onArticleFilter(article.id)}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    selectedArticle === article.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="font-medium">
                    {article.article_number_text}
                  </div>
                  {article.title && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                      {article.title}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {(selectedLegislation || selectedArticle) && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Active filters
            </span>
            <button
              onClick={() => {
                onLegislationFilter(null)
                onArticleFilter(null)
              }}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  )
}