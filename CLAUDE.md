# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a legal software project for browsing EU legislation and case law. The system allows lawyers to navigate legislation article by article, discover case law that interprets specific articles, and generate reports. Key features include:

- Article-by-article navigation of EU legislation
- Case law interpretation linking to specific articles  
- Bidirectional navigation between legislation and case law
- Report generation for operative parts per selected articles
- Search functionality across legislation and case law

## Database Architecture

The project uses Supabase with the following core entities:

### Core Tables
- `legislations` - EU legislation documents with CELEX numbers, titles, markdown content
- `articles` - Individual articles within legislation, linked to parent legislation
- `case_laws` - CJEU case law with operative parts, HTML/plaintext content
- `operative_parts` - Individual rulings within cases that interpret specific articles
- `document_chunks` - Text chunks with embeddings for search functionality

### Key Relationships
- `case_law_interprets_article` - Links cases to articles they interpret (convenience table)
- `operative_part_interprets_article` - Links specific operative parts to articles (primary relationship)
- `operative_part_mentions_legislation` - Tracks legislative references in operative parts

### Important Notes
- `operative_part_mentions_article` is deprecated; use `interprets_article` instead
- The relationship between case law and articles is primarily through operative parts
- Each operative part has both `verbatim_text` and `simplified_text` versions

## Development Status

**Phase 1 Complete - Production Ready!** Core infrastructure and main pages implemented in `/lexx-app/` directory.

### ✅ **Phase 1: Production Infrastructure - COMPLETED**
- **✅ Authentication System**: Complete Supabase Auth integration with role-based access control (Lawyer, Admin, Readonly)
- **✅ Security Infrastructure**: Rate limiting, input validation, middleware protection, XSS/SQL injection prevention
- **✅ Performance & Caching**: Memory-based caching system (Redis-ready), API response caching, LRU eviction
- **✅ API Enhancement**: Pagination with metadata, comprehensive validation, error handling
- **✅ Monitoring & Observability**: Structured logging system, health checks (/health, /ready, /live), error tracking
- **✅ Production Build**: TypeScript compilation, Next.js static generation, all 20 pages building successfully

### ✅ **Core Application Features - COMPLETED**
- **✅ Next.js 15 application** with TypeScript, Tailwind CSS, and App Router
- **✅ Supabase integration** with real database queries and authentication
- **✅ Home page** with search functionality and latest cases
- **✅ Legislation system** - listing page and individual legislation viewer
- **✅ Case law page** with filtering by legislation and article
- **✅ Article viewer** with interpreting cases display
- **✅ CaseInfoCard component** with context-aware operative parts
- **✅ Theme system** with dark mode, font controls, and operative parts preferences
- **✅ Responsive navigation** with proper routing and auth protection

### 🚧 **In Progress**
- Fix runtime array errors in LatestCases component
- Debug API response format compatibility

### 📋 **Phase 2: Core Frontend Features (Next Priority)**
- Three-pane case law viewer with sidebars
- Advanced case law filtering and grouping
- Report builder interface with template selection
- Enhanced search functionality with autocomplete
- Cross-references between cases and articles

### 🗂️ **Key Implementation Files**

#### **Production Infrastructure**
- `/lexx-app/src/lib/auth.ts` - Supabase authentication with role-based helpers
- `/lexx-app/src/lib/validation.ts` - Comprehensive input validation and sanitization
- `/lexx-app/src/lib/cache.ts` - Memory-based caching system with LRU eviction
- `/lexx-app/src/lib/logger.ts` - Structured logging with specialized methods
- `/lexx-app/src/lib/rateLimit.ts` - Memory-based rate limiting with burst protection
- `/lexx-app/src/middleware.ts` - Route protection and rate limiting middleware
- `/lexx-app/src/app/api/health/` - Health check endpoints for monitoring

#### **Core Application**
- `/lexx-app/src/app/api/` - Enhanced API routes with pagination, validation, caching
- `/lexx-app/src/components/` - Reusable UI components with auth integration
- `/lexx-app/src/components/auth/` - Authentication components and providers
- `/lexx-app/src/stores/` - Zustand state management
- `/lexx-app/src/types/database.ts` - Complete type definitions

#### **Configuration**
- `/lexx-app/.env.local` - Environment variables (Supabase keys, API URLs)
- `/lexx-app/next.config.js` - Next.js configuration with security headers

### 📖 **Documentation**
- `DatabaseStructure.md` - Complete database schema and sample data
- `Deliverables.md` - Detailed feature requirements and UI specifications  
- `Design.md` - Design philosophy and visual guidelines
- `docs/GAP_ANALYSIS.md` - Implementation roadmap and progress tracking
- `README.md` - Project goals and architectural planning request

## Production Infrastructure Details

### Authentication System
- **Provider**: Supabase Auth with email/password
- **Roles**: `lawyer`, `admin`, `readonly` with different access levels
- **Features**: User registration, login, logout, role-based route protection
- **Implementation**: `AuthProvider` context with middleware protection

### Security Features
- **Rate Limiting**: Memory-based with role-specific quotas (Readonly: 100/min, Lawyer: 500/min, Admin: 1000/min)
- **Input Validation**: Comprehensive sanitization with XSS/SQL injection prevention
- **Route Protection**: Middleware-based authentication and authorization
- **Error Handling**: Structured error responses with proper HTTP status codes

### Performance & Caching
- **Caching Strategy**: Memory-based LRU cache with tag-based invalidation
- **API Optimization**: Pagination with metadata, response caching headers
- **Database**: Optimized queries with proper indexing
- **Build**: Static generation for all pages, optimized bundle size

### Monitoring & Observability
- **Health Checks**: `/api/health`, `/api/health/ready`, `/api/health/live`
- **Structured Logging**: Multiple log levels with context-aware metadata
- **Error Tracking**: Comprehensive error logging with stack traces
- **Performance Metrics**: Request timing and database query monitoring

## API Response Format

All list endpoints return paginated responses:
```typescript
{
  data: T[], // Array of results
  pagination: {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    itemsPerPage: number,
    hasNext: boolean,
    hasPrev: boolean,
    nextOffset: number | null,
    prevOffset: number | null
  },
  metadata: {
    filters: object,
    requestTime: string
  }
}
```

## Commands

### Development
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production 
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript check

### Testing
- Health checks available at `/api/health` endpoints
- Database connection test at `/api/test-db`
- Authentication test at `/auth` page

## Planned Features

### Core Pages
1. **Home** - Search functionality with autocomplete, recent cases
2. **Legislation page** - List of all legislation with navigation to viewers
3. **Legislation viewer** - Individual legislation with article list and interpreting cases
4. **Case law page** - Filterable list of cases with grouping by article
5. **Article viewer** - Individual article with interpreting case law
6. **Case law viewer** - Three-pane layout with case text, operative parts, and references
7. **Report builder** - Generate print-ready reports of operative parts and articles
8. **AI chatbot** (future) - Interactive legal research assistant

### Key UI Components
- **CaseInfoCard** - Displays case info with context-aware operative parts
- Navigation between articles, cases, and legislation
- Filtering by legislation and article interpretation
- Toggle between simplified and verbatim operative part text

## Design Philosophy

- Minimalistic design with generous whitespace
- Optimized for both desktop and mobile
- Modern typography using Google fonts
- Dark mode support with font size/typeface toggles
- Subtle animations and micro-interactions
- Avoid typical SaaS aesthetics - focus on reading experience
- Strategic use of accents and visual hierarchy
- Preference for "Case law" over "Case Law" (sentence case)