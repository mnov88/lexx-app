'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, Scale, FileText, ExternalLink } from 'lucide-react'
import { CaseViewerData } from '@/types/database'

interface ArticlesSidebarProps {
  caseData: CaseViewerData
  isMobile?: boolean
}

export function ArticlesSidebar({ caseData, isMobile = false }: ArticlesSidebarProps) {
  const [articlesExpanded, setArticlesExpanded] = useState(true)
  const [referencesExpanded, setReferencesExpanded] = useState(true)

  // Group articles by legislation
  const articlesByLegislation = new Map()
  caseData.interpreted_articles?.forEach(article => {
    const legId = article.legislation.id
    if (!articlesByLegislation.has(legId)) {
      articlesByLegislation.set(legId, {
        legislation: article.legislation,
        articles: []
      })
    }
    articlesByLegislation.get(legId).articles.push(article)
  })

  const legislationGroups = Array.from(articlesByLegislation.values())

  return (
    <div className={`space-y-6 ${isMobile ? '' : 'sticky top-6 max-h-screen overflow-y-auto'}`}>
      {/* Articles Interpreted */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <button
          onClick={() => setArticlesExpanded(!articlesExpanded)}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Scale className="w-4 h-4 mr-2" />
            Articles Interpreted
          </h3>
          {articlesExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {articlesExpanded && (
          <div className="space-y-4">
            {legislationGroups.length > 0 ? (
              legislationGroups.map(({ legislation, articles }) => (
                <div key={legislation.id} className="space-y-2">
                  {/* Legislation Header */}
                  <div className="space-y-1">
                    <Link
                      href={`/legislation/${legislation.id}`}
                      className="group block"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {legislation.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {legislation.celex_number}
                          </p>
                        </div>
                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors ml-2 flex-shrink-0" />
                      </div>
                    </Link>
                  </div>

                  {/* Articles List */}
                  <div className="ml-3 space-y-2">
                    {articles
                      .sort((a: any, b: any) => (a.article_number || 0) - (b.article_number || 0))
                      .map((article: any) => (
                        <Link
                          key={article.id}
                          href={`/articles/${article.id}`}
                          className="group block p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {article.article_number_text}
                                {article.title && (
                                  <span className="font-normal italic ml-1">
                                    {article.title}
                                  </span>
                                )}
                              </div>
                              
                              {/* Show which operative parts interpret this article */}
                              {article.operative_parts && article.operative_parts.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {article.operative_parts.map((op: any) => (
                                    <span
                                      key={op.id}
                                      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                    >
                                      Part {op.part_number}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors ml-2 flex-shrink-0" />
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No articles interpreted by this case.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Referenced Cases - Placeholder for future implementation */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <button
          onClick={() => setReferencesExpanded(!referencesExpanded)}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Referenced Cases
          </h3>
          {referencesExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {referencesExpanded && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Case references coming soon...
            </p>
            {/* Future: Show cases referenced in the case body text */}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Case Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Operative parts:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {caseData.operative_parts?.length || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Articles interpreted:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {caseData.interpreted_articles?.length || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Legislation pieces:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {legislationGroups.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}