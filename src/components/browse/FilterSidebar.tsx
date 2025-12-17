// src/components/browse/FilterSidebar.tsx
"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { BrowseFiltersInput } from '@/types/listing';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  currentFilters?: BrowseFiltersInput;
}

// Default values to prevent crashes
const defaultFilters: BrowseFiltersInput = {
  assetType: 'all',
  category: 'all',
  minPrice: null,
  maxPrice: null,
  location: 'all',
  status: 'all'
};

export default function FilterSidebar({ currentFilters = defaultFilters }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = currentFilters;

  // Helper to update URL
  const updateFilter = (key: string, value: any) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'all' || value === '' || value === null) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    
    params.set('page', '1');
    router.push(`/browse?${params.toString()}`);
  };

  const showPhysical = filters.assetType === 'physical' || filters.assetType === 'all';
  const showDigital = filters.assetType === 'digital' || filters.assetType === 'all';

  const CategoryItem = ({ label, value }: { label: string, value: string }) => {
    const isActive = filters.category === value;
    return (
      <button
        onClick={() => updateFilter('category', isActive ? 'all' : value)}
        className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors flex items-center justify-between group ${
          isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <span>{label}</span>
        {isActive && <X className="w-3 h-3 text-blue-400" />}
      </button>
    );
  };

  return (
    <div className="space-y-8 pr-4">
      {/* Price Range */}
      <div>
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-400 text-xs">$</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value)}
              className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
             <span className="absolute left-3 top-2 text-gray-400 text-xs">$</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
              className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Category</h3>
        
        {showPhysical && (
          <div className="mb-6">
            <h4 className="text-[10px] font-semibold text-gray-400 uppercase mb-2 pl-2">Operational</h4>
            <div className="space-y-0.5">
              {['Fuel & Auto', 'Food & Beverage', 'Industrial & Logistics', 'Retail', 'Service Businesses'].map(cat => (
                <CategoryItem key={cat} label={cat} value={cat} />
              ))}
            </div>
          </div>
        )}

        {showDigital && (
          <div>
            <h4 className="text-[10px] font-semibold text-gray-400 uppercase mb-2 pl-2">Digital</h4>
            <div className="space-y-0.5">
              {['Digital Assets', 'SaaS', 'E-commerce', 'Agency', 'App'].map(cat => (
                <CategoryItem key={cat} label={cat} value={cat} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reset */}
      <button
        onClick={() => router.push('/browse')}
        className="w-full text-xs text-gray-400 hover:text-gray-600 underline text-center"
      >
        Clear All Filters
      </button>
    </div>
  );
}