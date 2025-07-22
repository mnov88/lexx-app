'use client'

import Link from 'next/link'
import { Article } from '@/types/database'
import { ExternalLink } from 'lucide-react'

interface ArticleListProps {
  articles: Article[]
  showLegislationInfo?: boolean
}

export function ArticleList({ articles, showLegislationInfo = false }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No articles found.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/articles/${article.id}`}
          className="block group"
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                {/* Article Number and Title */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.article_number_text}
                    {article.title && (
                      <span className="font-normal italic ml-2">
                        {article.title}
                      </span>
                    )}
                  </h3>
                </div>
                
                {/* Article Content Preview */}
                {article.markdown_content && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {article.markdown_content.substring(0, 150)}...
                  </p>
                )}
              </div>
              
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors ml-3 flex-shrink-0" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}