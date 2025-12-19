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
      image: 'https://images.unsplash.com/photo-1545262810-77515befe149?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      title: 'Profitable SaaS Platform',
      price: '$1,200,000',
      revenue: '$850K',
      profit: '$425K',
      location: 'Remote',
      verified: true,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      title: 'Quick Service Restaurant Franchise',
      price: '$950,000',
      revenue: '$1.8M',
      profit: '$280K',
      location: 'Vancouver, BC',
      verified: true,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=300&fit=crop',
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
          {listings.map((listing, idx) => (
            <Link
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="bg-white rounded-2xl border border-white/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="relative aspect-[16/9] bg-gray-200 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {listing.verified && (
                    <span className="px-2 py-1 bg-[#16A34A] text-white text-xs font-semibold rounded">
                      VERIFIED
                    </span>
                  )}
                  {listing.sold && (
                    <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded">
                      SOLD
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 min-h-[160px]">
                <div className="text-2xl font-semibold text-[#F97316]">{listing.price}</div>
                <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">{listing.title}</h3>
                <div className="text-sm text-gray-600 space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span className="font-semibold">{listing.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit:</span>
                    <span className="font-semibold">{listing.profit}</span>
                  </div>
                  <div className="text-gray-500 pt-1">📍 {listing.location}</div>
                </div>
                <div className="pt-3 mt-auto">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A122A]">
                    View Details <span aria-hidden>→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
