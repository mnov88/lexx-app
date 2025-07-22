'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { extractCrossReferences, resolveCrossReferences } from '@/lib/crossReferences'
import { ExternalLink, FileText, Scale, Gavel, ChevronDown, ChevronRight } from 'lucide-react'

interface CrossReference {
  type: 'article' | 'legislation' | 'case'
  id: string
  text: string
  href: string
  context: string
}

interface CrossReferencePanelProps {
  content: string
  currentLegislationId?: string
  className?: string
}

export function CrossReferencePanel({ 
  content, 
  currentLegislationId,
  className = ''
}: CrossReferencePanelProps) {
  const [references, setReferences] = useState<CrossReference[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const extractAndResolveReferences = async () => {
      if (!content) return

      setIsLoading(true)
      
      try {
        const extracted = extractCrossReferences(content, currentLegislationId)
        
        if (extracted.length > 0) {
          // Try to resolve references to actual entities
          const resolved = await resolveCrossReferences(extracted, currentLegislationId)
          setReferences(resolved)
        } else {
          setReferences([])
        }
      } catch (error) {
        console.error('Error resolving cross-references:', error)
        setReferences(extractCrossReferences(content, currentLegislationId))
      } finally {
        setIsLoading(false)
      }
    }

    extractAndResolveReferences()
  }, [content, currentLegislationId])

  const getIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="w-4 h-4" />
      case 'legislation':
        return <Scale className="w-4 h-4" />
      case 'case':
        return <Gavel className="w-4 h-4" />
      default:
        return <ExternalLink className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 dark:bg-opacity-20'
      case 'legislation':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20'
      case 'case':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20'
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-20'
    }
  }

  const groupedReferences = references.reduce((acc, ref) => {
    if (!acc[ref.type]) acc[ref.type] = []
    
    // Avoid duplicates
    if (!acc[ref.type].some(existing => existing.text === ref.text)) {
      acc[ref.type].push(ref)
    }
    
    return acc
  }, {} as Record<string, CrossReference[]>)

  const totalReferences = references.length
  const uniqueReferences = Object.values(groupedReferences).reduce((total, group) => total + group.length, 0)

  if (totalReferences === 0 && !isLoading) {
    return null
  }

  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-t-lg"
      >
        <div className="flex items-center space-x-3">
          <ExternalLink className="w-5 h-5 text-gray-400" />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Cross References
            </h3>
            {!isLoading && uniqueReferences > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {uniqueReferences} reference{uniqueReferences !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        ) : (
          <>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </>
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {uniqueReferences === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No cross-references detected in content
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {Object.entries(groupedReferences).map(([type, refs]) => (
                <div key={type} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize flex items-center space-x-2">
                    {getIcon(type)}
                    <span>{type}s ({refs.length})</span>
                  </h4>
                  
                  <div className="space-y-2">
                    {refs.map((ref, index) => (
                      <div key={`${ref.id}-${index}`} className="group">
                        <Link
                          href={ref.href}
                          className={`block p-3 rounded-lg border transition-all ${getTypeColor(type)} hover:shadow-sm`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {ref.text}
                              </div>
                              {ref.context && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                  {ref.context}
                                </div>
                              )}
                            </div>
                            <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 ml-2 flex-shrink-0" />
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Click any reference to navigate • Found {totalReferences} total matches
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}