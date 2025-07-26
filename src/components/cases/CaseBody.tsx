'use client'

import Link from 'next/link'
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CaseViewerData } from '@/types/database'

interface CaseBodyProps {
  caseData: CaseViewerData
  isMobile?: boolean
}

export function CaseBody({ caseData, isMobile = false }: CaseBodyProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const parseMarkdownContent = (content: string) => {
    if (!content) return null
    
    // Split content by main sections
    const sections = content.split(/^## /gm).filter(Boolean)
    const parsedSections: { [key: string]: string } = {}
    
    sections.forEach(section => {
      const lines = section.split('\n')
      const title = lines[0].trim()
      const content = lines.slice(1).join('\n').trim()
      parsedSections[title.toLowerCase()] = content
    })
    
    return parsedSections
  }

  const generateTableOfContents = (content: string) => {
    if (!content) return []
    
    const headers = content.match(/^## .+$/gm) || []
    const usedIds = new Set<string>()
    
    return headers.map((header, index) => {
      const title = header.replace('## ', '')
      
      // Generate valid CSS selector ID by removing/replacing invalid characters
      let baseId = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove all non-word, non-space, non-hyphen characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
      
      // Ensure the ID is not empty
      if (!baseId) {
        baseId = `section-${index}`
      }
      
      // Make sure the ID is unique
      let id = baseId
      let counter = 1
      while (usedIds.has(id)) {
        id = `${baseId}-${counter}`
        counter++
      }
      usedIds.add(id)
      
      return {
        title,
        id
      }
    })
  }

  const renderMarkdownSection = (content: string) => {
    if (!content) return null
    
    // Clean up escaped characters in legal text
    const cleanContent = content
      .replace(/^(\d+)\\\. /gm, '$1. ') // Fix escaped numbers
      .replace(/\\\[/g, '[') // Fix escaped brackets
      .replace(/\\\]/g, ']')
    
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h3: ({ children }) => (
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              {children}
            </h4>
          ),
          h4: ({ children }) => (
            <h5 className="text-base font-semibold text-gray-900 dark:text-white mt-4 mb-2">
              {children}
            </h5>
          ),
          p: ({ children }) => (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900 dark:text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800 dark:text-gray-200">
              {children}
            </em>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="mb-1 leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 dark:text-gray-400">
              {children}
            </blockquote>
          )
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    )
  }

  const content = parseMarkdownContent(caseData.plaintext_content || '')
  const tableOfContents = generateTableOfContents(caseData.plaintext_content || '')

  return (
    <div className={`space-y-6 ${!isMobile ? 'sticky top-6' : ''}`}>
      {/* Desktop Header */}
      {!isMobile && (
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/cases"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to cases
          </Link>
          
          {caseData.source_url && (
            <Link
              href={caseData.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              View original
              <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>
      )}

      {/* Case Document - Paper Style */}
      <div className={`${
        !isMobile 
          ? 'bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg max-w-4xl mx-auto' 
          : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg'
      }`}>
        <div className="p-8 md:p-12">
          {/* Case Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8 space-y-4">
            {/* Case ID and Date */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white">
                {caseData.case_id_text}
              </h1>
              {caseData.date_of_judgment && (
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(caseData.date_of_judgment)}</span>
                </div>
              )}
            </div>
            
            {/* Parties */}
            {caseData.parties && (
              <h2 className="text-lg font-serif italic text-gray-700 dark:text-gray-300">
                {caseData.parties}
              </h2>
            )}
            
            {/* Court */}
            {caseData.court && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {caseData.court}
              </p>
            )}
          </div>

          {/* Case Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none font-serif leading-relaxed">
            {content ? (
              // Render actual case content from plaintext
              Object.entries(content).map(([sectionTitle, sectionContent]) => {
                // Generate valid CSS selector ID matching the ToC logic
                const sectionId = sectionTitle
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '') // Remove all non-word, non-space, non-hyphen characters
                  .replace(/\s+/g, '-') // Replace spaces with hyphens
                  .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
                  .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
                return (
                <section key={sectionId} id={sectionId} className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {sectionTitle === 'parties' ? 'Parties' :
                     sectionTitle === 'grounds' ? 'Grounds' :
                     sectionTitle === 'operative part' ? 'On those grounds, the Court hereby rules:' :
                     sectionTitle.charAt(0).toUpperCase() + sectionTitle.slice(1)}
                  </h3>
                  <div>
                    {renderMarkdownSection(sectionContent)}
                  </div>
                </section>
                )
              })
            ) : (
              // Fallback content when no plaintext is available
              <>
                <section className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Case Information
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    This case concerns {caseData.title?.toLowerCase() || 'legal matters'}. 
                    {caseData.summary_text && (
                      <span> {caseData.summary_text}</span>
                    )}
                  </p>
                </section>

                {/* Show operative parts if available */}
                {caseData.operative_parts && caseData.operative_parts.length > 0 && (
                  <section id="operative-part" className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      On those grounds, the Court hereby rules:
                    </h3>
                    <div className="space-y-4">
                      {caseData.operative_parts
                        .sort((a, b) => a.part_number - b.part_number)
                        .map((part) => (
                          <div key={part.id} className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-4 rounded-r">
                            <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                              {part.part_number}.
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              {part.verbatim_text}
                            </p>
                          </div>
                        ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                {caseData.celex_number && `CELEX: ${caseData.celex_number}`}
              </span>
              {caseData.source_url && (
                <Link
                  href={caseData.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  View original source
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}