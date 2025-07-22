// Performance optimization utilities

/**
 * Simple memoization utility for expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map()
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    
    // Clean cache if it gets too large
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
    
    return result
  }) as T
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout | null = null
  let lastExecTime = 0
  
  return ((...args: any[]) => {
    const currentTime = Date.now()
    
    if (currentTime - lastExecTime > delay) {
      func(...args)
      lastExecTime = currentTime
    } else {
      if (timeoutId) clearTimeout(timeoutId)
      
      timeoutId = setTimeout(() => {
        func(...args)
        lastExecTime = Date.now()
      }, delay - (currentTime - lastExecTime))
    }
  }) as T
}

/**
 * Batch DOM updates to avoid layout thrashing
 */
export function batchUpdates(callback: () => void) {
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(callback)
  } else {
    setTimeout(callback, 16) // ~60fps fallback
  }
}

/**
 * Check if an element is in viewport with intersection observer
 */
export function isInViewport(element: Element): Promise<boolean> {
  return new Promise((resolve) => {
    const observer = new IntersectionObserver(([entry]) => {
      resolve(entry.isIntersecting)
      observer.disconnect()
    })
    
    observer.observe(element)
  })
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string = 'fetch', crossorigin: string = 'anonymous') {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  if (crossorigin) link.crossOrigin = crossorigin
  document.head.appendChild(link)
}

/**
 * Web vitals measurement utilities
 */
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  const start = performance.now()
  
  const finish = () => {
    const duration = performance.now() - start
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    
    // Send to analytics if needed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(duration)
      })
    }
  }
  
  const result = fn()
  
  if (result instanceof Promise) {
    return result.then((value) => {
      finish()
      return value
    }).catch((error) => {
      finish()
      throw error
    })
  } else {
    finish()
    return result
  }
}

/**
 * Lazy load components with intersection observer
 * Note: This requires React to be imported where it's used
 */
export function createLazyComponent<T>(
  importFn: () => Promise<{ default: T }>
) {
  // Return a function that can be used with React.lazy
  return () => {
    return new Promise<{ default: T }>((resolve) => {
      setTimeout(() => {
        importFn().then(resolve)
      }, 0)
    })
  }
}

/**
 * Efficient array updates for React state
 */
export function updateArrayItem<T>(
  array: T[],
  index: number,
  updater: (item: T) => T
): T[] {
  return array.map((item, i) => i === index ? updater(item) : item)
}

export function removeArrayItem<T>(array: T[], index: number): T[] {
  return array.filter((_, i) => i !== index)
}

export function addArrayItem<T>(array: T[], item: T, index?: number): T[] {
  if (index === undefined) {
    return [...array, item]
  }
  return [
    ...array.slice(0, index),
    item,
    ...array.slice(index)
  ]
}