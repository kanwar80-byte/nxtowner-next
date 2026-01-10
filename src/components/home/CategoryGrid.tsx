"use client";

import { useTrack } from "@/contexts/TrackContext";
import { useRouter } from "next/navigation";
import { 
  Fuel, Store, Truck, Utensils, ShoppingBag, 
  Globe, Server, Cpu, Laptop, Briefcase, 
  Building2, Wrench, Smartphone, Search, Users
} from "lucide-react";
import Link from "next/link";

interface CategoryGridProps {
  selectedDigitalModel?: string;
  onSelectDigitalModel?: (model: string) => void;
}

export default function CategoryGrid({ selectedDigitalModel, onSelectDigitalModel }: CategoryGridProps = {}) {
  const { track } = useTrack();
  const router = useRouter();

  // Map category codes to canonical category names (for API filtering)
  const codeToCanonical: Record<string, string> = {
    'saas_software': 'SaaS',
    'ecommerce': 'E-Commerce',
    'ai_tools': 'AI Tools',
    'agencies': 'Agencies',
    'mobile_apps': 'Mobile Apps',
    'content_media': 'Content Sites',
    'domains': 'Domains',
    'communities': 'Communities',
  };

  // DYNAMIC CATEGORIES
  // UX RULE: Exact 8 specific items per track for perfect symmetry.
  // "All" is handled by the "View all categories" link in the header.
  const categories = {
    real_world: [
      { name: "Gas Stations", count: "142", icon: Fuel, code: "fuel_auto" },
      { name: "Restaurants", count: "320", icon: Utensils, code: "food_beverage" },
      { name: "Franchises", count: "85", icon: Store, highlight: true, code: "retail_franchise" },
      { name: "Transport", count: "54", icon: Truck, code: "transport_logistics" },
      { name: "Retail", count: "210", icon: ShoppingBag, code: "retail" },
      { name: "Industrial", count: "45", icon: Building2, code: "industrial" },
      { name: "Services", count: "120", icon: Wrench, code: "services" },
      { name: "Main Street", count: "500+", icon: Briefcase, code: "main_street" },
    ],
    digital: [
      // REMOVED "All" tile. Now matches Real World layout exactly.
      { name: "SaaS", count: "120", icon: Server, highlight: true, code: "saas_software" },
      { name: "E-Commerce", count: "340", icon: ShoppingBag, code: "ecommerce" },
      { name: "AI Tools", count: "45", icon: Cpu, code: "ai_tools" },
      { name: "Agencies", count: "85", icon: Globe, code: "agencies" },
      { name: "Mobile Apps", count: "65", icon: Smartphone, code: "mobile_apps" },
      { name: "Content Sites", count: "110", icon: Laptop, code: "content_media" },
      { name: "Domains", count: "900+", icon: Search, code: "domains" },
      { name: "Communities", count: "30", icon: Users, code: "communities" }, // Now visible as the 8th tile
    ]
  };

  const currentCats = track === 'real_world' ? categories.real_world : categories.digital;

  // Build category URL for navigation
  // URLs format: /browse?asset_type=real_world&category=<category_code>
  // Note: category_code must match the 'code' column in tax_categories table
  const getCategoryUrl = (categoryCode?: string) => {
    const assetType = track === 'real_world' ? 'real_world' : 'digital';
    if (categoryCode) {
      // Generate URL with both asset_type and category query parameters
      return `/browse?asset_type=${assetType}&category=${encodeURIComponent(categoryCode)}`;
    }
    return `/browse?asset_type=${assetType}`;
  };

  // Handle category tile click (only for embedded mode with callback)
  const handleCategoryClick = (categoryCode?: string, categoryName?: string) => {
    // Only used when embedded in digital mode with callback
    if (track === 'digital' && onSelectDigitalModel) {
      if (categoryCode && categoryName) {
        const canonicalName = codeToCanonical[categoryCode] || categoryName;
        onSelectDigitalModel(canonicalName);
      } else {
        onSelectDigitalModel('All');
      }
    }
  };

  // Build "View all categories" URL using query parameters
  const getViewAllCategoriesUrl = () => {
    const assetType = track === 'real_world' ? 'real_world' : 'digital';
    return `/browse?asset_type=${assetType}`;
  };

  const isEmbedded = track === 'digital' && selectedDigitalModel !== undefined && onSelectDigitalModel !== undefined;
   
  return (
    <div className={isEmbedded ? "" : "py-12 bg-[#050505] border-b border-slate-900"}>
      <div className={isEmbedded ? "" : "container mx-auto px-4"}>
        
        {isEmbedded ? (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Browse by Business Model
              </h3>
              <Link 
                href="/browse"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all categories &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">
              Browse by{' '}
              <span className={track === 'real_world' ? 'text-amber-500' : 'text-teal-400'}>
                {track === 'real_world' ? 'Industry' : 'Business Model'}
              </span>
            </h3>
            <Link 
              href={getViewAllCategoriesUrl()} 
              className={`text-sm transition-colors ${
                track === 'real_world' 
                  ? 'text-slate-400 hover:text-amber-400' 
                  : 'text-slate-400 hover:text-teal-400'
              }`}
            >
              View all categories &rarr;
            </Link>
          </div>
        )}

        {/* GRID: 8 Columns on Desktop (Single Row) */}
        <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4`}>
          {currentCats.map((cat, idx) => {
            const isSelected = track === 'digital' && selectedDigitalModel && (
              (codeToCanonical[cat.code] === selectedDigitalModel || cat.name === selectedDigitalModel)
            );
            
            const cardContent = (
              <div className={`
                flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 h-full min-h-[120px]
                ${isSelected
                  ? 'bg-teal-900/20 border-teal-500/50 hover:border-teal-500'
                  : cat.highlight 
                    ? (track === 'real_world' ? 'bg-amber-900/10 border-amber-500/30 hover:border-amber-500' : 'bg-teal-900/10 border-teal-500/30 hover:border-teal-500') 
                    : 'bg-[#0A0A0A] border-white/5 hover:border-white/20 hover:bg-white/[0.03]'}
              `}>
                <cat.icon className={`w-8 h-8 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${
                  track === 'real_world' 
                    ? 'text-amber-500/80 group-hover:text-amber-500' 
                    : 'text-teal-500/80 group-hover:text-teal-500'
                }`} />
                <span className="text-sm font-bold text-slate-300 group-hover:text-white text-center leading-tight">{cat.name}</span>
                <span className="text-[10px] text-slate-600 group-hover:text-slate-500 mt-1.5 text-center">{cat.count} listings</span>
              </div>
            );
            
            // Generate URL for navigation
            const categoryUrl = getCategoryUrl(cat.code);
            
            // For embedded mode (digital with callback), use button; otherwise use Link for standard navigation
            if (track === 'digital' && onSelectDigitalModel && isEmbedded) {
              return (
                <button
                  key={idx}
                  onClick={() => handleCategoryClick(cat.code, cat.name)}
                  className="group text-left h-full cursor-pointer"
                >
                  {cardContent}
                </button>
              );
            }
            
            // Standard navigation: Always use Link component for reliable category filtering
            return (
              <Link
                key={idx}
                href={categoryUrl}
                className="group text-left h-full cursor-pointer"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}