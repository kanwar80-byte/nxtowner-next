-- Migration: Add AI and advanced fields to listings table
-- This migration adds new fields for AI trust, valuation, benchmarking, and deal room support

ALTER TABLE listings
ADD COLUMN is_ai_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN ai_summary_highlights TEXT,
ADD COLUMN ai_valuation_low NUMERIC,
ADD COLUMN ai_valuation_high NUMERIC,
ADD COLUMN margin_benchmark_score NUMERIC,
ADD COLUMN normalized_sde NUMERIC,
ADD COLUMN deal_timeline_checklist JSONB;
