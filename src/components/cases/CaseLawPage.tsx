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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [casesResponse, legislationsResponse] = await Promise.all([
          fetch('/api/cases'),
          fetch('/api/legislations')
        ])

        if (casesResponse.ok) {
          const casesResult = await casesResponse.json()
          setCases(casesResult.data || casesResult)
        }

        if (legislationsResponse.ok) {
          const legislationsData = await legislationsResponse.json()
          setLegislations(legislationsData)
        }
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
    
    if (!legislationId) {
      // Show all cases
      const response = await fetch('/api/cases')
      if (response.ok) {
        const data = await response.json()
        setCases(data.data || data)
      }
    } else {
      // Filter by legislation
      const response = await fetch(`/api/legislations/${legislationId}/cases`)
      if (response.ok) {
        const data = await response.json()
        setCases(data.data || data)
      }
    }
  }

  const handleArticleFilter = (articleId: string | null) => {
    setSelectedArticle(articleId)
    // TODO: Implement article-specific filtering
    // This would filter cases further by specific articles
  }

  const toggleGrouping = () => {
    setGroupByArticle(!groupByArticle)
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
          {cases.length} case{cases.length !== 1 ? 's' : ''} found
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
            <CaseList cases={cases} showArticleChips={Boolean(selectedLegislation)} />
          )}
        </div>
      </div>
    </div>
  )
}