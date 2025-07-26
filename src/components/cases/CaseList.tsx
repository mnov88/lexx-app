'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Calendar, ExternalLink } from 'lucide-react'
import { CaseLaw } from '@/types/database'
import { VirtualizedList } from '@/components/ui/VirtualizedList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

interface CaseListProps {
  cases: CaseLaw[]
  showArticleChips?: boolean
  compact?: boolean
  virtualized?: boolean
  onLoadMore?: () => Promise<CaseLaw[]>
  hasMore?: boolean
  isLoadingMore?: boolean
}

export function CaseList({ 
  cases, 
  showArticleChips = false, 
  compact = false,
  virtualized = false,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false
}: CaseListProps) {
  const [caseArticles, setCaseArticles] = useState<Record<string, any[]>>({})
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Fetch articles for cases when showArticleChips is enabled
  useEffect(() => {
    if (!showArticleChips || cases.length === 0) return

    const fetchArticlesForCases = async () => {
      try {
        const caseIds = cases.map(c => c.id)
        
        // Initialize empty map for all cases
        const emptyMap: Record<string, any[]> = {}
        cases.forEach(c => { emptyMap[c.id] = [] })
        setCaseArticles(emptyMap)
        
        // Process in batches of 25 to stay well under the 50 limit and avoid rate limiting
        const batchSize = 25
        const finalArticlesMap: Record<string, any[]> = {}
        
        for (let i = 0; i < caseIds.length; i += batchSize) {
          const batch = caseIds.slice(i, i + batchSize)
          
          try {
            const response = await fetch('/api/cases/articles/bulk', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ caseIds: batch })
            })
            
            if (response.ok) {
              const batchArticlesMap = await response.json()
              Object.assign(finalArticlesMap, batchArticlesMap)
            } else {
              console.warn(`Batch API failed for batch ${i / batchSize + 1}:`, response.status, response.statusText)
              // Add empty entries for this batch
              batch.forEach(caseId => {
                finalArticlesMap[caseId] = []
              })
            }
            
            // Small delay between batches to avoid rate limiting
            if (i + batchSize < caseIds.length) {
              await new Promise(resolve => setTimeout(resolve, 100))
            }
          } catch (batchError) {
            console.warn(`Error fetching batch ${i / batchSize + 1}:`, batchError)
            // Add empty entries for this batch
            batch.forEach(caseId => {
              finalArticlesMap[caseId] = []
            })
          }
        }
        
        setCaseArticles(finalArticlesMap)
      } catch (error) {
        console.error('Error in fetchArticlesForCases:', error)
        // Fallback to empty articles
        const emptyMap: Record<string, any[]> = {}
        cases.forEach(c => { emptyMap[c.id] = [] })
        setCaseArticles(emptyMap)
      }
    }

    fetchArticlesForCases()
  }, [cases, showArticleChips])

  if (cases.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No cases found.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {cases.map((case_law) => (
        <Link
          key={case_law.id}
          href={`/cases/${case_law.id}`}
          className="block group"
        >
          <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-sm ${
            compact ? 'p-4' : 'p-6'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {/* Case ID and Date */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{case_law.case_id_text}</span>
                  {case_law.date_of_judgment && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(case_law.date_of_judgment)}</span>
                    </div>
                  )}
                </div>
                
                {/* Title */}
                <h3 className={`font-serif font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                  compact ? 'text-base' : 'text-lg'
                }`}>
                  {case_law.title}
                </h3>
                
                {/* Parties */}
                {case_law.parties && (
                  <p className={`text-gray-600 dark:text-gray-300 italic ${
                    compact ? 'text-sm' : 'text-base'
                  }`}>
                    {case_law.parties}
                  </p>
                )}
                
                {/* Summary */}
                {case_law.summary_text && !compact && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                    {case_law.summary_text}
                  </p>
                )}

                {/* Article Chips */}
                {showArticleChips && caseArticles[case_law.id] && caseArticles[case_law.id].length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {caseArticles[case_law.id].map((article: any) => (
                      <span 
                        key={article.id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                        title={article.title || 'No title'}
                      >
                        {article.article_number_text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors ml-4 flex-shrink-0" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}