// src/app/browse/page.tsx
import { getFilteredListings } from '@/app/actions/getFilteredListings';
import FilterSidebar from '@/components/browse/FilterSidebar';
import ListingGrid from '@/components/browse/ListingGrid';
import { BrowseFiltersInput } from '@/types/listing';
import { Suspense } from 'react';

// Next.js 15+ / 16: searchParams is a Promise
interface BrowsePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BrowsePage(props: BrowsePageProps) {
  // 1. Await Search Params
  const searchParams = await props.searchParams;

  // 2. Parse Filters safely
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const currentAssetType = typeof searchParams.assetType === 'string' ? searchParams.assetType : 'all';
  
  const filters: BrowseFiltersInput = {
    assetType: currentAssetType as 'physical' | 'digital' | 'all',
    category: typeof searchParams.category === 'string' ? searchParams.category : 'all',
    minPrice: typeof searchParams.minPrice === 'string' ? parseInt(searchParams.minPrice) : null,
    maxPrice: typeof searchParams.maxPrice === 'string' ? parseInt(searchParams.maxPrice) : null,
    location: typeof searchParams.location === 'string' ? searchParams.location : 'all',
    status: 'all', // Show all listings to ensure data appears
  };

  // 3. Fetch Data
  const { listings, totalCount } = await getFilteredListings(filters, page);
  const totalPages = Math.ceil(totalCount / 20);

  // 4. Helper for Empty State
  const hasListings = listings && listings.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- HEADER --- */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Listings</h1>
          <p className="mt-2 text-gray-600">Find the perfect business or digital asset.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- CENTER TOGGLE (Operational / Digital / All) --- */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg inline-flex shadow-sm border border-gray-200">
            <a href="/browse?assetType=physical&page=1" className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${currentAssetType === 'physical' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>🏢 Operational Assets</a>
            <a href="/browse?assetType=digital&page=1" className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${currentAssetType === 'digital' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>💻 Digital Assets</a>
            <a href="/browse?assetType=all&page=1" className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${currentAssetType === 'all' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>All Listings</a>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- LEFT SIDEBAR --- */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <FilterSidebar currentFilters={filters} />
          </div>

          {/* --- RIGHT GRID --- */}
          <div className="flex-1">
            <Suspense fallback={<div className="text-center py-20">Loading listings...</div>}>
              {hasListings ? (
                <ListingGrid listings={listings} />
              ) : (
                <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                  <h3 className="text-lg font-medium text-gray-900">No listings found</h3>
                  <p className="text-gray-500 mt-1">We found {totalCount} total listings, but 0 matched your filters.</p>
                  <a href="/browse" className="mt-4 inline-block text-blue-600 hover:underline">Clear all filters</a>
                </div>
              )}
            </Suspense>

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-4">
                <a href={page > 1 ? `/browse?${new URLSearchParams({ ...searchParams as any, page: (page - 1).toString() }).toString()}` : '#'} className={`px-4 py-2 border rounded-md ${page <= 1 ? 'bg-gray-100 text-gray-400 pointer-events-none' : 'bg-white hover:bg-gray-50'}`}>Previous</a>
                <span className="text-gray-600">Page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold">{totalPages}</span></span>
                <a href={page < totalPages ? `/browse?${new URLSearchParams({ ...searchParams as any, page: (page + 1).toString() }).toString()}` : '#'} className={`px-4 py-2 border rounded-md ${page >= totalPages ? 'bg-gray-100 text-gray-400 pointer-events-none' : 'bg-white hover:bg-gray-50'}`}>Next</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}