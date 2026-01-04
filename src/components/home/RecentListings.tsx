import { searchListingsV16 } from "@/lib/v16/listings.repo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Simple Listing Interface for the UI
type ListingUI = {
  id: string;
  title: string;
  location: string;
  price: number;
  cash_flow: number;
  image: string;
  category: string;
};

export default async function RecentListings() {
  // ✅ 1. Use Canonical V16 Repo
  const listings = await searchListingsV16({ sort: 'newest' });
  
  // ✅ 2. Map Data safely (Handle V15/V16 field names)
  const rows: ListingUI[] = listings.slice(0, 4).map((item: any) => ({
    id: item.id,
    title: item.title || "Untitled Opportunity",
    location: `${item.city || 'Unknown'}, ${item.province || 'Canada'}`,
    price: item.asking_price || 0,
    cash_flow: item.cash_flow || 0,
    image: item.hero_image_url || item.heroImageUrl || '/placeholder.jpg',
    category: item.category || 'Business',
  }));

  if (rows.length === 0) {
    return null; // Don't show section if empty
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Fresh Opportunities</h2>
            <p className="mt-2 text-slate-600">The latest verified businesses listed this week.</p>
          </div>
          <Link href="/browse?sort=newest" className="hidden sm:flex items-center text-blue-600 font-medium hover:text-blue-700">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rows.map((listing) => (
            <Link key={listing.id} href={`/listing/${listing.id}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-slate-100">
              <div className="relative h-48 w-full bg-slate-200">
                <Image src={listing.image} alt={listing.title} fill className="object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-slate-700">
                  {listing.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{listing.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{listing.location}</p>
                <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-medium">Asking</p>
                    <p className="font-bold text-slate-900">${listing.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-medium">Cash Flow</p>
                    <p className="font-medium text-emerald-600">${listing.cash_flow.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
