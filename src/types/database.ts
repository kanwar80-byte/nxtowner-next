/**
 * Database type definitions for NxtOwner
 * Auto-generated types matching Supabase schema
 */

export type UserRole = 'buyer' | 'seller' | 'partner' | 'admin';
export type PlanType = 'free' | 'pro' | 'enterprise';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type PartnerType = 'broker' | 'cpa' | 'lawyer' | 'lender' | 'consultant';
export type PartnerStatus = 'pending' | 'approved' | 'rejected';
export type ConsultationStatus = 'pending' | 'contacted' | 'completed' | 'cancelled';

export type ListingType = 'asset' | 'digital';
export type ListingStatus = 'draft' | 'pending_review' | 'active' | 'under_nda' | 'under_offer' | 'closed';

export type NdaStatus = 'signed' | 'revoked';
export type DealRoomStatus = 'pending' | 'open' | 'under_offer' | 'closed' | 'abandoned';
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';
export type DealRoomMemberRole = 'buyer' | 'seller' | 'admin';

// ============================================================================
// PROFILES
// ============================================================================
export interface Profile {
  id: string; // UUID, references auth.users
  full_name: string | null;
  role: UserRole;
  plan: PlanType;
  avatar_url: string | null;
  verification_status: VerificationStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_renews_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert extends Omit<Profile, 'id' | 'created_at' | 'updated_at'> {
  id: string;
}

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;

// ============================================================================
// PARTNER PROFILES
// ============================================================================
export interface PartnerProfile {
  id: string;
  profile_id: string; // references profiles.id
  firm_name: string;
  partner_type: PartnerType;
  specialties: string[];
  regions: string[];
  years_experience: number | null;
  website_url: string | null;
  contact_email: string;
  contact_phone: string | null;
  bio: string | null;
  is_featured: boolean;
  status: PartnerStatus;
  created_at: string;
  updated_at: string;
}

export type PartnerProfileInsert = Omit<PartnerProfile, 'id' | 'created_at' | 'updated_at'>;

export type PartnerProfileUpdate = Partial<Omit<PartnerProfile, 'id' | 'profile_id' | 'created_at' | 'updated_at'>>;

// ============================================================================
// CONSULTATION REQUESTS
// ============================================================================
export interface ConsultationRequest {
  id: string;
  partner_profile_id: string; // references partner_profiles.id
  requester_id: string | null; // references auth.users
  requester_name: string;
  requester_email: string;
  requester_phone: string | null;
  message: string;
  listing_id: string | null; // references listings.id
  status: ConsultationStatus;
  created_at: string;
  updated_at: string;
}

export type ConsultationRequestInsert = Omit<ConsultationRequest, 'id' | 'created_at' | 'updated_at'>;

export type ConsultationRequestUpdate = Partial<Omit<ConsultationRequest, 'id' | 'created_at' | 'updated_at'>>;

// ============================================================================
// LISTINGS
// ============================================================================
export interface Listing {
  id: string;
  owner_id: string; // references auth.users
  title: string;
  description: string | null;
  summary: string | null;
  asking_price: number | null;
  annual_revenue: number | null;
  annual_cashflow: number | null;
  category: string | null;
  type: ListingType;
  status: ListingStatus;
  location: string | null;
  country: string | null;
  region: string | null;
  is_verified: boolean;
  is_featured: boolean;
  is_ai_verified: boolean;
  featured_until: string | null;
  ai_verified_at: string | null;
  metrics: Record<string, unknown> | null;
  meta: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ListingInsert extends Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'is_verified' | 'is_featured' | 'is_ai_verified' | 'featured_until' | 'ai_verified_at'> {
  id?: string;
  is_verified?: boolean;
  is_featured?: boolean;
  is_ai_verified?: boolean;
  featured_until?: string | null;
  ai_verified_at?: string | null;
}

export type ListingUpdate = Partial<Omit<Listing, 'id' | 'owner_id' | 'created_at' | 'updated_at'>>;

// ============================================================================
// WATCHLIST
// ============================================================================
export interface Watchlist {
  id: string;
  user_id: string; // references auth.users
  listing_id: string; // references listings
  created_at: string;
}

export interface WatchlistInsert extends Omit<Watchlist, 'id' | 'created_at'> {
  id?: string;
}

// ============================================================================
// NDAS
// ============================================================================
export interface Nda {
  id: string;
  listing_id: string; // references listings
  buyer_id: string; // references auth.users
  status: NdaStatus;
  signed_at: string;
  created_at: string;
}

export interface NdaInsert extends Omit<Nda, 'id' | 'signed_at' | 'created_at'> {
  id?: string;
  signed_at?: string;
}

// ============================================================================
// DEAL ROOMS
// ============================================================================
export interface DealRoom {
  id: string;
  listing_id: string; // references listings
  buyer_id: string; // references auth.users
  status: DealRoomStatus;
  created_by: string | null; // references auth.users
  created_at: string;
  updated_at: string;
}

export interface DealRoomInsert extends Omit<DealRoom, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
}

export type DealRoomUpdate = Partial<Omit<DealRoom, 'id' | 'listing_id' | 'buyer_id' | 'created_at' | 'updated_at'>>;

// ============================================================================
// DEAL ROOM MEMBERS
// ============================================================================
export interface DealRoomMember {
  id: string;
  deal_room_id: string; // references deal_rooms
  user_id: string; // references auth.users
  role: DealRoomMemberRole;
  created_at: string;
}

export interface DealRoomMemberInsert extends Omit<DealRoomMember, 'id' | 'created_at'> {
  id?: string;
}

// ============================================================================
// MESSAGES
// ============================================================================
export interface Message {
  id: string;
  deal_room_id: string; // references deal_rooms
  sender_id: string; // references auth.users
  body: string;
  created_at: string;
}

export interface MessageInsert extends Omit<Message, 'id' | 'created_at'> {
  id?: string;
}

// ============================================================================
// OFFERS
// ============================================================================
export interface Offer {
  id: string;
  deal_room_id: string; // references deal_rooms
  bidder_id: string; // references auth.users
  amount: number;
  currency: string;
  status: OfferStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OfferInsert extends Omit<Offer, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
}

export type OfferUpdate = Partial<Omit<Offer, 'id' | 'deal_room_id' | 'bidder_id' | 'created_at' | 'updated_at'>>;

// ============================================================================
// NDA SIGNATURES
// ============================================================================
export interface NdaSignature {
  id: string;
  deal_room_id: string; // references deal_rooms
  listing_id: string; // references listings
  signer_id: string; // references auth.users
  signed_pdf_url: string | null;
  signed_at: string;
  created_at: string;
}

export interface NdaSignatureInsert extends Omit<NdaSignature, 'id' | 'signed_at' | 'created_at'> {
  id?: string;
  signed_at?: string;
}

// ============================================================================
// LEADS - CRM-LITE
// ============================================================================
export interface ListingLead {
  id: string;
  listing_id: string;
  buyer_id: string;
  message: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'closed_lost' | 'closed_won';
  created_at: string;
  updated_at: string;
}

export interface ListingLeadInsert extends Omit<ListingLead, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
}

export type ListingLeadUpdate = Partial<Omit<ListingLead, 'id' | 'listing_id' | 'buyer_id' | 'created_at'>>;

export interface PartnerLead {
  id: string;
  partner_profile_id: string;
  requester_id: string | null;
  requester_name: string;
  requester_email: string;
  requester_phone: string | null;
  message: string | null;
  listing_id: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'closed_lost' | 'closed_won';
  created_at: string;
  updated_at: string;
}

export interface PartnerLeadInsert extends Omit<PartnerLead, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
}

export type PartnerLeadUpdate = Partial<Omit<PartnerLead, 'id' | 'partner_profile_id' | 'created_at'>>;

// ============================================================================
// DATABASE TYPE (for Supabase client)
// ============================================================================
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      listings: {
        Row: Listing;
        Insert: ListingInsert;
        Update: ListingUpdate;
      };
      watchlist: {
        Row: Watchlist;
        Insert: WatchlistInsert;
        Update: never;
      };
      ndas: {
        Row: Nda;
        Insert: NdaInsert;
        Update: never;
      };
      deal_rooms: {
        Row: DealRoom;
        Insert: DealRoomInsert;
        Update: DealRoomUpdate;
      };
      deal_room_members: {
        Row: DealRoomMember;
        Insert: DealRoomMemberInsert;
        Update: never;
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: never;
      };
      offers: {
        Row: Offer;
        Insert: OfferInsert;
        Update: OfferUpdate;
      };
      nda_signatures: {
        Row: NdaSignature;
        Insert: NdaSignatureInsert;
        Update: never;
      };
      partner_profiles: {
        Row: PartnerProfile;
        Insert: PartnerProfileInsert;
        Update: PartnerProfileUpdate;
      };
      consultation_requests: {
        Row: ConsultationRequest;
        Insert: ConsultationRequestInsert;
        Update: ConsultationRequestUpdate;
      };
      listing_leads: {
        Row: ListingLead;
        Insert: ListingLeadInsert;
        Update: ListingLeadUpdate;
      };
      partner_leads: {
        Row: PartnerLead;
        Insert: PartnerLeadInsert;
        Update: PartnerLeadUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_deal_room_with_nda: {
        Args: {
          _listing_id: string;
          _buyer_id: string;
          _signed_pdf_url: string;
          _initial_message?: string | null;
        };
        Returns: string; // returns room_id
      };
    };
    Enums: Record<string, never>;
  };
}
