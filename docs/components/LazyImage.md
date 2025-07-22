# LazyImage

## Overview
A performance-optimized image component that implements lazy loading using the Intersection Observer API. Images are only loaded when they enter the viewport, improving page load times and reducing bandwidth usage. The component includes loading states, error handling, and smooth transitions.

## Import
```typescript
import { LazyImage } from '@/components/ui/LazyImage'
```

## Props/Parameters

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| src | `string` | ✅ | - | The source URL of the image to load |
| alt | `string` | ✅ | - | Alternative text for accessibility and SEO |
| className | `string` | ❌ | `''` | Additional CSS classes to apply to the container |
| placeholder | `string` | ❌ | - | Placeholder image URL (currently unused in implementation) |
| fallback | `string` | ❌ | - | Fallback image URL to display if main image fails to load |

### Type Definitions
```typescript
interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  fallback?: string
}
```

## Usage Examples

### Basic Usage
```tsx
<LazyImage 
  src="/images/case-document.jpg"
  alt="Case document screenshot"
/>
```

### With Custom Styling
```tsx
<LazyImage 
  src="/images/legislation-diagram.png"
  alt="EU legislation hierarchy diagram"
  className="w-full h-64 rounded-lg shadow-md"
/>
```

### With Error Fallback
```tsx
<LazyImage 
  src="/images/court-building.jpg"
  alt="European Court of Justice building"
  fallback="/images/default-courthouse.svg"
  className="aspect-video object-cover"
/>
```

### In Legal Document Context
```tsx
<div className="flex flex-col space-y-4">
  <LazyImage 
    src={`/api/case-images/${case.id}/diagram`}
    alt={`Legal diagram for case ${case.title}`}
    fallback="/images/legal-placeholder.svg"
    className="border rounded-md p-2 bg-gray-50 dark:bg-gray-800"
  />
</div>
```

## Styling

### CSS Classes
- `.relative` - Base container positioning
- `.overflow-hidden` - Prevents content overflow during loading
- Custom classes passed via `className` prop

### Tailwind Classes Used
- **Loading State**: `flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800`
- **Loader**: `w-6 h-6 animate-spin text-gray-400`
- **Image Transition**: `transition-opacity duration-300`
- **Error State**: `text-center text-gray-500 dark:text-gray-400`

### Customization
```tsx
// Custom loading background
<LazyImage 
  src="image.jpg"
  alt="Description"
  className="bg-blue-50 dark:bg-blue-900"
/>

// Rounded corners with shadow
<LazyImage 
  src="image.jpg"
  alt="Description"
  className="rounded-xl shadow-lg"
/>
```

## Accessibility

### ARIA Attributes
- `alt` attribute provides accessible name for screen readers
- Loading state includes visual indicator with semantic meaning

### Keyboard Navigation
- Component follows standard image accessibility patterns
- No custom keyboard interactions required

### Screen Reader Support
- Proper `alt` text ensures screen readers can describe image content
- Loading states are announced appropriately
- Error states provide clear feedback about failed image loads

## States & Variants

### Loading State (Before Intersection)
```tsx
// Shows spinner before image enters viewport
<div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
</div>
```

### Loading State (After Intersection)
```tsx
// Shows spinner while image is downloading
<div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
</div>
```

### Loaded State
```tsx
// Image with smooth opacity transition
<img 
  className="transition-opacity duration-300 opacity-100"
  src={src}
  alt={alt}
/>
```

### Error State
```tsx
// Error message with optional fallback image
<div className="text-center text-gray-500 dark:text-gray-400">
  <div className="text-sm">Failed to load image</div>
  {fallback && <img src={fallback} alt={alt} className="mt-2 max-h-16" />}
</div>
```

## Edge Cases & Error Handling

1. **Invalid Image URL**: Component displays error state with fallback if provided
2. **Network Failures**: Graceful degradation to error state with user-friendly message
3. **Missing Alt Text**: TypeScript enforcement ensures alt text is always provided
4. **Intersection Observer Unavailable**: Component falls back to immediate loading
5. **Slow Network**: Loading spinner remains visible until image fully loads
6. **Large Images**: Intersection observer prevents loading until needed
7. **Component Unmount**: Properly cleans up intersection observer to prevent memory leaks

## Performance Considerations

- **Intersection Observer**: Only observes when component is mounted, disconnects after use
- **Lazy Loading**: Images load only when entering viewport (10% threshold)
- **Memory Management**: Observer is cleaned up on component unmount
- **Smooth Transitions**: 300ms opacity transition prevents jarring image appearance
- **Error Recovery**: Failed images don't block other content rendering

## Testing

### Unit Tests
```typescript
describe('LazyImage', () => {
  it('should render loading state initially', () => {
    render(<LazyImage src="/test.jpg" alt="Test image" />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('should load image when in viewport', async () => {
    // Mock intersection observer
    mockIntersectionObserver()
    render(<LazyImage src="/test.jpg" alt="Test image" />)
    
    // Simulate intersection
    triggerIntersection()
    
    await waitFor(() => {
      expect(screen.getByAltText('Test image')).toBeInTheDocument()
    })
  })

  it('should display error state on load failure', async () => {
    render(<LazyImage src="/invalid.jpg" alt="Test image" />)
    
    // Simulate image load error
    const img = screen.getByAltText('Test image')
    fireEvent.error(img)
    
    expect(screen.getByText('Failed to load image')).toBeInTheDocument()
  })
})
```

### Integration Tests
- Test with different image formats (JPG, PNG, SVG, WebP)
- Verify behavior in different viewport sizes
- Test intersection observer threshold behavior

### Accessibility Tests
```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('LazyImage has no accessibility violations', async () => {
  const { container } = render(
    <LazyImage src="/test.jpg" alt="Descriptive alt text" />
  )
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Dependencies

### External Libraries
- **lucide-react**: Provides the `Loader2` spinner icon
- **React**: Uses `useState`, `useRef`, and `useEffect` hooks

### Internal Dependencies
- None - component is self-contained

## Browser Support

- **Intersection Observer**: Supported in all modern browsers
- **Fallback**: If Intersection Observer is unavailable, images load immediately
- **CSS Transitions**: Supported in all modern browsers with graceful degradation

## Migration Guide

### From Standard `<img>` Tag
```tsx
// Before
<img src="/image.jpg" alt="Description" className="w-full" />

// After
<LazyImage src="/image.jpg" alt="Description" className="w-full" />
```

### From Other Lazy Loading Solutions
1. Replace component import
2. Update prop names if needed (most should be compatible)
3. Test intersection observer threshold (currently 0.1)
4. Verify error handling meets requirements

## Related Components

- **SearchBar**: Could potentially use LazyImage for search result thumbnails
- **CaseInfoCard**: May display case-related images or diagrams
- **ReportBuilder**: Could include lazy-loaded charts or legal diagrams

## Legal Research Context

This component is particularly useful in the Lexx platform for:
- **Case Document Images**: Screenshots of legal documents that load as users scroll
- **Legal Diagrams**: Complex legal relationship charts that are bandwidth-intensive
- **Court Building Images**: Visual context for different EU courts
- **Infographics**: Legal process flowcharts and explanatory diagrams

## Changelog

### v1.0.0 (Current)
- Initial implementation with Intersection Observer
- Loading states with smooth transitions
- Error handling with fallback image support
- Dark mode support
- TypeScript type safety

---

*Last updated: July 21, 2025*  
*Author: Claude Code Assistant*  
*Component: /src/components/ui/LazyImage.tsx*