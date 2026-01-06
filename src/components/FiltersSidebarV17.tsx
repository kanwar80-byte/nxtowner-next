"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CANONICAL_CATEGORIES, CANONICAL_SUBCATEGORIES } from '@/lib/v17/search/filters';

/**
 * V17 Filters Sidebar Component
 * Updates URL params on /search (no local state complexity)
 */
export default function FiltersSidebarV17() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read current URL params
  const [listingType, setListingType] = useState<'operational' | 'digital'>('operational');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [province, setProvince] = useState('');
  const [sort, setSort] = useState('newest');

  // Sync state with URL params on mount and when they change
  useEffect(() => {
    const listingTypeParam = searchParams.get('listing_type');
    const resolvedType = (listingTypeParam === 'operational' || listingTypeParam === 'digital')
      ? listingTypeParam
      : 'operational'; // Default to 'operational' if not set
    
    setListingType(resolvedType);
    setCategory(searchParams.get('category') || '');
    setSubcategory(searchParams.get('subcategory') || '');
    setMinPrice(searchParams.get('min_price') || '');
    setMaxPrice(searchParams.get('max_price') || '');
    setProvince(searchParams.get('province') || '');
    setSort(searchParams.get('sort') || 'newest');

    // Ensure listing_type is always in URL (even on initial load)
    // Only update if listing_type is missing or invalid
    if (!listingTypeParam || (listingTypeParam !== 'operational' && listingTypeParam !== 'digital')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('listing_type', resolvedType);
      const q = searchParams.get('q');
      if (q) params.set('q', q);
      // Use replace to avoid adding to history
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  // Get available subcategories for selected category
  const availableSubcategories = category && CANONICAL_SUBCATEGORIES[category]
    ? Array.from(CANONICAL_SUBCATEGORIES[category])
    : [];

  // Apply filters - update URL params
  const handleApply = () => {
    const params = new URLSearchParams();
    
    // Preserve query if it exists
    const q = searchParams.get('q');
    if (q) params.set('q', q);

    // ALWAYS include listing_type (required filter)
    params.set('listing_type', listingType);
    if (category) {
      params.set('category', category);
    }
    if (subcategory) {
      params.set('subcategory', subcategory);
    }
    if (minPrice) {
      params.set('min_price', minPrice);
    }
    if (maxPrice) {
      params.set('max_price', maxPrice);
    }
    if (province) {
      params.set('province', province);
    }
    if (sort && sort !== 'newest') {
      params.set('sort', sort);
    }

    router.push(`/search?${params.toString()}`);
  };

  const handleClear = () => {
    const params = new URLSearchParams();
    const q = searchParams.get('q');
    if (q) params.set('q', q);
    
    // ALWAYS keep listing_type (required filter)
    params.set('listing_type', listingType);
    
    // Keep sort default (newest)
    // Don't add sort param if it's the default
    
    router.push(`/search?${params.toString()}`);
    
    // Reset local state (but keep listingType)
    setCategory('');
    setSubcategory('');
    setMinPrice('');
    setMaxPrice('');
    setProvince('');
    setSort('newest');
  };

  return (
    <div className="w-64 space-y-6 p-4 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800">
      <div>
        <h3 className="font-semibold mb-4">Filters</h3>
        
        {/* Listing Type Toggle */}
        <div className="mb-4">
          <Label className="mb-2 block">Type</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={listingType === 'operational' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setListingType('operational');
                // Update URL immediately when toggle changes - ALWAYS include listing_type
                const params = new URLSearchParams(searchParams.toString());
                params.set('listing_type', 'operational');
                const q = searchParams.get('q');
                if (q) params.set('q', q);
                router.push(`/search?${params.toString()}`);
              }}
              className="flex-1"
            >
              Operational
            </Button>
            <Button
              type="button"
              variant={listingType === 'digital' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setListingType('digital');
                // Update URL immediately when toggle changes - ALWAYS include listing_type
                const params = new URLSearchParams(searchParams.toString());
                params.set('listing_type', 'digital');
                const q = searchParams.get('q');
                if (q) params.set('q', q);
                router.push(`/search?${params.toString()}`);
              }}
              className="flex-1"
            >
              Digital
            </Button>
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <Label htmlFor="category" className="mb-2 block">Category</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory(''); // Reset subcategory when category changes
            }}
            className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">All Categories</option>
            {Array.from(CANONICAL_CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory (dependent on category) */}
        {availableSubcategories.length > 0 && (
          <div className="mb-4">
            <Label htmlFor="subcategory" className="mb-2 block">Subcategory</Label>
            <select
              id="subcategory"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100"
            >
              <option value="">All Subcategories</option>
              {availableSubcategories.map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price Range */}
        <div className="mb-4">
          <Label className="mb-2 block">Price Range</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Province */}
        <div className="mb-4">
          <Label htmlFor="province" className="mb-2 block">Province</Label>
          <Input
            id="province"
            type="text"
            placeholder="e.g., ON, BC"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
        </div>

        {/* Sort */}
        <div className="mb-4">
          <Label htmlFor="sort" className="mb-2 block">Sort By</Label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-slate-100"
          >
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="revenue_high">Revenue: High to Low</option>
            <option value="cashflow_high">Cashflow: High to Low</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={handleClear} variant="outline" className="flex-1">
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}

