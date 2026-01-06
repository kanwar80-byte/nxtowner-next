export interface ListingDetail {
  id: string;
  type: 'operational' | 'digital';
  title: string;
  price: number;
  currency: string;
  
  // Dual-Track Metrics
  revenue: number;
  profit: number; // EBITDA or SDE
  profitLabel: string; // "EBITDA" vs "SDE" vs "Net Profit"
  multiplier: number;
  
  // Trust Signals
  verified: boolean;
  verificationSource: 'Stripe' | 'Quickbooks' | 'Tax Returns' | 'Manual';
  ndaRequired: boolean;
  
  // Specifics
  location?: string; // Operational only
  model?: string;    // Digital only (e.g., "SaaS")
  techStack?: string[]; // Digital
  assets?: string[];    // Operational (e.g., "Real Estate", "Inventory")
  
  images: string[];
  description: string;
}


