type MarketplaceMode = 'all' | 'operational' | 'digital';
type CategoryKind = 'operational' | 'digital';

interface CategoryItem {
  id: string;
  label: string;
  description: string;
  kind: CategoryKind;
  href?: string;
  image?: string;
}

interface CategoryGridProps {
  mode: MarketplaceMode;
}

const CATEGORIES: CategoryItem[] = [
  // OPERATIONAL
  {
    id: "gas-stations",
    label: "Gas Stations & C-Stores",
    description: "Fuel retail and convenience stores across Canada.",
    kind: "operational",
    image: 'https://images.unsplash.com/photo-1545262810-77515befe149?w=400&h=300&fit=crop',
  },
  {
    id: "car-washes",
    label: "Car Washes",
    description: "Touchless, tunnel, and coin-op wash systems.",
    kind: "operational",
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=300&fit=crop',
  },
  {
    id: "qsr-restaurants",
    label: "QSRs & Restaurants",
    description: "Quick service restaurants and foodservice brands.",
    kind: "operational",
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
  },
  {
    id: "warehouses-industrial",
    label: "Warehouses & Industrial",
    description: "Logistics, distribution, and light industrial assets.",
    kind: "operational",
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
  },
  {
    id: "retail-franchise",
    label: "Retail & Franchise Businesses",
    description: "Brick-and-mortar retail and franchise resales.",
    kind: "operational",
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
  },
  {
    id: "automotive-services",
    label: "Automotive & Service Centers",
    description: "Auto repair, tire shops, and service businesses.",
    kind: "operational",
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
  },
  {
    id: "hospitality",
    label: "Hospitality & Accommodation",
    description: "Hotels, motels, and hospitality businesses.",
    kind: "operational",
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
  },

  // DIGITAL
  {
    id: "saas",
    label: "SaaS (Software Businesses)",
    description: "Recurring-revenue software and micro-SaaS.",
    kind: "digital",
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
  },
  {
    id: "ecommerce",
    label: "E-Commerce Stores",
    description: "Shopify brands, Amazon FBA, and DTC stores.",
    kind: "digital",
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
  },
  {
    id: "content-media",
    label: "Content & Media Sites",
    description: "Blogs, newsletters, and niche content assets.",
    kind: "digital",
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop',
  },
  {
    id: "agencies-services",
    label: "Agencies & Service Businesses",
    description: "Marketing, dev, consulting, and online services.",
    kind: "digital",
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
  },
  {
    id: "marketplaces-platforms",
    label: "Marketplaces & Platforms",
    description: "Two-sided platforms and digital exchanges.",
    kind: "digital",
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
  },
];

export default function CategoryGrid({ mode }: CategoryGridProps) {
  // Filter categories based on mode
  const visibleCategories =
    mode === 'all'
      ? CATEGORIES
      : CATEGORIES.filter(cat => cat.kind === mode);

  return (
    <section className="bg-[#F8FAFC] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-10">
          {mode === 'all' && 'Browse by Category'}
          {mode === 'operational' && 'Operational Business Categories'}
          {mode === 'digital' && 'Digital Asset Categories'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {visibleCategories.map((category: CategoryItem, index: number) => (
            <a
              key={category.id}
              href="/browse"
              className="group relative overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] transition-all duration-300 hover:scale-[1.02] animate-fadeInUp"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="aspect-[4/3] bg-gray-300 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.label}
                  className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white text-2xl font-semibold drop-shadow-lg">
                    {category.label}
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
