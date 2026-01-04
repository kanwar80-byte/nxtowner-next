"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTrack } from "@/contexts/TrackContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Globe, Building2, TrendingUp, ArrowRight, Sparkles, Loader2, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function Hero() {
  const { track, setTrack } = useTrack();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOperational = track === "operational";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [mrrQuery, setMrrQuery] = useState(""); // For digital mode input (even if disabled)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showModePrompt, setShowModePrompt] = useState(false);
  const [suggestedMode, setSuggestedMode] = useState<'operational' | 'digital' | null>(null);
  const [pendingFilters, setPendingFilters] = useState<any>(null);

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      // Get Supabase configuration (these are inlined at build time for client components)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase configuration missing. Please check your environment variables.");
      }

      // Call the AI Search Parser Edge Function
      const response = await fetch(`${supabaseUrl}/functions/v1/ai-search-parser`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          mode: track,
        }),
      });

      if (!response.ok) {
        throw new Error(`Edge Function error: ${response.statusText}`);
      }

      const { filters, raw_query } = await response.json();

      // Check for mode mismatch (if AI suggests different mode)
      if (filters.type && filters.type !== track) {
        setSuggestedMode(filters.type);
        setPendingFilters(filters);
        setShowModePrompt(true);
        setIsAnalyzing(false);
        return;
      }

      // Proceed with search using Edge Function filters
      executeSearch(filters, raw_query);
    } catch (error) {
      console.error("AI Search Error:", error);
      // Fallback: use raw query if Edge Function fails
      executeSearch({ query: searchQuery }, searchQuery);
    }
  }

  function executeSearch(filters: any, rawQuery?: string) {
    // Build URL search params
    const params = new URLSearchParams(searchParams.toString());
    
    // Clear existing search params
    params.delete('q');
    params.delete('category');
    params.delete('location');
    params.delete('min_value');
    params.delete('is_verified');

    // Add Edge Function filters (structured format)
    if (rawQuery) {
      params.set('q', rawQuery);
    }
    if (filters.category) {
      params.set('category', filters.category);
    }
    if (filters.location || locationQuery) {
      params.set('location', filters.location || locationQuery);
    }
    if (filters.min_value) {
      params.set('min_value', filters.min_value.toString());
    }
    if (filters.is_verified) {
      params.set('is_verified', 'true');
    }

    // Update URL without page reload
    router.push(`/?${params.toString()}`, { scroll: false });
    
    // Scroll to listings section
    setTimeout(() => {
      const listingsSection = document.getElementById('listings-section');
      if (listingsSection) {
        listingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setIsAnalyzing(false);
    }, 300);
  }

  function handleModeSwitch() {
    if (suggestedMode) {
      setTrack(suggestedMode);
      if (pendingFilters) {
        executeSearch(pendingFilters);
      }
      setShowModePrompt(false);
      setSuggestedMode(null);
      setPendingFilters(null);
    }
  }

  function handleContinueWithoutSwitch() {
    if (pendingFilters) {
      executeSearch(pendingFilters);
    }
    setShowModePrompt(false);
    setSuggestedMode(null);
    setPendingFilters(null);
  }

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-slate-950 pt-20">
      
      {/* BACKGROUND EFFECTS (Subtle Gradients) */}
      <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${isOperational ? 'bg-amber-600' : 'bg-teal-600'}`} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />

      <div className="container relative z-10 px-4 text-center">
        
        {/* 1. THE BADGE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-sm mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-medium text-slate-300 uppercase tracking-wide">
            Live Market: 42 New Listings Today
          </span>
        </motion.div>

        {/* 2. THE HEADLINE */}
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 max-w-5xl mx-auto leading-[1.1]">
          The Operating System for <br />
          <span className="relative">
             {/* Text Switch Animation */}
             <AnimatePresence mode="wait">
               <motion.span 
                 key={track}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 className={`inline-block ${isOperational ? 'text-amber-500' : 'text-teal-400'}`}
               >
                 {isOperational ? "Real World" : "Digital"}
               </motion.span>
             </AnimatePresence>
             {" "}Acquisitions.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Stop guessing. Start closing. We combine verified financials, AI-driven due diligence, and expert advisory for the modern dealmaker.
        </p>

        {/* 3. THE TOGGLE & SEARCH MODULE */}
        <div className="w-full max-w-3xl mx-auto bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-2 shadow-2xl">
          
          {/* A. THE SWITCHER (Tabs) */}
          <div className="flex p-1 bg-slate-950 rounded-xl mb-4 relative">
             {/* Sliding Background Pill */}
             <motion.div 
               className={`absolute top-1 bottom-1 w-[49%] rounded-lg ${isOperational ? 'bg-slate-800' : 'bg-slate-800 translate-x-[102%]'}`}
               layoutId="tab-pill"
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
             />
             
             <button 
               onClick={() => setTrack("operational")}
               className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${isOperational ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <Building2 className="w-4 h-4" />
               Operational Assets
             </button>

             <button 
               onClick={() => setTrack("digital")}
               className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${!isOperational ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <Globe className="w-4 h-4" />
               Digital Assets
             </button>
          </div>

          {/* B. THE AI SEARCH BAR */}
          <form 
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-2"
          >
            <div className="relative flex-grow group">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
              <Input 
                type="text" 
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isOperational 
                    ? "Search gas stations, car washes, logistics..."
                    : "Search SaaS, e-commerce, AI tools..."
                }
                className="pl-12 h-14 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-amber-500/50"
              />
            </div>
            
            {/* Contextual Input #2 */}
            <div className="relative md:w-1/3 group hidden md:block">
               {isOperational ? (
                 <>
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                   <Input 
                     type="text" 
                     value={locationQuery || ""}
                     onChange={(e) => setLocationQuery(e.target.value)}
                     placeholder="City or Province"
                     className="pl-12 h-14 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                   />
                 </>
               ) : (
                 <>
                   <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-500 transition-colors" />
                   <Input 
                     type="text" 
                     value={mrrQuery || ""}
                     onChange={(e) => setMrrQuery(e.target.value)}
                     placeholder="Min. MRR (e.g. $5k)"
                     className="pl-12 h-14 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                     disabled
                   />
                 </>
               )}
            </div>

            <Button 
              type="submit"
              size="lg" 
              disabled={isAnalyzing}
              className={`h-14 px-8 text-base font-bold relative overflow-hidden ${isOperational ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-600 hover:bg-teal-700'} ${isAnalyzing ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="animate-pulse">AI Analyzing...</span>
                </span>
              ) : (
                'Search'
              )}
            </Button>
          </form>
        </div>

        {/* Mode Switch Prompt Modal */}
        <AnimatePresence>
          {showModePrompt && suggestedMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModePrompt(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
              >
                <button
                  onClick={() => setShowModePrompt(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-full ${suggestedMode === 'operational' ? 'bg-amber-600/20' : 'bg-teal-600/20'}`}>
                    <AlertCircle className={`w-6 h-6 ${suggestedMode === 'operational' ? 'text-amber-500' : 'text-teal-500'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">
                      Switch to {suggestedMode === 'operational' ? 'Operational' : 'Digital'} Assets?
                    </h3>
                    <p className="text-sm text-slate-400">
                      Your search seems to match {suggestedMode === 'operational' ? 'operational' : 'digital'} assets better. Switch to {suggestedMode === 'operational' ? 'Operational' : 'Digital'} Assets for these results?
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleModeSwitch}
                    className={`flex-1 ${suggestedMode === 'operational' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-600 hover:bg-teal-700'}`}
                  >
                    Switch & Search
                  </Button>
                  <Button
                    onClick={handleContinueWithoutSwitch}
                    variant="outline"
                    className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Continue in Current Mode
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
