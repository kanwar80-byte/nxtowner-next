'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Fuel, 
  Utensils, 
  Store, 
  Truck, 
  ShoppingBag, 
  Building2, 
  Wrench, 
  Briefcase 
} from 'lucide-react';

const INDUSTRIES = [
  { icon: Fuel, label: "Gas Stations", href: "/buy/gas-stations", color: "text-red-500" },
  { icon: Utensils, label: "Restaurants", href: "/buy/restaurants", color: "text-orange-500" },
  { icon: Store, label: "Franchises", href: "/buy/franchises", color: "text-yellow-500" },
  { icon: Truck, label: "Transport & Logistics", href: "/buy/transport", color: "text-blue-500" },
  { icon: ShoppingBag, label: "Retail", href: "/buy/retail", color: "text-pink-500" },
  { icon: Building2, label: "Industrial", href: "/buy/industrial", color: "text-gray-400" },
  { icon: Wrench, label: "Services", href: "/buy/services", color: "text-emerald-500" },
  { icon: Briefcase, label: "Main Street", href: "/buy/main-street", color: "text-purple-500" },
];

export default function IndustryGrid() {
  return (
    <section className="py-20 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Simple & Clean */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Browse by Industry</h2>
            <p className="text-gray-500 text-sm mt-1">Explore verified opportunities across key sectors.</p>
          </div>
          <Link 
            href="/buy" 
            className="hidden md:flex items-center text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors"
          >
            View all categories →
          </Link>
        </div>

        {/* The Grid - Distinct "Button" Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INDUSTRIES.map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className="group relative flex flex-col items-center justify-center p-6 bg-[#0A0A0A] border border-white/5 rounded-xl hover:border-orange-500/30 hover:bg-white/[0.03] transition-all duration-300"
            >
              {/* Icon - Starts subtle, glows on hover */}
              <item.icon 
                size={32} 
                className={`mb-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 ${item.color}`} 
              />
              
              {/* Label */}
              <span className="text-gray-300 font-medium text-sm group-hover:text-white transition-colors">
                {item.label}
              </span>

              {/* Mobile "Tap" Indicator (Optional subtle dot) */}
              <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-orange-500 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Mobile "View All" Link (shown only on small screens) */}
        <div className="mt-8 text-center md:hidden">
           <Link 
            href="/buy" 
            className="text-sm font-medium text-orange-500"
          >
            View all categories →
          </Link>
        </div>

      </div>
    </section>
  );
}




