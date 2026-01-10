"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTrack } from "@/contexts/TrackContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Globe, Building2, TrendingUp, ArrowRight, Sparkles, Loader2, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const { track, setTrack } = useTrack();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Derive mode from track (single source of truth)
  // Normalize 'all' and 'real_world' to 'operational' for homepage
  const mode: 'operational' | 'digital' = track === 'digital' ? 'digital' : 'operational';
  const isOperational = mode === "operational";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [mrrQuery, setMrrQuery] = useState(""); // For digital mode input (even if disabled)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showModePrompt, setShowModePrompt] = useState(false);
  const [suggestedMode, setSuggestedMode] = useState<'operational' | 'digital' | null>(null);
  const [pendingFilters, setPendingFilters] = useState<any>(null);

  // Handle toggle switch - updates TrackContext (single source of truth)
  function handleToggleSwitch(newMode: "operational" | "digital") {
    // Update TrackContext - normalize "operational" to "real_world"
    setTrack(newMode === "operational" ? "real_world" : "digital");
  }

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      // Call the Next.js API route for AI search
      const response = await fetch('/api/ai-search-listings', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          mode: track === 'digital' ? 'digital' : 'operational',
          location: locationQuery || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const { success, filters, raw_query, suggestedMode } = await response.json();

      if (!success) {
        throw new Error("API returned success: false");
      }

      // Check for mode mismatch (if AI suggests different mode)
      const currentMode = track === 'digital' ? 'digital' : 'operational';
      if (suggestedMode && suggestedMode !== currentMode) {
        setSuggestedMode(suggestedMode);
        setPendingFilters(filters);
        setShowModePrompt(true);
        setIsAnalyzing(false);
        return;
      }

      // Proceed with search using AI-extracted filters
      executeSearch(filters, raw_query || searchQuery);
    } catch (error) {
      console.error("AI Search Error:", error);
      // Fallback: redirect to search page with query and listing_type
      setIsAnalyzing(false);
      const params = new URLSearchParams();
      params.set('listing_type', track === 'digital' ? 'digital' : 'operational');
      if (searchQuery) {
        params.set('q', encodeURIComponent(searchQuery));
      }
      router.push(`/search?${params.toString()}`);
    }
  }

  function executeSearch(filters: any, rawQuery?: string) {
    // Build URL search params for /search route (V17 canonical)
    const params = new URLSearchParams();
    
    // Always include listing_type from current track (single source of truth)
    params.set('listing_type', track === 'digital' ? 'digital' : 'operational');

    // Add query if present
    if (rawQuery) {
      params.set('q', encodeURIComponent(rawQuery));
    }
    
    // Add other filters if needed (location, price, etc.)
    if (filters.location || locationQuery) {
      params.set('province', filters.location || locationQuery);
    }
    if (filters.min_revenue) {
      params.set('min_revenue', filters.min_revenue.toString());
    }
    if (filters.is_verified) {
      // Note: verification_status filter would need to be handled by backend
      // For now, we'll skip it or add it as a query param if backend supports it
    }

    // Navigate to search page with filters
    router.push(`/search?${params.toString()}`);
    setIsAnalyzing(false);
  }

  function handleModeSwitch() {
    if (suggestedMode) {
      // Update TrackContext (single source of truth) - normalize "operational" to "real_world"
      setTrack(suggestedMode === "operational" ? "real_world" : suggestedMode);
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
            {isOperational ? "Operational Market: New Listings Today" : "Digital Market: New Listings Today"}
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
          {isOperational
            ? "Stop guessing. Start closing. Verified real-world businesses, NDA deal rooms, and guided diligence for serious buyers."
            : "Stop guessing. Start closing. Traction-first digital deals, transfer readiness signals, and faster diligence for modern acquirers."}
        </p>

        {/* AI MICRO-SIGNAL (no layout change, just a single line) */}
        <p className="text-sm text-slate-500 -mt-6 mb-8 max-w-2xl mx-auto">
          Powered by <span className="text-slate-300 font-semibold">NxtAI™</span> —{" "}
          {isOperational
            ? "verification signals, pricing guidance, and buyer readiness."
            : "traction signals, risk flags, and deal-room acceleration."}
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
               onClick={() => handleToggleSwitch("operational")}
               className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${isOperational ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <Building2 className="w-4 h-4" />
               Operational Assets
             </button>

             <button 
               onClick={() => handleToggleSwitch("digital")}
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
                    ? "Search gas stations, car washes, trucking, warehouses..."
                    : "Search SaaS, e-commerce, apps, agencies..."
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
                     placeholder="City / Province"
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
