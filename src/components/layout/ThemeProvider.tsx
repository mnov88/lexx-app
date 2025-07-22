'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, fontSize, typeface } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    
    // Apply theme
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Apply font size
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl')
    root.classList.add(`text-${fontSize}`)
    
    // Apply typeface
    if (typeface === 'serif') {
      root.classList.add('font-serif')
      root.classList.remove('font-sans')
    } else {
      root.classList.add('font-sans')
      root.classList.remove('font-serif')
    }
  }, [theme, fontSize, typeface])

  return <>{children}</>
}