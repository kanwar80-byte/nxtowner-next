'use client';

import React from 'react';
import { useTrack } from '@/contexts/TrackContext';
import { cn } from '@/lib/utils';

interface TrustAndCategoriesProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

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
  const isOperational = track === 'operational';
  
  // Dynamic categories based on mode
  const categories = isOperational ? OPERATIONAL_CATEGORIES : DIGITAL_CATEGORIES;
  
  // Accent color based on mode
  const accentColor = isOperational 
    ? 'bg-amber-600 hover:bg-amber-700' 
    : 'bg-cyan-600 hover:bg-cyan-700';

  return (
    <section className="w-full py-12 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filter Pills Section */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
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

