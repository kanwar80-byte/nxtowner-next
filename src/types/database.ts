// src/types/database.ts
// Canonical re-exports from the generated schema types
export type { Database, Json } from "./database.types";

// minimal unions to satisfy legacy usage
export type ListingType = "Operational" | "Digital" | "all" | string;
export type ListingStatus = "draft" | "live" | "published" | "archived" | string;

// minimal shared row shapes used across UI/actions (kept loose on purpose)
export type PartnerType = "broker" | "lender" | "lawyer" | "cpa" | "other" | string;

export type PartnerProfile = {
  id: string;
  user_id?: string | null;
  partner_type?: PartnerType | null;
  specialties?: string[] | null;
  regions?: string[] | null;
  is_approved?: boolean | null;
  created_at?: string | null;
  [key: string]: unknown;
};
export type PartnerProfileInsert = Partial<PartnerProfile>;
export type PartnerProfileUpdate = Partial<PartnerProfile>;

export type ConsultationRequest = {
  id: string;
  requester_id?: string | null;
  partner_id?: string | null;
  status?: "pending" | "contacted" | "completed" | "cancelled" | string;
  created_at?: string | null;
  [key: string]: unknown;
};
export type ConsultationRequestInsert = Partial<ConsultationRequest>;
export type ConsultationRequestUpdate = Partial<ConsultationRequest>;

export type ListingLead = {
  id: string;
  listing_id?: string | null;
  buyer_id?: string | null;
  status?: string; // important: UI expects this exists
  created_at?: string | null;
  [key: string]: unknown;
};

export type PartnerLead = {
  id: string;
  partner_id?: string | null;
  requester_id?: string | null;
  status?: string; // UI expects this exists
  created_at?: string | null;
  [key: string]: unknown;
};

// if any page imports Listing from here, give it a loose definition to avoid "missing props"
export type Listing = {
  id: string;
  title?: string | null;
  description?: string | null;
  summary?: string | null;
  asking_price?: number | null;
  annual_revenue?: number | null;
  [key: string]: unknown;
};