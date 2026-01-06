-- V17 Audit Events Table
-- Foundation for immutable audit trail of admin actions

-- ============================================================================
-- TABLE CREATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  actor_user_id uuid NULL,
  actor_role text NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NULL,
  summary text NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip inet NULL,
  user_agent text NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON public.audit_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON public.audit_events(action);
CREATE INDEX IF NOT EXISTS idx_audit_events_entity ON public.audit_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_actor_user_id ON public.audit_events(actor_user_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Policy: SELECT - Only admins can read audit events
-- Assumes: profiles table has columns: id (uuid), role (text)
-- Condition: User must have role = 'admin' in profiles table
CREATE POLICY "audit_events_select_admin_only"
  ON public.audit_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
  );

-- Policy: INSERT - Only admins can insert audit events
-- Same condition as SELECT
CREATE POLICY "audit_events_insert_admin_only"
  ON public.audit_events
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.audit_events IS 'Immutable audit trail of admin actions. Only admins can read/write.';
COMMENT ON COLUMN public.audit_events.actor_user_id IS 'User ID of the actor (from auth.users or profiles.id)';
COMMENT ON COLUMN public.audit_events.actor_role IS 'Role of the actor at time of action (e.g., admin)';
COMMENT ON COLUMN public.audit_events.action IS 'Action performed (e.g., listing.approve, user.suspend)';
COMMENT ON COLUMN public.audit_events.entity_type IS 'Type of entity affected (e.g., listing, user, nda, deal_room)';
COMMENT ON COLUMN public.audit_events.entity_id IS 'ID of the affected entity';
COMMENT ON COLUMN public.audit_events.summary IS 'Short human-readable summary of the action';
COMMENT ON COLUMN public.audit_events.metadata IS 'Additional context (JSONB, no PII)';
COMMENT ON COLUMN public.audit_events.ip IS 'IP address of the actor (optional)';
COMMENT ON COLUMN public.audit_events.user_agent IS 'User agent string (optional)';




