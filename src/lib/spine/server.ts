import { createClient } from '@/lib/supabaseAdmin';
import { TABLES } from './constants';
import type { Profile } from './types';

const supabase = createClient();

export async function getOrCreateProfile(userId: string, defaults: Partial<Profile> = {}): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (data) return data;
  const { data: inserted, error: insertError } = await supabase.from('profiles').insert([{ id: userId, ...defaults }]).select('*').single();
  if (insertError) throw insertError;
  return inserted;
}

export async function requestNda({ listingId, buyerId }: { listingId: string; buyerId: string; }) {
  await supabase.from(TABLES.ndas).upsert({ listing_id: listingId, buyer_id: buyerId, status: 'requested' }, { onConflict: 'listing_id,buyer_id' });
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
  await supabase.from(TABLES.ndas).upsert({ listing_id: listingId, buyer_id: buyerId, status: 'signed', signed_at: new Date().toISOString() }, { onConflict: 'listing_id,buyer_id' });
  // Upsert deal_room
  const { data: dealRoom } = await supabase.from(TABLES.deal_rooms).upsert({ listing_id: listingId, buyer_id: buyerId, stage: 'deal_room', is_active: true, opened_at: new Date().toISOString() }, { onConflict: 'listing_id,buyer_id' }).select('id').single();
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
  await supabase.from(TABLES.events).insert({
    deal_room_id: dealRoomId,
    listing_id: listingId,
    actor_id: actorId,
    type,
    payload,
    created_at: new Date().toISOString(),
  });
}

export async function ensureScore(entityType: string, entityId: string, scoreKey: string, scope = 'private', initial = 0) {
  await supabase.from(TABLES.scores).upsert({
    entity_type: entityType,
    entity_id: entityId,
    scope,
    score_key: scoreKey,
    score_value: initial,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'entity_type,entity_id,scope,score_key' });
}
