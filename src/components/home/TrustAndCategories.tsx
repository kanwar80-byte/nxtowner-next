'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTrack } from '@/contexts/TrackContext';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

interface TrustAndCategoriesProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

// Category name to code mapping (for routing)
const CATEGORY_CODE_MAP: Record<string, string> = {
  // Operational
  'Gas Stations': 'fuel_auto',
  'Car Washes': 'fuel_auto',
  'Franchise Resales': 'retail_franchise',
  'Convenience Stores': 'retail_franchise',
  // Digital
  'SaaS': 'saas_software',
  'E-Commerce': 'ecommerce',
  'AI Tools': 'saas_software',
  'Content Sites': 'content_media',
};

// Category Constants
const OPERATIONAL_CATEGORIES = [
  'All Listings',
  'Gas Stations',
  'Car Washes',
  'Franchise Resales',
  'Convenience Stores',
];

const DIGITAL_CATEGORIES = [
  'All Listings',
  'SaaS',
  'E-Commerce',
  'AI Tools',
  'Content Sites',
];

export default function TrustAndCategories({ activeCategory, setActiveCategory }: TrustAndCategoriesProps) {
  const { track } = useTrack();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOperational = track === 'real_world';
  const supabase = createClient();
  
  // Dynamic categories based on mode
  const categories = isOperational ? OPERATIONAL_CATEGORIES : DIGITAL_CATEGORIES;
  
  // Accent color based on mode
  const accentColor = isOperational 
    ? 'bg-amber-600 hover:bg-amber-700' 
    : 'bg-cyan-600 hover:bg-cyan-700';

  // Sync activeCategory from URL params
  useEffect(() => {
    const categoryId = searchParams.get('categoryId');
    if (categoryId) {
      // Resolve categoryId to display name (client-side lookup)
      // For now, we'll keep activeCategory in sync with URL
      // The actual category name lookup would require an API call
    } else {
      // If no categoryId in URL, default to "All Listings"
      if (activeCategory !== "All Listings") {
        setActiveCategory("All Listings");
      }
    }
  }, [searchParams, activeCategory, setActiveCategory]);

  const handleCategoryClick = async (category: string) => {
    setActiveCategory(category);
    
    // Route to /browse with categoryId (UUID) - single source of truth
    if (category === 'All Listings') {
      router.push(`/browse?assetType=${track}`);
    } else {
      const categoryCode = CATEGORY_CODE_MAP[category];
      if (categoryCode) {
        try {
          // Resolve category code to UUID
          const { data: categoryData, error } = await supabase
            .from("tax_categories")
            .select("id")
            .eq("code", categoryCode)
            .maybeSingle();
          
          if (categoryData?.id && !error) {
            // Route to /browse with categoryId UUID
            router.push(`/browse?assetType=${track}&categoryId=${categoryData.id}`);
          } else {
            // Fallback: route with code if UUID resolution fails
            router.push(`/browse?assetType=${track}&category=${categoryCode}`);
          }
        } catch (err) {
          // Fallback: route with code if resolution fails
          router.push(`/browse?assetType=${track}&category=${categoryCode}`);
        }
      }
    }
  };

  return (
    <section className="w-full py-12 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filter Pills Section */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
                activeCategory === category
                  ? `${accentColor} text-white shadow-lg scale-105`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
              )}
            >
              {category}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
