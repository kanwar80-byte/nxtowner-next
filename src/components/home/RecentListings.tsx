"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// Helper to calculate "2 days ago"
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  return "Just now";
}

interface Listing {
  id: number;
  title: string;
  location: string;
  price: number | null;
  cashflow: string;
  category: string;
  asset_type: string;
  image_url: string;
  created_at: string;
}

export default function RecentListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRecent() {
      // Fetch 3 newest active listings
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching recent:', error);
      } else if (data) {
        setListings(data);
      }
      setLoading(false);
    }

    fetchRecent();
  }, []);

  if (loading) return null; // or a spinner
  if (listings.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#0a192f]">Recent Listings</h2>
          <p className="text-sm text-gray-500 mt-1">Fresh opportunities added this week.</p>
        </div>
        <Link href="/browse" className="hidden md:flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700">
          Browse All <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((item) => (
          <Link href={`/listing/${item.id}`} key={item.id} className="block group bg-white border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="h-40 bg-gray-50 relative overflow-hidden">
               <img 
                 src={item.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80'} 
                 alt={item.title}
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
               />
                
                {/* NEW Badge Logic: Show NEW if less than 7 days old */}
                {(new Date().getTime() - new Date(item.created_at).getTime()) / (1000 * 3600 * 24) < 7 && (
                   <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                      NEW
                   </span>
                )}
                
                <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock size={10} /> {timeAgo(item.created_at)}
                </span>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {item.asset_type || 'Asset'}
                 </span>
                 <span className="text-sm font-bold text-green-700">
                    {item.price ? `$${item.price.toLocaleString()}` : 'Contact'}
                 </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-1 group-hover:text-blue-900">
                {item.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-50">
                 <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>
                 <span className="font-medium text-gray-700">{item.cashflow || 'N/A'}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-6 md:hidden text-center">
        <Link href="/browse" className="text-sm font-bold text-orange-600">View All Listings →</Link>
      </div>
    </div>
  );
}
