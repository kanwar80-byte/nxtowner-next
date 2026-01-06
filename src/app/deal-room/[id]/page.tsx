import { getDealState } from "@/app/actions/deal-actions";
import AIAnalysisSection from "@/components/platform/AIAnalysisSection";
import AnalysisWrapper from "@/components/platform/AnalysisWrapper";
import SecureVault from "@/components/platform/SecureVault";
import SmartActionCenter from "@/components/platform/SmartActionCenter";
import { getUser } from "@/lib/auth";
import { getListingByIdV16, searchListingsV16 } from "@/lib/v16/listings.repo";
import { normalizeId } from "@/lib/utils/normalizeId";
import { TABLES } from "@/lib/spine/constants";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Safely normalizes ai_analysis from database (unknown type) to the expected format.
 * Handles string, object, array, null, or undefined inputs.
 */
function normalizeAiAnalysis(
  raw: unknown
): {
  growth_score: number;
  risk_score: number;
  executive_summary: string;
  automation_potential: string;
  growth_opportunities: string[];
} | null {
  if (raw === null || raw === undefined) {
    return null;
  }

  // If it's already a string, try to parse it as JSON
  if (typeof raw === "string") {
    if (raw.trim() === "") return null;
    try {
      const parsed = JSON.parse(raw);
      return normalizeAiAnalysis(parsed);
    } catch {
      // If parsing fails, treat as plain text and create a minimal structure
      return {
        growth_score: 0,
        risk_score: 0,
        executive_summary: raw,
        automation_potential: "",
        growth_opportunities: [],
      };
    }
  }

  // If it's an object, validate and extract fields
  if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>;
    return {
      growth_score: typeof obj.growth_score === "number" ? obj.growth_score : 0,
      risk_score: typeof obj.risk_score === "number" ? obj.risk_score : 0,
      executive_summary: typeof obj.executive_summary === "string" ? obj.executive_summary : "",
      automation_potential: typeof obj.automation_potential === "string" ? obj.automation_potential : "",
      growth_opportunities: Array.isArray(obj.growth_opportunities)
        ? obj.growth_opportunities.filter((item): item is string => typeof item === "string")
        : [],
    };
  }

  // For arrays or other types, return null (component handles null gracefully)
  return null;
}

export default async function DealRoomPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  
  // Check authentication (without redirecting)
  const user = await getUser();
  const supabase = await createClient();

  // If user not logged in, show sign-in required screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Sign in required</h1>
            <p className="text-slate-600">
              Deal Rooms are private. Please sign in to continue.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#0B1221] text-white font-semibold rounded-lg hover:bg-[#0F172A] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // User is logged in - attempt to fetch deal room
  const dealState = await getDealState(id);
  
  // Fetch deal room (canonical) and check access
  const relationName = TABLES.deal_rooms;
  let room: { id: string; listing_id: string; status: string } | null = null;
  let roomError: any = null;
  
  if (relationName === "deal_rooms") {
    const result = await supabase
      .from("deal_rooms")
      .select("id, listing_id, status")
      .eq("id", id)
      .single();
    room = result.data;
    roomError = result.error;
  } else {
    throw new Error("Unsupported relation: " + relationName);
  }

  // Check if room exists and user has access
  let hasAccess = false;
  if (room && !roomError) {
    const membersTableName = TABLES.deal_room_members;
    let member: { id: string } | null = null;
    
    if (membersTableName === "deal_room_members") {
      const result = await supabase
        .from("deal_room_members")
        .select("id")
        .eq("deal_room_id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      member = result.data;
    } else {
      throw new Error("Unsupported relation: " + membersTableName);
    }
    
    hasAccess = !!member;
  }

  // If room not found or no access, show friendly error screen
  if (roomError || !room || !hasAccess) {
    // Extract listingId from query params if present
    const listingIdParam = sp.listingId as string | undefined;
    const isValidUUID = listingIdParam && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(listingIdParam);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Deal Room not available</h1>
            <p className="text-slate-600">
              This link may be invalid, the Deal Room hasn't been created yet, or you don't have access.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#0B1221] text-white font-semibold rounded-lg hover:bg-[#0F172A] transition-colors"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Browse Marketplace
            </Link>
            {isValidUUID && (
              <Link
                href={`/nda/${listingIdParam}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
              >
                Sign NDA to start Deal Room
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 1. Fetch listing using canonical repo
  if (!room.listing_id) {
    throw new Error("Deal room missing listing_id");
  }
  const listing = await getListingByIdV16(room.listing_id);
  if (!listing) {
    // Listing not found - show friendly error
    const listingIdParam = sp.listingId as string | undefined;
    const isValidUUID = listingIdParam && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(listingIdParam);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Deal Room not available</h1>
            <p className="text-slate-600">
              The listing associated with this Deal Room could not be found.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#0B1221] text-white font-semibold rounded-lg hover:bg-[#0F172A] transition-colors"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Browse Marketplace
            </Link>
            {isValidUUID && (
              <Link
                href={`/nda/${listingIdParam}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
              >
                Sign NDA to start Deal Room
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Fetch benchmarks for comparison using canonical repo
  // Filter by subcategory to get comparable listings
  const subcategoryId = normalizeId(listing.subcategory_id ?? listing.subcategory);

  const benchmarkListings = subcategoryId
    ? await searchListingsV16({
        subcategory: subcategoryId,
      })
    : [];
  
  // Map to expected benchmark format (extract needed fields)
  const benchmarks = benchmarkListings
    .filter((item) => item.id !== listing.id) // Exclude current listing
    .map((item) => ({
      asking_price: item.asking_price,
      gross_revenue: item.revenue_annual ?? null, // Map revenue_annual to gross_revenue
      ebitda: null, // ebitda not in teaser, set to null
    }));

  const deal = {
    ...listing,
    nda_signed: dealState.ndaSigned,
    loi_status: dealState.loiSubmitted ? "Drafted" : "None",
  };

  // Normalize ai_analysis to expected type
  const aiAnalysis = normalizeAiAnalysis(listing.ai_analysis);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            {/* AI Insights (Static Data) */}
            <AIAnalysisSection analysis={aiAnalysis} />
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