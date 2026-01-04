export type AssetType = 'Operational' | 'Digital';

export interface Listing {
  id: string;
  created_at: string;
  title: string;
  asset_type: AssetType;
  category: string;
  subcategory: string;
  hero_image_url: string | null;
  asking_price: number;
  gross_revenue: number;
  ebitda: number;
  city: string;
  province: string;
  
  // Joined Data
  operational_data?: {
    sq_ft: number;
    employee_count: number;
    real_estate_included: boolean;
  } | null;
  
  digital_data?: {
    mrr: number;
    churn_rate: number;
    tech_stack: string[];
  } | null;

  ai_analysis?: {
    growth_score: number;
    risk_score: number;
    automation_potential: string;
    executive_summary: string;
  } | null;
}

export type PublicListing = {
  id: string;
  title?: string | null;
  status?: string | null;
  asset_type?: string | null;
  hero_image_url?: string | null;
  asking_price?: number | null;
  [key: string]: unknown;
};