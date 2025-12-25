'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';


const CATEGORIES = [
  { id: 'saas', name: 'SaaS', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80' },
  { id: 'ecommerce', name: 'E-commerce', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80' },
  { id: 'agency', name: 'Agencies', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80' },
  { id: 'content', name: 'Content Sites', image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80' },
  { id: 'marketplace', name: 'Marketplaces', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80' },
  { id: 'app', name: 'Mobile Apps', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80' },
  { id: 'newsletter', name: 'Newsletters', image: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&q=80' },
  { id: 'service', name: 'Services', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80' },
];

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function BrowseByCategory() {
  return (
    <section>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Browse by Category</h2>
          <p className="text-slate-500 mt-2">Explore opportunities by business model.</p>
        </div>
        <Link href="/browse" className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm">
          View All Categories <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => {
          const slug = slugify(cat.name);
          return (
            <Link
              key={cat.id}
              href={`/browse?category=${slug}&assetType=all`}
              className="group relative h-40 rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors" />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Label */}
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-bold text-lg">{cat.name}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}