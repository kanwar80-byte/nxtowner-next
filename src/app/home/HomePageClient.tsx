"use client";

import { useState, useEffect } from "react";
import { useTrack, TrackProvider } from "@/contexts/TrackContext";
import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";

// --- ENTERPRISE MODULES ---
import HeroSearch from "@/components/home/HeroSearch";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProcessRoadmap from "@/components/home/ProcessRoadmap";
import TrustSection from "@/components/home/TrustSection";
import ServicesSection from "@/components/home/ServicesSection";
import PartnersSection from "@/components/home/PartnersSection";
import CTASection from "@/components/home/CTASection";
import MarketInsights from "@/components/home/MarketInsights";
import Image from "next/image";

// --- TYPES ---
interface HomePageClientProps {
  digitalData?: any; 
  realWorldData?: any;
  initialOperationalListings?: any[];
  initialDigitalListings?: any[];
  initialNewListings?: any[];
}

function HomeContent({ initialOperationalListings, initialDigitalListings, initialNewListings }: HomePageClientProps) {
  const { track, setTrack } = useTrack();

  // State Management: View mode for switching between real_world and digital
  const [viewMode, setViewMode] = useState<'real_world' | 'digital'>('real_world');

  // Prevent Hydration Mismatch
  const [mounted, setMounted] = useState(false);
  
  // UX UPDATE: Set default to 'real_world' (Real World) on mount if no track is set
  // Sync viewMode with track context
  useEffect(() => {
    setMounted(true);
    if (!track) {
      setTrack('real_world');
      setViewMode('real_world');
    } else {
      // Map track to viewMode
      setViewMode(track === 'digital' ? 'digital' : 'real_world');
    }
  }, [track, setTrack]);

  if (!mounted) return null;

  // Theme configuration based on viewMode
  // Real World: Amber-500 for all accents
  // Digital: Teal-400 for all accents (as per original design)
  const theme = {
    accent: viewMode === 'real_world' ? 'amber' : 'teal',
    accentText: viewMode === 'real_world' ? 'text-amber-500' : 'text-teal-400',
    accentBg: viewMode === 'real_world' ? 'bg-amber-500/20' : 'bg-teal-400/20',
    borderColor: viewMode === 'real_world' ? 'border-amber-500/50' : 'border-teal-400/50',
    hoverBorder: viewMode === 'real_world' ? 'hover:border-amber-500/50' : 'hover:border-teal-400/50',
    hoverText: viewMode === 'real_world' ? 'hover:text-amber-400' : 'hover:text-teal-400',
    selectionBg: viewMode === 'real_world' ? 'selection:bg-amber-500/30' : 'selection:bg-teal-400/30',
    badgeBg: viewMode === 'real_world' ? 'bg-amber-500/90' : 'bg-teal-400/90',
  };

  // Filter New This Week listings by viewMode
  const filteredNewListings = initialNewListings?.filter(item => item.asset_type === viewMode) || [];

  // Determine which featured listings to show
  const featuredListings = viewMode === 'real_world' ? initialOperationalListings : initialDigitalListings;

  // Update track context when viewMode changes
  const handleViewModeChange = (mode: 'real_world' | 'digital') => {
    setViewMode(mode);
    setTrack(mode);
  };

  return (
    <main className={`min-h-screen bg-[#050505] overflow-x-hidden ${theme.selectionBg}`}>
      
      {/* 1. HERO SECTION - Replaced with HeroSearch */}
      <HeroSearch mode={viewMode} setMode={handleViewModeChange} />

      {/* 2. CATEGORIES */}
      <section className="mb-24 relative z-20">
         <CategoryGrid /> 
      </section>

      {/* 3. FEATURED LISTINGS - Conditionally rendered based on viewMode */}
      {viewMode === 'real_world' && featuredListings && featuredListings.length > 0 && (
        <section className="py-12 border-t border-slate-900 bg-slate-950/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Featured <span className={theme.accentText}>Real World</span> Listings
              </h2>
              <Link 
                href="/browse?asset_type=real_world" 
                className={`font-medium flex items-center gap-1 transition-colors ${theme.accentText} ${theme.hoverText}`}
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredListings.slice(0, 8).map((listing: any) => {
                const price = listing.asking_price 
                  ? new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(listing.asking_price)
                  : 'Contact for Price';
                
                const cashFlow = listing.cash_flow 
                  ? new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0, notation: 'compact' }).format(listing.cash_flow)
                  : 'N/A';
                
                const location = listing.city && listing.province 
                  ? `${listing.city}, ${listing.province}` 
                  : listing.city || listing.province || 'Canada';

                return (
                  <Link 
                    key={listing.id} 
                    href={`/listing/${listing.id}`} 
                    className={`group block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden ${theme.hoverBorder} transition-all shadow-lg h-full flex flex-col`}
                  >
                    <div className="relative h-48 w-full bg-slate-800">
                      {listing.hero_image_url ? (
                        <Image 
                          src={listing.hero_image_url} 
                          alt={listing.title || 'Listing'} 
                          fill
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                          <Briefcase className="w-12 h-12 text-slate-600" />
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 bg-slate-950/90 text-white px-3 py-1 rounded text-sm font-bold shadow-sm border border-slate-700">
                        {price}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className={`text-lg font-bold text-white mb-2 line-clamp-2 ${viewMode === 'real_world' ? 'group-hover:text-amber-400' : 'group-hover:text-teal-400'} transition-colors`}>
                        {listing.title || 'Untitled Listing'}
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">Real World Asset</p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Briefcase className={`w-3.5 h-3.5 ${theme.accentText}`}/>
                          {location}
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Cash Flow</p>
                          <p className="text-sm font-bold text-emerald-400">{cashFlow}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED DIGITAL LISTINGS - Conditionally rendered based on viewMode */}
      {viewMode === 'digital' && featuredListings && featuredListings.length > 0 && (
        <section className="py-12 border-t border-slate-900 bg-slate-950/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Featured <span className={theme.accentText}>Digital</span> Listings
              </h2>
              <Link 
                href="/browse?asset_type=digital" 
                className={`font-medium flex items-center gap-1 transition-colors ${theme.accentText} ${theme.hoverText}`}
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredListings.slice(0, 8).map((listing: any) => {
                const price = listing.asking_price 
                  ? new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(listing.asking_price)
                  : 'Contact for Price';
                
                const revenue = listing.revenue_annual 
                  ? new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0, notation: 'compact' }).format(listing.revenue_annual)
                  : 'N/A';
                
                const location = listing.city && listing.province 
                  ? `${listing.city}, ${listing.province}` 
                  : listing.city || listing.province || 'Remote';

                return (
                  <Link 
                    key={listing.id} 
                    href={`/listing/${listing.id}`} 
                    className={`group block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden ${theme.hoverBorder} transition-all shadow-lg h-full flex flex-col`}
                  >
                    <div className="relative h-48 w-full bg-slate-800">
                      {listing.hero_image_url ? (
                        <Image 
                          src={listing.hero_image_url} 
                          alt={listing.title || 'Listing'} 
                          fill
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                          <Briefcase className="w-12 h-12 text-slate-600" />
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 bg-slate-950/90 text-white px-3 py-1 rounded text-sm font-bold shadow-sm border border-slate-700">
                        {price}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className={`text-lg font-bold text-white mb-2 line-clamp-2 ${viewMode === 'digital' ? 'group-hover:text-teal-400' : 'group-hover:text-amber-400'} transition-colors`}>
                        {listing.title || 'Untitled Listing'}
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">Digital Asset</p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Briefcase className={`w-3.5 h-3.5 ${theme.accentText}`}/>
                          {location}
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Revenue</p>
                          <p className="text-sm font-bold text-emerald-400">{revenue}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. NEW THIS WEEK SECTION - Filtered by viewMode */}
      {filteredNewListings && filteredNewListings.length > 0 && (
        <section className="py-12 border-t border-slate-900 bg-slate-950/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  New <span className={theme.accentText}>This Week</span>
                </h2>
                <p className="text-slate-400 mt-2">
                  The latest {viewMode === 'real_world' ? 'Real World' : 'Digital'} listings added recently
                </p>
              </div>
              <Link 
                href={`/browse?asset_type=${viewMode}&sort=newest`} 
                className={`font-medium flex items-center gap-1 transition-colors ${theme.accentText} ${theme.hoverText}`}
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredNewListings.map((listing: any) => {
                const price = listing.asking_price 
                  ? new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(listing.asking_price)
                  : 'Contact for Price';
                
                const cashFlow = listing.cash_flow 
                  ? new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0, notation: 'compact' }).format(listing.cash_flow)
                  : 'N/A';
                
                const revenue = listing.revenue_annual 
                  ? new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0, notation: 'compact' }).format(listing.revenue_annual)
                  : 'N/A';
                
                const location = listing.city && listing.province 
                  ? `${listing.city}, ${listing.province}` 
                  : listing.city || listing.province || (viewMode === 'real_world' ? 'Canada' : 'Remote');

                return (
                  <Link 
                    key={listing.id} 
                    href={`/listing/${listing.id}`} 
                    className={`group block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden ${theme.hoverBorder} transition-all shadow-lg h-full flex flex-col`}
                  >
                    <div className="relative h-48 w-full bg-slate-800">
                      {listing.hero_image_url ? (
                        <Image 
                          src={listing.hero_image_url} 
                          alt={listing.title || 'Listing'} 
                          fill
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                          <Briefcase className="w-12 h-12 text-slate-600" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className={`${theme.badgeBg} text-black px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide`}>
                          New
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-slate-950/90 text-white px-3 py-1 rounded text-sm font-bold shadow-sm border border-slate-700">
                        {price}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className={`text-lg font-bold text-white mb-2 line-clamp-2 ${viewMode === 'real_world' ? 'group-hover:text-amber-400' : 'group-hover:text-teal-400'} transition-colors`}>
                        {listing.title || 'Untitled Listing'}
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">
                        {viewMode === 'real_world' ? 'Real World Asset' : 'Digital Asset'}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Briefcase className={`w-3.5 h-3.5 ${theme.accentText}`}/>
                          {location}
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                            {viewMode === 'real_world' ? 'Cash Flow' : 'Revenue'}
                          </p>
                          <p className="text-sm font-bold text-emerald-400">
                            {viewMode === 'real_world' ? cashFlow : revenue}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. ENTERPRISE SECTIONS */}
      <div className="space-y-24 mt-24">
        <ProcessRoadmap viewMode={viewMode} />
        <TrustSection viewMode={viewMode} />
        <ServicesSection viewMode={viewMode} />
        <PartnersSection viewMode={viewMode} />
        <CTASection viewMode={viewMode} />
        <div className="mb-24">
          <MarketInsights viewMode={viewMode} />
        </div>
      </div>

    </main>
  );
}

export default function HomePageClient(props: HomePageClientProps) {
  return (
    <TrackProvider>
      <HomeContent {...props} />
    </TrackProvider>
  );
}