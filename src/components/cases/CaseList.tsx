'use client'

import Link from 'next/link'
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
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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

                {/* Article Chips - placeholder for now */}
                {showArticleChips && (
                  <div className="flex flex-wrap gap-2">
                    {/* TODO: Replace with actual article data */}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      Article 6
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      Article 7
                    </span>
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