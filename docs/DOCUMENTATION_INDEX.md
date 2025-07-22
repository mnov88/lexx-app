# Component Documentation Index

This index tracks the documentation status of all reusable components in the Lexx platform.

## UI Components (`/src/components/ui/`)

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| **LazyImage** | ✅ Documented | High | Performance-critical component |
| **SearchBar** | ❌ Needs docs | High | Core search functionality |
| **VirtualizedList** | ❌ Needs docs | Medium | Performance component |
| **TableOfContents** | ❌ Needs docs | Medium | Navigation component |
| **Breadcrumbs** | ❌ Needs docs | Low | Simple navigation |
| **ThemeControls** | ❌ Needs docs | Medium | Theme switching |
| **KeyboardShortcuts** | ❌ Needs docs | Low | Help modal |
| **CrossReferencePanel** | ❌ Needs docs | High | Legal-specific component |
| **LatestCases** | ❌ Needs docs | Medium | Home page component |

## Case Components (`/src/components/cases/`)

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| **CaseInfoCard** | ❌ Needs docs | High | Core display component |
| **CaseViewer** | ❌ Needs docs | High | Main case display |
| **CaseList** | ❌ Needs docs | Medium | Case browsing |
| **GroupedCaseView** | ❌ Needs docs | Medium | Alternative case view |
| **FilterPanel** | ❌ Needs docs | Medium | Case filtering |
| **ArticlesSidebar** | ❌ Needs docs | Medium | Navigation sidebar |
| **OperativePartsSidebar** | ❌ Needs docs | Medium | Case details sidebar |
| **CaseBody** | ❌ Needs docs | High | Main case content |
| **CaseLawPage** | ❌ Needs docs | Medium | Page-level component |

## Article Components (`/src/components/articles/`)

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| **ArticleViewer** | ❌ Needs docs | High | Core article display |
| **ArticleList** | ❌ Needs docs | Medium | Article browsing |

## Legislation Components (`/src/components/legislation/`)

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| **LegislationViewer** | ❌ Needs docs | High | Main legislation display |
| **LegislationList** | ❌ Needs docs | Medium | Legislation browsing |

## Report Components (`/src/components/reports/`)

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| **ReportBuilder** | ❌ Needs docs | High | Report generation |
| **ReportConfiguration** | ❌ Needs docs | High | Report settings |
| **ReportPreview** | ❌ Needs docs | Medium | Report display |

## Layout Components (`/src/components/layout/`)

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| **Navigation** | ❌ Needs docs | High | Main site navigation |
| **ThemeProvider** | ❌ Needs docs | Medium | Theme context |
| **KeyboardShortcutsProvider** | ❌ Needs docs | Low | Keyboard shortcuts context |

## Provider Components

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| **ServiceWorkerProvider** | ❌ Needs docs | Low | PWA functionality |

## Hooks (`/src/hooks/`)

| Hook | Status | Priority | Notes |
|------|--------|----------|-------|
| **useDebounce** | ❌ Needs docs | Medium | Performance utility |
| **useInfiniteScroll** | ❌ Needs docs | Medium | Pagination utility |
| **usePerformanceMonitor** | ❌ Needs docs | Low | Development utility |

## Documentation Priorities

### High Priority (Core Legal Features)
1. **CaseInfoCard** - Central to case display
2. **CaseViewer** - Main case reading interface
3. **ArticleViewer** - Main article reading interface
4. **SearchBar** - Core search functionality
5. **CrossReferencePanel** - Legal-specific navigation
6. **ReportBuilder** - Report generation
7. **LegislationViewer** - Main legislation interface
8. **Navigation** - Site navigation

### Medium Priority (Supporting Features)
1. **VirtualizedList** - Performance component
2. **TableOfContents** - Document navigation
3. **FilterPanel** - Search/browse filtering
4. **ThemeControls** - User preferences
5. **CaseList** - Case browsing
6. **ArticleList** - Article browsing
7. **LegislationList** - Legislation browsing

### Low Priority (Utility Components)
1. **Breadcrumbs** - Simple navigation
2. **KeyboardShortcuts** - Help functionality
3. **ServiceWorkerProvider** - PWA features

## Next Steps

1. **Start with High Priority components** - Focus on core legal research features
2. **Use the template** - Copy from `/docs/COMPONENT_TEMPLATE.md`
3. **Legal context examples** - Always include examples relevant to legal research
4. **Review existing components** - Some may need TypeScript interface updates
5. **Test documentation** - Verify all code examples work

## Documentation Goals

- [ ] All High Priority components documented by next release
- [ ] Medium Priority components documented over next sprint
- [ ] Establish documentation review process
- [ ] Create component visual guide/gallery
- [ ] Set up automated documentation validation