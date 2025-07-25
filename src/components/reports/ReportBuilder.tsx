'use client'

import { useState, useEffect } from 'react'
import { ReportConfiguration } from './ReportConfiguration'
import { ReportPreview } from './ReportPreview'
import { ReportConfig, ReportData, Legislation } from '@/types/database'
import { FileText, Download, Eye, Settings } from 'lucide-react'

export function ReportBuilder() {
  const [step, setStep] = useState<'configure' | 'preview'>('configure')
  const [config, setConfig] = useState<ReportConfig>({
    title: 'Legal Research Report',
    description: '',
    legislations: [],
    articles: [],
    includeOperativeParts: true,
    operativePartsMode: 'simplified',
    includeArticleText: true,
    includeCaseSummaries: true,
    format: 'html',
    template: 'standard'
  })
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [legislations, setLegislations] = useState<Legislation[]>([])

  useEffect(() => {
    // Fetch available legislations for selection
    const fetchLegislations = async () => {
      try {
        const response = await fetch('/api/legislations')
        if (response.ok) {
          const data = await response.json()
          console.log('Fetched legislations:', data) // Debug log
          setLegislations(data || [])
        } else {
          console.error('Failed to fetch legislations:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error fetching legislations:', error)
      }
    }

    fetchLegislations()
  }, [])

  const generateReport = async () => {
    if (config.legislations.length === 0 && config.articles.length === 0) {
      alert('Please select at least one legislation or article for the report.')
      return
    }

    console.log('Generating report with config:', config) // Debug log
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Report generation failed:', response.status, errorData)
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      console.log('Report generated successfully:', data) // Debug log
      setReportData(data)
      setStep('preview')
    } catch (error) {
      console.error('Error generating report:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to generate report: ${errorMessage}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadReport = async (format: 'html' | 'pdf') => {
    if (!reportData) return

    try {
      const response = await fetch('/api/reports/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...config,
          format,
          reportData
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to download report')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${config.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading report:', error)
      alert('Failed to download report. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                Report Builder
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Create professional legal research reports with beautiful typography
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm ${
                step === 'configure' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                <Settings className="w-4 h-4" />
                <span>Configure</span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm ${
                step === 'preview' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {step === 'preview' && (
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setStep('configure')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Back to Configuration
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={() => downloadReport('html')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download HTML
                </button>
                <button
                  onClick={() => downloadReport('pdf')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        {step === 'configure' ? (
          <ReportConfiguration
            config={config}
            setConfig={setConfig}
            legislations={legislations}
            onGenerate={generateReport}
            isGenerating={isGenerating}
          />
        ) : (
          reportData && (
            <ReportPreview
              reportData={reportData}
              onDownloadHtml={() => downloadReport('html')}
              onDownloadPdf={() => downloadReport('pdf')}
            />
          )
        )}
      </div>
    </div>
  )
}