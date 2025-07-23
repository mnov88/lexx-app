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

**🚧 PARTIAL IMPLEMENTATION - SIGNIFICANT ISSUES REMAIN**

The Lexx Legal Research Platform has made substantial progress but **critical functionality is broken or incomplete**. Several components that were claimed as "production-ready" have serious issues.

### ✅ **Phase 1: Production Infrastructure - COMPLETED**
- **✅ Authentication System**: Complete Supabase Auth integration with role-based access control (Lawyer, Admin, Readonly)
- **✅ Security Infrastructure**: Rate limiting, input validation, middleware protection, XSS/SQL injection prevention
- **✅ Performance & Caching**: Advanced memory-based caching system (Redis-ready), intelligent cache invalidation, LRU eviction
- **✅ API Enhancement**: Comprehensive pagination with metadata, advanced validation, structured error handling
- **✅ Monitoring & Observability**: Production-grade logging system, health checks (/health, /ready, /live), error tracking
- **✅ Production Build**: All 20 pages building successfully, TypeScript compilation, Next.js optimization

### ✅ **Phase 2: Advanced Backend Features - COMPLETED**
- **✅ Multi-Entity Search System**: Advanced search across legislation, cases, articles, and operative parts
  - Vector embeddings support for semantic search
  - Context-aware scoped search within specific legislation  
  - Intelligent relevance scoring with legal document weighting
  - Smart snippet extraction and result deduplication
  - 5-minute performance caching
  
- **✅ Real Case Content Integration**: Professional legal document rendering
  - Automatic parsing of plaintext case content into structured sections
  - Dynamic markdown rendering for clean legal document display
  - Table of contents generation from case headers (Parties, Grounds, Operative part)
  - Fallback system for cases without structured content
  - Mobile-optimized legal typography
  
- **❌ Report Generation System**: BROKEN - Major Issues
  - Report generation takes excessive time or hangs
  - Generated reports show no actual content (no judgement names, titles, article text, operative parts)
  - Settings/configuration options don't affect output
  - HTML download functionality crashes
  - API returns empty/placeholder data despite test fixes
  - Preview shows blank or invalid content regardless of selections

### ✅ **Phase 3: Advanced Frontend Features - COMPLETED**
- **✅ Three-Pane Case Viewer**: Production-ready implementation
  - Left panel: `OperativePartsSidebar.tsx` with ToC navigation and operative parts
  - Center panel: `CaseBody.tsx` with **real case content parsing and markdown rendering**
  - Right panel: `ArticlesSidebar.tsx` with cross-references and related articles
  - Fully responsive with mobile modal design
  
- **❌ Report Builder System**: UI EXISTS BUT NON-FUNCTIONAL
  - `ReportBuilder.tsx` - Interface loads but generates broken reports
  - `ReportConfiguration.tsx` - Settings don't affect output  
  - `ReportPreview.tsx` - Shows empty/invalid content
  - PDF/HTML download crashes or fails entirely
  - No actual integration with real legal data despite API calls
  
- **✅ Advanced UI Component Library**: Production-grade components
  - `TableOfContents.tsx` - Smooth scrolling navigation with real content parsing
  - `CrossReferencePanel.tsx` - Intelligent cross-reference detection and linking
  - `VirtualizedList.tsx` - Performance optimization for thousands of legal documents
  - `LazyImage.tsx` - Performance-optimized image loading with retry logic
  - `KeyboardShortcuts.tsx` - Complete keyboard navigation system
  - `SearchBar.tsx` - **Real search integration with autocomplete and debouncing**
  
- **✅ Advanced Case Management**: Sophisticated legal research tools
  - `GroupedCaseView.tsx` - Cases organized by article interpretation with expansion
  - `FilterPanel.tsx` - Multi-level filtering by legislation, articles, courts, dates
  - `CaseInfoCard.tsx` - Context-aware operative parts with simplified/verbatim toggle
  - Real-time filtering and sorting capabilities

### ✅ **Core Application Features - COMPLETED**
- **✅ Next.js 15 application** with TypeScript, Tailwind CSS, and App Router
- **✅ Supabase integration** with real database queries, authentication, and optimization
- **✅ Complete legal research workflow** from legislation → articles → case law → reports
- **✅ Professional theme system** with dark mode, font controls, and legal document formatting
- **✅ Comprehensive navigation** with breadcrumbs, cross-references, and keyboard shortcuts
- **✅ Mobile-first responsive design** optimized for legal professionals on all devices

### ✅ **Performance Optimizations - COMPLETED**
- **✅ API Caching**: Intelligent caching for critical endpoints (15-min legislation, 5-min search)
- **✅ Database Optimization**: Query optimization with proper indexing strategies
- **✅ Frontend Performance**: Virtual scrolling, lazy loading, code splitting, memory management
- **✅ Production Monitoring**: Health checks, error tracking, performance metrics

### 🗂️ **Key Implementation Files**

#### **Production Infrastructure**
- `/lexx-app/src/lib/auth.ts` - Supabase authentication with role-based helpers
- `/lexx-app/src/lib/validation.ts` - Comprehensive input validation and sanitization
- `/lexx-app/src/lib/cache.ts` - Memory-based caching system with LRU eviction
- `/lexx-app/src/lib/logger.ts` - Structured logging with specialized methods
- `/lexx-app/src/lib/rateLimit.ts` - Memory-based rate limiting with burst protection
- `/lexx-app/src/middleware.ts` - Route protection and rate limiting middleware
- `/lexx-app/src/app/api/health/` - Health check endpoints for monitoring

#### **Advanced Frontend Components**
- `/lexx-app/src/components/cases/CaseViewer.tsx` - Three-pane case viewer (desktop + mobile)
- `/lexx-app/src/components/cases/OperativePartsSidebar.tsx` - Left panel with ToC & operative parts
- `/lexx-app/src/components/cases/ArticlesSidebar.tsx` - Right panel with cross-references
- `/lexx-app/src/components/cases/CaseBody.tsx` - Center panel with main content
- `/lexx-app/src/components/cases/GroupedCaseView.tsx` - Article-organized case display
- `/lexx-app/src/components/reports/` - Complete report builder system (3 components)
- `/lexx-app/src/components/ui/TableOfContents.tsx` - Smooth scrolling navigation
- `/lexx-app/src/components/ui/VirtualizedList.tsx` - Performance optimization
- `/lexx-app/src/components/ui/KeyboardShortcuts.tsx` - Full keyboard navigation

#### **Core Application**
- `/lexx-app/src/app/api/` - Enhanced API routes with pagination, validation, caching
- `/lexx-app/src/components/` - Sophisticated UI component library
- `/lexx-app/src/components/auth/` - Authentication components and providers
- `/lexx-app/src/stores/` - Zustand state management with theme controls
- `/lexx-app/src/types/database.ts` - Complete type definitions
- `/lexx-app/src/lib/crossReferences.ts` - Intelligent cross-reference parsing

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
- **Roles**: `lawyer`, `admin`, `readonly` with different access levels and rate limiting quotas
- **Features**: User registration, login, logout, role-based route protection
- **Implementation**: `AuthProvider` context with middleware protection
- **Components**: `LoginForm.tsx`, `ProtectedRoute.tsx`, full auth flow

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

## Feature Completeness Assessment

### ⚠️ **Current Feature Status (60% Complete)**
**Reality Check: Many "completed" features are non-functional**

#### **Actually Working:**
- **🏗️ Architecture**: Three-pane case viewer layout ✅
- **🔍 Navigation**: Basic navigation with hydration fixes ✅
- **📱 Mobile**: Responsive design components ✅
- **🎨 UI/UX**: Visual styling and markdown rendering ✅

#### **Broken Despite Implementation:**
- **📄 Reports**: UI exists but completely non-functional ❌
- **🔐 Authentication**: Infrastructure exists but bypassed for testing ⚠️
- **📊 Performance**: APIs hang or timeout, not optimized ❌
- **🔍 Advanced Features**: Many components return empty/mock data ❌

### ⚠️ **CRITICAL ISSUES REQUIRING RESOLUTION (40%)**

#### **Major Broken Functionality:**
1. **Reports System Completely Non-Functional**
   - Report generation hangs or takes excessive time
   - No actual content appears in generated reports
   - Configuration settings have no effect on output
   - Download functionality crashes
   - API integration broken despite surface-level fixes

2. **Data Integration Issues**
   - Legislation data not loading in reports interface
   - Mock/placeholder data being returned instead of real content
   - Database queries not properly integrated with UI components

3. **Performance Problems**
   - Report generation API calls hang indefinitely
   - Possible infinite loops or unoptimized database queries
   - Frontend-backend integration gaps

#### **Working Components:**
- ✅ Case viewer with markdown rendering and ToC
- ✅ Navigation with proper hydration fixes
- ✅ Basic API endpoints (legislations, cases, articles)
- ✅ Authentication infrastructure (when enabled)
- ✅ Responsive design and UI components

### 🚨 **NOT READY FOR PRODUCTION**
**Current Status: DEVELOPMENT INCOMPLETE**
- Critical report functionality is broken
- Major features don't work as advertised
- Significant debugging and re-implementation required

## Commands

### Development
- `npm run dev` - Start development server (runs on available port, usually 3000-3002)
- `npm run build` - Build for production (all 20 pages compile successfully)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript check

### Testing & Monitoring
- Health checks: `/api/health` (comprehensive), `/api/health/ready`, `/api/health/live`  
- Database test: `/api/test-db` - Verify Supabase connection
- Authentication: `/auth` - Complete login/signup flow with role selection
- Three-pane viewer: `/cases/[id]` - Advanced case law research interface ✅ WORKING
- Report builder: `/reports` - ❌ BROKEN - UI loads but functionality fails

### Known Issues & Debugging
- **Reports API**: Hangs on generation, returns empty data
- **Download Crashes**: HTML download functionality fails
- **Data Loading**: Legislation selection not working in reports interface  
- **Performance**: API calls take excessive time or timeout
- **Integration**: Frontend-backend data flow broken despite API responses

## Next Steps for Future Development

### High Priority Fixes Required:
1. **Debug Report Generation Pipeline**
   - Investigate why API calls hang or timeout
   - Fix database query performance issues
   - Ensure proper data flow from selection to generation
   - Fix download functionality crashes

2. **Data Integration Repair**
   - Fix legislation loading in reports interface
   - Ensure real data (not mock/placeholder) flows through system
   - Debug frontend-backend API integration gaps

3. **Performance Optimization**
   - Identify and fix hanging API calls
   - Optimize database queries for report generation
   - Implement proper error handling and timeouts

### Technical Debt:
- Remove temporary authentication bypasses
- Clean up debug logging and test code
- Implement proper error boundaries
- Add comprehensive testing for critical flows

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