import { fetchListings } from "@/lib/db/listings";
import { getFeaturedListingsV16 } from "@/lib/v16/listings.repo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type Listing = {
  id: string;
  title: string | null;
  city: string | null;
  province: string | null;
  asking_price: number | null;
  cash_flow: number | null;
  category: string | null;
  subcategory: string | null;
  hero_image_url: string | null;
  created_at: string | null;
};

export default async function CuratedOpportunities() {
  const useV16 = process.env.NEXT_PUBLIC_USE_V16 === "1";
  let rows: Listing[] = [];
  if (useV16) {
    // V16 fetch, map to V15 Listing shape
    const v16Rows = await getFeaturedListingsV16();
    rows = v16Rows.map((item) => ({
      id: item.id,
      title: item.title ?? null,
      city: item.city ?? null,
      province: item.province ?? null,
      asking_price: typeof item.askingPrice === "number" ? item.askingPrice : null,
      cash_flow: typeof item.cashFlowAnnual === "number" ? item.cashFlowAnnual : null,
      category: item.categoryLabel ?? null,
      subcategory: item.subcategoryLabel ?? null,
      hero_image_url: item.heroImageUrl ?? null,
      created_at: null,
    }));
  } else {
    const { data, error } = await fetchListings();
    if (error) console.error(error);
    rows = (data || []).slice(0, 6) as Listing[];
  }

  if (rows.length === 0) {
    return (
      <section className="py-12 bg-[#0B1221]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Featured Opportunities</h2>
          <p className="text-slate-400 mb-6">No curated listings found right now.</p>
          <Link
            href="/browse"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Browse All Listings
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-[#0B1221]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Featured Opportunities</h2>
            <p className="text-slate-400 mt-2">Hand-picked for financial health and readiness.</p>
          </div>
          <Link
            href="/browse?sort=newest"
            className="text-blue-500 font-bold flex items-center gap-1 hover:text-blue-400 hover:gap-2 transition-all text-sm"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rows.map((deal) => (
            <Link
              key={deal.id}
              href={`/listing/${deal.id}`}
              className="block bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform h-full"
            >
              <div className="aspect-[4/3] bg-slate-200 relative w-full">
                {deal.hero_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={deal.hero_image_url}
                    className="w-full h-full object-cover"
                    alt={deal.title || "Listing"}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-400 text-slate-500 text-sm">
                    No Image
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 px-2 py-1 rounded text-xs font-bold">
                  {deal.subcategory || deal.category || "Business"}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-1">
                  {deal.title || "Untitled Listing"}
                </h3>
                {(() => {
                  const loc = [deal.city, deal.province].filter(Boolean).join(", ");
                  return <p className="text-xs text-slate-500 mb-2">{loc || "Canada"}</p>;
                })()}

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Price</p>
                    <p className="font-bold">
                      {typeof deal.asking_price === "number" ? `$${deal.asking_price.toLocaleString()}` : "Confidential"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase">Cash Flow</p>
                    <p className="font-bold text-green-600">
                      {typeof deal.cash_flow === "number" ? `$${deal.cash_flow.toLocaleString()}` : "-"}
                    </p>
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