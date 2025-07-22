'use client'

import Link from 'next/link'
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react'
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

  const getDocumentContent = () => {
    // In a real implementation, this would render the actual case content
    // For now, we'll create a structured mock content
    return {
      background: `This case concerns the interpretation of EU legislation regarding ${caseData.title?.toLowerCase() || 'legal matters'}. The referring court seeks clarification on specific provisions that have generated uncertainty in national proceedings.`,
      
      facts: `The facts of the case establish that ${caseData.parties || 'the parties'} are involved in a dispute that requires the interpretation of relevant EU law provisions. The national court has identified several questions that require preliminary ruling from the Court of Justice.`,
      
      questions: [
        'Whether the relevant EU provisions should be interpreted as precluding national legislation that...',
        'Whether the principle of effectiveness requires that Member States ensure...',
        'Whether the interpretation of the provisions in question is compatible with...'
      ],
      
      analysis: `The Court notes that this case raises important questions about the interpretation and application of EU law. The referring court's questions concern fundamental principles of EU law, including the principle of effectiveness and the obligation of Member States to ensure compliance with EU obligations.`,
      
      conclusion: `For these reasons, the Court hereby rules that the provisions in question must be interpreted in accordance with the principles established in previous case law, taking into account the specific circumstances of the case and the need to ensure effective protection of rights under EU law.`
    }
  }

  const content = getDocumentContent()

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
            {/* Background */}
            <section id="background" className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Background to the dispute
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content.background}
              </p>
            </section>

            {/* Facts */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Facts of the case
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content.facts}
              </p>
            </section>

            {/* Questions */}
            <section id="questions" className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Questions referred for preliminary ruling
              </h3>
              <div className="space-y-4">
                {content.questions.map((question, index) => (
                  <div key={index} id={`question-${index + 1}`}>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Question {index + 1}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {question}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Analysis */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Analysis
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content.analysis}
              </p>
            </section>

            {/* Costs */}
            <section id="costs" className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Costs
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Since these proceedings are, for the parties to the main proceedings, a step in the action pending before the national court, the decision on costs is a matter for that court.
              </p>
            </section>

            {/* Operative Part */}
            <section id="operative-part" className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                On those grounds, the Court hereby rules:
              </h3>
              
              {caseData.operative_parts && caseData.operative_parts.length > 0 ? (
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
              ) : (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {content.conclusion}
                </p>
              )}
            </section>
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