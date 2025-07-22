import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { UserRole } from '@/lib/auth'

export default function ChatPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.LAWYER}>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
            AI Legal Assistant
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            Chat with our AI assistant to get help with legal research, find relevant 
            cases and articles, and understand complex EU legislation interpretations.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            AI legal assistant coming soon...
          </p>
        </div>
      </div>
    </ProtectedRoute>
  )
}