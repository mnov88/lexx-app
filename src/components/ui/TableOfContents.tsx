'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, List, X } from 'lucide-react'

export interface TocItem {
  id: string
  title: string
  level: number
  href: string
}

interface TableOfContentsProps {
  content: string
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function TableOfContents({ content, isOpen, onClose, className = '' }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!content) return

    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const items: TocItem[] = []
    const usedIds = new Set<string>()
    let match
    let index = 0

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const title = match[2].trim()
      
      let baseId = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
      
      // Ensure the ID is not empty
      if (!baseId) {
        baseId = `heading-${index}`
      }
      
      // Make sure the ID is unique
      let id = baseId
      let counter = 1
      while (usedIds.has(id)) {
        id = `${baseId}-${counter}`
        counter++
      }
      usedIds.add(id)

      items.push({
        id,
        title,
        level,
        href: `#${id}`
      })
      
      index++
    }

    setTocItems(items)
    
    // Auto-expand top-level sections
    const topLevelIds = items.filter(item => item.level === 1).map(item => item.id)
    setExpandedSections(new Set(topLevelIds))
  }, [content])

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedSections(newExpanded)
  }

  const scrollToHeading = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
      onClose()
    }
  }

  const getVisibleChildren = (parentLevel: number, startIndex: number): TocItem[] => {
    const children: TocItem[] = []
    
    for (let i = startIndex + 1; i < tocItems.length; i++) {
      const item = tocItems[i]
      
      if (item.level <= parentLevel) {
        break // Found a sibling or parent, stop collecting children
      }
      
      if (item.level === parentLevel + 1) {
        children.push(item)
      }
    }
    
    return children
  }

  const renderTocItem = (item: TocItem, index: number) => {
    const children = getVisibleChildren(item.level, index)
    const hasChildren = children.length > 0
    const isExpanded = expandedSections.has(item.id)
    const shouldShowChildren = hasChildren && isExpanded

    return (
      <div key={item.id} className="group">
        <div className={`flex items-center py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
          item.level === 1 ? 'font-medium' : ''
        }`}>
          {hasChildren && (
            <button
              onClick={() => toggleSection(item.id)}
              className="mr-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}
          
          <button
            onClick={() => scrollToHeading(item.href)}
            className={`flex-1 text-left truncate ${
              item.level === 1 
                ? 'text-gray-900 dark:text-white' 
                : item.level === 2
                ? 'text-gray-700 dark:text-gray-300 ml-4'
                : 'text-gray-600 dark:text-gray-400 ml-8'
            } hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
          >
            {item.title}
          </button>
        </div>

        {shouldShowChildren && (
          <div className="ml-4 border-l border-gray-200 dark:border-gray-700 pl-2">
            {children.map((child, childIndex) => 
              renderTocItem(child, tocItems.indexOf(child))
            )}
          </div>
        )}
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <List className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Table of Contents
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tocItems.length > 0 ? (
            <div className="space-y-1">
              {tocItems
                .filter(item => item.level === 1)
                .map((item, index) => renderTocItem(item, tocItems.indexOf(item)))
              }
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <List className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No headings found in content</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Click on any heading to navigate • Use ↑↓ to navigate • Press Esc to close
          </div>
        </div>
      </div>
    </div>
  )
}