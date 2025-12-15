"use client";

export default function BrowseFilters() {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="grid gap-3 md:grid-cols-5">
        <select className="h-10 rounded-lg border px-3">
          <option value="all">All Types</option>
          <option value="asset">Operational</option>
          <option value="digital">Digital</option>
        </select>

        <select className="h-10 rounded-lg border px-3">
          <option value="all">All Categories</option>
        </select>

        <select className="h-10 rounded-lg border px-3">
          <option value="any">Any Price</option>
        </select>

        <select className="h-10 rounded-lg border px-3">
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <button className="h-10 rounded-lg border px-3 font-medium">
          More Filters
        </button>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, ChevronDown, ChevronUp, Briefcase, Zap } from 'lucide-react';

const CATEGORIES = [
  "Gas Stations & C-Stores", "Car Washes", "SaaS (Software)", 
  "E-commerce Stores", "Warehouses & Industrial", "QSRs & Restaurants"
];

export default function BrowseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [assetType, setAssetType] = useState(searchParams.get('type') || 'all');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  
  // Financials
  const [minCashflow, setMinCashflow] = useState(searchParams.get('minCashflow') || '');
  const [minRevenue, setMinRevenue] = useState(searchParams.get('minRevenue') || '');
  const [showFinancials, setShowFinancials] = useState(true);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (assetType !== 'all') params.set('type', assetType);
    if (category) params.set('category', category);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minCashflow) params.set('minCashflow', minCashflow);
    if (minRevenue) params.set('minRevenue', minRevenue);
    
    // Updates URL -> Triggers Page Reload -> Runs Server Action
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-24">
      <div className="flex items-center gap-2 mb-6 text-[#0a192f] font-bold pb-4 border-b border-gray-100">
        <Filter size={20} />
        <span>Filter Listings</span>
      </div>

      <div className="space-y-8">
        {/* 1. Asset Type Toggle */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Business Type</label>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setAssetType('all')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${assetType === 'all' ? 'bg-white text-[#0a192f] shadow-sm' : 'text-gray-500'}`}>All</button>
            <button onClick={() => setAssetType('asset')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 ${assetType === 'asset' ? 'bg-white text-[#0a192f] shadow-sm' : 'text-gray-500'}`}><Briefcase size={10}/> Ops</button>
            <button onClick={() => setAssetType('digital')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 ${assetType === 'digital' ? 'bg-white text-[#0a192f] shadow-sm' : 'text-gray-500'}`}><Zap size={10}/> Digital</button>
          </div>
        </div>

        {/* 2. Category */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a192f] outline-none">
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* 3. Price Range */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Price Range (CAD)</label>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"/>
            <span className="text-gray-300">-</span>
            <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"/>
          </div>
        </div>

        {/* 4. Financial Filters */}
        <div className="pt-4 border-t border-gray-50">
          <button onClick={() => setShowFinancials(!showFinancials)} className="flex items-center justify-between w-full text-left mb-4 group">
            <label className="text-xs font-bold uppercase text-orange-600 tracking-wider cursor-pointer">Financial Filters</label>
            {showFinancials ? <ChevronUp size={14} className="text-gray-400"/> : <ChevronDown size={14} className="text-gray-400"/>}
          </button>
          
          {showFinancials && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
               <div>
                  <label className="text-sm text-gray-600 mb-1 block">Min Annual Revenue</label>
                  <input type="number" placeholder="$500,000+" value={minRevenue} onChange={(e) => setMinRevenue(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"/>
               </div>
               <div>
                  <label className="text-sm text-gray-600 mb-1 block">Min EBITDA / Profit</label>
                  <input type="number" placeholder="$100,000+" value={minCashflow} onChange={(e) => setMinCashflow(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"/>
               </div>
            </div>
          )}
        </div>

        <button onClick={applyFilters} className="w-full bg-[#0a192f] text-white font-bold py-3 rounded-xl hover:bg-[#142642] transition-all shadow-md active:scale-95">Update Results</button>
        <button onClick={() => router.push('/browse')} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-2">Reset Filters</button>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, ChevronDown, ChevronUp, Briefcase, Zap } from 'lucide-react';

const CATEGORIES = [
  "Gas Stations & C-Stores", "Car Washes", "SaaS (Software)", 
  "E-commerce Stores", "Warehouses & Industrial", "QSRs & Restaurants"
];

export default function BrowseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [assetType, setAssetType] = useState(searchParams.get('type') || 'all');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  
  // Financials
  const [minCashflow, setMinCashflow] = useState(searchParams.get('minCashflow') || '');
  const [minRevenue, setMinRevenue] = useState(searchParams.get('minRevenue') || '');
  const [showFinancials, setShowFinancials] = useState(true);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (assetType !== 'all') params.set('type', assetType);
    if (category) params.set('category', category);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minCashflow) params.set('minCashflow', minCashflow);
    if (minRevenue) params.set('minRevenue', minRevenue);
    
    // Updates URL -> Triggers Page Reload -> Runs Server Action
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-24">
      <div className="flex items-center gap-2 mb-6 text-[#0a192f] font-bold pb-4 border-b border-gray-100">
        <Filter size={20} />
        <span>Filter Listings</span>
      </div>

      <div className="space-y-8">
        {/* 1. Asset Type Toggle */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Business Type</label>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setAssetType('all')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${assetType === 'all' ? 'bg-white text-[#0a192f] shadow-sm' : 'text-gray-500'}`}>All</button>
            <button onClick={() => setAssetType('asset')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 ${assetType === 'asset' ? 'bg-white text-[#0a192f] shadow-sm' : 'text-gray-500'}`}><Briefcase size={10}/> Ops</button>
            <button onClick={() => setAssetType('digital')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 ${assetType === 'digital' ? 'bg-white text-[#0a192f] shadow-sm' : 'text-gray-500'}`}><Zap size={10}/> Digital</button>
          </div>
        </div>

        {/* 2. Category */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a192f] outline-none">
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* 3. Price Range */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Price Range (CAD)</label>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"/>
            <span className="text-gray-300">-</span>
            <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"/>
          </div>
        </div>

        {/* 4. Financial Filters */}
        <div className="pt-4 border-t border-gray-50">
          <button onClick={() => setShowFinancials(!showFinancials)} className="flex items-center justify-between w-full text-left mb-4 group">
            <label className="text-xs font-bold uppercase text-orange-600 tracking-wider cursor-pointer">Financial Filters</label>
            {showFinancials ? <ChevronUp size={14} className="text-gray-400"/> : <ChevronDown size={14} className="text-gray-400"/>}
          </button>
          
          {showFinancials && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
               <div>
                  <label className="text-sm text-gray-600 mb-1 block">Min Annual Revenue</label>
                  <input type="number" placeholder="$500,000+" value={minRevenue} onChange={(e) => setMinRevenue(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"/>
               </div>
               <div>
                  <label className="text-sm text-gray-600 mb-1 block">Min EBITDA / Profit</label>
                  <input type="number" placeholder="$100,000+" value={minCashflow} onChange={(e) => setMinCashflow(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"/>
               </div>
            </div>
          )}
        </div>

        <button onClick={applyFilters} className="w-full bg-[#0a192f] text-white font-bold py-3 rounded-xl hover:bg-[#142642] transition-all shadow-md active:scale-95">Update Results</button>
        <button onClick={() => router.push('/browse')} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-2">Reset Filters</button>
      </div>
    </div>
  );
}
'use client'

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, ChevronDown, ChevronUp, Briefcase, Zap } from 'lucide-react';

const CATEGORIES = [
  "Gas Stations & C-Stores", "Car Washes", "SaaS (Software)", 
  "E-commerce Stores", "Warehouses & Industrial", "QSRs & Restaurants"
];

export default function BrowseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // BrowseFilters client component
  // This file should only contain the React component for filter UI.
  // Stripe server actions should be in src/app/actions/stripe.ts

  import React from 'react';

  type BrowseFiltersProps = {
    filters: {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      assetType?: string;
      minCashflow?: number;
      minRevenue?: number;
    };
    setFilters: (filters: any) => void;
  };

  const BrowseFilters: React.FC<BrowseFiltersProps> = ({ filters, setFilters }) => {
    // ...existing code for filter UI (inputs, selects, etc.)
    return (
      <div className="space-y-4">
        {/* Example filter UI - replace with your actual filter controls */}
        <input
          type="text"
          placeholder="Category"
          value={filters.category || ''}
          onChange={e => setFilters({ ...filters, category: e.target.value })}
          className="border p-2 rounded w-full"
        />
        {/* Add more filter controls as needed */}
      </div>
    );
  };

  export default BrowseFilters;
          value={filters.category || ''}
          onChange={e => setFilters({ ...filters, category: e.target.value })}
          className="border p-2 rounded w-full"
        />
        {/* Add more filter controls as needed */}
      </div>
    );
  };

  export default BrowseFilters;
            </button>
            <button
              onClick={() => setAssetType('digital')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 ${assetType === 'digital' ? 'bg-white text-[#0a192f] shadow-sm' : 'text-gray-500'}`}
            >
              <Zap size={10}/> Digital
            </button>
          </div>
        </div>

        {/* 2. Category */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0a192f] outline-none"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* 3. Price Range */}
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Price Range (CAD)</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
            <span className="text-gray-300">-</span>
            <input 
              type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* 4. Financial Filters (Dynamic) */}
        <div className="pt-4 border-t border-gray-50">
          <button 
            onClick={() => setShowFinancials(!showFinancials)}
            className="flex items-center justify-between w-full text-left mb-4 group"
          >
            <label className="text-xs font-bold uppercase text-orange-600 tracking-wider cursor-pointer">
              {assetType === 'digital' ? 'Digital Metrics' : 'Financial Filters'}
            </label>
            {showFinancials ? <ChevronUp size={14} className="text-gray-400"/> : <ChevronDown size={14} className="text-gray-400"/>}
          </button>
          
          {showFinancials && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
               {/* Shared: Revenue */}
               <div>
                  <label className="text-sm text-gray-600 mb-1 block">Min Annual Revenue</label>
                  <input 
                    type="number" placeholder="$500,000+" value={minRevenue} onChange={(e) => setMinRevenue(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  />
               </div>

               {/* Shared: Cashflow */}
               <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    {assetType === 'digital' ? 'Min Annual Profit' : 'Min EBITDA / SDE'}
                  </label>
                  <input 
                    type="number" placeholder="$100,000+" value={minCashflow} onChange={(e) => setMinCashflow(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  />
               </div>

               {/* Operational Only: Real Estate */}
               {assetType !== 'digital' && (
                 <div className="flex items-center gap-2 mt-2">
                   <input type="checkbox" id="re" className="rounded text-[#0a192f] focus:ring-[#0a192f]" />
                   <label htmlFor="re" className="text-sm text-gray-600">Real Estate Included</label>
                 </div>
               )}
            </div>
          )}
        </div>

        <button 
          onClick={applyFilters}
          className="w-full bg-[#0a192f] text-white font-bold py-3 rounded-xl hover:bg-[#142642] transition-all shadow-md active:scale-95"
        >
          Update Results
        </button>
        
        <button 
          onClick={() => router.push('/browse')}
          className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-2"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
