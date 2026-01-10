"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import ListingsSection from '@/components/home/ListingsSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import { Monitor, Briefcase } from 'lucide-react';

// I recall we defined this structure for your data props
type ListingData = {
  featured: unknown[];
  newest: unknown[];
};

export default function HomeClient({ 
  digitalData, 
  realWorldData 
}: { 
  digitalData: ListingData, 
  realWorldData: ListingData 
}) {
  // RESTORED: Default state is 'digital' to match your original "Before" state
  const [track, setTrack] = useState<'digital' | 'real-world'>('digital');
  
  const isDigital = track === 'digital';
  const data = isDigital ? digitalData : realWorldData;

  // RESTORED: Your exact Dynamic Theme logic
  const theme = {
    heroText: isDigital ? 'Digital Acquisitions' : 'Real World Acquisitions',
    accent: isDigital ? 'text-teal-400' : 'text-amber-500',
    glow: isDigital ? 'bg-teal-500/20' : 'bg-amber-500/20',
    button: isDigital ? 'bg-teal-500 hover:bg-teal-400' : 'bg-amber-500 hover:bg-amber-400',
    // This restores the specific "Active Button" look from your screenshot
    toggleActive: isDigital ? 'bg-teal-500 text-black shadow-teal-500/25' : 'bg-amber-500 text-black shadow-amber-500/25',
  };

  return (
    <main className="min-h-screen bg-[#050505]">
      
      {/* HERO SECTION */}
      <div className="relative pt-32 pb-12 px-4 overflow-hidden">
        {/* Dynamic Glow Background */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full blur-[120px] -z-10 transition-colors duration-700 ${theme.glow}`}></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* RESTORED: The "Pill" Toggle Switch */}
          <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-full shadow-2xl backdrop-blur-md">
            <button
              onClick={() => setTrack('digital')}
              className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${track === 'digital' ? theme.toggleActive : 'text-slate-400 hover:text-white'}`}
            >
              <Monitor className="w-4 h-4" /> Digital
            </button>
            <button
              onClick={() => setTrack('real-world')}
              className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${track === 'real-world' ? theme.toggleActive : 'text-slate-400 hover:text-white'}`}
            >
              <Briefcase className="w-4 h-4" /> Real World
            </button>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
            The Operating System for <br />
            <span className={`transition-colors duration-500 ${theme.accent}`}>
              {theme.heroText}
            </span>
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
             <Link href={`/browse/${track}`} className={`px-8 py-4 text-black font-bold rounded-xl transition-all shadow-lg ${theme.button}`}>
               Browse {isDigital ? 'Digital' : 'Real World'}
             </Link>
             <Link href="/sell" className="px-8 py-4 bg-slate-900 border border-slate-700 hover:border-white/20 text-white font-bold rounded-xl transition-all">
               List a Business
             </Link>
          </div>
        </div>
      </div>

      {/* RESTORED: Categories */}
      <div className="mb-24">
        <CategoryGrid />
      </div>

      {/* RESTORED: Listings (Connected to the switched data) with Framer Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={track} // This forces the animation when track changes
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ListingsSection 
            track={track} 
            featuredListings={data.featured} 
            newListings={data.newest} 
          />
        </motion.div>
      </AnimatePresence>

    </main>
  );
}
