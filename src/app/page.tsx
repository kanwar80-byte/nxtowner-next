"use client";

import { useState, useEffect } from 'react';
import { useTrack, TrackProvider } from "@/contexts/TrackContext";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import HeroCapabilities from "@/components/home/HeroCapabilities";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProcessRoadmap from "@/components/home/ProcessRoadmap";
import CuratedOpportunities from "@/components/home/CuratedOpportunities";
import TrustAndCategories from "@/components/home/TrustAndCategories";
import SmartListingGrid from "@/components/home/SmartListingGrid";
import SellerCTA from "@/components/home/SellerCTA";
import MarketInsights from "@/components/home/MarketInsights";

function HomeContent() {
  const { track } = useTrack();
  // 1. Lift state up: Manage the active category here
  const [activeCategory, setActiveCategory] = useState("All Listings");
  
  // Reset activeCategory to "All Listings" when track/mode changes
  useEffect(() => {
    setActiveCategory("All Listings");
  }, [track]);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30">
      <Navbar />
      
      {/* 1. HERO SECTION (Just the Search & Title) */}
      <Hero /> 

      {/* 2. THE CAPABILITIES DOCK */}
      {/* Replaces the old $125M strip. It's subtle and tech-focused. */}
      <HeroCapabilities />

      {/* 3. TRUST SIGNALS & CATEGORY FILTERS */}
      <TrustAndCategories 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      {/* 4. SMART LISTING GRID (New Component with Category Filtering) */}
      <SmartListingGrid activeCategory={activeCategory} />

      {/* 5. VISUAL CATEGORIES (Hat 1: The "Superstore" Feel) */}
      <CategoryGrid />

      {/* 6. LISTINGS (Legacy Component) - COMMENTED OUT: Replaced by SmartListingGrid */}
      {/* <CuratedOpportunities /> */}
      
      {/* 7. PROCESS ROADMAP (Hat 3: The "Tracker" Value Prop) */}
      <ProcessRoadmap />
      
      {/* 8. SELLER POWER SECTION */}
      <SellerCTA />

      {/* 9. INSIGHTS */}
      <MarketInsights />

    </main>
  );
}

export default function Home() {
  return (
    <TrackProvider>
      <HomeContent />
    </TrackProvider>
  );
}