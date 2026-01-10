import { getFeaturedListingsV17, searchListingsV17 } from "@/lib/v17/listings.repo";
import ListingsSection from '@/components/home/ListingsSection';
import CategoryGrid from '@/components/home/CategoryGrid'; 

// Force dynamic rendering to always show fresh database data
export const dynamic = 'force-dynamic';

export default async function DigitalHomePage() {

  // 1. FETCH DATA (Using Standard V17 Repo)
  // We explicitly ask for 'asset_type: digital' to match the column we just synced
  const [featured, newArrivalsResult] = await Promise.all([
    // Featured Digital Listings
    getFeaturedListingsV17({ 
      asset_type: 'digital', 
      limit: 3 
    }),
    
    // New This Week (Digital Only)
    searchListingsV17({ 
      asset_type: 'digital',
      sort: 'newest', 
      limit: 3 
    } as any)
  ]);

  // 2. SAFETY FALLBACK (Prevents crashes if DB is empty)
  // searchListingsV17 returns { items, total, page, page_size }, extract items
  const featuredListings = featured || [];
  const newListings = (newArrivalsResult && typeof newArrivalsResult === 'object' && 'items' in newArrivalsResult)
    ? (newArrivalsResult as { items: unknown[] }).items
    : Array.isArray(newArrivalsResult) ? newArrivalsResult : [];

  return (
    <main className="min-h-screen bg-black">
      {/* --- HERO SECTION --- */}
      <div className="pt-32 pb-12 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          The Operating System for <span className="text-teal-400">Digital Acquisitions</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Buy and sell verified SaaS, AI, and Agencies with code-level due diligence.
        </p>
      </div>

      {/* --- CATEGORIES --- */}
      <CategoryGrid />

      {/* --- LISTINGS SECTION --- */}
      {/* This renders the cards in Teal mode */}
      <ListingsSection 
        track="digital"
        featuredListings={featuredListings} 
        newListings={newListings} 
      />
    </main>
  );
}