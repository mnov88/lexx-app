'use client'

import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  renderTime: number
  componentMountTime: number
  updateCount: number
}

export function usePerformanceMonitor(componentName: string, enabled = process.env.NODE_ENV === 'development') {
  const mountTime = useRef<number | undefined>(undefined)
  const renderCount = useRef(0)
  const lastRenderTime = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!enabled) return

    // Track component mount time
    mountTime.current = performance.now()

    return () => {
      if (mountTime.current) {
        const totalMountTime = performance.now() - mountTime.current
        console.log(`[Performance] ${componentName} total lifetime: ${totalMountTime.toFixed(2)}ms`)
      }
    }
  }, [componentName, enabled])

  useEffect(() => {
    if (!enabled) return

    renderCount.current += 1
    const currentTime = performance.now()

    if (lastRenderTime.current) {
      const renderDuration = currentTime - lastRenderTime.current
      
      if (renderDuration > 16) { // More than one frame at 60fps
        console.warn(`[Performance] ${componentName} slow render #${renderCount.current}: ${renderDuration.toFixed(2)}ms`)
      }
    }

    lastRenderTime.current = currentTime
  })

  const logMetrics = () => {
    if (!enabled) return

    const metrics: PerformanceMetrics = {
      renderTime: lastRenderTime.current ? performance.now() - lastRenderTime.current : 0,
      componentMountTime: mountTime.current ? performance.now() - mountTime.current : 0,
      updateCount: renderCount.current
    }

    console.log(`[Performance] ${componentName} metrics:`, metrics)
    return metrics
  }

  return { logMetrics, renderCount: renderCount.current }
}

export function useRenderCount(componentName: string) {
  const renderCount = useRef(0)
  
  useEffect(() => {
    renderCount.current += 1
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Render] ${componentName} rendered ${renderCount.current} times`)
    }
  })
  
  return renderCount.current
}