import Link from "next/link";

export default function CuratedListings() {
  const listings = [
    {
      id: 1,
      title: 'Established Gas Station & C-Store',
      price: '$2,850,000',
      revenue: '$4.2M',
      profit: '$680K',
      location: 'Toronto, ON',
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1545262810-77515befe149?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      title: 'Profitable SaaS Platform',
      price: '$1,200,000',
      revenue: '$850K',
      profit: '$425K',
      location: 'Remote',
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      title: 'Quick Service Restaurant Franchise',
      price: '$950,000',
      revenue: '$1.8M',
      profit: '$280K',
      location: 'Vancouver, BC',
      verified: true,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      title: 'Modern Car Wash Facility',
      price: '$3,500,000',
      revenue: '$2.1M',
      profit: '$850K',
      location: 'Calgary, AB',
      verified: true,
      sold: true,
      imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=300&fit=crop',
    },
  ];

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-orange-400/90 font-bold mb-2">
              Featured Collection
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A122A]">
              Curated Opportunities
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-3 max-w-2xl">
              Hand-picked operational and digital assets that match what acquisition-focused buyers are looking for right now.
            </p>
          </div>
          <Link
            href="/browse"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition"
          >
            View all <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
            const readinessScore =
              listing.readiness_score ??
              listing.readiness?.score ??
              listing.outputs?.readiness?.score ??
              listing.meta?.readiness?.score ??
              null;

            const readinessTier =
              listing.readiness_tier ??
              listing.readiness?.tier ??
              listing.outputs?.readiness?.tier ??
              listing.meta?.readiness?.tier ??
              null;

            return (
              <Link
                key={listing.id}
                href={`/listing/${listing.slug || listing.id}`}
                className="group rounded-2xl bg-white/5 border border-white/10 hover:bg-white/7 hover:border-white/20 transition overflow-hidden flex flex-col h-full"
              >
                <div className="relative aspect-[16/10] bg-white/5">
                  {listing.imageUrl && (
                    <img
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="object-cover w-full h-full"
                    />
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {listing.verified && (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-emerald-200 backdrop-blur">
                        Verified
                      </span>
                    )}
                    {listing.aiVerified && (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-emerald-200 backdrop-blur">
                        AI-Verified
                      </span>
                    )}
                    {listing.featured && (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/25 text-[#F6E7B0] backdrop-blur">
                        Featured
                      </span>
                    )}
                    {typeof readinessScore === "number" && (
                      <span
                        className={
                          "text-[10px] px-2 py-1 rounded-full backdrop-blur inline-flex items-center gap-1 " +
                          (
                            readinessTier === "deal_ready" || readinessScore >= 80
                              ? "bg-emerald-500/12 border border-emerald-500/25 text-emerald-200"
                              : readinessTier === "nearly_ready" || (readinessScore >= 55 && readinessScore < 80)
                              ? "bg-[#D4AF37]/15 border border-[#D4AF37]/25 text-[#F6E7B0]"
                              : "bg-white/5 border border-white/10 text-slate-200"
                          )
                        }
                      >
                        Deal-Ready {readinessScore}/100
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <div className="mb-1">
                    <div className="text-slate-50 font-semibold leading-snug line-clamp-2">
                      {listing.title}
                    </div>
                    {listing.category && (
                      <div className="text-xs text-slate-400 mt-1">{listing.category}</div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-400">Price</div>
                      <div className="text-sm font-semibold text-slate-100">
                        {listing.price ? `$${listing.price.toLocaleString()}` : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-400">
                        {listing.cashFlow ? "Cash Flow" : listing.revenue ? "Revenue" : "Cash Flow"}
                      </div>
                      <div className="text-sm font-semibold text-slate-100">
                        {listing.cashFlow
                          ? `$${listing.cashFlow.toLocaleString()}`
                          : listing.revenue
                          ? `$${listing.revenue.toLocaleString()}`
                          : "—"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-slate-400 text-xs flex flex-wrap gap-x-3 gap-y-1">
                    {listing.location && <span>{listing.location}</span>}
                    {listing.assetType && <span>{listing.assetType}</span>}
                    {/* Add more meta if present */}
                  </div>
                  {/* Optional: View button if already present */}
                  {/* <div className="mt-4">
                    <button className="bg-white/5 border border-white/10 text-slate-100 px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition">
                      View
                    </button>
                  </div> */}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
