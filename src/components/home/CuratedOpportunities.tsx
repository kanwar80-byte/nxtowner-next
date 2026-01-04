"use client";

import { useEffect, useState } from "react";
import { useTrack } from "@/contexts/TrackContext";
import { ListingCard } from "@/components/ui/ListingCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Listing {
  id: string;
  title: string;
  asking_price: number;
  image_url: string;
  deal_type: "operational" | "digital";
  ebitda: number;
  location_city: string;
  mrr: number;
  tech_stack: string[];
  source_type?: string;
  ai_growth_score?: number;
}

export default function CuratedOpportunities() {
  const { track } = useTrack(); 
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')          
        .eq('deal_type', track)          
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching listings:", error);
      } else if (data) {
        // V17 MAPPING FIX
        const mappedListings: Listing[] = data.map((item: any) => ({
          id: String(item.id || ''),
          title: String(item.title || item.listing_title || 'Untitled'),
          asking_price: Number(item.asking_price) || 0,
          image_url: String(item.image_url || item.hero_image_url || '/images/placeholder.jpg'),
          deal_type: (String(item.deal_type || item.asset_type || 'operational') as 'operational' | 'digital'),
          
          // 🛑 THE FIX IS HERE: Read 'cash_flow' as EBITDA
          ebitda: Number(item.cash_flow || item.ebitda) || 0,
          
          location_city: String(item.location_city || item.city || ''),
          mrr: Number(item.mrr || item.mrr_current) || 0,
          tech_stack: Array.isArray(item.tech_stack) ? item.tech_stack as string[] : [],
          source_type: item.source_type ? String(item.source_type) : undefined,
          ai_growth_score: item.ai_growth_score ? Number(item.ai_growth_score) : undefined,
        }));
        setListings(mappedListings);
      }
      setLoading(false);
    }

    fetchListings();
  }, [track]); 

  const fmtMoney = (amount: number) => {
    if (!amount) return "Contact for Price";
    return new Intl.NumberFormat('en-CA', { 
      style: 'currency', 
      currency: 'CAD', 
      maximumFractionDigits: 0,
      notation: "compact" 
    }).format(amount);
  };

  return (
    <section className="py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {track === 'operational' ? 'Prime Operational Assets' : 'Trending Digital Assets'}
            </h2>
            <p className="text-slate-400">
              {track === 'operational' 
                ? 'Verified brick & mortar opportunities.' 
                : 'Profitable code & communities.'}
              <span className={track === 'operational' ? "text-amber-500 font-medium ml-1" : "text-teal-500 font-medium ml-1"}>
                {track === 'operational' ? 'Broker Represented.' : 'Direct from Founder.'}
              </span>
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            View All {track === 'operational' ? 'Real World' : 'Digital'} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-slate-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((deal) => (
              <ListingCard
                key={deal.id}
                id={deal.id}
                dealType={deal.deal_type}
                title={deal.title}
                price={fmtMoney(deal.asking_price)}
                image={deal.image_url || '/images/placeholder.jpg'} 
                
                // Smart Metrics Logic
                metric1={deal.deal_type === 'operational' 
                  ? (deal.ebitda ? `EBITDA: ${fmtMoney(deal.ebitda)}` : 'EBITDA: N/A') 
                  : (deal.mrr ? `MRR: ${fmtMoney(deal.mrr)}` : 'MRR: N/A')}
                
                metric2={deal.deal_type === 'operational' 
                  ? (deal.location_city || 'Ontario') 
                  : (deal.tech_stack?.[0] || 'SaaS')}
                
                sourceName={deal.deal_type === 'operational' ? 'Partner Broker' : 'Founder Direct'}
                aiScore={deal.ai_growth_score || 0}
              />
            ))}
            
            {listings.length === 0 && (
              <div className="col-span-full text-center py-16 text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                <p>No active listings found.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}