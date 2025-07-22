'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, List, Eye, EyeOff } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { CaseViewerData, TableOfContentsItem } from '@/types/database'

interface OperativePartsSidebarProps {
  caseData: CaseViewerData
  operativePartsVisible: boolean
  simplified: boolean
  isMobile?: boolean
}

export function OperativePartsSidebar({ 
  caseData, 
  operativePartsVisible, 
  simplified,
  isMobile = false 
}: OperativePartsSidebarProps) {
  const [tocExpanded, setTocExpanded] = useState(true)
  const [operativePartsExpanded, setOperativePartsExpanded] = useState(true)
  
  const { toggleOperativeParts, toggleOperativePartsMode } = useThemeStore()

  // Mock ToC data - in a real implementation, this would be extracted from case content
  const mockTocItems: TableOfContentsItem[] = [
    { id: 'background', title: 'Background to the dispute', level: 1, href: '#background' },
    { id: 'questions', title: 'Questions referred for preliminary ruling', level: 1, href: '#questions' },
    { id: 'question-1', title: 'The first question', level: 2, href: '#question-1' },
    { id: 'question-2', title: 'The second question', level: 2, href: '#question-2' },
    { id: 'costs', title: 'Costs', level: 1, href: '#costs' },
    { id: 'operative-part', title: 'Operative part', level: 1, href: '#operative-part' }
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className={`space-y-6 ${isMobile ? '' : 'sticky top-6 max-h-screen overflow-y-auto'}`}>
      {/* Table of Contents */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <button
          onClick={() => setTocExpanded(!tocExpanded)}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <List className="w-4 h-4 mr-2" />
            Table of Contents
          </h3>
          {tocExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {tocExpanded && (
          <nav className="space-y-1">
            {mockTocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.href)}
                className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  item.level === 2 ? 'ml-4 text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                }`}
              >
                {item.title}
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Operative Parts */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setOperativePartsExpanded(!operativePartsExpanded)}
            className="flex items-center text-left"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Operative Parts
            </h3>
            <span className="ml-2">
              {operativePartsExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleOperativeParts}
              className={`p-1 rounded text-xs transition-colors ${
                operativePartsVisible
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-400'
              }`}
              title={operativePartsVisible ? 'Hide operative parts' : 'Show operative parts'}
            >
              {operativePartsVisible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>

            {operativePartsVisible && (
              <button
                onClick={toggleOperativePartsMode}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {simplified ? 'Simplified' : 'Verbatim'}
              </button>
            )}
          </div>
        </div>

        {operativePartsExpanded && (
          <div className="space-y-4">
            {caseData.operative_parts && caseData.operative_parts.length > 0 ? (
              caseData.operative_parts
                .sort((a, b) => a.part_number - b.part_number)
                .map((operativePart) => (
                  <div key={operativePart.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Part {operativePart.part_number}
                      </span>
                      {operativePart.articles && operativePart.articles.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {operativePart.articles.map((article) => (
                            <span
                              key={article.id}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                              {article.article_number_text}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {operativePartsVisible && (
                      <div className="border-l-4 border-blue-200 dark:border-blue-800 pl-3 py-2 bg-blue-50 dark:bg-blue-950/20 rounded-r text-sm">
                        {simplified && operativePart.simplified_text
                          ? operativePart.simplified_text
                          : operativePart.verbatim_text || 'No text available'
                        }
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No operative parts available.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}