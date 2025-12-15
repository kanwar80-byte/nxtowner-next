import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

const RECENT_DEMO = [
  {
    id: 101,
    title: 'E-commerce Store (Health & Wellness)',
    location: 'Toronto, ON',
    price: '$350,000',
    revenue: '$1.2M Rev',
    category: 'E-commerce',
    posted: '2 days ago',
  },
  {
    id: 102,
    title: 'Industrial Warehouse Property',
    location: 'Vaughan, ON',
    price: '$4,200,000',
    revenue: 'Vacant Possession',
    category: 'Real Estate',
    posted: '3 days ago',
  },
  {
    id: 103,
    title: 'Coffee Shop (High Foot Traffic)',
    location: 'Montreal, QC',
    price: '$1,250,000',
    revenue: '$450k EBITDA',
    category: 'Hospitality',
    posted: '5 days ago',
  },
];

export default function RecentListings() {
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#0a192f]">Recent Listings</h2>
          <p className="text-sm text-gray-500 mt-1">Fresh opportunities added this week.</p>
        </div>
        <Link href="/browse" className="hidden md:flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700">
          Browse All <ArrowRight size={16} />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {RECENT_DEMO.map((item) => (
          <Link href={`/listing/${item.id}`} key={item.id} className="block group bg-white border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="h-40 bg-gray-50 relative flex items-center justify-center text-gray-300 text-xs font-medium">
                {item.category} Photo
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">NEW</span>
                <span className="absolute bottom-2 right-2 bg-black/50 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock size={10} /> {item.posted}
                </span>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.category}</span>
                 <span className="text-sm font-bold text-green-700">{item.price}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-1 group-hover:text-blue-900">{item.title}</h3>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-50">
                 <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>
                 <span className="font-medium text-gray-700">{item.revenue}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="mt-6 md:hidden text-center">
        <Link href="/browse" className="text-sm font-bold text-orange-600">
          View All Listings →
        </Link>
      </div>
    </div>
  );
}
