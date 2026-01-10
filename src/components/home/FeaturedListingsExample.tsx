'use client';

import { ListingCard } from '@/components/ui/ListingCard';

/**
 * Example component showing how to use ListingCard with two distinct lanes:
 * - LANE 1: Operational (Broker Led)
 * - LANE 2: Digital (Founder Direct)
 * 
 * This demonstrates the dual-engine approach where operational assets
 * show broker information and digital assets show founder information.
 */
export default function FeaturedListingsExample() {
  return (
    <section className="py-14 lg:py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* LANE 1: OPERATIONAL (Broker Led) */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Operational Assets</h2>
              <p className="text-slate-400">Broker-listed physical businesses</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ListingCard 
              id="101"
              dealType={"operational" as const}
              title="High Volume Petro Canada"
              price="$2,400,000"
              image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
              metric1="$320k"       // EBITDA
              metric2="Shelburne, ON" // Location
              sourceName="CBRE Limited"
            />
            <ListingCard 
              id="102"
              dealType={"operational" as const}
              title="Express Car Wash - Toronto"
              price="$850,000"
              image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"
              metric1="$180k"       // EBITDA
              metric2="Toronto, ON" // Location
              sourceName="Colliers International"
            />
            <ListingCard 
              id="103"
              dealType={"operational" as const}
              title="Retail Plaza - Multi-Tenant"
              price="$1,200,000"
              image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80"
              metric1="$95k"        // EBITDA
              metric2="Mississauga, ON" // Location
              sourceName="JLL Canada"
            />
          </div>
        </div>

        {/* LANE 2: DIGITAL (Founder Direct) */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Digital Assets</h2>
              <p className="text-slate-400">Founder-direct online businesses</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ListingCard 
              id="202"
              dealType={"digital" as const}
              title="SaaS for Inventory Mgmt"
              price="$150,000"
              image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
              metric1="$12k"        // MRR
              metric2="React / Node" // Tech Stack
              sourceName="Vishal K."
            />
            <ListingCard 
              id="203"
              dealType={"digital" as const}
              title="E-commerce DTC Brand"
              price="$85,000"
              image="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80"
              metric1="$8.5k"       // MRR
              metric2="Shopify / Stripe" // Tech Stack
              sourceName="Sarah M."
            />
            <ListingCard 
              id="204"
              dealType={"digital" as const}
              title="Content Site - Tech Blog"
              price="$45,000"
              image="https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80"
              metric1="$3.2k"       // MRR
              metric2="WordPress / AWS" // Tech Stack
              sourceName="Alex T."
            />
          </div>
        </div>

      </div>
    </section>
  );
}




