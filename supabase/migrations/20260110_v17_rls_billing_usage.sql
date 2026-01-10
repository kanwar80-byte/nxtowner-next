-- ============================================================================
-- V17 RLS + Billing + Usage Events Migration
-- Date: 2026-01-10
-- Description: Creates billing/entitlements tables, usage_events table,
--              and applies strict RLS policies for deal tables and billing.
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SECTION A: CORE DEAL TABLES (Create if missing, preserve if exists)
-- ============================================================================

-- Deals table
CREATE TABLE IF NOT EXISTS public.deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  listing_id uuid NULL,
  status text NOT NULL DEFAULT 'discovery',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Deal documents table
CREATE TABLE IF NOT EXISTS public.deal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  doc_type text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_deal_documents_deal FOREIGN KEY (deal_id) 
    REFERENCES public.deals(id) ON DELETE CASCADE
);

-- Deal tasks table
CREATE TABLE IF NOT EXISTS public.deal_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  due_date date NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_deal_tasks_deal FOREIGN KEY (deal_id) 
    REFERENCES public.deals(id) ON DELETE CASCADE
);

-- Deal partners table
CREATE TABLE IF NOT EXISTS public.deal_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL,
  partner_id uuid NOT NULL,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_deal_partners_deal FOREIGN KEY (deal_id) 
    REFERENCES public.deals(id) ON DELETE CASCADE
);

-- ============================================================================
-- SECTION B: BILLING / ENTITLEMENTS TABLES
-- ============================================================================

-- User plans table
CREATE TABLE IF NOT EXISTS public.user_plans (
  user_id uuid PRIMARY KEY,
  plan text NOT NULL CHECK (plan IN ('FREE', 'PRO', 'ELITE')),
  active boolean NOT NULL DEFAULT true,
  current_period_start timestamptz NULL,
  current_period_end timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- User entitlements table
CREATE TABLE IF NOT EXISTS public.user_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entitlement text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_entitlements_user_entitlement UNIQUE (user_id, entitlement)
);

-- Supported entitlement values (documented, not enforced via enum):
-- - ai_preview_basic
-- - ai_fit_score_full
-- - ai_valuation_preview
-- - ai_compare
-- - deal_workspace
-- - nda_access
-- - partner_intro

-- ============================================================================
-- SECTION C: USAGE EVENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  event_name text NOT NULL,
  deal_id uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NULL
);

-- Note: metadata must NOT contain PII. Use for flags like {source:"ai_panel", action:"compare"}

-- ============================================================================
-- SECTION D: ROW LEVEL SECURITY (RLS) - ENABLE AND POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- DEALS TABLE POLICIES
-- ============================================================================

-- SELECT: Users can only see their own deals
CREATE POLICY "Users can view their own deals"
  ON public.deals FOR SELECT
  USING (user_id = auth.uid());

-- INSERT: Users can only create deals for themselves (enforce user_id = auth.uid())
CREATE POLICY "Users can insert their own deals"
  ON public.deals FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- UPDATE: Users can only update their own deals
CREATE POLICY "Users can update their own deals"
  ON public.deals FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE: Users can only delete their own deals
CREATE POLICY "Users can delete their own deals"
  ON public.deals FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- DEAL_DOCUMENTS TABLE POLICIES
-- ============================================================================

-- SELECT: Users can only see documents for deals they own
CREATE POLICY "Users can view documents for their own deals"
  ON public.deal_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_documents.deal_id
      AND deals.user_id = auth.uid()
    )
  );

-- INSERT: Users can only add documents to their own deals
CREATE POLICY "Users can insert documents for their own deals"
  ON public.deal_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_documents.deal_id
      AND deals.user_id = auth.uid()
    )
  );

-- UPDATE: Users can only update documents for their own deals
CREATE POLICY "Users can update documents for their own deals"
  ON public.deal_documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_documents.deal_id
      AND deals.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_documents.deal_id
      AND deals.user_id = auth.uid()
    )
  );

-- DELETE: Users can only delete documents for their own deals
CREATE POLICY "Users can delete documents for their own deals"
  ON public.deal_documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_documents.deal_id
      AND deals.user_id = auth.uid()
    )
  );

-- ============================================================================
-- DEAL_TASKS TABLE POLICIES
-- ============================================================================

-- SELECT: Users can only see tasks for deals they own
CREATE POLICY "Users can view tasks for their own deals"
  ON public.deal_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_tasks.deal_id
      AND deals.user_id = auth.uid()
    )
  );

-- INSERT: Users can only add tasks to their own deals
CREATE POLICY "Users can insert tasks for their own deals"
  ON public.deal_tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_tasks.deal_id
      AND deals.user_id = auth.uid()
    )
  );

-- UPDATE: Users can only update tasks for their own deals
CREATE POLICY "Users can update tasks for their own deals"
  ON public.deal_tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_tasks.deal_id
      AND deals.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_tasks.deal_id
      AND deals.user_id = auth.uid()
    )
  );

-- DELETE: Users can only delete tasks for their own deals
CREATE POLICY "Users can delete tasks for their own deals"
  ON public.deal_tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_tasks.deal_id
      AND deals.user_id = auth.uid()
    )
  );

-- ============================================================================
-- DEAL_PARTNERS TABLE POLICIES
-- ============================================================================

-- SELECT: Users can only see partners for deals they own
CREATE POLICY "Users can view partners for their own deals"
  ON public.deal_partners FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_partners.deal_id
      AND deals.user_id = auth.uid()
    )
  );

-- INSERT: Users can only add partners to their own deals
CREATE POLICY "Users can insert partners for their own deals"
  ON public.deal_partners FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_partners.deal_id
      AND deals.user_id = auth.uid()
    )
  );

-- UPDATE: Users can only update partners for their own deals
CREATE POLICY "Users can update partners for their own deals"
  ON public.deal_partners FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_partners.deal_id
      AND deals.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_partners.deal_id
      AND deals.user_id = auth.uid()
    )
  );

-- DELETE: Users can only delete partners for their own deals
CREATE POLICY "Users can delete partners for their own deals"
  ON public.deal_partners FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.deals
      WHERE deals.id = deal_partners.deal_id
      AND deals.user_id = auth.uid()
    )
  );

-- ============================================================================
-- USER_PLANS TABLE POLICIES
-- ============================================================================

-- SELECT: Users can only view their own plan
CREATE POLICY "Users can view their own plan"
  ON public.user_plans FOR SELECT
  USING (user_id = auth.uid());

-- Note: INSERT/UPDATE/DELETE on user_plans should be managed by service role
-- (e.g., via Stripe webhooks or admin operations). No policies are created
-- for these operations, effectively blocking normal users from modifying plans.

-- ============================================================================
-- USER_ENTITLEMENTS TABLE POLICIES
-- ============================================================================

-- SELECT: Users can only view their own entitlements
CREATE POLICY "Users can view their own entitlements"
  ON public.user_entitlements FOR SELECT
  USING (user_id = auth.uid());

-- Note: INSERT/UPDATE/DELETE on user_entitlements should be managed by service role
-- (e.g., automatically derived from user_plans or via admin operations).
-- No policies are created for these operations, effectively blocking normal users.

-- ============================================================================
-- USAGE_EVENTS TABLE POLICIES
-- ============================================================================

-- INSERT: Users can only insert events for themselves
CREATE POLICY "Users can insert their own usage events"
  ON public.usage_events FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- SELECT: Users can only view their own usage events
CREATE POLICY "Users can view their own usage events"
  ON public.usage_events FOR SELECT
  USING (user_id = auth.uid());

-- Note: UPDATE/DELETE on usage_events is blocked (no policies created).
-- Usage events are append-only for audit purposes.

-- ============================================================================
-- SECTION E: INDEXES FOR PERFORMANCE
-- ============================================================================

-- Deals indexes
CREATE INDEX IF NOT EXISTS idx_deals_user_id ON public.deals(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_listing_id ON public.deals(listing_id) WHERE listing_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON public.deals(created_at DESC);

-- Deal documents indexes
CREATE INDEX IF NOT EXISTS idx_deal_documents_deal_id ON public.deal_documents(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_documents_doc_type ON public.deal_documents(doc_type) WHERE doc_type IS NOT NULL;

-- Deal tasks indexes
CREATE INDEX IF NOT EXISTS idx_deal_tasks_deal_id ON public.deal_tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_tasks_status ON public.deal_tasks(status);
CREATE INDEX IF NOT EXISTS idx_deal_tasks_due_date ON public.deal_tasks(due_date) WHERE due_date IS NOT NULL;

-- Deal partners indexes
CREATE INDEX IF NOT EXISTS idx_deal_partners_deal_id ON public.deal_partners(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_partners_partner_id ON public.deal_partners(partner_id);
CREATE INDEX IF NOT EXISTS idx_deal_partners_status ON public.deal_partners(status);

-- User plans indexes
CREATE INDEX IF NOT EXISTS idx_user_plans_active ON public.user_plans(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_user_plans_plan ON public.user_plans(plan);

-- User entitlements indexes
CREATE INDEX IF NOT EXISTS idx_user_entitlements_user_id ON public.user_entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_entitlements_entitlement ON public.user_entitlements(entitlement);
CREATE INDEX IF NOT EXISTS idx_user_entitlements_enabled ON public.user_entitlements(enabled) WHERE enabled = true;

-- Usage events indexes
CREATE INDEX IF NOT EXISTS idx_usage_events_user_id_created_at ON public.usage_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_events_event_name ON public.usage_events(event_name);
CREATE INDEX IF NOT EXISTS idx_usage_events_deal_id ON public.usage_events(deal_id) WHERE deal_id IS NOT NULL;

-- ============================================================================
-- SECTION F: STORAGE POLICIES FOR DEAL DOCUMENTS
-- ============================================================================

-- Note: Supabase Storage policies are typically created via SQL on storage.objects.
-- The bucket 'deal-docs' should be created in the Supabase dashboard first.
-- Then run the following SQL in the Supabase SQL Editor:

/*
-- Create the deal-docs bucket if it doesn't exist (run in SQL Editor)
-- Note: Bucket creation is usually done via Dashboard or API, but you can try:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('deal-docs', 'deal-docs', false, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- Policy: Users can read files in their own user folder
CREATE POLICY "Users can read their own deal documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'deal-docs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can upload files to their own user folder
CREATE POLICY "Users can upload their own deal documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'deal-docs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can update files in their own user folder
CREATE POLICY "Users can update their own deal documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'deal-docs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'deal-docs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete files in their own user folder
CREATE POLICY "Users can delete their own deal documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'deal-docs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Expected path structure: {userId}/{dealId}/{filename}
-- Example: 550e8400-e29b-41d4-a716-446655440000/123e4567-e89b-12d3-a456-426614174000/document.pdf
*/

-- ============================================================================
-- SECTION G: SEED EXAMPLES (Commented out - for reference only)
-- ============================================================================

/*
-- Example: FREE plan entitlements
-- INSERT INTO public.user_plans (user_id, plan, active)
-- VALUES ('00000000-0000-0000-0000-000000000001', 'FREE', true);

-- INSERT INTO public.user_entitlements (user_id, entitlement, enabled)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000001', 'ai_preview_basic', true);

-- Example: PRO plan entitlements
-- INSERT INTO public.user_plans (user_id, plan, active, current_period_start, current_period_end)
-- VALUES (
--   '00000000-0000-0000-0000-000000000002', 
--   'PRO', 
--   true,
--   now(),
--   now() + interval '30 days'
-- );

-- INSERT INTO public.user_entitlements (user_id, entitlement, enabled)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000002', 'ai_preview_basic', true),
--   ('00000000-0000-0000-0000-000000000002', 'ai_fit_score_full', true),
--   ('00000000-0000-0000-0000-000000000002', 'ai_valuation_preview', true),
--   ('00000000-0000-0000-0000-000000000002', 'ai_compare', true),
--   ('00000000-0000-0000-0000-000000000002', 'deal_workspace', true),
--   ('00000000-0000-0000-0000-000000000002', 'nda_access', true);

-- Example: ELITE plan entitlements
-- INSERT INTO public.user_plans (user_id, plan, active, current_period_start, current_period_end)
-- VALUES (
--   '00000000-0000-0000-0000-000000000003', 
--   'ELITE', 
--   true,
--   now(),
--   now() + interval '30 days'
-- );

-- INSERT INTO public.user_entitlements (user_id, entitlement, enabled)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000003', 'ai_preview_basic', true),
--   ('00000000-0000-0000-0000-000000000003', 'ai_fit_score_full', true),
--   ('00000000-0000-0000-0000-000000000003', 'ai_valuation_preview', true),
--   ('00000000-0000-0000-0000-000000000003', 'ai_compare', true),
--   ('00000000-0000-0000-0000-000000000003', 'deal_workspace', true),
--   ('00000000-0000-0000-0000-000000000003', 'nda_access', true),
--   ('00000000-0000-0000-0000-000000000003', 'partner_intro', true);
*/

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Summary:
-- ✅ Created deal tables (if missing)
-- ✅ Created billing tables (user_plans, user_entitlements)
-- ✅ Created usage_events table
-- ✅ Enabled RLS on all tables
-- ✅ Applied strict owner-only RLS policies
-- ✅ Created performance indexes
-- ✅ Documented storage policies (run separately in SQL Editor)
-- ✅ Provided seed examples (commented out)
