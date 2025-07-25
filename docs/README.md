# Documentation System

This directory contains comprehensive documentation for the Lexx EU Legal Research Platform.

## Structure

```
docs/
├── README.md                 # This file - documentation overview
├── COMPONENT_TEMPLATE.md     # Template for documenting components
└── components/               # Component-specific documentation
    ├── LazyImage.md          # Documented
    ├── CaseViewer.md         # Documented
    ├── ArticleViewer.md      # Documented
    ├── SearchBar.md          # Documented
    ├── ReportBuilder.md      # Documented
    ├── CaseInfoCard.md       # Documented
    └── ...
```

## Documentation Standards

### For Components
- Use the template in `COMPONENT_TEMPLATE.md`
- Document all props, accessibility features, and edge cases
- Include realistic usage examples from the legal domain
- Keep documentation updated with code changes

### File Naming Convention
- Component docs: `ComponentName.md` (exact match to component name)
- General docs: `UPPERCASE.md` for templates and guides
- Feature docs: `kebab-case.md` for specific features

### Required Sections
1. **Overview** - What the component does
2. **Props** - Complete API documentation
3. **Usage Examples** - Realistic examples from legal context
4. **Accessibility** - ARIA attributes and keyboard navigation
5. **Edge Cases** - Error handling and unusual scenarios

## Component Documentation Checklist

Before merging component changes:

- [ ] Component has corresponding documentation file
- [ ] All props are documented with types and descriptions
- [ ] Usage examples include legal research context
- [ ] Accessibility features are documented
- [ ] Edge cases and error handling are covered
- [ ] Dependencies are listed
- [ ] Changelog is updated

## Maintenance

### Updating Documentation
1. Update documentation when component props change
2. Add new usage examples when features are added
3. Update changelog with version bumps
4. Review accessibility section when UI changes

### Review Process
- Component documentation should be reviewed alongside code
- Focus on completeness and accuracy of examples
- Ensure accessibility documentation is thorough
- Verify that legal research context is appropriate

## Legal Research Context

Our documentation should always consider:
- **Lawyers as primary users** - Clear, professional language
- **Legal workflows** - Examples relevant to case research and legislation analysis
- **Accessibility compliance** - Legal professionals may have diverse accessibility needs
- **Professional environment** - Components used in law firms and legal institutions

## Tools and Automation

### Generating Documentation
Consider automating parts of component documentation:
- Extract prop types from TypeScript interfaces
- Generate basic usage examples from component tests
- Validate that all exported components have documentation

### Documentation Linting
- Check for required sections
- Validate code examples compile
- Ensure accessibility section is complete
- Verify changelog format

## Contributing

When adding new components:
1. Copy `COMPONENT_TEMPLATE.md` to `components/ComponentName.md`
2. Fill in all sections thoroughly
3. Include at least 3 usage examples
4. Test all code examples
5. Have documentation reviewed with code

When updating existing components:
1. Update props table if API changed
2. Add new usage examples for new features
3. Update edge cases if error handling changed
4. Increment changelog version

## Future Enhancements

- Interactive documentation with live examples
- Automated prop extraction from TypeScript
- Visual component gallery with screenshots
- Integration with Storybook or similar tools
- Accessibility testing automation