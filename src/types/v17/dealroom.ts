/**
 * V17 Canonical Deal Room + NDA Types
 */

/**
 * NDA Status
 */
export type NDAStatus = 'requested' | 'signed' | 'rejected' | 'expired';

/**
 * NDA Entity
 */
export interface NDA {
  id: string; // uuid pk
  listing_id: string; // uuid fk
  buyer_profile_id: string; // uuid fk
  seller_profile_id: string; // uuid fk
  status: NDAStatus;
  signed_at: string | null; // timestamptz null
  created_at: string;
  updated_at: string;
}

/**
 * Deal Room Entity
 */
export interface DealRoom {
  id: string; // uuid pk
  listing_id: string; // uuid fk
  seller_profile_id: string; // uuid fk
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Document Type
 */
export type DocumentType =
  | 'financials'
  | 'lease'
  | 'fuel'
  | 'licenses'
  | 'environmental'
  | 'other';

/**
 * Document Visibility
 */
export type DocumentVisibility = 'nda_required' | 'seller_only' | 'buyer_post_nda';

/**
 * Deal Room Document Entity
 */
export interface DealRoomDocument {
  id: string; // uuid pk
  deal_room_id: string; // uuid fk
  file_path: string; // Supabase Storage path
  doc_type: DocumentType;
  visibility: DocumentVisibility;
  created_at: string;
  updated_at: string;
}

/**
 * Deal Room Activity Event Type
 */
export type DealRoomActivityType =
  | 'opened'
  | 'doc_viewed'
  | 'doc_downloaded'
  | 'message_sent';

/**
 * Deal Room Activity Entity
 */
export interface DealRoomActivity {
  id: string; // uuid pk
  deal_room_id: string; // uuid fk
  actor_profile_id: string; // uuid fk
  event_type: DealRoomActivityType;
  meta: Record<string, unknown>; // jsonb
  created_at: string;
}


