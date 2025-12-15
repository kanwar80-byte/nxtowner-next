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
