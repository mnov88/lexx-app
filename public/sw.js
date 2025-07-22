// Service Worker for Lexx App
const CACHE_NAME = 'lexx-app-v1'
const API_CACHE_NAME = 'lexx-api-v1'

// Cache these static assets
const STATIC_ASSETS = [
  '/',
  '/legislation',
  '/cases',
  '/reports',
  '/_next/static/css/',
  '/_next/static/js/',
]

// Cache these API endpoints with different strategies
const API_ENDPOINTS = {
  // Cache for 5 minutes
  SHORT_CACHE: [
    '/api/search',
    '/api/cases',
  ],
  // Cache for 1 hour
  MEDIUM_CACHE: [
    '/api/legislations',
    '/api/articles',
  ],
  // Cache for 24 hours
  LONG_CACHE: [
    '/api/legislations/',
    '/api/articles/',
  ]
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS.filter(url => !url.includes('_next')))
    })
  )
  
  // Skip waiting to activate immediately
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  // Claim all clients
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }
  
  // Handle static assets
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'style') {
    event.respondWith(handleStaticRequest(request))
    return
  }
  
  // Default: network first
  event.respondWith(fetch(request))
})

async function handleApiRequest(request) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  // Determine cache strategy
  let cacheTime = 0
  let strategy = 'network-first'
  
  if (API_ENDPOINTS.LONG_CACHE.some(endpoint => pathname.startsWith(endpoint))) {
    cacheTime = 24 * 60 * 60 * 1000 // 24 hours
    strategy = 'cache-first'
  } else if (API_ENDPOINTS.MEDIUM_CACHE.some(endpoint => pathname.startsWith(endpoint))) {
    cacheTime = 60 * 60 * 1000 // 1 hour
  } else if (API_ENDPOINTS.SHORT_CACHE.some(endpoint => pathname.startsWith(endpoint))) {
    cacheTime = 5 * 60 * 1000 // 5 minutes
  }
  
  const cache = await caches.open(API_CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  // Check if cached response is still valid
  if (cachedResponse && cacheTime > 0) {
    const cachedTime = new Date(cachedResponse.headers.get('sw-cached-time') || 0)
    const now = new Date()
    
    if (now.getTime() - cachedTime.getTime() < cacheTime) {
      return cachedResponse
    }
  }
  
  try {
    // Fetch from network
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok && cacheTime > 0) {
      // Clone and add timestamp header
      const responseToCache = networkResponse.clone()
      const headers = new Headers(responseToCache.headers)
      headers.set('sw-cached-time', new Date().toISOString())
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      })
      
      cache.put(request, modifiedResponse)
    }
    
    return networkResponse
  } catch (error) {
    // Network failed, return cached version if available
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return error response
    return new Response(
      JSON.stringify({ error: 'Network error and no cache available' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // For navigation requests, return offline page
    if (request.destination === 'document') {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Lexx - Offline</title>
          <style>
            body { font-family: system-ui; text-align: center; padding: 2rem; }
            .offline { color: #666; }
          </style>
        </head>
        <body>
          <h1>Lexx EU Legal Research</h1>
          <div class="offline">
            <p>You're currently offline. Please check your connection and try again.</p>
          </div>
        </body>
        </html>`,
        { 
          headers: { 'Content-Type': 'text/html' }
        }
      )
    }
    
    throw error
  }
}