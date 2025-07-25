'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/ui/SearchBar'
import { CaseList } from '@/components/cases/CaseList'
import { FilterPanel } from '@/components/cases/FilterPanel'
import { GroupedCaseView } from '@/components/cases/GroupedCaseView'
import { CaseLaw, Legislation, Article } from '@/types/database'
import { Filter, Grid, List } from 'lucide-react'

export function CaseLawPage() {
  const [cases, setCases] = useState<CaseLaw[]>([])
  const [legislations, setLegislations] = useState<Legislation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [groupByArticle, setGroupByArticle] = useState(false)
  
  // Filter states
  const [selectedLegislation, setSelectedLegislation] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)
  
  // Pagination states
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 25,
    hasNext: false,
    hasPrev: false
  })
  const [currentOffset, setCurrentOffset] = useState(0)

  const fetchCases = async (offset = 0, legislationId?: string | null) => {
    try {
      const params = new URLSearchParams({
        limit: '25',
        offset: offset.toString()
      })
      
      let url = '/api/cases'
      if (legislationId) {
        url = `/api/legislations/${legislationId}/cases`
      }
      
      const response = await fetch(`${url}?${params}`)
      if (response.ok) {
        const result = await response.json()
        
        // Handle both paginated and non-paginated responses
        if (result.data && result.pagination) {
          setCases(result.data)
          setPagination(result.pagination)
        } else {
          setCases(result.data || result)
          // For non-paginated responses, set basic pagination
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: (result.data || result).length,
            itemsPerPage: 25,
            hasNext: false,
            hasPrev: false
          })
        }
      }
    } catch (error) {
      console.error('Error fetching cases:', error)
    }
  }

  const fetchCasesByArticle = async (articleId: string) => {
    try {
      const response = await fetch(`/api/articles/${articleId}/cases`)
      if (response.ok) {
        const result = await response.json()
        setCases(result)
        
        // Set basic pagination for article-filtered results (no pagination from API)
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: result.length,
          itemsPerPage: 25,
          hasNext: false,
          hasPrev: false
        })
      }
    } catch (error) {
      console.error('Error fetching cases by article:', error)
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const legislationsResponse = await fetch('/api/legislations')
        if (legislationsResponse.ok) {
          const legislationsData = await legislationsResponse.json()
          setLegislations(legislationsData)
        }
        
        await fetchCases(0)
      } catch (error) {
        console.error('Error fetching initial data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const handleLegislationFilter = async (legislationId: string | null) => {
    setSelectedLegislation(legislationId)
    setSelectedArticle(null) // Reset article filter
    setCurrentOffset(0) // Reset to first page
    
    await fetchCases(0, legislationId)
  }

  const handleArticleFilter = async (articleId: string | null) => {
    setSelectedArticle(articleId)
    setCurrentOffset(0) // Reset to first page
    
    if (articleId) {
      // Fetch cases that interpret this specific article
      await fetchCasesByArticle(articleId)
    } else {
      // If no article selected, fall back to legislation filter or all cases
      await fetchCases(0, selectedLegislation)
    }
  }

  const toggleGrouping = () => {
    setGroupByArticle(!groupByArticle)
  }

  const handlePageChange = async (newOffset: number) => {
    setCurrentOffset(newOffset)
    setIsLoading(true)
    await fetchCases(newOffset, selectedLegislation)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-16"></div>
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-64"></div>
          <div className="lg:col-span-3 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
          Case law
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          Explore EU court decisions and their interpretations of legislation. 
          Filter by legislation or group by article to find relevant cases.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl">
        <SearchBar placeholder="Search case law..." />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          
          {selectedLegislation && (
            <button
              onClick={toggleGrouping}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                groupByArticle
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {groupByArticle ? <Grid className="w-4 h-4 mr-2" /> : <List className="w-4 h-4 mr-2" />}
              {groupByArticle ? 'Grouped by article' : 'Group by article'}
            </button>
          )}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {pagination.totalItems > 0 
            ? `${pagination.totalItems} case${pagination.totalItems !== 1 ? 's' : ''} found`
            : 'No cases found'
          }
          {pagination.totalPages > 1 && (
            <span className="ml-2">
              (Page {pagination.currentPage} of {pagination.totalPages})
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filter Panel */}
        {showFilters && (
          <div className="lg:col-span-1">
            <FilterPanel
              legislations={legislations}
              selectedLegislation={selectedLegislation}
              selectedArticle={selectedArticle}
              onLegislationFilter={handleLegislationFilter}
              onArticleFilter={handleArticleFilter}
            />
          </div>
        )}

        {/* Cases List */}
        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          {groupByArticle && selectedLegislation ? (
            <GroupedCaseView legislationId={selectedLegislation} />
          ) : (
            <div className="space-y-6">
              <CaseList cases={cases} showArticleChips={Boolean(selectedLegislation)} />
              
              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentOffset - pagination.itemsPerPage)}
                      disabled={!pagination.hasPrev}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentOffset + pagination.itemsPerPage)}
                      disabled={!pagination.hasNext}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing{' '}
                        <span className="font-medium">{currentOffset + 1}</span>
                        {' '}to{' '}
                        <span className="font-medium">
                          {Math.min(currentOffset + pagination.itemsPerPage, pagination.totalItems)}
                        </span>
                        {' '}of{' '}
                        <span className="font-medium">{pagination.totalItems}</span>
                        {' '}results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentOffset - pagination.itemsPerPage)}
                          disabled={!pagination.hasPrev}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          ←
                        </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                          const pageNum = i + 1
                          const offset = (pageNum - 1) * pagination.itemsPerPage
                          const isCurrent = pagination.currentPage === pageNum
                          
                          return (
                            <button
                              key={i}
                              onClick={() => handlePageChange(offset)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                isCurrent
                                  ? 'z-10 bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
                                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                        
                        <button
                          onClick={() => handlePageChange(currentOffset + pagination.itemsPerPage)}
                          disabled={!pagination.hasNext}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          →
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}