import { z } from 'zod';

/**
 * API Request Validation Schemas
 * Used for runtime validation of API route inputs
 */

// ============================================================================
// Valuation API Schema
// ============================================================================

export const ValuationRequestSchema = z.object({
  asset_type: z.string().min(1, 'Asset type is required'),
  location: z.string().min(1, 'Location is required'),
  annual_revenue: z.number().positive('Annual revenue must be positive'),
  annual_profit: z.number().min(0, 'Annual profit cannot be negative'),
  asking_price: z.number().positive('Asking price must be positive').optional(),
  years_in_operation: z.number().int().min(0, 'Years in operation cannot be negative'),
  key_highlights: z.string().min(1, 'Key highlights are required'),
  risk_flags: z.string().optional(),
});

export type ValuationRequest = z.infer<typeof ValuationRequestSchema>;

// ============================================================================
// V17 AI Search API Schema
// ============================================================================

export const V17AISearchRequestSchema = z.object({
  query: z.string().min(1, 'Query is required'),
});

export type V17AISearchRequest = z.infer<typeof V17AISearchRequestSchema>;

// ============================================================================
// AI Search Listings API Schema
// ============================================================================

export const AISearchListingsRequestSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  mode: z.enum(['operational', 'digital']).optional(),
  location: z.string().optional(),
});

export type AISearchListingsRequest = z.infer<typeof AISearchListingsRequestSchema>;

// ============================================================================
// Events API Schema
// ============================================================================

export const EventsRequestSchema = z.object({
  event_name: z.string().min(1, 'Event name is required'),
  path: z.string().optional(),
  referrer: z.string().optional(),
  listing_id: z.string().uuid('Listing ID must be a valid UUID').optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
});

export type EventsRequest = z.infer<typeof EventsRequestSchema>;

// ============================================================================
// NDA Sign API Schema
// ============================================================================

export const NDASignRequestSchema = z.object({
  listingId: z.string().uuid('Listing ID must be a valid UUID'),
});

export type NDASignRequest = z.infer<typeof NDASignRequestSchema>;


