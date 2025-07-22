'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, ExternalLink } from 'lucide-react'
import { CaseLaw } from '@/types/database'

export function LatestCases() {
  const [cases, setCases] = useState<CaseLaw[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLatestCases = async () => {
      try {
        console.log('Fetching latest cases...')
        // Try a simpler request first
        const response = await fetch('/api/cases?limit=5')
        console.log('Response status:', response.status)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))
        if (!response.ok) {
          const errorText = await response.text()
          console.error('API Error Response:', errorText)
          console.error('Full response:', response)
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
        }
        const result = await response.json()
        console.log('API Response:', result)
        console.log('Type of result:', typeof result)
        console.log('Is result array:', Array.isArray(result))
        console.log('Has result.data:', !!result.data)
        console.log('Type of result.data:', typeof result.data)
        console.log('Is result.data array:', Array.isArray(result.data))
        
        // Handle new paginated response format
        const casesData = result.data || result
        console.log('Final cases data:', casesData)
        console.log('Is final data array:', Array.isArray(casesData))
        
        // Ensure we always set an array
        if (Array.isArray(casesData)) {
          setCases(casesData)
        } else {
          console.warn('Cases data is not an array:', casesData)
          setCases([])
        }
      } catch (error) {
        console.error('Error fetching latest cases:', error)
        // Keep empty cases array to show "no cases" message
        setCases([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestCases()
  }, [])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-32"></div>
        ))}
      </div>
    )
  }

  // Safety check to ensure cases is always an array
  const safeCases = Array.isArray(cases) ? cases : []
  
  return (
    <div className="space-y-6">
      {safeCases.map((case_law) => (
        <Link
          key={case_law.id}
          href={`/cases/${case_law.id}`}
          className="block group"
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-md">
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
                <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {case_law.title}
                </h3>
                
                {/* Parties */}
                {case_law.parties && (
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    {case_law.parties}
                  </p>
                )}
                
                {/* Summary */}
                {case_law.summary_text && (
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                    {case_law.summary_text}
                  </p>
                )}
              </div>
              
              <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors ml-4 flex-shrink-0" />
            </div>
          </div>
        </Link>
      ))}
      
      {safeCases.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No recent cases found.
        </div>
      )}
    </div>
  )
}