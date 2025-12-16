"use client";

import { useState } from "react";
import { TAXONOMY } from "@/lib/categories";
import { ChevronDown, ChevronUp, Check, DollarSign, MapPin } from "lucide-react";

// Colors (NxtOwner Theme)
const THEME = {
  primary: "bg-[#0B1120]", // Deep Navy
  accent: "bg-[#F97316]",  // Orange
  text: "text-[#0B1120]",
};

interface FilterSidebarProps {
  filters: any;
  setFilters: (f: any) => void;
}

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("global");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  // NEW LOOKUP LOGIC:
  // 1. Get the current top-level group (physical or digital)
  const currentGroup = (TAXONOMY as any)[filters.type]; 
  
  // 2. Extract the categories array from that group, or return an empty array if not found
  const currentCategories = currentGroup && currentGroup.categories 
    ? Object.keys(currentGroup.categories)
    : [];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4 font-sans text-sm">
      
      {/* 🔹 SECTION 1: ASSET TYPE */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div 
          className={`p-4 ${THEME.primary} text-white font-bold flex justify-between items-center cursor-pointer`}
          onClick={() => toggleSection("global")}
        >
          <span>Asset Type</span>
          {expandedSection === "global" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {expandedSection === "global" && (
          <div className="p-4 space-y-3 bg-gray-50">
             <button
               // The value 'physical' must match the key in TAXONOMY
               onClick={() => handleChange("type", "physical")}
               className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex justify-between items-center ${
                 filters.type === "physical" 
                 ? "bg-white border-[#F97316] shadow-sm text-[#0B1120] font-semibold" 
                 : "border-transparent hover:bg-gray-100 text-gray-500"
               }`}
             >
               <span>🏢 Physical / Operational</span>
               {filters.type === "physical" && <Check size={16} className="text-[#F97316]" />}
             </button>

             <button
               // The value 'digital' must match the key in TAXONOMY
               onClick={() => handleChange("type", "digital")}
               className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex justify-between items-center ${
                 filters.type === "digital" 
                 ? "bg-white border-[#F97316] shadow-sm text-[#0B1120] font-semibold" 
                 : "border-transparent hover:bg-gray-100 text-gray-500"
               }`}
             >
               <span>💻 Digital / SaaS</span>
               {filters.type === "digital" && <Check size={16} className="text-[#F97316]" />}
             </button>
          </div>
        )}
      </div>

        {/* 🔹 SECTION 2: PRICE, CASH FLOW, & LOCATION */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 font-bold text-gray-800">
          Details
        </div>
        <div className="p-4 space-y-4">
            
          {/* Price Range */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Asking Price Range ($)</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Min Price"
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#F97316]"
                value={filters.minPrice}
                onChange={(e) => handleChange("minPrice", e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Max Price"
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#F97316]"
                value={filters.maxPrice}
                onChange={(e) => handleChange("maxPrice", e.target.value)}
              />
            </div>
          </div>
            
          {/* Cash Flow Range */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Cash Flow Range ($)</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Min Cash Flow"
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#F97316]"
                value={filters.minCashFlow}
                onChange={(e) => handleChange("minCashFlow", e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Max Cash Flow"
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#F97316]"
                value={filters.maxCashFlow}
                onChange={(e) => handleChange("maxCashFlow", e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Location</label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="e.g. Toronto, ON"
                className="w-full pl-8 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#F97316]"
                value={filters.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>
          </div>
            
          {/* Financing Checkbox */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={filters.hasFinancing}
                onChange={(e) => handleChange("hasFinancing", e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Seller Financing Available
              </span>
            </label>
          </div>
        </div>
        </div>

      {/* 🔹 SECTION 3: CATEGORIES */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div 
            className="p-4 border-b border-gray-100 font-bold text-gray-800 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("categories")}
        >
            <span>Categories</span>
            {expandedSection === "categories" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {expandedSection === "categories" && (
            <div className="p-2 max-h-64 overflow-y-auto">
                <button
                    onClick={() => handleChange("category", "all")}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 ${
                        filters.category === "all" ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    All Categories
                </button>
                
                {currentCategories && currentCategories.length > 0 ? (
                    currentCategories.map((cat: string) => (
                        <button
                            key={cat}
                            onClick={() => handleChange("category", cat)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 ${
                                filters.category === cat ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {cat}
                        </button>
                    ))
                ) : (
                    <p className="text-xs text-gray-400 p-2">No categories found. Check src/lib/categories.ts keys.</p>
                )}
            </div>
        )}
      </div>

    </aside>
  );
}