"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Monitor, 
  Search,
  Fuel,
  Utensils,
  Building2,
  Server,
  ShoppingBag,
  Globe
} from "lucide-react";
import Link from "next/link";

interface HeroSearchProps {
  mode: 'real_world' | 'digital';
  setMode: (mode: 'real_world' | 'digital') => void;
}

export default function HeroSearch({ mode, setMode }: HeroSearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const isRealWorld = mode === 'real_world';

  // Theme based on active tab - Amber-500 for real_world, Teal-400 for digital
  const theme = {
    accent: isRealWorld ? 'text-amber-500' : 'text-teal-400',
    accentBg: isRealWorld ? 'bg-amber-500/20' : 'bg-teal-400/20',
    pillBg: isRealWorld ? 'bg-amber-500' : 'bg-teal-400',
    button: isRealWorld ? 'bg-amber-500 hover:bg-amber-400' : 'bg-teal-400 hover:bg-teal-500',
    glow: isRealWorld ? 'bg-amber-500/20' : 'bg-teal-400/20',
    border: isRealWorld ? 'border-amber-500/30 hover:border-amber-500/50' : 'border-teal-400/30 hover:border-teal-400/50',
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?asset_type=${mode}&q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Quick filter categories with correct category codes
  const quickFilters = {
    real_world: [
      { name: "Gas Stations", icon: Fuel, code: "gas_stations" },
      { name: "Restaurants", icon: Utensils, code: "restaurants" },
      { name: "Industrial", icon: Building2, code: "industrial" },
    ],
    digital: [
      { name: "SaaS", icon: Server, code: "saas" },
      { name: "E-Commerce", icon: ShoppingBag, code: "e_commerce" },
      { name: "Agencies", icon: Globe, code: "agencies" },
    ],
  };

  const currentFilters = quickFilters[mode];
  
  // Dynamic placeholder text based on active tab
  const searchPlaceholder = isRealWorld 
    ? "Search gas stations, franchises, or industrial..."
    : "Search SaaS, E-commerce, or agencies...";

  return (
    <div className="relative pt-32 pb-16 px-4 overflow-hidden">
      {/* Animated Background Glow */}
      <motion.div 
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full blur-[120px] -z-10 transition-colors duration-700 ${theme.glow}`}
      />
      
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        
        {/* PILL TOGGLE */}
        <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-full shadow-2xl backdrop-blur-md relative">
          {/* The Sliding Background */}
          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`absolute top-1 bottom-1 rounded-full ${theme.pillBg}`}
            style={{ 
              left: isRealWorld ? '4px' : '50%', 
              width: 'calc(50% - 4px)' 
            }}
          />
          
          {/* BUTTON 1: REAL WORLD (Left) */}
          <button
            onClick={() => setMode('real_world')}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors duration-200 ${
              isRealWorld ? 'text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Real World
          </button>

          {/* BUTTON 2: DIGITAL (Right) */}
          <button
            onClick={() => setMode('digital')}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors duration-200 ${
              !isRealWorld ? 'text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" /> Digital
          </button>
        </div>

        {/* MAIN HEADING - Animated transition */}
        <AnimatePresence mode="wait">
          <motion.h1 
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight"
          >
            The Operating System for <br />
            <span className={`transition-colors duration-500 ${theme.accent}`}>
              {isRealWorld ? 'Real World' : 'Digital'} Acquisitions
            </span>
          </motion.h1>
        </AnimatePresence>
        
        <motion.p 
          key={`subtitle-${mode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          {isRealWorld 
            ? "From Main Street to Industrial, we provide the data, verification, and deal rooms to close."
            : "Buy and sell SaaS, E-commerce, and Agencies with verified data."}
        </motion.p>
        
        {/* GLASSMORPHISM SEARCH BAR */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex gap-2 items-center bg-slate-900/30 backdrop-blur-lg border border-white/10 rounded-xl p-2 shadow-2xl hover:border-white/20 transition-all duration-300"
          >
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className={`w-5 h-5 ${theme.accent} opacity-60`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex-1 bg-transparent text-white placeholder:text-slate-500/70 focus:outline-none text-lg"
              />
            </div>
            <button
              type="submit"
              className={`px-6 py-3 ${theme.button} text-black font-bold rounded-lg transition-all shadow-lg hover:scale-105 active:scale-95`}
            >
              Search
            </button>
          </motion.div>
        </form>

        {/* QUICK FILTERS - Animated transition */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <span className="text-sm text-slate-500">Quick filters:</span>
          <AnimatePresence mode="wait">
            {currentFilters.map((filter, index) => (
              <motion.div
                key={`${mode}-${filter.code}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link
                  href={`/browse?asset_type=${mode}&category=${filter.code}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 group backdrop-blur-sm ${
                    isRealWorld 
                      ? 'bg-slate-900/30 border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10' 
                      : 'bg-slate-900/30 border-teal-400/30 hover:border-teal-400/50 hover:bg-teal-400/10'
                  }`}
                >
                  <filter.icon className={`w-4 h-4 transition-colors ${
                    isRealWorld ? 'text-amber-500/80 group-hover:text-amber-500' : 'text-teal-400/80 group-hover:text-teal-400'
                  }`} />
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {filter.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
