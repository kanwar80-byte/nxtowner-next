import Link from 'next/link';
import Hero from "@/components/home/Hero";
import BrowseByCategory from "@/components/home/BrowseByCategory";
import BuySellSplit from "@/components/home/BuySellSplit";
import DealServices from "@/components/home/DealServices";
import CuratedOpportunities from "@/components/home/CuratedOpportunities";
import RecentListings from "@/components/home/RecentListings";
import MarketInsights from "@/components/home/MarketInsights";

export default function HomePage() {
  return (
    <main className="bg-brand-bg">
      <Hero />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Example: Category Links with assetType and category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <Link href="/browse?assetType=physical&category=Fuel%20%26%20Auto" className="block bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <div className="font-bold text-lg mb-1">Gas Stations</div>
            <div className="text-gray-500 text-sm">Physical Asset • Fuel & Auto</div>
          </Link>
          <Link href="/browse?assetType=digital&category=E-commerce" className="block bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <div className="font-bold text-lg mb-1">Shopify & FBA Businesses</div>
            <div className="text-gray-500 text-sm">Digital Asset • E-commerce</div>
          </Link>
        </div>
        <BrowseByCategory />
        <BuySellSplit />
        <DealServices />
        <CuratedOpportunities />
        <RecentListings />
        <MarketInsights />
      </div>
    </main>
  );
}
