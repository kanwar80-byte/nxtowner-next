'use server';

import { createClient } from '@/utils/supabase/server';
import { requireAuth } from '@/lib/auth';
import { VALUATION_STEPS, getStepIndex } from './config';

/**
 * Save valuation progress to database
 * Upserts by user_id for cross-device persistence
 */
export async function saveValuationProgress(
  stepId: string,
  track?: 'operational' | 'digital',
  data?: Record<string, any>
) {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Calculate step_index from stepId
    const stepIndex = getStepIndex(stepId);
    const safeStepIndex = stepIndex >= 0 ? stepIndex : 0;

    // Extract intent from data if present
    const intent = data?.intent && typeof data.intent === 'string' ? data.intent : null;

    // Prepare input JSON with all wizard state
    const inputData: Record<string, any> = {
      step_index: safeStepIndex,
      step_id: stepId,
      ...(data && typeof data === 'object' ? data : {}),
    };
    if (intent) inputData.intent = intent;
    if (track) inputData.track = track;

    // Upsert valuation record (one per user)
    // Store wizard state in input JSON column
    const { error } = await supabase
      .from('valuations')
      .upsert({
        user_id: user.id,
        type: 'wizard_progress',
        input: inputData,
      }, {
        onConflict: 'user_id',
      });

    if (error) {
      // Log error but don't throw (client will use localStorage fallback)
      console.warn('Could not save valuation to DB:', error.message);
      throw error;
    }
  } catch (err) {
    // Silent fail - client will use localStorage fallback
    console.warn('Server save failed, client will use localStorage');
    throw err;
  }
}

/**
 * Load valuation progress from database
 * Returns null if not found or on error
 */
export async function loadValuationProgress(): Promise<{
  valuationId?: string | null;
  currentStep: string | null;
  track: 'operational' | 'digital' | null;
  stepData: Record<string, any>;
  readinessScore?: number | null;
} | null> {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Fetch most recent valuation (by created_at) for user
    const { data, error } = await supabase
      .from('valuations')
      .select('id, input, result')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      // PGRST116 = no rows found (expected for new users)
      if (error.code === 'PGRST116') {
        return null;
      }
      console.warn('Could not load valuation from DB:', error.message);
      return null;
    }

    if (!data) {
      return null;
    }

    // Extract wizard state from input JSON
    const input = data.input && typeof data.input === 'object' && !Array.isArray(data.input)
      ? data.input as Record<string, any>
      : {};
    
    // Extract step_index or step_id from input
    const stepIndex = typeof input.step_index === 'number' 
      ? input.step_index 
      : input.step_id 
        ? getStepIndex(input.step_id)
        : 0;
    const step = VALUATION_STEPS[stepIndex];
    const currentStepId = step?.id || input.step_id || 'intent';

    // Extract track from input
    const track = input.track === 'operational' || input.track === 'digital' 
      ? input.track 
      : null;

    // Extract readiness_score from result JSON (or input as fallback)
    const result = data.result && typeof data.result === 'object' && !Array.isArray(data.result)
      ? data.result as Record<string, any>
      : {};
    const readinessScore = typeof result.readiness_score === 'number'
      ? result.readiness_score
      : typeof input.readiness_score === 'number'
        ? input.readiness_score
        : null;

    // Build stepData from input (excluding internal fields)
    const stepData: Record<string, any> = { ...input };
    delete stepData.step_index;
    delete stepData.step_id;
    delete stepData.readiness_score;

    return {
      valuationId: data.id || null,
      currentStep: currentStepId,
      track: track,
      stepData: stepData,
      readinessScore: readinessScore,
    };
  } catch (err) {
    console.warn('Server load failed:', err);
    return null;
  }
}

/**
 * Save readiness score to valuation record
 */
export async function saveReadinessScore(score: number): Promise<void> {
  try {
    const user = await requireAuth();
    const supabase = await createClient();

    // Get existing result JSON or create new one
    const { data: existing } = await supabase
      .from('valuations')
      .select('result')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const existingResult = existing?.result && typeof existing.result === 'object' && !Array.isArray(existing.result)
      ? existing.result as Record<string, any>
      : {};

    const { error } = await supabase
      .from('valuations')
      .update({
        result: {
          ...existingResult,
          readiness_score: score,
        },
      })
      .eq('user_id', user.id);

    if (error) {
      console.warn('Could not save readiness score:', error.message);
    }
  } catch (err) {
    console.warn('Server save readiness score failed:', err);
  }
}
