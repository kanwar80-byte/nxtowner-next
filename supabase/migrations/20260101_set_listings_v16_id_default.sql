-- Migration: Set listings_v16.id default to gen_random_uuid()
-- Date: 2026-01-01
-- Purpose: Make listings_v16.id auto-generated to fix TypeScript Insert type requirement

-- ============================================================================
-- Set default value for listings_v16.id column
-- ============================================================================

alter table public.listings_v16
alter column id set default gen_random_uuid();




