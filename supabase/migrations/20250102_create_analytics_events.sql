-- Analytics Events Table
-- Tracks user events for funnel analysis (valuation flow, etc.)

-- Create analytics_events table (idempotent)
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name text NOT NULL,
  props jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_created 
  ON public.analytics_events(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_analytics_events_name_created 
  ON public.analytics_events(event_name, created_at DESC);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Authenticated users can insert their own events
DROP POLICY IF EXISTS "Users can insert their own events" ON public.analytics_events;
CREATE POLICY "Users can insert their own events"
  ON public.analytics_events
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' 
    AND (user_id IS NULL OR user_id = auth.uid())
  );

-- Note: SELECT/UPDATE/DELETE policies omitted for now (admin access later)




