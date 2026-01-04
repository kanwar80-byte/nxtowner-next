"use client";

import { useTrack } from "@/contexts/TrackContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Fuel, Truck, Building2, ShoppingBag, // Operational Icons
  Code2, Smartphone, Globe, BarChart3, // Digital Icons
  ArrowRight 
} from "lucide-react";
import Link from "next/link";

// 1. Define the Data for Both Worlds
const OPERATIONAL_CATS = [
  { id: 'gas', label: 'Gas Stations', count: '124', icon: Fuel, color: 'text-amber-500' },
  { id: 'logistics', label: 'Transport & Logistics', count: '45', icon: Truck, color: 'text-blue-500' },
  { id: 'industrial', label: 'Industrial & Warehousing', count: '89', icon: Building2, color: 'text-slate-300' },
  { id: 'retail', label: 'Retail & Franchise', count: '210', icon: ShoppingBag, color: 'text-purple-500' },
];

const DIGITAL_CATS = [
  { id: 'saas', label: 'B2B SaaS', count: '56', icon: Code2, color: 'text-teal-500' },
  { id: 'ecom', label: 'E-Commerce', count: '112', icon: ShoppingBag, color: 'text-pink-500' },
  { id: 'agency', label: 'Digital Agencies', count: '34', icon: Globe, color: 'text-indigo-500' },
  { id: 'content', label: 'Content & Media', count: '28', icon: Smartphone, color: 'text-orange-500' },
];

export default function BrowseByCategory() {
  const { track } = useTrack();
  const isOperational = track === "operational";
  
  // Select the correct list based on the Toggle
  const categories = isOperational ? OPERATIONAL_CATS : DIGITAL_CATS;

  return (
    <section className="py-24 bg-slate-950 border-t border-slate-900">
      <div className="container mx-auto px-4">
        
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Browse by <span className={isOperational ? "text-amber-500" : "text-teal-500"}>Sector</span>
            </h2>
            <p className="text-slate-400">
              Explore {isOperational ? "verified brick & mortar" : "profitable digital"} opportunities sorted by industry.
            </p>
          </div>
          <Link href="/browse" className="hidden md:flex items-center text-sm font-bold text-slate-300 hover:text-white transition-colors">
            View All Categories <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {/* ANIMATED GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="wait">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/search?category=${cat.id}`} className="group block h-full">
                  <div className="relative h-full p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-all duration-300 group-hover:border-slate-600 group-hover:shadow-lg overflow-hidden">
                    
                    {/* Hover Gradient Effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${isOperational ? 'bg-amber-500' : 'bg-teal-500'}`} />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <cat.icon className={`w-6 h-6 ${cat.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 group-hover:text-white">{cat.label}</h3>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          {cat.count} Listings
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
