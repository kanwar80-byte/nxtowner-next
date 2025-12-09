interface RecentListingsProps {
  mode: 'all' | 'operational' | 'digital';
}

export default function RecentListings({ mode }: RecentListingsProps) {
  const listings = [
    {
      id: 5,
      title: 'E-commerce Store - Health & Wellness',
      price: '$580,000',
      revenue: '$720K',
      profit: '$215K',
      location: 'Online',
      verified: true,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    },
    {
      id: 6,
      title: 'Industrial Warehouse Property',
      price: '$4,200,000',
      revenue: '$980K',
      profit: '$420K',
      location: 'Mississauga, ON',
      verified: false,
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
    },
    {
      id: 7,
      title: 'Coffee Shop Chain (3 Locations)',
      price: '$1,850,000',
      revenue: '$2.4M',
      profit: '$380K',
      location: 'Montreal, QC',
      verified: true,
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop',
    },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Recent Listings</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              The latest operational and digital assets added to NxtOwner.ca.
            </p>
          </div>
          <a
            href="/browse"
            className="hidden sm:inline-block px-6 py-3 bg-[#F97316] text-white rounded-full font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.14)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] hover:scale-[1.03] active:scale-[0.98] hover:bg-[#ea580c] transition-all duration-300"
          >
            Browse All
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {listings.map((listing, idx) => (
            <a
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 group animate-fadeInUp flex flex-col h-full"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="relative aspect-[16/10] bg-gray-200 overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {listing.verified && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-[#16A34A] text-white text-xs font-semibold rounded">
                      VERIFIED
                    </span>
                  </div>
                )}
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
        <div className="text-center mt-10 sm:hidden">
          <a
            href="/browse"
            className="inline-block px-6 py-3 bg-[#F97316] text-white rounded-full font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.14)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] hover:scale-[1.03] active:scale-[0.98] hover:bg-[#ea580c] transition-all duration-300"
          >
            Browse All
          </a>
        </div>
      </div>
    </section>
  );
}
