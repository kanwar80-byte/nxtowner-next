// src/components/browse/FilterSidebar.tsx
"use client";

import { AssetType, TAXONOMY } from '@/lib/taxonomy';
import { ChevronDown, ChevronRight, Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read current filters from URL
  const currentType = searchParams.get('type') as AssetType | null;
  const currentCategory = searchParams.get('category');
  const currentSub = searchParams.get('sub');
  const maxPrice = searchParams.get('maxPrice');

  // State for expanding/collapsing sections
  const [expandedType, setExpandedType] = useState<string | null>(currentType || 'Operational');

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
      // Reset children when parent changes
      if (key === 'type') { params.delete('category'); params.delete('sub'); }
      if (key === 'category') { params.delete('sub'); }
    } else {
      params.delete(key);
    }
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-64 bg-white border-r border-slate-200 h-full md:min-h-screen p-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <Filter size={18} /> Filters
        </h2>
        {(currentType || currentCategory) && (
          <button 
            onClick={() => router.push('/browse')}
            className="text-xs text-red-600 hover:text-red-800 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* 1. ASSET TYPE */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Asset Class</h3>
        <div className="space-y-2">
          {['Operational', 'Digital'].map((type) => (
            <div key={type} className="space-y-1">
              <button
                onClick={() => {
                  updateFilter('type', type);
                  setExpandedType(expandedType === type ? null : type);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentType === type ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type} Assets
                {expandedType === type ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {/* 2. CATEGORIES (Nested) */}
              {expandedType === type && (
                <div className="ml-2 pl-2 border-l border-slate-200 space-y-1 mt-1">
                  {Object.keys(TAXONOMY[type as AssetType]).map((cat) => (
                    <div key={cat}>
                       <button
                        onClick={() => updateFilter('category', cat)}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors truncate ${
                          currentCategory === cat ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. PRICE RANGE */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Max Price</h3>
        <div className="space-y-2">
           {[100000, 500000, 1000000, 5000000].map(price => (
             <label key={price} className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
               <input 
                 type="radio" 
                 name="price"
                 checked={Number(maxPrice) === price}
                 onChange={() => updateFilter('maxPrice', price.toString())}
                 className="text-blue-600 focus:ring-blue-500" 
               />
               <span>Under ${price.toLocaleString()}</span>
             </label>
           ))}
        </div>
      </div>
    </div>
  );
}