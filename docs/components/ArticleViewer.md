# ArticleViewer Component

## Overview

The `ArticleViewer` component is responsible for displaying a single article of legislation, its content, and the cases that interpret it. It provides a focused reading experience for legal professionals, with easy navigation to related content.

- **File**: `lexx-app/src/components/articles/ArticleViewer.tsx`
- **Dependencies**: `CaseInfoCard`, `Breadcrumbs`, `TableOfContents`, `CrossReferencePanel`

## Functionality

- **Data Fetching**: Fetches the article data, the cases that interpret it, and the navigation context from the API.
- **Content Rendering**: Renders the article content from Markdown to HTML, adding anchor links to headings and cross-reference links to other legal documents.
- **Case Display**: Displays a list of cases that interpret the article, using the `CaseInfoCard` component.
- **Navigation**: Provides navigation to the previous and next articles in the same legislation, both through on-page controls and keyboard shortcuts.
- **Table of Contents**: Displays a table of contents for the article, allowing users to easily navigate its sections.
- **Cross-References**: Uses the `CrossReferencePanel` to display a list of all the legal documents referenced in the article's text.

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `articleId` | `string` | ✅ | The UUID of the article to be displayed. |

## Usage Example

```tsx
// In lexx-app/src/app/articles/[id]/page.tsx
import { ArticleViewer } from '@/components/articles/ArticleViewer'

interface ArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params
  
  return <ArticleViewer articleId={id} />
}
``` 