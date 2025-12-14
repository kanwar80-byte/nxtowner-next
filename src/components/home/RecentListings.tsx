export default function RecentListings() {
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

    import Link from "next/link";

    const DEMO = [
      {
        title: "E-commerce Store (Health & Wellness)",
        location: "Toronto, ON",
        price: "$580,000",
        href: "/browse",
      },
      {
        title: "Industrial Warehouse Property",
        location: "Brampton, ON",
        price: "$4,200,000",
        href: "/browse",
      },
      {
        title: "Coffee Shop (High Foot Traffic Location)",
        location: "Mississauga, ON",
        price: "$1,850,000",
        href: "/browse",
      },
    ];

    return (
      <section className="bg-white rounded-xl border border-brand-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-brand-text">Recent Listings</h2>
            <p className="text-sm text-brand-muted">Fresh opportunities added to NxtOwner.</p>
          </div>
          <Link
            href="/browse"
            className="text-sm font-semibold text-brand-orange hover:underline"
          >
            Browse All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DEMO.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-lg border border-brand-border bg-white p-5 hover:shadow-md transition"
            >
              <div className="text-sm text-brand-muted">{item.location}</div>
              <div className="mt-2 font-semibold text-brand-text group-hover:text-brand-orange transition">
                {item.title}
              </div>
              <div className="mt-3 text-brand-orange font-bold">{item.price}</div>
            </Link>
          ))}
        </div>
      </section>
    );
}
