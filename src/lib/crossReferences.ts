// Cross-reference detection and linking utilities

interface CrossReference {
  type: 'article' | 'legislation' | 'case'
  id: string
  text: string
  href: string
  context: string
}

/**
 * Extract cross-references from legal text content
 */
export function extractCrossReferences(content: string, currentLegislationId?: string): CrossReference[] {
  const references: CrossReference[] = []

  // Article references (e.g., "Article 5", "Articles 10-12", "Art. 3(2)")
  const articleRegex = /\b(?:Article|Articles|Art\.?)\s+(\d+(?:-\d+)?|\d+\(\d+\))\b/gi
  let match
  
  while ((match = articleRegex.exec(content)) !== null) {
    const fullMatch = match[0]
    const articleRef = match[1]
    
    references.push({
      type: 'article',
      id: `${currentLegislationId}-${articleRef}`, // This would need proper resolution
      text: fullMatch,
      href: `/search?q=${encodeURIComponent(fullMatch)}`, // Generic search for now
      context: getContextAroundMatch(content, match.index, 50)
    })
  }

  // CELEX number references (e.g., "32016R0679", "62019CJ0123")
  const celexRegex = /\b([3-6]\d{4}[A-Z]{1,2}\d{4})\b/g
  
  while ((match = celexRegex.exec(content)) !== null) {
    const celexNumber = match[1]
    
    references.push({
      type: 'legislation',
      id: celexNumber,
      text: celexNumber,
      href: `/search?q=${encodeURIComponent(celexNumber)}`,
      context: getContextAroundMatch(content, match.index, 50)
    })
  }

  // Case references (e.g., "C-123/19", "T-456/20")
  const caseRegex = /\b([CT]-\d+\/\d{2,4})\b/g
  
  while ((match = caseRegex.exec(content)) !== null) {
    const caseRef = match[1]
    
    references.push({
      type: 'case',
      id: caseRef,
      text: caseRef,
      href: `/search?q=${encodeURIComponent(caseRef)}`,
      context: getContextAroundMatch(content, match.index, 50)
    })
  }

  // Directive/Regulation references (e.g., "Directive 2016/679", "Regulation (EU) 2018/1725")
  const directiveRegex = /\b(Directive|Regulation)\s+(?:\([A-Z]{2}\)\s+)?(\d{4}\/\d+)\b/gi
  
  while ((match = directiveRegex.exec(content)) !== null) {
    const fullMatch = match[0]
    
    references.push({
      type: 'legislation',
      id: match[2], // Year/number part
      text: fullMatch,
      href: `/search?q=${encodeURIComponent(fullMatch)}`,
      context: getContextAroundMatch(content, match.index, 50)
    })
  }

  return references
}

function getContextAroundMatch(content: string, index: number, contextLength: number): string {
  const start = Math.max(0, index - contextLength)
  const end = Math.min(content.length, index + contextLength)
  
  let context = content.substring(start, end)
  
  // Add ellipsis if we truncated
  if (start > 0) context = '...' + context
  if (end < content.length) context = context + '...'
  
  return context.trim()
}

/**
 * Replace cross-references in content with clickable links
 */
export function linkifyContent(content: string, currentLegislationId?: string): string {
  const references = extractCrossReferences(content, currentLegislationId)
  
  let linkedContent = content
  
  // Sort references by position (descending) to avoid offset issues
  references.sort((a, b) => linkedContent.lastIndexOf(b.text) - linkedContent.lastIndexOf(a.text))
  
  references.forEach(ref => {
    const regex = new RegExp(`\\b${escapeRegExp(ref.text)}\\b`, 'g')
    linkedContent = linkedContent.replace(regex, (match) => {
      return `<a href="${ref.href}" class="text-blue-600 dark:text-blue-400 hover:underline font-medium" title="${ref.context}" data-cross-ref="${ref.type}">${match}</a>`
    })
  })
  
  return linkedContent
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Advanced cross-reference resolution with database lookup
 */
export async function resolveCrossReferences(
  references: CrossReference[],
  currentLegislationId?: string
): Promise<CrossReference[]> {
  const resolved: CrossReference[] = []
  
  for (const ref of references) {
    try {
      let resolvedRef = { ...ref }
      
      if (ref.type === 'article' && currentLegislationId) {
        // Try to resolve article within current legislation
        const response = await fetch(`/api/legislations/${currentLegislationId}/articles?search=${encodeURIComponent(ref.text)}`)
        if (response.ok) {
          const articles = await response.json()
          if (articles.length > 0) {
            resolvedRef.id = articles[0].id
            resolvedRef.href = `/articles/${articles[0].id}`
          }
        }
      } else if (ref.type === 'legislation') {
        // Try to resolve legislation by CELEX or title
        const response = await fetch(`/api/search?q=${encodeURIComponent(ref.text)}&type=legislation&limit=1`)
        if (response.ok) {
          const results = await response.json()
          if (results.results && results.results.length > 0) {
            resolvedRef.id = results.results[0].id
            resolvedRef.href = `/legislation/${results.results[0].id}`
          }
        }
      } else if (ref.type === 'case') {
        // Try to resolve case by case number
        const response = await fetch(`/api/search?q=${encodeURIComponent(ref.text)}&type=case&limit=1`)
        if (response.ok) {
          const results = await response.json()
          if (results.results && results.results.length > 0) {
            resolvedRef.id = results.results[0].id
            resolvedRef.href = `/cases/${results.results[0].id}`
          }
        }
      }
      
      resolved.push(resolvedRef)
    } catch (error) {
      console.warn('Failed to resolve cross-reference:', ref.text, error)
      resolved.push(ref) // Keep unresolved reference with search fallback
    }
  }
  
  return resolved
}

/**
 * Get summary statistics for cross-references in content
 */
export function getCrossReferenceStats(content: string): {
  articles: number
  legislations: number
  cases: number
  total: number
} {
  const references = extractCrossReferences(content)
  
  return {
    articles: references.filter(r => r.type === 'article').length,
    legislations: references.filter(r => r.type === 'legislation').length,
    cases: references.filter(r => r.type === 'case').length,
    total: references.length
  }
}