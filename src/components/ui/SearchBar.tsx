'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDebounce, useDebouncedCallback } from '@/hooks/useDebounce'

interface SearchResult {
  id: string
  title: string
  type: 'legislation' | 'case' | 'article'
  subtitle?: string
  snippet?: string
  score?: number
  metadata?: Record<string, unknown>
}

interface SearchBarProps {
  placeholder?: string
  className?: string
  context?: string // Optional: legislation_id for scoped search
  autoFocus?: boolean
}

export function SearchBar({ 
  placeholder = "Search...", 
  className, 
  context,
  autoFocus = false 
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const debouncedQuery = useDebounce(query, 300)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    
    try {
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        limit: '8'
      })
      
      if (context) {
        params.append('context', context)
      }

      const response = await fetch(`/api/search?${params}`)
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }
      
      const data = await response.json()
      setResults(data.results || [])
      setIsOpen((data.results || []).length > 0)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      handleSearch(debouncedQuery)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [debouncedQuery, context])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'legislation':
        return '📜'
      case 'case':
        return '⚖️'
      case 'article':
        return '📄'
      default:
        return '📋'
    }
  }

  const navigateToResult = (result: SearchResult) => {
    let path = ''
    switch (result.type) {
      case 'legislation':
        path = `/legislation/${result.id}`
        break
      case 'case':
        path = `/cases/${result.id}`
        break
      case 'article':
        path = `/articles/${result.id}`
        break
      default:
        return
    }
    
    router.push(path)
    setIsOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(results.length > 0)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 text-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.id}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors duration-150"
              onClick={() => navigateToResult(result)}
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg">{getResultIcon(result.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {result.title}
                  </div>
                  {result.subtitle && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {result.subtitle}
                    </div>
                  )}
                  {result.snippet && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {result.snippet}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
          
          {results.length === 0 && query && !isLoading && (
            <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  )
}