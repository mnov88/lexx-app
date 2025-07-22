'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, ExternalLink, FileText } from 'lucide-react'
import { Legislation } from '@/types/database'

export function LegislationList() {
  const [legislations, setLegislations] = useState<Legislation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLegislations = async () => {
      try {
        const response = await fetch('/api/legislations')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setLegislations(data)
      } catch (error) {
        console.error('Error fetching legislations:', error)
        setLegislations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLegislations()
  }, [])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDocumentTypeLabel = (type: string | null) => {
    switch (type) {
      case 'REG':
        return 'Regulation'
      case 'DIR':
        return 'Directive'
      case 'DEC':
        return 'Decision'
      default:
        return type || 'Document'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-32"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {legislations.map((legislation) => (
        <Link
          key={legislation.id}
          href={`/legislation/${legislation.id}`}
          className="block group"
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {/* Document type and CELEX number */}
                <div className="flex items-center space-x-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <FileText className="w-3 h-3 mr-1" />
                    {getDocumentTypeLabel(legislation.document_type)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 font-mono">
                    {legislation.celex_number}
                  </span>
                  {legislation.publication_date && (
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(legislation.publication_date)}</span>
                    </div>
                  )}
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {legislation.title}
                </h3>
                
                {/* Summary */}
                {legislation.summary && (
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                    {legislation.summary}
                  </p>
                )}
              </div>
              
              <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors ml-4 flex-shrink-0" />
            </div>
          </div>
        </Link>
      ))}
      
      {legislations.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No legislation found.
        </div>
      )}
    </div>
  )
}