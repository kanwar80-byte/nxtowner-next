export interface PublicListing {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  price: number | null;
  location: string | null;
  category: string | null;
  deal_type: 'asset' | 'digital' | null; // Ensures specific text values
  image_url: string | null;              // <--- This was missing!
  revenue: number | null;
  cashflow: number | null;
  cashflow_numeric: number | null;
  status: string;
}