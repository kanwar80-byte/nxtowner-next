import { Suspense } from 'react';
import FiltersSidebarV17 from '@/components/FiltersSidebarV17';
import SearchResultsClient from './SearchResultsClient';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="hidden md:block">
            <Suspense fallback={<div className="w-64 h-96 bg-slate-100 animate-pulse rounded" />}>
              <FiltersSidebarV17 />
            </Suspense>
          </aside>
          <main className="flex-1">
            <Suspense fallback={<div className="h-96 bg-slate-100 animate-pulse rounded" />}>
              <SearchResultsClient />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

