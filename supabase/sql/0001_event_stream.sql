-- V17 Event Stream Table
-- Foundation for Founder dashboard metrics + funnels

CREATE TABLE IF NOT EXISTS public.event_stream (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_name text NOT NULL,
  user_id uuid NULL,
  session_id uuid NOT NULL,
  path text NULL,
  referrer text NULL,
  listing_id uuid NULL,
  properties jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_event_stream_created_at ON public.event_stream(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_stream_event_name ON public.event_stream(event_name);
CREATE INDEX IF NOT EXISTS idx_event_stream_user_id ON public.event_stream(user_id);
CREATE INDEX IF NOT EXISTS idx_event_stream_session_id ON public.event_stream(session_id);
CREATE INDEX IF NOT EXISTS idx_event_stream_listing_id ON public.event_stream(listing_id);

-- Enable RLS
ALTER TABLE public.event_stream ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- INSERT: Only allow via service role (inserts happen from API route using service role)
-- SELECT: Deny by default (we'll add secure views later for Founder/Admin aggregates)
-- No public policies needed - all access via service role

COMMENT ON TABLE public.event_stream IS 'V17 event capture for analytics, funnels, and Founder dashboard metrics';
COMMENT ON COLUMN public.event_stream.session_id IS 'Browser session identifier (stored in httpOnly cookie)';
COMMENT ON COLUMN public.event_stream.properties IS 'Event-specific properties (JSONB, no PII)';




