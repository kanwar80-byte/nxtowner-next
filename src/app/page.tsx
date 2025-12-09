'use client';

import { useState } from 'react';
import Hero from '@/components/home/Hero';
import BadgeBar from '@/components/home/BadgeBar';
import CategoryGrid from '@/components/home/CategoryGrid';
import BuyerSellerPanels from '@/components/home/BuyerSellerPanels';
import ServicesSection from '@/components/home/ServicesSection';
import CuratedListings from '@/components/home/CuratedListings';
import RecentListings from '@/components/home/RecentListings';
import MarketInsights from '@/components/home/MarketInsights';

type MarketplaceMode = 'all' | 'operational' | 'digital';

export default function HomePage() {
  const [mode, setMode] = useState<MarketplaceMode>('all');

  return (
    <main>
      <Hero mode={mode} setMode={setMode} />
      <div className="border-t border-gray-200 my-8 sm:my-10"></div>
      <BadgeBar />
      <div className="border-t border-gray-200 my-8 sm:my-10"></div>
      <CategoryGrid mode={mode} />
      <div className="border-t border-gray-200 my-8 sm:my-10"></div>
      <BuyerSellerPanels />
      <div className="border-t border-gray-200 my-8 sm:my-10"></div>
      <ServicesSection />
      <div className="border-t border-gray-200 my-8 sm:my-10"></div>
      <CuratedListings />
      <div className="border-t border-gray-200 my-8 sm:my-10"></div>
      <RecentListings />
      <div className="border-t border-gray-200 my-8 sm:my-10"></div>
      <MarketInsights />
    </main>
  );
}
