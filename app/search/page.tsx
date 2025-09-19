import { Suspense } from "react"
import { SearchHeader } from "@/components/search/search-header"
import { SearchInterface } from "@/components/search/search-interface"
import { SearchResults } from "@/components/search/search-results"
import { SearchFilters } from "@/components/search/search-filters"
import { RecentSearches } from "@/components/search/recent-searches"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <SearchInterface />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <SearchFilters />
            <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded-lg" />}>
              <RecentSearches />
            </Suspense>
          </div>

          <div className="lg:col-span-3">
            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <SearchResults />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
