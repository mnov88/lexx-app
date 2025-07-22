'use client'

import Link from 'next/link'
import { Calendar, LinkIcon } from 'lucide-react'
import { CaseInfoCardData } from '@/types/database'

interface CaseInfoCardProps {
  data: CaseInfoCardData
  showOperativeParts?: boolean
  simplified?: boolean
}

export function CaseInfoCard({ 
  data, 
  showOperativeParts = true, 
  simplified = false 
}: CaseInfoCardProps) {
  const { case_law, operative_parts, context } = data

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Filter operative parts based on context
  const relevantOperativeParts = operative_parts || []

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-md group">
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
          
          {/* Case Title */}
          <Link 
            href={`/cases/${case_law.id}`}
            className="block"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {case_law.title}
            </h3>
          </Link>
          
          {/* Parties */}
          {case_law.parties && (
            <p className="text-gray-600 dark:text-gray-300 italic">
              {case_law.parties}
            </p>
          )}
          
          {/* Operative Parts */}
          {showOperativeParts && relevantOperativeParts.length > 0 && (
            <div className="space-y-2">
              {relevantOperativeParts.map((operativePart) => (
                <div
                  key={operativePart.id}
                  className="border-l-4 border-blue-200 dark:border-blue-800 pl-4 py-2 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-r group/operative relative"
                >
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {simplified && operativePart.simplified_text
                      ? operativePart.simplified_text
                      : operativePart.verbatim_text
                    }
                  </div>
                  {operativePart.part_number && (
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Operative part {operativePart.part_number}
                      </div>
                      <Link
                        href={`/cases/${case_law.id}#operative-part-${operativePart.part_number}`}
                        className="opacity-0 group-hover/operative:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        title={`Link to operative part ${operativePart.part_number}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LinkIcon className="w-3 h-3 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}