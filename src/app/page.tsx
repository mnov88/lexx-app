import { SearchBar } from '@/components/ui/SearchBar'
import { LatestCases } from '@/components/ui/LatestCases'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white">
          EU Legal Research
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Browse EU legislation and case law with seamless navigation. 
          Discover connections between articles and the cases that interpret them.
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto">
        <SearchBar placeholder="Search legislation, cases, or articles..." />
      </div>

      {/* Latest Cases Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white">
          Latest cases
        </h2>
        <LatestCases />
      </div>
    </div>
  )
}
