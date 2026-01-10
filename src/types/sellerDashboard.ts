/**
 * Seller Dashboard Types (V17)
 */

export interface SellerKpis {
  views7d: number;
  views30d: number;
  saves: number;
  ndaRequests: number;
  aiFitScore: number; // 0-100
}

export interface ListingHealth {
  listingId: string;
  listingTitle: string;
  healthScore: number; // 0-100
  issues: string[];
  dataCompleteness: number; // 0-100
}

export interface AiValuationBand {
  listingId: string;
  low: number;
  mid: number;
  high: number;
  yourAsk: number;
  askVsValuation: "below" | "at" | "above";
  warning?: string;
}

export interface DataCompletenessItem {
  id: string;
  label: string;
  status: "complete" | "partial" | "missing";
  importance: "high" | "medium" | "low";
  description?: string;
}

export interface DataCompleteness {
  listingId: string;
  overall: number; // 0-100
  items: DataCompletenessItem[];
}

export interface BuyerSignal {
  type: "comparing" | "pro_interest" | "price_sensitivity";
  label: string;
  count?: number;
  message: string;
  listingId?: string;
}

export interface SellerDashboardData {
  kpis: SellerKpis;
  listings: {
    id: string;
    title: string;
    status: "draft" | "published" | "under_review" | "closed";
    askingPrice: number | null;
    health?: ListingHealth;
    valuationBand?: AiValuationBand;
    dataCompleteness?: DataCompleteness;
  }[];
  buyerSignals: BuyerSignal[];
}
