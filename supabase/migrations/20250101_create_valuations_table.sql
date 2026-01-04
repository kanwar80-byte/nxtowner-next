-- Valuation Flow Persistence
-- Stores user valuation progress for cross-device resume

-- Create valuations table (idempotent)
CREATE TABLE IF NOT EXISTS public.valuations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  intent text,
  track text CHECK (track IN ('operational','digital')), -- nullable until selected
  step_index integer NOT NULL DEFAULT 0,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  readiness_score integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- If table exists with old asset_type enum, migrate to text CHECK
DO $$
BEGIN
  -- Check if track column exists and is of type asset_type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'valuations' 
    AND column_name = 'track'
    AND data_type = 'USER-DEFINED'
  ) THEN
    -- Convert asset_type enum to text with CHECK constraint
    ALTER TABLE public.valuations 
      ALTER COLUMN track TYPE text USING track::text;
    
    -- Add CHECK constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'valuations_track_check'
    ) THEN
      ALTER TABLE public.valuations 
        ADD CONSTRAINT valuations_track_check 
        CHECK (track IN ('operational','digital'));
    END IF;
  END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_valuations_user_id ON public.valuations(user_id);
CREATE INDEX IF NOT EXISTS idx_valuations_updated_at ON public.valuations(updated_at);

-- Enable RLS
ALTER TABLE public.valuations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read only their own valuation (idempotent)
DROP POLICY IF EXISTS "Users can read their own valuation" ON public.valuations;
CREATE POLICY "Users can read their own valuation"
  ON public.valuations
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own valuation (idempotent)
DROP POLICY IF EXISTS "Users can insert their own valuation" ON public.valuations;
CREATE POLICY "Users can insert their own valuation"
  ON public.valuations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own valuation (idempotent)
DROP POLICY IF EXISTS "Users can update their own valuation" ON public.valuations;
CREATE POLICY "Users can update their own valuation"
  ON public.valuations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own valuation (idempotent)
DROP POLICY IF EXISTS "Users can delete their own valuation" ON public.valuations;
CREATE POLICY "Users can delete their own valuation"
  ON public.valuations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_valuations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_valuations_updated_at
  BEFORE UPDATE ON public.valuations
  FOR EACH ROW
  EXECUTE FUNCTION update_valuations_updated_at();

