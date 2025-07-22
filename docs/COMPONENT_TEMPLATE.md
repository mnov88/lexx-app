# Component Documentation Template

Use this template to document all reusable components in the Lexx EU Legal Research Platform.

## Template Structure

```markdown
# ComponentName

## Overview
Brief description of what the component does and its primary purpose.

## Import
```typescript
import { ComponentName } from '@/components/path/to/ComponentName'
```

## Props/Parameters

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| prop1 | `string` | ✅ | - | Description of prop1 |
| prop2 | `number` | ❌ | `0` | Description of prop2 |
| prop3 | `boolean` | ❌ | `false` | Description of prop3 |
| children | `React.ReactNode` | ❌ | - | Child elements to render |

### Type Definitions
```typescript
interface ComponentNameProps {
  prop1: string
  prop2?: number
  prop3?: boolean
  children?: React.ReactNode
}
```

## Usage Examples

### Basic Usage
```tsx
<ComponentName prop1="value" />
```

### Advanced Usage
```tsx
<ComponentName 
  prop1="value"
  prop2={10}
  prop3={true}
  className="custom-class"
>
  <div>Child content</div>
</ComponentName>
```

### With State Management
```tsx
const [state, setState] = useState(false)

<ComponentName 
  prop1="value"
  onToggle={() => setState(!state)}
  isActive={state}
/>
```

## Styling

### CSS Classes
- `.component-name` - Base component class
- `.component-name--variant` - Modifier classes
- `.component-name__element` - Element classes

### Tailwind Classes Used
List the main Tailwind classes applied to this component.

### Customization
Describe how to customize the component's appearance.

## Accessibility

### ARIA Attributes
- `aria-label`: Provides accessible name
- `role`: Defines the component's role
- `aria-expanded`: Indicates expanded state (if applicable)

### Keyboard Navigation
- `Tab`: Navigate to/from component
- `Enter/Space`: Activate component (if applicable)
- `Escape`: Close/cancel (if applicable)

### Screen Reader Support
Describe how the component works with screen readers.

## States & Variants

### Loading State
How the component behaves during loading.

### Error State
How the component displays errors.

### Disabled State
How the component appears when disabled.

### Variants
- `primary` - Default variant
- `secondary` - Alternative styling
- `danger` - Error/warning variant

## Edge Cases & Error Handling

1. **Missing Required Props**: What happens if required props are not provided
2. **Invalid Data**: How the component handles invalid or unexpected data
3. **Network Errors**: Behavior during network failures (if applicable)
4. **Empty States**: How the component renders with no data
5. **Overflow Content**: Behavior with large amounts of content

## Performance Considerations

- Memoization usage (if any)
- Virtualization (for large lists)
- Lazy loading (if applicable)
- Bundle size impact

## Testing

### Unit Tests
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // test implementation
  })
})
```

### Integration Tests
Describe integration test scenarios.

### Accessibility Tests
Tools and methods for testing accessibility.

## Dependencies

### External Libraries
- Library name: Purpose and why it's used

### Internal Dependencies
- Other components this component depends on

## Browser Support

List any browser-specific considerations or limitations.

## Migration Guide

If this component replaces an older version, provide migration instructions.

## Related Components

List related or similar components in the codebase.

## Changelog

### v1.0.0
- Initial implementation
- Basic functionality

---

*Last updated: [Date]*  
*Author: [Name]*  
*Reviewed by: [Name]*
```

## Usage Instructions

1. **Create Component Documentation**: Copy this template for each reusable component
2. **File Location**: Save as `docs/components/ComponentName.md`
3. **Keep Updated**: Update documentation when component changes
4. **Review Process**: Have documentation reviewed with code changes
5. **Link from Code**: Reference documentation in component comments

## Documentation Standards

- Use clear, concise language
- Include realistic examples
- Keep props table up to date
- Document all accessibility features
- Include edge cases and error scenarios
- Update changelog with each modification