import { createClient } from '@/lib/supabaseAdmin';
import { TABLES } from './constants';
import type { Profile } from './types';

const supabase = createClient();

export async function getOrCreateProfile(userId: string, defaults: Partial<Profile> = {}): Promise<Profile> {
  const { data, error } = await (supabase as any).from('profiles').select('*').eq('id', userId).single();
  if (data) return data;
  const { data: inserted, error: insertError } = await (supabase as any).from('profiles').upsert([{ id: userId, ...defaults }], { onConflict: 'id' }).select('*').single();
  if (insertError) throw insertError;
  return inserted;
}

export async function requestNda({ listingId, buyerId }: { listingId: string; buyerId: string; }) {
  await (supabase as any).from(TABLES.ndas).upsert({ listing_id: listingId, buyer_id: buyerId, status: 'requested' }, { onConflict: 'listing_id,buyer_id' });
  
  // Fetch seller_id from listing (owner_id)
  const { data: listing } = await (supabase as any).from('listings_v16').select('owner_id').eq('id', listingId).single();
  const sellerId = listing?.owner_id;
  
  if (!sellerId) {
    throw new Error(`Could not find seller_id for listing ${listingId}`);
  }
  
  // Create deal_room with status 'nda_requested' when NDA is requested
  // NOTE: deal_rooms.status must match DB constraint: ('draft','nda_requested','nda_signed','active','closed')
  // Required columns: listing_id, buyer_id, seller_id (NOT NULL), created_by (NOT NULL), status
  await (supabase as any).from(TABLES.deal_rooms).upsert({ 
    listing_id: listingId, 
    buyer_id: buyerId,
    seller_id: sellerId,
    created_by: buyerId,
    status: 'nda_requested'  // Use status column (not stage/is_active) per DB constraint
  }, { onConflict: 'listing_id,buyer_id' });
  
  await emitEvent({
    dealRoomId: null,
    listingId,
    actorId: buyerId,
    type: 'nda_requested',
    payload: {},
  });
}

export async function signNdaAndCreateDealRoom({ listingId, buyerId }: { listingId: string; buyerId: string; }) {
  // Set NDA signed
  await (supabase as any).from(TABLES.ndas).upsert({ listing_id: listingId, buyer_id: buyerId, status: 'signed', signed_at: new Date().toISOString() }, { onConflict: 'listing_id,buyer_id' });
  
  // Fetch seller_id from listing (owner_id)
  const { data: listing } = await (supabase as any).from('listings_v16').select('owner_id').eq('id', listingId).single();
  const sellerId = listing?.owner_id;
  
  if (!sellerId) {
    throw new Error(`Could not find seller_id for listing ${listingId}`);
  }
  
  // Upsert deal_room
  // NOTE: deal_rooms.status must match DB constraint: ('draft','nda_requested','nda_signed','active','closed')
  // Required columns: listing_id, buyer_id, seller_id (NOT NULL), created_by (NOT NULL), status
  const { data: dealRoom } = await (supabase as any).from(TABLES.deal_rooms).upsert({ 
    listing_id: listingId, 
    buyer_id: buyerId,
    seller_id: sellerId,
    created_by: buyerId,
    status: 'nda_signed'  // Use status column (not stage/is_active) per DB constraint
  }, { onConflict: 'listing_id,buyer_id' }).select('id').single();
  
  // Emit events
  await emitEvent({
    dealRoomId: dealRoom?.id,
    listingId,
    actorId: buyerId,
    type: 'nda_signed',
    payload: {},
  });
  await emitEvent({
    dealRoomId: dealRoom?.id,
    listingId,
    actorId: buyerId,
    type: 'deal_room_created',
    payload: {},
  });
  return dealRoom?.id;
}

export async function emitEvent({ dealRoomId, listingId, actorId, type, payload }: { dealRoomId: string | null, listingId: string, actorId: string, type: string, payload: Record<string, any> }) {
  await (supabase as any).from(TABLES.events).insert({
    deal_room_id: dealRoomId,
    listing_id: listingId,
    actor_id: actorId,
    type,
    payload,
    created_at: new Date().toISOString(),
  });
}

export async function ensureScore(entityType: string, entityId: string, scoreKey: string, scope = 'private', initial = 0) {
  await (supabase as any).from(TABLES.scores).upsert({
    entity_type: entityType,
    entity_id: entityId,
    scope,
    score_key: scoreKey,
    score_value: initial,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'entity_type,entity_id,scope,score_key' });
}
