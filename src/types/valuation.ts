export type Valuation = {
  id: string;
  profile_id: string;
  listing_id?: string;
  asset_type: "physical" | "digital";
  business_type?: string;
  title: string;
  country?: string;
  region?: string;
  annual_revenue?: number;
  annual_profit?: number;
  asking_price?: number;
  key_metrics?: Record<string, number>;
  notes?: string;
  ai_input_summary?: string;
  ai_output_range_min?: number;
  ai_output_range_max?: number;
  ai_output_currency?: string;
  ai_output_multiples?: {
    revenue_multiple?: number;
    profit_multiple?: number;
  };
  ai_output_narrative?: string;
  status: "queued" | "running" | "completed" | "failed";
  error_message?: string;
  created_at: string;
};

export type ValuationAIResult = {
  valuation_min: number;
  valuation_max: number;
  currency: string;
  revenue_multiple: number;
  profit_multiple: number;
  narrative: string;
};
