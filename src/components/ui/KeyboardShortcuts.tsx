'use client'

import { useState, useEffect } from 'react'
import { X, Keyboard, Command, ArrowLeft, ArrowRight } from 'lucide-react'

interface KeyboardShortcut {
  keys: string[]
  description: string
  section: string
}

const shortcuts: KeyboardShortcut[] = [
  // Navigation
  { keys: ['←'], description: 'Previous article', section: 'Navigation' },
  { keys: ['→'], description: 'Next article', section: 'Navigation' },
  { keys: ['Esc'], description: 'Close modal/dropdown', section: 'Navigation' },
  
  // Search
  { keys: ['/', 'Cmd', 'K'], description: 'Focus search (coming soon)', section: 'Search' },
  { keys: ['Enter'], description: 'Search/Navigate to result', section: 'Search' },
  { keys: ['↑', '↓'], description: 'Navigate search results', section: 'Search' },
  
  // Content
  { keys: ['T'], description: 'Toggle table of contents', section: 'Content' },
  { keys: ['R'], description: 'Toggle cross-references (coming soon)', section: 'Content' },
  { keys: ['P'], description: 'Toggle operative parts', section: 'Content' },
  
  // Theme
  { keys: ['D'], description: 'Toggle dark mode (coming soon)', section: 'Theme' },
  { keys: ['+'], description: 'Increase font size (coming soon)', section: 'Theme' },
  { keys: ['-'], description: 'Decrease font size (coming soon)', section: 'Theme' },
  
  // Reports
  { keys: ['Cmd', 'S'], description: 'Save/Download report', section: 'Reports' },
  { keys: ['Cmd', 'P'], description: 'Print report', section: 'Reports' }
]

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault()
        onClose()
      }
      
      // Show shortcuts with ? key
      if (event.key === '?' && !isOpen) {
        event.preventDefault()
        // This would need to be connected to parent component
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.section]) {
      acc[shortcut.section] = []
    }
    acc[shortcut.section].push(shortcut)
    return acc
  }, {} as Record<string, KeyboardShortcut[]>)

  const renderKey = (key: string) => {
    const keyMap: Record<string, React.ReactElement> = {
      'Cmd': <Command className="w-3 h-3" />,
      '←': <ArrowLeft className="w-3 h-3" />,
      '→': <ArrowRight className="w-3 h-3" />,
      '↑': <span className="text-xs">↑</span>,
      '↓': <span className="text-xs">↓</span>
    }

    return keyMap[key] || <span className="text-xs font-mono">{key}</span>
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Keyboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {Object.entries(groupedShortcuts).map(([section, sectionShortcuts]) => (
            <div key={section} className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
                {section}
              </h3>
              
              <div className="space-y-2">
                {sectionShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center space-x-1">
                          {keyIndex > 0 && (
                            <span className="text-gray-400 text-xs">+</span>
                          )}
                          <div className="inline-flex items-center justify-center h-7 min-w-7 px-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-gray-200">
                            {renderKey(key)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">?</kbd> to show this dialog
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Esc</kbd> to close
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook to manage keyboard shortcuts modal
export function useKeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show shortcuts with ? (but not in input fields)
      if (
        event.key === '?' && 
        !isOpen &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return {
    isShortcutsOpen: isOpen,
    showShortcuts: () => setIsOpen(true),
    hideShortcuts: () => setIsOpen(false)
  }
}