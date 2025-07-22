'use client'

import { useState } from 'react'
import { Sun, Moon, Settings, Eye, EyeOff, Type, Palette } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'

export function ThemeControls() {
  const {
    theme,
    fontSize,
    typeface,
    operativePartsVisible,
    operativePartsSimplified,
    setTheme,
    setFontSize,
    setTypeface,
    toggleOperativeParts,
    toggleOperativePartsMode
  } = useThemeStore()

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Theme settings"
      >
        <Settings className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4">
            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Theme
                </span>
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="inline-flex items-center px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {theme === 'light' ? (
                    <>
                      <Sun className="w-4 h-4 mr-2" />
                      Light
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 mr-2" />
                      Dark
                    </>
                  )}
                </button>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Font Size
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {(['sm', 'base', 'lg', 'xl'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        fontSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typeface */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Typeface
                </span>
                <button
                  onClick={() => setTypeface(typeface === 'serif' ? 'sans' : 'serif')}
                  className="inline-flex items-center px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Type className="w-4 h-4 mr-2" />
                  {typeface === 'serif' ? 'Serif' : 'Sans'}
                </button>
              </div>

              {/* Operative Parts Controls */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Operative Parts
                </span>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Visibility
                  </span>
                  <button
                    onClick={toggleOperativeParts}
                    className={`inline-flex items-center px-2 py-1 rounded text-xs transition-colors ${
                      operativePartsVisible
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {operativePartsVisible ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Visible
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hidden
                      </>
                    )}
                  </button>
                </div>

                {operativePartsVisible && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Mode
                    </span>
                    <button
                      onClick={toggleOperativePartsMode}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Palette className="w-3 h-3 mr-1" />
                      {operativePartsSimplified ? 'Simplified' : 'Verbatim'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}