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
      <div className="border-t border-gray-200 my-12"></div>
      <BadgeBar mode={mode} />
      <div className="border-t border-gray-200 my-12"></div>
      <CategoryGrid mode={mode} />
      <div className="border-t border-gray-200 my-12"></div>
      <BuyerSellerPanels mode={mode} />
      <div className="border-t border-gray-200 my-12"></div>
      <ServicesSection mode={mode} />
      <div className="border-t border-gray-200 my-12"></div>
      <CuratedListings mode={mode} />
      <div className="border-t border-gray-200 my-12"></div>
      <RecentListings mode={mode} />
      <div className="border-t border-gray-200 my-12"></div>
      <MarketInsights mode={mode} />
    </main>
  );
}
