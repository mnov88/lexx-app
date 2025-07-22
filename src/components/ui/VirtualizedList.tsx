'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface VirtualizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number
  containerHeight: number
  overscan?: number
  className?: string
  onLoadMore?: () => void
  hasNextPage?: boolean
  isLoadingMore?: boolean
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5,
  className = '',
  onLoadMore,
  hasNextPage = false,
  isLoadingMore = false
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollElementRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const totalHeight = items.length * itemHeight
  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  )

  const startIndex = Math.max(visibleStart - overscan, 0)
  const endIndex = Math.min(visibleEnd + overscan, items.length - 1)

  const visibleItems = items.slice(startIndex, endIndex + 1)

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    setScrollTop(scrollTop)
    setIsScrolling(true)

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Set scrolling to false after scrolling stops
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 150)

    // Load more when near the bottom
    if (
      onLoadMore &&
      hasNextPage &&
      !isLoadingMore &&
      scrollTop + containerHeight >= totalHeight - itemHeight * 2
    ) {
      onLoadMore()
    }
  }, [onLoadMore, hasNextPage, isLoadingMore, totalHeight, containerHeight, itemHeight])

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${startIndex * itemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{
                height: itemHeight,
                overflow: 'hidden',
              }}
              className={isScrolling ? 'pointer-events-none' : ''}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
          
          {isLoadingMore && (
            <div 
              style={{ height: itemHeight }}
              className="flex items-center justify-center"
            >
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-500">Loading more...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}