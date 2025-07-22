'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Menu, X } from 'lucide-react'
import { OperativePartsSidebar } from './OperativePartsSidebar'
import { ArticlesSidebar } from './ArticlesSidebar'
import { CaseBody } from './CaseBody'
import { useThemeStore } from '@/stores/useThemeStore'
import { CaseViewerData } from '@/types/database'

interface CaseViewerProps {
  caseId: string
}

export function CaseViewer({ caseId }: CaseViewerProps) {
  const [caseData, setCaseData] = useState<CaseViewerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  
  const { operativePartsVisible, operativePartsSimplified } = useThemeStore()

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const response = await fetch(`/api/cases/${caseId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch case: ${response.status}`)
        }
        const data = await response.json()
        setCaseData(data)
      } catch (error) {
        console.error('Error fetching case data:', error)
        setCaseData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCaseData()
  }, [caseId])

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
      <div className="min-h-screen">
        {/* Mobile header skeleton */}
        <div className="lg:hidden animate-pulse bg-gray-100 dark:bg-gray-800 h-16 mb-4"></div>
        
        {/* Desktop layout skeleton */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 min-h-screen">
          <div className="col-span-3 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
          <div className="col-span-6 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
          <div className="col-span-3 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Case not found
        </h1>
        <Link 
          href="/cases"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to case law
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden mb-4">
        <div className="flex items-center justify-between mb-4">
          <Link 
            href="/cases"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to cases
          </Link>
        </div>

        {/* Case Header - Mobile */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 dark:text-white">
              {caseData.case_id_text}
            </span>
            {caseData.date_of_judgment && (
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(caseData.date_of_judgment)}</span>
              </div>
            )}
          </div>
          
          {caseData.parties && (
            <p className="text-gray-600 dark:text-gray-300 italic">
              {caseData.parties}
            </p>
          )}
        </div>

        {/* Mobile Control Buttons */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setLeftSidebarOpen(true)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-4 h-4 mr-2" />
            ToC & Operative Parts
          </button>
          <button
            onClick={() => setRightSidebarOpen(true)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-4 h-4 mr-2" />
            References
          </button>
        </div>
      </div>

      {/* Desktop Three-Pane Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 min-h-screen">
        {/* Left Sidebar - Operative Parts & ToC */}
        <div className="col-span-3">
          <OperativePartsSidebar 
            caseData={caseData}
            operativePartsVisible={operativePartsVisible}
            simplified={operativePartsSimplified}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-6">
          <CaseBody caseData={caseData} />
        </div>

        {/* Right Sidebar - Articles Interpreted */}
        <div className="col-span-3">
          <ArticlesSidebar caseData={caseData} />
        </div>
      </div>

      {/* Mobile Case Body */}
      <div className="lg:hidden">
        <CaseBody caseData={caseData} isMobile />
      </div>

      {/* Mobile Sidebars as Modals */}
      {leftSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute inset-y-0 left-0 w-80 max-w-full bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Table of Contents & Operative Parts
              </h3>
              <button
                onClick={() => setLeftSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full">
              <OperativePartsSidebar 
                caseData={caseData}
                operativePartsVisible={operativePartsVisible}
                simplified={operativePartsSimplified}
                isMobile
              />
            </div>
          </div>
        </div>
      )}

      {rightSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute inset-y-0 right-0 w-80 max-w-full bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                References
              </h3>
              <button
                onClick={() => setRightSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full">
              <ArticlesSidebar caseData={caseData} isMobile />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}