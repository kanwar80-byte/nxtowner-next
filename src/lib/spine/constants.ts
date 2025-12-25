export const ASSET_TYPES = [
  'operational',
  'digital',
] as const;

export const DEAL_STAGES = [
  'discover',
  'interest',
  'nda',
  'deal_room',
  'due_diligence',
  'negotiation',
  'closing',
  'post_close',
] as const;

export const LISTING_STATUS = [
  'draft',
  'published',
  'paused',
  'archived',
] as const;

export const NDA_STATUS = [
  'requested',
  'signed',
  'revoked',
] as const;

// Table names (current source of truth)
export const TABLES = {
  listings: 'listings',
  listing_details: 'v16_listing_details',
  deal_rooms: 'v16_deal_rooms',
  ndas: 'v16_ndas',
  events: 'v16_events',
  scores: 'v16_scores',
};

export function isOperational(asset_type: string): boolean {
  return asset_type === 'operational';
}

export function isDigital(asset_type: string): boolean {
  return asset_type === 'digital';
}
