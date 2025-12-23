

import BrowseClientShell from "@/components/platform/BrowseClientShell";
import FilterSidebar from "@/components/platform/FilterSidebar";
import { supabaseServer } from "@/lib/supabase/server";
import { Suspense } from "react";

export default async function BrowsePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ asset_type?: string; category?: string }> 
}) {
  // 1. Unwrapping the Promise (Required for Next.js 15/16)
  const resolvedParams = await searchParams;
  const supabase = await supabaseServer();

  // 2. Fetch listings with joined AI analysis
  const { data: listings } = await supabase
    .from("listings")
    .select(`*, ai_analysis(*)`)
    .order('created_at', { ascending: false });

  // 3. Return the 3-column Flippa-style layout
  return (
    <div className="flex flex-col min-h-screen pt-20 bg-slate-50/50"> 
      {/* pt-20 ensures content starts below the navigation bar */}
      
      <div className="max-w-[1600px] mx-auto w-full px-6 py-8">
        
        {/* Page Heading: Visible at the very top */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
          <p className="text-slate-500 mt-1">Discover and acquire vetted business opportunities.</p>
        </div>

        <div className="flex gap-8 items-start">
          {/* Column 1: Side Filters (Sticky on left) */}
          <aside className="w-64 flex-shrink-0 sticky top-28 h-[calc(100vh-120px)] overflow-y-auto hidden md:block">
            <FilterSidebar />
          </aside>

          {/* Column 2: Main Listing Feed (Center scroll) */}
          <main className="flex-1 min-w-[1000px] min-w-0">
            <Suspense fallback={<div className="animate-pulse space-y-4">Loading listings...</div>}>
              <BrowseClientShell listings={listings || []} />
            </Suspense>
          </main>

        </div>
      </div>
    </div>
  );
}
