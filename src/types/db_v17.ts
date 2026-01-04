// FILE: types/db_v17.ts
// STRICT V17 TYPE DEFINITIONS

// 1. THE CORE ASSET ENUM
export type AssetType = 'operational' | 'digital';

// 2. OPERATIONAL META (Physical Assets - Gas Stations, Retail, etc.)
export interface OperationalMeta {
  property_type: 'lease' | 'owned';
  lease_term_remaining_years?: number;
  sqft?: number;
  zoning_code?: string;
  fuel_volume_liters?: number; 
  noi_annual?: number; 
  franchise_fee?: number;
}

// 3. DIGITAL META (Intangible Assets - SaaS, E-com, etc.)
export interface DigitalMeta {
  model_type: 'saas' | 'ecommerce' | 'content' | 'agency';
  mrr?: number;
  churn_rate_percent?: number;
  customer_count?: number;
  tech_stack?: string[];
  traffic_source?: 'organic' | 'paid' | 'direct';
}

// 4. THE V17 LISTING INTERFACE
export interface ListingV17 {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  asset_type: AssetType;
  category_code: string; 
  subcategory_code: string;
  asking_price: number;
  revenue_annual: number;
  profit_annual: number; 
  
  // THE DUAL-TRACK MAGIC
  // This forces the code to look at "meta_data" differently based on asset_type
  meta_data: OperationalMeta | DigitalMeta;
  
  // V17.2 AI LAYERS
  ai_confidence_score: number;
  ai_public_summary: string | null;
  ai_admin_flags: string[];
  ai_last_reviewed_at: string | null;
  is_verified_by_ai: boolean;
}

// 5. TYPE GUARDS (Use these in your Components)
export function isOperational(listing: ListingV17): listing is ListingV17 & { meta_data: OperationalMeta } {
  return listing.asset_type === 'operational';
}

export function isDigital(listing: ListingV17): listing is ListingV17 & { meta_data: DigitalMeta } {
  return listing.asset_type === 'digital';
}

