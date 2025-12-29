import BrowseByCategory from '@/components/home/BrowseByCategory';
import ComparisonSection from '@/components/home/ComparisonSection';
import CTASection from '@/components/home/CTASection';
import CuratedListings from '@/components/home/CuratedListings';
import CuratedOpportunities from '@/components/home/CuratedOpportunities';
import Hero from '@/components/home/Hero';
import MarketInsights from '@/components/home/MarketInsights';
import ServicesSection from '@/components/home/ServicesSection';

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <Hero />
      <CuratedOpportunities />
      <BrowseByCategory />
      <CuratedListings />
      <ComparisonSection />
      <ServicesSection />
      <MarketInsights />
      <CTASection />
    </main>
  );
}