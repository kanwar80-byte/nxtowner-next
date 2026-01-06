-- Analytics Daily Aggregate Tables
-- These tables store pre-computed daily aggregates from event_stream and core tables
-- to make Founder dashboards fast and cost-effective.

-- ============================================================================
-- 1. analytics_daily: Core daily metrics
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.analytics_daily (
  day DATE PRIMARY KEY,
  visitors INT NOT NULL DEFAULT 0,
  sessions INT NOT NULL DEFAULT 0,
  page_views INT NOT NULL DEFAULT 0,
  listing_views INT NOT NULL DEFAULT 0,
  registrations INT NOT NULL DEFAULT 0,
  nda_requested INT NOT NULL DEFAULT 0,
  nda_signed INT NOT NULL DEFAULT 0,
  enquiries INT NOT NULL DEFAULT 0,
  deal_rooms_created INT NOT NULL DEFAULT 0,
  messages_sent INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_daily_day_desc ON public.analytics_daily(day DESC);

-- ============================================================================
-- 2. analytics_funnel_daily: Funnel step counts by day
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.analytics_funnel_daily (
  day DATE NOT NULL,
  step TEXT NOT NULL,
  count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (day, step)
);

CREATE INDEX IF NOT EXISTS idx_analytics_funnel_daily_day_desc ON public.analytics_funnel_daily(day DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_funnel_daily_day_step ON public.analytics_funnel_daily(day, step);

-- ============================================================================
-- 3. analytics_feature_daily: Feature usage counts by day
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.analytics_feature_daily (
  day DATE NOT NULL,
  feature TEXT NOT NULL,
  count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (day, feature)
);

CREATE INDEX IF NOT EXISTS idx_analytics_feature_daily_day_desc ON public.analytics_feature_daily(day DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_feature_daily_day_feature ON public.analytics_feature_daily(day, feature);

-- ============================================================================
-- 4. analytics_revenue_daily: Revenue metrics by day
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.analytics_revenue_daily (
  day DATE PRIMARY KEY,
  paid_users INT NULL,
  mrr NUMERIC(12, 2) NULL,
  arr NUMERIC(12, 2) NULL,
  upgrades_revenue NUMERIC(12, 2) NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_revenue_daily_day_desc ON public.analytics_revenue_daily(day DESC);

-- ============================================================================
-- RLS Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_funnel_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_feature_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_revenue_daily ENABLE ROW LEVEL SECURITY;

-- SELECT: Allow admin/founder roles
CREATE POLICY "analytics_daily_select_admin_founder"
  ON public.analytics_daily
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.role = 'founder')
    )
  );

CREATE POLICY "analytics_funnel_daily_select_admin_founder"
  ON public.analytics_funnel_daily
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.role = 'founder')
    )
  );

CREATE POLICY "analytics_feature_daily_select_admin_founder"
  ON public.analytics_feature_daily
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.role = 'founder')
    )
  );

CREATE POLICY "analytics_revenue_daily_select_admin_founder"
  ON public.analytics_revenue_daily
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.role = 'founder')
    )
  );

-- INSERT/UPDATE: Allow service role only (cron job uses service role)
-- Note: Service role bypasses RLS, so we don't need explicit policies for INSERT/UPDATE
-- But we add them for clarity and future-proofing

CREATE POLICY "analytics_daily_insert_service_role"
  ON public.analytics_daily
  FOR INSERT
  WITH CHECK (true); -- Service role bypasses RLS, this is a placeholder

CREATE POLICY "analytics_daily_update_service_role"
  ON public.analytics_daily
  FOR UPDATE
  USING (true)
  WITH CHECK (true); -- Service role bypasses RLS, this is a placeholder

CREATE POLICY "analytics_funnel_daily_insert_service_role"
  ON public.analytics_funnel_daily
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "analytics_funnel_daily_update_service_role"
  ON public.analytics_funnel_daily
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "analytics_feature_daily_insert_service_role"
  ON public.analytics_feature_daily
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "analytics_feature_daily_update_service_role"
  ON public.analytics_feature_daily
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "analytics_revenue_daily_insert_service_role"
  ON public.analytics_revenue_daily
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "analytics_revenue_daily_update_service_role"
  ON public.analytics_revenue_daily
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- Helper function to update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_analytics_daily_updated_at
  BEFORE UPDATE ON public.analytics_daily
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_funnel_daily_updated_at
  BEFORE UPDATE ON public.analytics_funnel_daily
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_feature_daily_updated_at
  BEFORE UPDATE ON public.analytics_feature_daily
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_revenue_daily_updated_at
  BEFORE UPDATE ON public.analytics_revenue_daily
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();




