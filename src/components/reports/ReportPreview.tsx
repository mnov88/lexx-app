'use client'

import { ReportData } from '@/types/database'
import { Eye, Download, FileText, Clock, Scale, Book } from 'lucide-react'

interface ReportPreviewProps {
  reportData: ReportData
  onDownloadHtml: () => void
  onDownloadPdf: () => void
}

export function ReportPreview({
  reportData,
  onDownloadHtml,
  onDownloadPdf
}: ReportPreviewProps) {
  const { config, content } = reportData

  return (
    <div className="space-y-6">
      {/* Report Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Report Preview</h2>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Generated {new Date(content.generatedAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="text-sm font-medium text-blue-900 dark:text-blue-200">
                {content.legislations.length} Legislation{content.legislations.length !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Selected for analysis
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Book className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <div className="text-sm font-medium text-green-900 dark:text-green-200">
                {content.totalArticles} Article{content.totalArticles !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                Included in report
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <div className="text-sm font-medium text-purple-900 dark:text-purple-200">
                {content.totalCases} Case{content.totalCases !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                Referenced in analysis
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
            Report Configuration
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Template:</span>
              <span className="ml-2 text-gray-900 dark:text-white capitalize">{config.template}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Format:</span>
              <span className="ml-2 text-gray-900 dark:text-white uppercase">{config.format}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Article Text:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {config.includeArticleText ? 'Included' : 'Excluded'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Operative Parts:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {config.includeOperativeParts 
                  ? `${config.operativePartsMode} mode` 
                  : 'Excluded'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content Preview */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            {config.title}
          </h1>
          {config.description && (
            <p className="text-gray-600 dark:text-gray-400">
              {config.description}
            </p>
          )}
          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Generated on {new Date(content.generatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Content Structure Preview */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-6">
            {content.legislations.map((legislation, index) => (
              <div key={legislation.id} className="border-l-4 border-blue-200 dark:border-blue-800 pl-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {index + 1}. {legislation.title}
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  CELEX: {legislation.celex_number}
                </div>
                
                {legislation.articles.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
                      Articles ({legislation.articles.length})
                    </h3>
                    <div className="grid gap-2">
                      {legislation.articles.slice(0, 3).map((article) => (
                        <div key={article.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded border-l-2 border-green-200 dark:border-green-800">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Article {article.article_number_text}: {article.title}
                          </div>
                          {article.cases.length > 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {article.cases.length} interpreting case{article.cases.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      ))}
                      {legislation.articles.length > 3 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                          ... and {legislation.articles.length - 3} more articles
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {content.legislations.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No content to preview
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onDownloadHtml}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <FileText className="w-4 h-4 mr-2" />
          Download HTML
        </button>
        <button
          onClick={onDownloadPdf}
          className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </button>
      </div>
    </div>
  )
}