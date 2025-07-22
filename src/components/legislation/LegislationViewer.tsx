'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SearchBar } from '@/components/ui/SearchBar'
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/Breadcrumbs'
import { ArticleList } from '@/components/articles/ArticleList'
import { CaseList } from '@/components/cases/CaseList'
import { Legislation, Article, CaseLaw } from '@/types/database'
import { Calendar, FileText, ArrowLeft } from 'lucide-react'

interface LegislationViewerProps {
  legislationId: string
}

export function LegislationViewer({ legislationId }: LegislationViewerProps) {
  const [legislation, setLegislation] = useState<Legislation | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [cases, setCases] = useState<CaseLaw[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAllArticles, setShowAllArticles] = useState(false)
  const [showAllCases, setShowAllCases] = useState(false)

  useEffect(() => {
    const fetchLegislationData = async () => {
      try {
        // Fetch legislation, articles, and cases in parallel
        const [legislationResponse, articlesResponse, casesResponse] = await Promise.all([
          fetch(`/api/legislations/${legislationId}`),
          fetch(`/api/legislations/${legislationId}/articles`),
          fetch(`/api/legislations/${legislationId}/cases`)
        ])

        if (!legislationResponse.ok) {
          throw new Error(`Failed to fetch legislation: ${legislationResponse.status}`)
        }

        const legislationData = await legislationResponse.json()
        setLegislation(legislationData)

        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json()
          setArticles(articlesData)
        }

        if (casesResponse.ok) {
          const casesData = await casesResponse.json()
          setCases(casesData.data || casesData)
        }
      } catch (error) {
        console.error('Error fetching legislation data:', error)
        setLegislation(null)
        setArticles([])
        setCases([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLegislationData()
  }, [legislationId])

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
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-32"></div>
        <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-16"></div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-64"></div>
          <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-64"></div>
        </div>
      </div>
    )
  }

  if (!legislation) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Legislation not found
        </h1>
        <Link 
          href="/legislation"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to legislation list
        </Link>
      </div>
    )
  }

  const displayedArticles = showAllArticles ? articles : articles.slice(0, 5)
  const displayedCases = showAllCases ? cases : cases.slice(0, 5)

  // Generate breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      href: '/legislation',
      label: 'Legislation'
    },
    {
      href: `/legislation/${legislationId}`,
      label: legislation.title,
      current: true
    }
  ]

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* Back Navigation */}
      <div>
        <Link 
          href="/legislation"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to legislation
        </Link>
      </div>

      {/* Legislation Header */}
      <div className="space-y-4">
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
        
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
          {legislation.title}
        </h1>
        
        {legislation.summary && (
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {legislation.summary}
          </p>
        )}
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl">
        <SearchBar 
          placeholder="Search within this legislation..." 
          context={legislationId}
        />
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Articles Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white">
              Articles
            </h2>
            {articles.length > 5 && (
              <button
                onClick={() => setShowAllArticles(!showAllArticles)}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                {showAllArticles ? 'Show less' : `Show all ${articles.length}`}
              </button>
            )}
          </div>
          
          <ArticleList articles={displayedArticles} />
        </div>

        {/* Cases Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white">
              Interpreting cases
            </h2>
            {cases.length > 5 && (
              <button
                onClick={() => setShowAllCases(!showAllCases)}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                {showAllCases ? 'Show less' : `Show all ${cases.length}`}
              </button>
            )}
          </div>
          
          <CaseList cases={displayedCases} showArticleChips />
        </div>
      </div>
    </div>
  )
}