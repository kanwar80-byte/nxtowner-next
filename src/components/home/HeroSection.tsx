"use client";

import { useState, useEffect, useRef } from "react";
import { useTrack } from "@/contexts/TrackContext";
import { 
  Search, MapPin, DollarSign, CheckCircle2, 
  Fuel, Utensils, Store, Server, ShoppingBag, 
  Briefcase, Laptop 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { OPERATIONAL_SUGGESTIONS, DIGITAL_SUGGESTIONS, LOCATIONS } from "@/lib/searchSuggestions"; 

export default function HeroSection() {
  const { track, setTrack } = useTrack();
  const router = useRouter();
  const isOperational = track === 'real_world';

  // --- STATE ---
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [minMrr, setMinMrr] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filtered Suggestions
  const baseSuggestions = isOperational ? OPERATIONAL_SUGGESTIONS : DIGITAL_SUGGESTIONS;
  const filteredSuggestions = query === "" 
    ? baseSuggestions.slice(0, 4) 
    : baseSuggestions.filter(s => s.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const executeSearch = (searchTerm: string, searchType: 'keyword' | 'category' = 'keyword', categoryValue?: string) => {
    const params = new URLSearchParams();
    if (searchType === 'category' && categoryValue) {
      params.set(isOperational ? "industry" : "model", categoryValue);
    } else if (searchTerm) {
      params.set("q", searchTerm);
    }
    if (isOperational && location) params.set("location", location);
    if (!isOperational && minMrr) params.set("min_mrr", minMrr);

    const basePath = isOperational ? "/browse/operational" : "/browse/digital";
    router.push(`${basePath}?${params.toString()}`);
    setShowSuggestions(false);
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[85vh] flex flex-col justify-center">
      
      {/* BACKGROUND GRADIENT BLOB (Transitions Softly) */}
      <div className="absolute inset-0 bg-[#050505]">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 ease-in-out ${
          isOperational ? "bg-amber-600" : "bg-teal-600"
        }`} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* 1. TOP PILL: LIVE MARKET STATUS */}
          <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors duration-500 ${
              isOperational 
                ? "bg-amber-950/30 border-amber-500/20 text-amber-500" 
                : "bg-teal-950/30 border-teal-500/20 text-teal-500"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isOperational ? "bg-amber-500" : "bg-teal-500"}`} />
              {isOperational ? "Live Market: 42 New Listings" : "Live Market: 18 New Listings"}
            </div>
          </div>

          {/* 2. THE TOGGLE (Back at Top & Colored) */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-900/80 p-1 rounded-full border border-slate-800 flex items-center shadow-2xl backdrop-blur-md">
              
              <button
                onClick={() => { setTrack('real_world'); setQuery(""); }}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  isOperational 
                    ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Real World
              </button>

              <button
                onClick={() => { setTrack('digital'); setQuery(""); }}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  !isOperational 
                    ? "bg-teal-500 text-black shadow-[0_0_20px_rgba(20,184,166,0.4)] scale-105" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Laptop className="w-4 h-4" />
                Digital Assets
              </button>

            </div>
          </div>

          {/* 3. THE HEADLINE (Soft Upward Wave) */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            The Operating System for <br />
            <span 
              key={isOperational ? "headline-op" : "headline-dig"}
              className={`inline-block animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-forwards ${
                isOperational ? "text-amber-500" : "text-teal-500"
              }`}
            >
              {isOperational ? "Real World Acquisitions." : "Digital Acquisitions."}
            </span>
          </h1>
          
          {/* 4. THE SUBHEAD (Staggered Delay) */}
          <div 
            key={isOperational ? "sub-op" : "sub-dig"}
            className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 ease-out fill-mode-forwards"
          >
            <p>
              {isOperational 
                ? "Stop guessing. Start closing. We combine verified financials, AI-driven due diligence, and expert advisory for the modern dealmaker." 
                : "Stop guessing. Start closing. We combine verified metrics, code-level due diligence, and expert advisory for the modern dealmaker."}
            </p>
          </div>

          {/* 5. SEARCH BAR (Button Matches Theme) */}
          <div ref={searchContainerRef} className="relative max-w-3xl mx-auto">
            <div className={`bg-white/5 backdrop-blur-xl border p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl transition-all duration-500 ${
              showSuggestions ? "border-white/30 bg-slate-900/90" : "border-white/10 hover:border-white/20"
            }`}>
              
              {/* Keyword Input */}
              <div className="flex-1 relative group z-20">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={isOperational ? "Search gas stations, car washes..." : "Search SaaS, e-commerce, AI tools..."}
                  className="w-full h-14 bg-transparent pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none"
                  autoComplete="off"
                />
              </div>

              <div className="hidden md:block w-px bg-white/10 my-2" />

              {/* Context Input */}
              <div className="flex-1 relative group z-20">
                {isOperational ? (
                  <>
                    <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${location ? 'text-amber-500' : 'text-slate-500'}`} />
                    <input 
                      type="text"
                      list="locations-list"
                      placeholder="City or Province"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-14 bg-transparent pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none"
                    />
                    <datalist id="locations-list">
                      {LOCATIONS.map(loc => <option key={loc} value={loc} />)}
                    </datalist>
                  </>
                ) : (
                  <>
                    <DollarSign className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${minMrr ? 'text-teal-500' : 'text-slate-500'}`} />
                    <select 
                      value={minMrr}
                      onChange={(e) => setMinMrr(e.target.value)}
                      className="w-full h-14 bg-transparent pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none appearance-none cursor-pointer [&>option]:bg-slate-900"
                    >
                      <option value="">Min. MRR (e.g. $5k)</option>
                      <option value="1000">$1k+ /mo</option>
                      <option value="5000">$5k+ /mo</option>
                      <option value="10000">$10k+ /mo</option>
                    </select>
                  </>
                )}
              </div>

              {/* SEARCH BUTTON (Syncs with Theme) */}
              <button 
                onClick={() => executeSearch(query)}
                className={`h-14 px-8 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                  isOperational 
                    ? "bg-amber-500 hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
                    : "bg-teal-500 hover:bg-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                }`}
              >
                Search
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200 text-left">
                 <div className="p-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-2">
                    {query ? "Suggestions" : "Trending Searches"}
                  </p>
                  
                  {filteredSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => executeSearch(item.label, item.type as any, item.value)}
                      className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 ${
                        isOperational ? "group-hover:text-amber-500" : "group-hover:text-teal-500"
                      }`}>
                        {item.icon === 'Fuel' && <Fuel className="w-4 h-4" />}
                        {item.icon === 'Utensils' && <Utensils className="w-4 h-4" />}
                        {item.icon === 'Store' && <Store className="w-4 h-4" />}
                        {item.icon === 'Server' && <Server className="w-4 h-4" />}
                        {item.icon === 'ShoppingBag' && <ShoppingBag className="w-4 h-4" />}
                        {item.icon === 'Search' && <Search className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-slate-500">
                          {item.type === 'category' ? `Browse ${item.label}` : `Search for "${item.label}"`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${isOperational ? "text-amber-500" : "text-teal-500"}`} /> 
              Vetted Inventory
            </span>
             <span className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${isOperational ? "text-amber-500" : "text-teal-500"}`} /> 
              Secure Deal Rooms
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}