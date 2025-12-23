import { getDealState } from "@/app/actions/deal-actions";
import AIAnalysisSection from "@/components/platform/AIAnalysisSection";
import AnalysisWrapper from "@/components/platform/AnalysisWrapper"; // New Bridge Component
import SecureVault from "@/components/platform/SecureVault";
import SmartActionCenter from "@/components/platform/SmartActionCenter";
import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DealPage({ params }: PageProps) {
  const { id } = await params;
  const dealState = await getDealState(id);
  const supabase = await supabaseServer();

  // 1. Fetch listing with NEW schema joins
  const { data: listing, error } = await supabase
    .from("listings")
    .select(`*, operational_data(*), digital_data(*), ai_analysis(*)`)
    .eq("id", id)
    .single();

  if (error || !listing) return notFound();

  // 2. Fetch benchmarks for comparison
  const { data: benchmarks } = await supabase
    .from("listings")
    .select("asking_price, gross_revenue, ebitda")
    .eq("subcategory", listing.subcategory);

  const deal = {
    ...listing,
    nda_signed: dealState.ndaSigned,
    loi_status: dealState.loiSubmitted ? "Drafted" : "None",
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            {/* AI Insights (Static Data) */}
            <AIAnalysisSection analysis={listing.ai_analysis} />
            
            {/* AI Chart (Dynamic Client Component) */}
            <AnalysisWrapper 
              dealMetrics={listing} 
              marketBenchmarks={benchmarks} 
            />
          </div>

          <div className="space-y-6">
            <SmartActionCenter 
              dealId={deal.id}
              initialNdaStatus={dealState.ndaSigned}
            />
          </div>
        </div>
        <SecureVault deal={deal} />
      </div>
    </div>
  );
}