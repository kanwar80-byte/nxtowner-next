"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ListingsSectionProps {
  track: 'digital' | 'real-world';
  featuredListings: unknown[];
  newListings: unknown[];
}

export default function ListingsSection({ 
  track, 
  featuredListings, 
  newListings 
}: ListingsSectionProps) {
  const isDigital = track === 'digital';
  const accentColor = isDigital ? 'text-teal-500' : 'text-amber-500';
  const accentBg = isDigital ? 'bg-teal-500/10' : 'bg-amber-500/10';

  return (
    <section className="py-24 bg-slate-950 border-t border-slate-900">
      <div className="container mx-auto px-4">
        
        {/* Featured Listings */}
        {featuredListings.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Featured <span className={accentColor}>
                  {isDigital ? 'Digital' : 'Real World'}
                </span> Listings
              </h2>
              <Link 
                href={`/browse/${track}`}
                className={`font-medium flex items-center gap-1 transition-colors ${accentColor} hover:opacity-80`}
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredListings.slice(0, 3).map((listing: unknown, idx: number) => {
                // Simple placeholder card - replace with actual listing card component
                const item = listing as Record<string, unknown>;
                return (
                  <div key={idx} className={`rounded-2xl border border-slate-800 p-6 ${accentBg} hover:border-slate-700 transition-colors`}>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.title as string || 'Untitled Listing'}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      {item.description as string || 'No description available'}
                    </p>
                    {typeof item.asking_price === 'number' && (
                      <p className={`text-lg font-bold ${accentColor}`}>
                        ${item.asking_price.toLocaleString()}
                      </p>
                    )}
                    {typeof item.asking_price === 'string' && !isNaN(Number(item.asking_price)) && (
                      <p className={`text-lg font-bold ${accentColor}`}>
                        ${Number(item.asking_price).toLocaleString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* New Listings */}
        {newListings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Newest <span className={accentColor}>
                  {isDigital ? 'Digital' : 'Real World'}
                </span> Listings
              </h2>
              <Link 
                href={`/browse/${track}?sort=newest`}
                className={`font-medium flex items-center gap-1 transition-colors ${accentColor} hover:opacity-80`}
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newListings.slice(0, 3).map((listing: unknown, idx: number) => {
                // Simple placeholder card - replace with actual listing card component
                const item = listing as Record<string, unknown>;
                return (
                  <div key={idx} className={`rounded-2xl border border-slate-800 p-6 ${accentBg} hover:border-slate-700 transition-colors`}>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.title as string || 'Untitled Listing'}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      {item.description as string || 'No description available'}
                    </p>
                    {typeof item.asking_price === 'number' && (
                      <p className={`text-lg font-bold ${accentColor}`}>
                        ${item.asking_price.toLocaleString()}
                      </p>
                    )}
                    {typeof item.asking_price === 'string' && !isNaN(Number(item.asking_price)) && (
                      <p className={`text-lg font-bold ${accentColor}`}>
                        ${Number(item.asking_price).toLocaleString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
