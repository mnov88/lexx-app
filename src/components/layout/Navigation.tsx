'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Scale, FileText, BookOpen, Printer, MessageSquare, User, LogOut, LogIn } from 'lucide-react'
import { ThemeControls } from '@/components/ui/ThemeControls'
import { useAuth } from '@/components/auth/AuthProvider'
import { UserRole } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'

const navigationItems = [
  { href: '/', label: 'Home', icon: Search, public: true },
  { href: '/legislation', label: 'Legislation', icon: Scale, public: true },
  { href: '/cases', label: 'Case law', icon: FileText, public: true },
  { href: '/reports', label: 'Reports', icon: Printer, public: true }, // Temporarily public for testing
  { href: '/chat', label: 'AI assistant', icon: MessageSquare, requiresAuth: true },
]

export function Navigation() {
  const pathname = usePathname()
  const { isAuthenticated, profile, signOut, loading } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                Lexx
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems
                .filter(item => item.public || isAuthenticated)
                .map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                        isActive
                          ? 'border-gray-900 text-gray-900 dark:border-white dark:text-white'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300'
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
            </div>
          </div>
          
          {/* User Controls & Theme */}
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {isAuthenticated ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {profile?.full_name || profile?.email?.split('@')[0] || 'User'}
                      </span>
                      {profile?.role && (
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          profile.role === UserRole.ADMIN ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" :
                          profile.role === UserRole.LAWYER ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" :
                          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        )}>
                          {profile.role}
                        </span>
                      )}
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                          {profile?.email}
                          {profile?.organization && (
                            <div>{profile.organization}</div>
                          )}
                        </div>
                        <button
                          onClick={async () => {
                            await signOut()
                            setShowUserMenu(false)
                          }}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}
              </>
            )}
            <ThemeControls />
          </div>
        </div>
      </div>
    </nav>
  )
}