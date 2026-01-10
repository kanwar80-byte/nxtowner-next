"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { parseAsString, parseAsArrayOf, useQueryState } from "nuqs";
import { Suspense } from "react";
import { Filter } from "lucide-react";

// Constants for slider ranges
const MIN_ASKING_PRICE = 0;
const MAX_ASKING_PRICE = 10000000;
const MIN_REVENUE = 0;
const MAX_REVENUE = 10000000;
const MIN_CASH_FLOW = 0;
const MAX_CASH_FLOW = 5000000;
const SLIDER_STEP = 50000;

// Real World Categories
const REAL_WORLD_CATEGORIES = [
  { value: "gas_stations", label: "Gas Stations" },
  { value: "restaurants", label: "Restaurants" },
  { value: "industrial", label: "Industrial" },
  { value: "retail", label: "Retail" },
];

// Digital Business Models
const DIGITAL_BUSINESS_MODELS = [
  { value: "saas", label: "SaaS" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "content", label: "Content" },
  { value: "agency", label: "Agency" },
];

// Digital Monetization
const DIGITAL_MONETIZATION = [
  { value: "subscription", label: "Subscription" },
  { value: "ad_revenue", label: "Ad Revenue" },
  { value: "one_time", label: "One-time" },
];

// Digital Platforms
const DIGITAL_PLATFORMS = [
  { value: "shopify", label: "Shopify" },
  { value: "wordpress", label: "WordPress" },
  { value: "custom", label: "Custom" },
];

// Canadian Provinces
const CANADIAN_PROVINCES = [
  { value: "ON", label: "Ontario" },
  { value: "BC", label: "British Columbia" },
  { value: "AB", label: "Alberta" },
  { value: "QC", label: "Quebec" },
  { value: "MB", label: "Manitoba" },
  { value: "SK", label: "Saskatchewan" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "YT", label: "Yukon" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
];

interface SmartFiltersProps {
  assetType?: "real_world" | "digital" | null;
}

function SmartFiltersInner({ assetType }: SmartFiltersProps) {
  // Financial Filters - URL State
  const [minAskingPrice, setMinAskingPrice] = useQueryState(
    "min_price",
    parseAsString
  );
  const [maxAskingPrice, setMaxAskingPrice] = useQueryState(
    "max_price",
    parseAsString
  );
  const [minRevenue, setMinRevenue] = useQueryState(
    "min_revenue",
    parseAsString
  );
  const [maxRevenue, setMaxRevenue] = useQueryState(
    "max_revenue",
    parseAsString
  );
  const [minCashFlow, setMinCashFlow] = useQueryState(
    "min_cashflow",
    parseAsString
  );
  const [maxCashFlow, setMaxCashFlow] = useQueryState(
    "max_cashflow",
    parseAsString
  );

  // Real World Filters
  const [categories, setCategories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [realEstateIncluded, setRealEstateIncluded] = useQueryState(
    "real_estate_included",
    parseAsString
  );
  const [location, setLocation] = useQueryState("location", parseAsString);

  // Digital Filters
  const [businessModels, setBusinessModels] = useQueryState(
    "business_models",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [monetization, setMonetization] = useQueryState(
    "monetization",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [platforms, setPlatforms] = useQueryState(
    "platforms",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  // Local state for sliders (dual-thumb)
  const [askingPriceRange, setAskingPriceRange] = useState<[number, number]>([
    MIN_ASKING_PRICE,
    MAX_ASKING_PRICE,
  ]);
  const [revenueRange, setRevenueRange] = useState<[number, number]>([
    MIN_REVENUE,
    MAX_REVENUE,
  ]);
  const [cashFlowRange, setCashFlowRange] = useState<[number, number]>([
    MIN_CASH_FLOW,
    MAX_CASH_FLOW,
  ]);

  // Sync URL state to local slider state on mount/change
  useEffect(() => {
    setAskingPriceRange([
      minAskingPrice ? parseInt(minAskingPrice) : MIN_ASKING_PRICE,
      maxAskingPrice ? parseInt(maxAskingPrice) : MAX_ASKING_PRICE,
    ]);
  }, [minAskingPrice, maxAskingPrice]);

  useEffect(() => {
    setRevenueRange([
      minRevenue ? parseInt(minRevenue) : MIN_REVENUE,
      maxRevenue ? parseInt(maxRevenue) : MAX_REVENUE,
    ]);
  }, [minRevenue, maxRevenue]);

  useEffect(() => {
    setCashFlowRange([
      minCashFlow ? parseInt(minCashFlow) : MIN_CASH_FLOW,
      maxCashFlow ? parseInt(maxCashFlow) : MAX_CASH_FLOW,
    ]);
  }, [minCashFlow, maxCashFlow]);

  // Handlers for sliders
  const handleAskingPriceChange = (values: number[]) => {
    const [min, max] = values;
    setAskingPriceRange([min, max]);
    setMinAskingPrice(min === MIN_ASKING_PRICE ? null : min.toString());
    setMaxAskingPrice(max === MAX_ASKING_PRICE ? null : max.toString());
  };

  const handleRevenueChange = (values: number[]) => {
    const [min, max] = values;
    setRevenueRange([min, max]);
    setMinRevenue(min === MIN_REVENUE ? null : min.toString());
    setMaxRevenue(max === MAX_REVENUE ? null : max.toString());
  };

  const handleCashFlowChange = (values: number[]) => {
    const [min, max] = values;
    setCashFlowRange([min, max]);
    setMinCashFlow(min === MIN_CASH_FLOW ? null : min.toString());
    setMaxCashFlow(max === MAX_CASH_FLOW ? null : max.toString());
  };

  // Handlers for checkboxes
  const handleCategoryToggle = (value: string) => {
    const newCategories = categories.includes(value)
      ? categories.filter((c) => c !== value)
      : [...categories, value];
    setCategories(newCategories.length > 0 ? newCategories : []);
  };

  const handleBusinessModelToggle = (value: string) => {
    const newModels = businessModels.includes(value)
      ? businessModels.filter((m) => m !== value)
      : [...businessModels, value];
    setBusinessModels(newModels.length > 0 ? newModels : []);
  };

  const handleMonetizationToggle = (value: string) => {
    const newMonetization = monetization.includes(value)
      ? monetization.filter((m) => m !== value)
      : [...monetization, value];
    setMonetization(newMonetization.length > 0 ? newMonetization : []);
  };

  const handlePlatformToggle = (value: string) => {
    const newPlatforms = platforms.includes(value)
      ? platforms.filter((p) => p !== value)
      : [...platforms, value];
    setPlatforms(newPlatforms.length > 0 ? newPlatforms : []);
  };

  // Clear all filters
  const clearAll = () => {
    setMinAskingPrice(null);
    setMaxAskingPrice(null);
    setMinRevenue(null);
    setMaxRevenue(null);
    setMinCashFlow(null);
    setMaxCashFlow(null);
    setCategories([]);
    setBusinessModels([]);
    setMonetization([]);
    setPlatforms([]);
    setRealEstateIncluded(null);
    setLocation(null);
    setAskingPriceRange([MIN_ASKING_PRICE, MAX_ASKING_PRICE]);
    setRevenueRange([MIN_REVENUE, MAX_REVENUE]);
    setCashFlowRange([MIN_CASH_FLOW, MAX_CASH_FLOW]);
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  // Default accordion state - Financials open, others closed
  const defaultAccordionValue = assetType ? ["financials"] : ["financials"];

  return (
    <div className="w-full h-full flex flex-col bg-[#050505] text-slate-200 border-r border-slate-800 sticky top-28 self-start">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <h2 className="font-semibold text-lg text-white">Filters</h2>
        </div>
        <button
          onClick={clearAll}
          className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <Accordion
          type="multiple"
          defaultValue={defaultAccordionValue}
          className="w-full px-4 py-2"
        >
          {/* Financial Filters - Always Visible */}
          <AccordionItem value="financials" className="border-slate-800">
            <AccordionTrigger className="text-sm font-semibold text-slate-200 hover:text-white py-3">
              Financials
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              {/* Asking Price Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-300">
                  Asking Price
                </Label>
                <Slider
                  min={MIN_ASKING_PRICE}
                  max={MAX_ASKING_PRICE}
                  step={SLIDER_STEP}
                  value={askingPriceRange}
                  onValueChange={handleAskingPriceChange}
                  className="w-full"
                />
                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-xs text-slate-400 mb-1 block">
                      Min
                    </Label>
                    <Input
                      type="number"
                      value={askingPriceRange[0]}
                      onChange={(e) => {
                        const val = Math.max(
                          MIN_ASKING_PRICE,
                          Math.min(parseInt(e.target.value) || MIN_ASKING_PRICE, askingPriceRange[1])
                        );
                        handleAskingPriceChange([val, askingPriceRange[1]]);
                      }}
                      className="h-8 bg-slate-900 border-slate-700 text-slate-200 text-xs"
                      placeholder="Min"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-slate-400 mb-1 block">
                      Max
                    </Label>
                    <Input
                      type="number"
                      value={askingPriceRange[1]}
                      onChange={(e) => {
                        const val = Math.min(
                          MAX_ASKING_PRICE,
                          Math.max(parseInt(e.target.value) || MAX_ASKING_PRICE, askingPriceRange[0])
                        );
                        handleAskingPriceChange([askingPriceRange[0], val]);
                      }}
                      className="h-8 bg-slate-900 border-slate-700 text-slate-200 text-xs"
                      placeholder="Max"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{formatCurrency(askingPriceRange[0])}</span>
                  <span>{formatCurrency(askingPriceRange[1])}</span>
                </div>
              </div>

              {/* Revenue Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-300">
                  Revenue
                </Label>
                <Slider
                  min={MIN_REVENUE}
                  max={MAX_REVENUE}
                  step={SLIDER_STEP}
                  value={revenueRange}
                  onValueChange={handleRevenueChange}
                  className="w-full"
                />
                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-xs text-slate-400 mb-1 block">
                      Min
                    </Label>
                    <Input
                      type="number"
                      value={revenueRange[0]}
                      onChange={(e) => {
                        const val = Math.max(
                          MIN_REVENUE,
                          Math.min(parseInt(e.target.value) || MIN_REVENUE, revenueRange[1])
                        );
                        handleRevenueChange([val, revenueRange[1]]);
                      }}
                      className="h-8 bg-slate-900 border-slate-700 text-slate-200 text-xs"
                      placeholder="Min"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-slate-400 mb-1 block">
                      Max
                    </Label>
                    <Input
                      type="number"
                      value={revenueRange[1]}
                      onChange={(e) => {
                        const val = Math.min(
                          MAX_REVENUE,
                          Math.max(parseInt(e.target.value) || MAX_REVENUE, revenueRange[0])
                        );
                        handleRevenueChange([revenueRange[0], val]);
                      }}
                      className="h-8 bg-slate-900 border-slate-700 text-slate-200 text-xs"
                      placeholder="Max"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{formatCurrency(revenueRange[0])}</span>
                  <span>{formatCurrency(revenueRange[1])}</span>
                </div>
              </div>

              {/* Cash Flow / EBITDA Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-300">
                  Cash Flow / EBITDA
                </Label>
                <Slider
                  min={MIN_CASH_FLOW}
                  max={MAX_CASH_FLOW}
                  step={SLIDER_STEP}
                  value={cashFlowRange}
                  onValueChange={handleCashFlowChange}
                  className="w-full"
                />
                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-xs text-slate-400 mb-1 block">
                      Min
                    </Label>
                    <Input
                      type="number"
                      value={cashFlowRange[0]}
                      onChange={(e) => {
                        const val = Math.max(
                          MIN_CASH_FLOW,
                          Math.min(parseInt(e.target.value) || MIN_CASH_FLOW, cashFlowRange[1])
                        );
                        handleCashFlowChange([val, cashFlowRange[1]]);
                      }}
                      className="h-8 bg-slate-900 border-slate-700 text-slate-200 text-xs"
                      placeholder="Min"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-slate-400 mb-1 block">
                      Max
                    </Label>
                    <Input
                      type="number"
                      value={cashFlowRange[1]}
                      onChange={(e) => {
                        const val = Math.min(
                          MAX_CASH_FLOW,
                          Math.max(parseInt(e.target.value) || MAX_CASH_FLOW, cashFlowRange[0])
                        );
                        handleCashFlowChange([cashFlowRange[0], val]);
                      }}
                      className="h-8 bg-slate-900 border-slate-700 text-slate-200 text-xs"
                      placeholder="Max"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{formatCurrency(cashFlowRange[0])}</span>
                  <span>{formatCurrency(cashFlowRange[1])}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Real World Specific Filters */}
          {assetType === "real_world" && (
            <>
              <AccordionItem value="category" className="border-slate-800">
                <AccordionTrigger className="text-sm font-semibold text-slate-200 hover:text-white py-3">
                  Category
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-4">
                  {REAL_WORLD_CATEGORIES.map((cat) => (
                    <div key={cat.value} className="flex items-center space-x-2 group">
                      <Checkbox
                        id={`cat-${cat.value}`}
                        checked={categories.includes(cat.value)}
                        onCheckedChange={() => handleCategoryToggle(cat.value)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-slate-700"
                      />
                      <Label
                        htmlFor={`cat-${cat.value}`}
                        className="text-sm text-slate-300 cursor-pointer group-hover:text-white transition-colors flex-1"
                      >
                        {cat.label}
                      </Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="real-estate" className="border-slate-800">
                <AccordionTrigger className="text-sm font-semibold text-slate-200 hover:text-white py-3">
                  Real Estate
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="real-estate-switch"
                      className="text-sm text-slate-300 cursor-pointer"
                    >
                      Real Estate Included?
                    </Label>
                    <Switch
                      id="real-estate-switch"
                      checked={realEstateIncluded === "true"}
                      onCheckedChange={(checked) =>
                        setRealEstateIncluded(checked ? "true" : null)
                      }
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="location" className="border-slate-800 border-none">
                <AccordionTrigger className="text-sm font-semibold text-slate-200 hover:text-white py-3">
                  Location
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <select
                    value={location || ""}
                    onChange={(e) => setLocation(e.target.value || null)}
                    className="w-full h-10 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Provinces</option>
                    {CANADIAN_PROVINCES.map((province) => (
                      <option key={province.value} value={province.value}>
                        {province.label}
                      </option>
                    ))}
                  </select>
                </AccordionContent>
              </AccordionItem>
            </>
          )}

          {/* Digital Specific Filters */}
          {assetType === "digital" && (
            <>
              <AccordionItem value="business-model" className="border-slate-800">
                <AccordionTrigger className="text-sm font-semibold text-slate-200 hover:text-white py-3">
                  Business Model
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-4">
                  {DIGITAL_BUSINESS_MODELS.map((model) => (
                    <div key={model.value} className="flex items-center space-x-2 group">
                      <Checkbox
                        id={`model-${model.value}`}
                        checked={businessModels.includes(model.value)}
                        onCheckedChange={() =>
                          handleBusinessModelToggle(model.value)
                        }
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-slate-700"
                      />
                      <Label
                        htmlFor={`model-${model.value}`}
                        className="text-sm text-slate-300 cursor-pointer group-hover:text-white transition-colors flex-1"
                      >
                        {model.label}
                      </Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="monetization" className="border-slate-800">
                <AccordionTrigger className="text-sm font-semibold text-slate-200 hover:text-white py-3">
                  Monetization
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-4">
                  {DIGITAL_MONETIZATION.map((mon) => (
                    <div key={mon.value} className="flex items-center space-x-2 group">
                      <Checkbox
                        id={`mon-${mon.value}`}
                        checked={monetization.includes(mon.value)}
                        onCheckedChange={() => handleMonetizationToggle(mon.value)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-slate-700"
                      />
                      <Label
                        htmlFor={`mon-${mon.value}`}
                        className="text-sm text-slate-300 cursor-pointer group-hover:text-white transition-colors flex-1"
                      >
                        {mon.label}
                      </Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="platform" className="border-slate-800 border-none">
                <AccordionTrigger className="text-sm font-semibold text-slate-200 hover:text-white py-3">
                  Platform
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-4">
                  {DIGITAL_PLATFORMS.map((platform) => (
                    <div key={platform.value} className="flex items-center space-x-2 group">
                      <Checkbox
                        id={`platform-${platform.value}`}
                        checked={platforms.includes(platform.value)}
                        onCheckedChange={() => handlePlatformToggle(platform.value)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-slate-700"
                      />
                      <Label
                        htmlFor={`platform-${platform.value}`}
                        className="text-sm text-slate-300 cursor-pointer group-hover:text-white transition-colors flex-1"
                      >
                        {platform.label}
                      </Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </>
          )}
        </Accordion>
      </div>
    </div>
  );
}

export default function SmartFilters({ assetType }: SmartFiltersProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex flex-col bg-[#050505] text-slate-200 border-r border-slate-800">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <h2 className="font-semibold text-lg text-white">Filters</h2>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-sm text-slate-500">Loading filters…</div>
          </div>
        </div>
      }
    >
      <SmartFiltersInner assetType={assetType} />
    </Suspense>
  );
}
