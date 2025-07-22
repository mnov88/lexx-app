'use client'

import { useState, useEffect } from 'react'
import { ReportConfig, Legislation, Article } from '@/types/database'
import { Plus, X, FileText, Settings2, Book, Scale, Download } from 'lucide-react'

interface ReportConfigurationProps {
  config: ReportConfig
  setConfig: (config: ReportConfig) => void
  legislations: Legislation[]
  onGenerate: () => void
  isGenerating: boolean
}

export function ReportConfiguration({
  config,
  setConfig,
  legislations,
  onGenerate,
  isGenerating
}: ReportConfigurationProps) {
  const [availableArticles, setAvailableArticles] = useState<Article[]>([])
  const [selectedLegislationDetails, setSelectedLegislationDetails] = useState<Legislation[]>([])

  // Fetch articles for selected legislations
  useEffect(() => {
    const fetchArticles = async () => {
      if (config.legislations.length === 0) {
        setAvailableArticles([])
        return
      }

      try {
        const articlePromises = config.legislations.map(legislationId =>
          fetch(`/api/legislations/${legislationId}/articles`).then(res => res.json())
        )
        
        const articlesResults = await Promise.all(articlePromises)
        const allArticles = articlesResults.flat()
        setAvailableArticles(allArticles)
      } catch (error) {
        console.error('Error fetching articles:', error)
        setAvailableArticles([])
      }
    }

    fetchArticles()
  }, [config.legislations])

  // Update selected legislation details
  useEffect(() => {
    const details = legislations.filter(leg => config.legislations.includes(leg.id))
    setSelectedLegislationDetails(details)
  }, [config.legislations, legislations])

  const addLegislation = (legislationId: string) => {
    if (!config.legislations.includes(legislationId)) {
      setConfig({
        ...config,
        legislations: [...config.legislations, legislationId]
      })
    }
  }

  const removeLegislation = (legislationId: string) => {
    setConfig({
      ...config,
      legislations: config.legislations.filter(id => id !== legislationId),
      // Remove articles from removed legislation
      articles: config.articles.filter(articleId => {
        const article = availableArticles.find(a => a.id === articleId)
        return article && article.legislation_id !== legislationId
      })
    })
  }

  const addArticle = (articleId: string) => {
    if (!config.articles.includes(articleId)) {
      setConfig({
        ...config,
        articles: [...config.articles, articleId]
      })
    }
  }

  const removeArticle = (articleId: string) => {
    setConfig({
      ...config,
      articles: config.articles.filter(id => id !== articleId)
    })
  }

  const selectedArticles = availableArticles.filter(article => 
    config.articles.includes(article.id)
  )

  const unselectedLegislations = legislations.filter(leg => 
    !config.legislations.includes(leg.id)
  )

  const unselectedArticles = availableArticles.filter(article => 
    !config.articles.includes(article.id)
  )

  return (
    <div className="space-y-8">
      {/* Report Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings2 className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Report Settings</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Title
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter report title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Template
            </label>
            <select
              value={config.template}
              onChange={(e) => setConfig({ ...config, template: e.target.value as ReportConfig['template'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="standard">Standard</option>
              <option value="detailed">Detailed</option>
              <option value="summary">Summary</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={config.description || ''}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of this report..."
          />
        </div>
      </div>

      {/* Content Selection */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Legislation Selection */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Scale className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Legislation</h2>
          </div>

          {/* Selected Legislations */}
          {selectedLegislationDetails.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selected ({selectedLegislationDetails.length})
              </h3>
              <div className="space-y-2">
                {selectedLegislationDetails.map((legislation) => (
                  <div
                    key={legislation.id}
                    className="flex items-start justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-200 truncate">
                        {legislation.title}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {legislation.celex_number}
                      </div>
                    </div>
                    <button
                      onClick={() => removeLegislation(legislation.id)}
                      className="ml-2 p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Legislations */}
          {unselectedLegislations.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available Legislation
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {unselectedLegislations.map((legislation) => (
                  <button
                    key={legislation.id}
                    onClick={() => addLegislation(legislation.id)}
                    className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {legislation.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {legislation.celex_number}
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedLegislationDetails.length === 0 && unselectedLegislations.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No legislation available
            </div>
          )}
        </div>

        {/* Article Selection */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Book className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Articles</h2>
          </div>

          {config.legislations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Select legislation to choose specific articles
            </div>
          ) : (
            <>
              {/* Selected Articles */}
              {selectedArticles.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selected Articles ({selectedArticles.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedArticles.map((article) => (
                      <div
                        key={article.id}
                        className="flex items-start justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-green-900 dark:text-green-200 truncate">
                            Article {article.article_number_text}: {article.title}
                          </div>
                        </div>
                        <button
                          onClick={() => removeArticle(article.id)}
                          className="ml-2 p-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Articles */}
              {unselectedArticles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Available Articles
                  </h3>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {unselectedArticles.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => addArticle(article.id)}
                        className="w-full text-left p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              Article {article.article_number_text}: {article.title}
                            </div>
                          </div>
                          <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedArticles.length === 0 && unselectedArticles.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No articles available for selected legislation
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content Options */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Content Options</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                id="includeArticleText"
                type="checkbox"
                checked={config.includeArticleText}
                onChange={(e) => setConfig({ ...config, includeArticleText: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeArticleText" className="text-sm text-gray-700 dark:text-gray-300">
                Include article text
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                id="includeOperativeParts"
                type="checkbox"
                checked={config.includeOperativeParts}
                onChange={(e) => setConfig({ ...config, includeOperativeParts: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeOperativeParts" className="text-sm text-gray-700 dark:text-gray-300">
                Include operative parts
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                id="includeCaseSummaries"
                type="checkbox"
                checked={config.includeCaseSummaries}
                onChange={(e) => setConfig({ ...config, includeCaseSummaries: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeCaseSummaries" className="text-sm text-gray-700 dark:text-gray-300">
                Include case summaries
              </label>
            </div>
          </div>

          <div className="space-y-4">
            {config.includeOperativeParts && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Operative Parts Mode
                </label>
                <select
                  value={config.operativePartsMode}
                  onChange={(e) => setConfig({ ...config, operativePartsMode: e.target.value as ReportConfig['operativePartsMode'] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="simplified">Simplified text</option>
                  <option value="verbatim">Verbatim text</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Output Format
              </label>
              <select
                value={config.format}
                onChange={(e) => setConfig({ ...config, format: e.target.value as ReportConfig['format'] })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="html">HTML</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-end">
        <button
          onClick={onGenerate}
          disabled={isGenerating || (config.legislations.length === 0 && config.articles.length === 0)}
          className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-md text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Report...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </>
          )}
        </button>
      </div>
    </div>
  )
}