import { LegislationList } from '@/components/legislation/LegislationList'

export default function LegislationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
          EU Legislation
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          Browse all EU legislation in our database. Click on any legislation to view its articles 
          and see related case law interpretations.
        </p>
      </div>
      
      <LegislationList />
    </div>
  )
}