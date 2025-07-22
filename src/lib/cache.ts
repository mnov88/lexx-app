import { NextRequest, NextResponse } from 'next/server'

// Cache configuration
interface CacheConfig {
  duration: number // in milliseconds
  maxSize: number // maximum number of entries
  compression: boolean
  tags?: string[]
}

interface CacheEntry {
  key: string
  data: any
  timestamp: number
  expires: number
  size: number
  tags: string[]
  hits: number
  lastAccessed: number
}

// Memory-based cache implementation (upgradeable to Redis)
class MemoryCache {
  private cache: Map<string, CacheEntry> = new Map()
  private totalSize: number = 0
  private readonly maxTotalSize: number = 100 * 1024 * 1024 // 100MB

  // Get cached data
  get(key: string): any | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    // Check if expired
    if (Date.now() > entry.expires) {
      this.delete(key)
      return null
    }
    
    // Update access statistics
    entry.hits++
    entry.lastAccessed = Date.now()
    
    return entry.data
  }

  // Set cache data
  set(key: string, data: any, config: CacheConfig): void {
    const now = Date.now()
    const serialized = JSON.stringify(data)
    const size = serialized.length
    
    // Check cache size limits
    if (this.totalSize + size > this.maxTotalSize) {
      this.evictLRU(size)
    }
    
    const entry: CacheEntry = {
      key,
      data,
      timestamp: now,
      expires: now + config.duration,
      size,
      tags: config.tags || [],
      hits: 0,
      lastAccessed: now
    }
    
    // Remove old entry if exists
    this.delete(key)
    
    // Add new entry
    this.cache.set(key, entry)
    this.totalSize += size
    
    // Enforce max entries
    if (this.cache.size > config.maxSize) {
      this.evictLRU(0)
    }
  }

  // Delete cache entry
  delete(key: string): boolean {
    const entry = this.cache.get(key)
    if (entry) {
      this.cache.delete(key)
      this.totalSize -= entry.size
      return true
    }
    return false
  }

  // Delete by tags
  deleteByTags(tags: string[]): number {
    let deleted = 0
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.some(tag => tags.includes(tag))) {
        this.delete(key)
        deleted++
      }
    }
    
    return deleted
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
    this.totalSize = 0
  }

  // Get cache statistics
  getStats() {
    const entries = Array.from(this.cache.values())
    
    return {
      totalEntries: this.cache.size,
      totalSize: this.totalSize,
      averageSize: entries.length > 0 ? this.totalSize / entries.length : 0,
      totalHits: entries.reduce((sum, entry) => sum + entry.hits, 0),
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : null,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : null
    }
  }

  // Evict least recently used entries
  private evictLRU(requiredSpace: number): void {
    const entries = Array.from(this.cache.values())
      .sort((a, b) => a.lastAccessed - b.lastAccessed)
    
    for (const entry of entries) {
      if (this.totalSize + requiredSpace <= this.maxTotalSize && this.cache.size < 10000) {
        break
      }
      this.delete(entry.key)
    }
  }
}

// Global cache instance
const cache = new MemoryCache()

// Cache configurations for different endpoints
export const cacheConfigs = {
  // Static content - cache for 1 hour
  legislation: {
    duration: 60 * 60 * 1000, // 1 hour
    maxSize: 1000,
    compression: true,
    tags: ['legislation']
  },
  
  // Articles - cache for 30 minutes
  articles: {
    duration: 30 * 60 * 1000, // 30 minutes
    maxSize: 2000,
    compression: true,
    tags: ['articles']
  },
  
  // Case law - cache for 15 minutes
  cases: {
    duration: 15 * 60 * 1000, // 15 minutes
    maxSize: 1000,
    compression: true,
    tags: ['cases']
  },
  
  // Search results - cache for 5 minutes
  search: {
    duration: 5 * 60 * 1000, // 5 minutes
    maxSize: 500,
    compression: true,
    tags: ['search']
  },
  
  // Reports - don't cache (personalized)
  reports: {
    duration: 0,
    maxSize: 0,
    compression: false,
    tags: ['reports']
  }
}

// Generate cache key from request
export function generateCacheKey(request: NextRequest, prefix: string = ''): string {
  const url = new URL(request.url)
  const method = request.method
  const path = url.pathname
  const params = Array.from(url.searchParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  
  const baseKey = `${method}:${path}${params ? `?${params}` : ''}`
  return prefix ? `${prefix}:${baseKey}` : baseKey
}

// HOF for caching API responses
export function withCache<T extends any[]>(
  config: CacheConfig,
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>,
  keyPrefix?: string
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    // Don't cache if duration is 0
    if (config.duration === 0) {
      return await handler(request, ...args)
    }
    
    // Generate cache key
    const cacheKey = generateCacheKey(request, keyPrefix)
    
    // Try to get from cache
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      // Return cached response with headers
      const response = NextResponse.json(cachedData)
      response.headers.set('X-Cache', 'HIT')
      response.headers.set('X-Cache-Key', cacheKey)
      response.headers.set('Cache-Control', `public, max-age=${Math.floor(config.duration / 1000)}`)
      return response
    }
    
    try {
      // Execute handler
      const response = await handler(request, ...args)
      
      // Cache successful responses
      if (response.status === 200) {
        const responseData = await response.json()
        cache.set(cacheKey, responseData, config)
        
        // Return new response with cache headers
        const newResponse = NextResponse.json(responseData)
        newResponse.headers.set('X-Cache', 'MISS')
        newResponse.headers.set('X-Cache-Key', cacheKey)
        newResponse.headers.set('Cache-Control', `public, max-age=${Math.floor(config.duration / 1000)}`)
        
        // Copy other headers from original response
        response.headers.forEach((value, key) => {
          if (!newResponse.headers.has(key) && key !== 'content-length') {
            newResponse.headers.set(key, value)
          }
        })
        
        return newResponse
      }
      
      return response
    } catch (error) {
      console.error('Cache middleware error:', error)
      return await handler(request, ...args)
    }
  }
}

// Manual cache management functions
export const cacheManager = {
  // Get cached data
  get: (key: string) => cache.get(key),
  
  // Set cache data
  set: (key: string, data: any, config: CacheConfig) => cache.set(key, data, config),
  
  // Delete specific key
  delete: (key: string) => cache.delete(key),
  
  // Delete by tags (useful for invalidation)
  deleteByTags: (tags: string[]) => cache.deleteByTags(tags),
  
  // Clear all cache
  clear: () => cache.clear(),
  
  // Get cache statistics
  getStats: () => cache.getStats(),
  
  // Invalidate related caches
  invalidateLegislation: (legislationId?: string) => {
    const tags = ['legislation', 'articles', 'search']
    if (legislationId) {
      tags.push(`legislation:${legislationId}`)
    }
    return cache.deleteByTags(tags)
  },
  
  invalidateArticle: (articleId?: string) => {
    const tags = ['articles', 'cases', 'search']
    if (articleId) {
      tags.push(`article:${articleId}`)
    }
    return cache.deleteByTags(tags)
  },
  
  invalidateCase: (caseId?: string) => {
    const tags = ['cases', 'articles', 'search']
    if (caseId) {
      tags.push(`case:${caseId}`)
    }
    return cache.deleteByTags(tags)
  }
}

// Cache warming functions
export const cacheWarmer = {
  // Pre-warm frequently accessed data
  warmPopularContent: async () => {
    try {
      // This would make requests to popular endpoints to pre-populate cache
      console.log('Cache warming started...')
      
      // In a real implementation, you might:
      // 1. Fetch most popular legislation
      // 2. Pre-cache common search queries
      // 3. Load frequently accessed articles
      
      console.log('Cache warming completed')
    } catch (error) {
      console.error('Cache warming error:', error)
    }
  }
}

// Cleanup expired entries periodically
setInterval(() => {
  const stats = cache.getStats()
  console.log(`Cache cleanup - Entries: ${stats.totalEntries}, Size: ${stats.totalSize} bytes`)
}, 10 * 60 * 1000) // Every 10 minutes