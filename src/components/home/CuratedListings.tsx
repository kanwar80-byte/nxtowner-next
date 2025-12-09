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
    <section className="bg-[#F8FAFC] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Curated Opportunities</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Hand-picked operational and digital assets that match what acquisition-focused buyers are looking for right now.
            </p>
          </div>
          <a
            href="/browse"
            className="hidden sm:inline-block px-6 py-3 border-2 border-[#0A122A] text-[#0A122A] rounded-full font-semibold hover:bg-[#0A122A] hover:text-white hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
          >
            View All
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {listings.map((listing, idx) => (
            <a
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] hover:-translate-y-1 transition-all duration-300 overflow-hidden group animate-fadeInUp flex flex-col h-full"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
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
              <div className="p-5 space-y-3 flex-1 flex flex-col">
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
                <div className="pt-3">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A122A]">
                    View Details <span aria-hidden>→</span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <a
            href="/browse"
            className="inline-block px-6 py-3 border-2 border-[#0A122A] text-[#0A122A] rounded-full font-semibold hover:bg-[#0A122A] hover:text-white hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
          >
            View All
          </a>
        </div>
      </div>
    </section>
  );
}
