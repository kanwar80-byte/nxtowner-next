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

const CATEGORIES = ["Food", "SaaS", "Retail", "Healthcare", "Finance"];
const MIN_PRICE = 0;
const MAX_PRICE = 5000000;
const PRICE_STEP = 50000;

export default function FilterSidebar({ categoryCounts = {} }: { categoryCounts?: Record<string, number> }) {
  const [assetType, setAssetType] = useQueryState('asset_type', parseAsString);
  const [category, setCategory] = useQueryState('category', parseAsString);
  const [minPrice, setMinPrice] = useQueryState('min_price', parseAsString);
  const [maxPrice, setMaxPrice] = useQueryState('max_price', parseAsString);

  const clearAll = () => {
    setAssetType(null);
    setCategory(null);
    setMinPrice(null);
    setMaxPrice(null);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(category === cat ? null : cat);
  };

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
                <RadioGroupItem value="Operational" id="operational" />
                <Label htmlFor="operational" className="text-sm font-normal">Operational</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Digital" id="digital" />
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
                {CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={cat} 
                        checked={category === cat}
                        onCheckedChange={() => handleCategoryChange(cat)}
                      />
                      <Label 
                        htmlFor={cat} 
                        className="text-sm font-normal cursor-pointer group-hover:text-blue-600 transition-colors"
                      >
                        {cat}
                      </Label>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({categoryCounts[cat] || 0})
                    </span>
                  </div>
                ))}
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