# Component Documentation Index

This index tracks the documentation status of all reusable components in the Lexx platform.

## UI Components (`/src/components/ui/`)

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| **LazyImage** | ✅ Documented | High | Performance-critical component |
| **SearchBar** | ✅ Documented | High | Core search functionality |
| **VirtualizedList** | ✅ Documented | Medium | Performance component |
| **TableOfContents** | ✅ Documented | Medium | Navigation component |
| **Breadcrumbs** | ❌ Needs docs | Low | Simple navigation |
| **ThemeControls** | ✅ Documented | Medium | Theme switching |
| **KeyboardShortcuts** | ❌ Needs docs | Low | Help modal |
| **CrossReferencePanel** | ✅ Documented | High | Legal-specific component |
| **LatestCases** | ✅ Documented | Medium | Home page component |

## Case Components (`/src/components/cases/`)

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| **CaseInfoCard** | ✅ Documented | High | Core display component |
| **CaseViewer** | ✅ Documented | High | Main case display |
| **CaseList** | ✅ Documented | Medium | Case browsing |
| **GroupedCaseView** | ❌ Needs docs | Medium | Alternative case view |
| **FilterPanel** | ✅ Documented | Medium | Case filtering |
| **ArticlesSidebar** | ✅ Documented | Medium | Part of CaseViewer |
| **OperativePartsSidebar** | ✅ Documented | Medium | Part of CaseViewer |
| **CaseBody** | ✅ Documented | High | Part of CaseViewer |
| **CaseLawPage** | ❌ Needs docs | Medium | Page-level component |

## Article Components (`/src/components/articles/`)

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| **ArticleViewer** | ✅ Documented | High | Core article display |
| **ArticleList** | ✅ Documented | Medium | Article browsing |

## Legislation Components (`/src/components/legislation/`)

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| **LegislationViewer** | ✅ Documented | High | Main legislation display |
| **LegislationList** | ✅ Documented | Medium | Legislation browsing |

## Report Components (`/src/components/reports/`)

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| **ReportBuilder** | ✅ Documented | High | Report generation |
| **ReportConfiguration** | ✅ Documented | High | Part of ReportBuilder |
| **ReportPreview** | ✅ Documented | Medium | Part of ReportBuilder |

## Layout Components (`/src/components/layout/`)

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| **Navigation** | ✅ Documented | High | Main site navigation |
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

- [x] All High Priority components documented by next release
- [ ] Medium Priority components documented over next sprint
- [ ] Establish documentation review process
- [ ] Create component visual guide/gallery
- [ ] Set up automated documentation validation