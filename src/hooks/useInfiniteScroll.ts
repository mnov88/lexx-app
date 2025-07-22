'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

interface UseInfiniteScrollReturn {
  isFetchingNextPage: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
  ref: (node?: Element | null) => void
}

export function useInfiniteScroll<T>(
  fetchMore: () => Promise<T[]>,
  hasMore: boolean = true,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const {
    threshold = 1.0,
    rootMargin = '0px',
    enabled = true
  } = options

  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(hasMore)

  const fetchNextPage = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage || !enabled) return

    setIsFetchingNextPage(true)
    
    try {
      const newItems = await fetchMore()
      
      // If no new items returned, we've reached the end
      if (!newItems || newItems.length === 0) {
        setHasNextPage(false)
      }
    } catch (error) {
      console.error('Error fetching next page:', error)
    } finally {
      setIsFetchingNextPage(false)
    }
  }, [fetchMore, isFetchingNextPage, hasNextPage, enabled])

  const ref = useCallback((node: Element | null | undefined) => {
    if (!node || !enabled) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, threshold, rootMargin, enabled])

  useEffect(() => {
    setHasNextPage(hasMore)
  }, [hasMore])

  return {
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    ref
  }
}