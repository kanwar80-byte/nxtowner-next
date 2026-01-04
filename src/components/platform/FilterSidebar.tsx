"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { parseAsString, useQueryState } from 'nuqs';
import { Suspense } from 'react';

// UUID regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUUID(value: string | null | undefined): boolean {
  if (!value || typeof value !== "string") return false;
  return UUID_REGEX.test(value);
}

const MIN_PRICE = 0;
const MAX_PRICE = 5000000;
const PRICE_STEP = 50000;

type FacetValue = { count: number; label: string };

function FilterSidebarInner({ 
  categoryCounts = {} 
}: { 
  categoryCounts?: Record<string, number | FacetValue> 
}) {
  const [assetType, setAssetType] = useQueryState('asset_type', parseAsString);
  const [category, setCategory] = useQueryState('category', parseAsString);
  const [categoryId, setCategoryId] = useQueryState('categoryId', parseAsString);
  const [minPrice, setMinPrice] = useQueryState('min_price', parseAsString);
  const [maxPrice, setMaxPrice] = useQueryState('max_price', parseAsString);

  const clearAll = () => {
    setAssetType(null);
    setCategory(null);
    setCategoryId(null);
    setMinPrice(null);
    setMaxPrice(null);
  };

  const handleCategoryChange = (key: string) => {
    // Determine if key is UUID or code
    if (isUUID(key)) {
      // UUID: use categoryId param (preferred)
      setCategoryId(categoryId === key ? null : key);
      setCategory(null); // Clear legacy category param
    } else {
      // Code/string: use category param (legacy)
      setCategory(category === key ? null : key);
      setCategoryId(null); // Clear UUID param
    }
  };

  // Check if a category is currently selected
  const isCategorySelected = (key: string): boolean => {
    if (isUUID(key)) {
      return categoryId === key;
    }
    return category === key;
  };

  // Normalize categoryCounts to handle both old (number) and new (FacetValue) shapes
  const normalizedCategoryCounts: Record<string, FacetValue> = {};
  for (const [key, value] of Object.entries(categoryCounts)) {
    if (typeof value === 'number') {
      // Legacy shape: just a number, use key as label
      normalizedCategoryCounts[key] = { count: value, label: key };
    } else {
      // New shape: object with count and label
      normalizedCategoryCounts[key] = value;
    }
  }

  // Sort categories by count (descending) for better UX
  const sortedCategories = Object.entries(normalizedCategoryCounts)
    .sort(([, a], [, b]) => b.count - a.count);

  const currentMin = minPrice ? parseInt(minPrice) : MIN_PRICE;
  const currentMax = maxPrice ? parseInt(maxPrice) : MAX_PRICE;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-lg text-slate-900">Filters</span>
        <button
          className="text-xs text-blue-600 hover:underline font-medium"
          onClick={clearAll}
        >
          Clear All
        </button>
      </div>

      <Accordion type="multiple" defaultValue={["asset-type", "category", "price"]} className="w-full">
        {/* Asset Type */}
        <AccordionItem value="asset-type" className="border-slate-200">
          <AccordionTrigger className="text-sm font-bold">Asset Type</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={assetType || "all"}
              onValueChange={(val) => setAssetType(val === "all" ? null : val)}
              className="flex flex-col gap-2 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="text-sm font-normal">All Assets</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="operational" id="operational" />
                <Label htmlFor="operational" className="text-sm font-normal">Operational</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="digital" id="digital" />
                <Label htmlFor="digital" className="text-sm font-normal">Digital</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Categories */}
        <AccordionItem value="category" className="border-slate-200">
          <AccordionTrigger className="text-sm font-bold">Categories</AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-48 pr-4 pt-2">
              <div className="space-y-3">
                {sortedCategories.length > 0 ? (
                  sortedCategories.map(([key, facetValue]) => (
                    <div key={key} className="flex items-center justify-between group">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={key} 
                          checked={isCategorySelected(key)}
                          onCheckedChange={() => handleCategoryChange(key)}
                        />
                        <Label 
                          htmlFor={key} 
                          className="text-sm font-normal cursor-pointer group-hover:text-blue-600 transition-colors"
                        >
                          {facetValue.label}
                        </Label>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({facetValue.count})
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No categories available</p>
                )}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="text-sm font-bold">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-6 px-2">
              <Slider
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={PRICE_STEP}
                value={[currentMin, currentMax]}
                onValueChange={([min, max]) => {
                  setMinPrice(min.toString());
                  setMaxPrice(max.toString());
                }}
              />
              <div className="flex justify-between mt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Min</span>
                  <span className="text-xs font-mono">${currentMin.toLocaleString()}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Max</span>
                  <span className="text-xs font-mono">${currentMax.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default function FilterSidebar({ 
  categoryCounts = {} 
}: { 
  categoryCounts?: Record<string, number | FacetValue> 
}) {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-lg text-slate-900">Filters</span>
        </div>
        <div className="text-sm text-slate-500">Loading filters…</div>
      </div>
    }>
      <FilterSidebarInner categoryCounts={categoryCounts} />
    </Suspense>
  );
}
