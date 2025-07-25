/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- PERFORMANCE OPTIMIZATIONS ---

  // Experimental feature to optimize package imports, reducing bundle size.
  // 'lucide-react' is a large library of icons, and this helps bundle only the icons that are actually used.
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Advanced image optimization.
  // - AVIF and WebP are modern, highly compressed image formats.
  // - deviceSizes and imageSizes are configured to generate a comprehensive set of responsive image sizes.
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Enables Gzip compression for smaller response sizes and faster page loads.
  compress: true,
  
  // --- BUNDLE OPTIMIZATION ---

  // Custom Webpack configuration for production builds.
  webpack: (config, { dev, isServer }) => {
    // These optimizations are applied only to the client-side production build.
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        // splitChunks configuration for code splitting.
        // This breaks up the application's JavaScript into smaller chunks,
        // which can be loaded on demand, improving initial page load time.
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // 'vendor' chunk contains all the code from node_modules.
            // This is beneficial because vendor code changes less frequently than application code,
            // so it can be cached by the browser for a longer time.
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            // 'common' chunk contains code that is shared between at least two different parts of the application.
            common: {
              name: 'common',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }
    
    return config
  },
  
  // --- SECURITY & CACHING HEADERS ---

  async headers() {
    return [
      {
        // These security headers are applied to all routes.
        source: '/(.*)',
        headers: [
          // Prevents the browser from inferring a content type other than what is declared.
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Prevents the page from being displayed in an iframe, which can help prevent clickjacking attacks.
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Enables the browser's built-in XSS protection.
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // These caching headers are applied to all API routes.
        // - 'public' means the response can be cached by any cache.
        // - 'max-age=60' means the response can be cached for 60 seconds.
        // - 'stale-while-revalidate=300' means that if a request is made for a cached response that is older than 60 seconds
        //   but newer than 300 seconds, the cached response will be served, and the cache will be revalidated in the background.
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        // These caching headers are applied to all static assets.
        // - 'public' means the response can be cached by any cache.
        // - 'max-age=31536000' means the response can be cached for one year.
        // - 'immutable' means the asset will never change, so the browser doesn't need to revalidate it.
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig