'use client'

import { useState, useEffect } from 'react'

interface DatabaseStatus {
  connection: string
  timestamp: string
  environmentCheck?: {
    url: { exists: boolean; isPlaceholder: boolean; value: string | null }
    anonKey: { exists: boolean; isPlaceholder: boolean; value: string | null }
  }
  message?: string
  requiredSteps?: string[]
  expectedDatabaseSchema?: {
    tables: string[]
  }
  tables?: Record<string, any>
  error?: string
}

export default function DatabaseStatusPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/test-db')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch database status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Database Status
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Database Status
          </h1>
          <button
            onClick={fetchStatus}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
              Error
            </h2>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {status && (
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    status.connection === 'SUCCESS'
                      ? 'bg-green-500'
                      : status.connection === 'CONFIGURATION_REQUIRED'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Connection Status: {status.connection}
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last checked: {new Date(status.timestamp).toLocaleString()}
              </p>
              {status.message && (
                <p className="mt-2 text-gray-700 dark:text-gray-300">{status.message}</p>
              )}
            </div>

            {/* Environment Check */}
            {status.environmentCheck && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Environment Configuration
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border dark:border-gray-700 rounded p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Supabase URL
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className={`${status.environmentCheck.url.exists ? 'text-green-600' : 'text-red-600'}`}>
                        Exists: {status.environmentCheck.url.exists ? 'Yes' : 'No'}
                      </p>
                      <p className={`${status.environmentCheck.url.isPlaceholder ? 'text-yellow-600' : 'text-green-600'}`}>
                        Is Placeholder: {status.environmentCheck.url.isPlaceholder ? 'Yes' : 'No'}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Value: {status.environmentCheck.url.value || 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div className="border dark:border-gray-700 rounded p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Anon Key
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className={`${status.environmentCheck.anonKey.exists ? 'text-green-600' : 'text-red-600'}`}>
                        Exists: {status.environmentCheck.anonKey.exists ? 'Yes' : 'No'}
                      </p>
                      <p className={`${status.environmentCheck.anonKey.isPlaceholder ? 'text-yellow-600' : 'text-green-600'}`}>
                        Is Placeholder: {status.environmentCheck.anonKey.isPlaceholder ? 'Yes' : 'No'}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Value: {status.environmentCheck.anonKey.value || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Required Steps */}
            {status.requiredSteps && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-400 mb-4">
                  Required Steps
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-yellow-700 dark:text-yellow-300">
                  {status.requiredSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Expected Schema */}
            {status.expectedDatabaseSchema && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Expected Database Schema
                </h2>
                <div className="space-y-2">
                  {status.expectedDatabaseSchema.tables.map((table, index) => (
                    <div key={index} className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                        {table}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tables Data */}
            {status.tables && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Database Tables
                </h2>
                <div className="space-y-4">
                  {Object.entries(status.tables).map(([tableName, tableInfo]) => (
                    <div key={tableName} className="border dark:border-gray-700 rounded p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {tableName}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          tableInfo.accessible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tableInfo.accessible ? 'Accessible' : 'Not Accessible'}
                        </span>
                      </div>
                      {tableInfo.count !== undefined && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Rows: {tableInfo.count}
                        </p>
                      )}
                      {tableInfo.error && (
                        <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                          Error: {tableInfo.error}
                        </p>
                      )}
                      {tableInfo.sampleData && tableInfo.sampleData.length > 0 && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm text-blue-600 dark:text-blue-400">
                            View Sample Data ({tableInfo.sampleData.length} rows)
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-x-auto">
                            {JSON.stringify(tableInfo.sampleData, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}