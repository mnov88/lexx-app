'use client'

import { useState, useRef, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  fallback?: string
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder,
  fallback 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!imgRef.current) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observerRef.current?.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observerRef.current.observe(imgRef.current)

    return () => observerRef.current?.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
    >
      {!isInView && (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}
      
      {isInView && (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          )}
          
          {!hasError ? (
            <img
              src={src}
              alt={alt}
              onLoad={handleLoad}
              onError={handleError}
              className={`transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              } ${className}`}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-sm">Failed to load image</div>
                {fallback && (
                  <img src={fallback} alt={alt} className="mt-2 max-h-16" />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}