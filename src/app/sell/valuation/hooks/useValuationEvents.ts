'use client';

import { useEffect, useRef } from 'react';
import { logEvent } from '@/app/actions/analytics';
import { getStepIndex } from '../config';
import type { TrackType } from '../config';

interface UseValuationEventsProps {
  isAuthenticated: boolean;
  isInitialized: boolean;
  currentStepId: string;
  track: TrackType | null;
  stepData: Record<string, unknown>;
  readinessScore?: number | null;
  valuationId?: string | null;
}

/**
 * Valuation funnel event tracking hook
 * Fires events with anti-spam guards
 */
export function useValuationEvents({
  isAuthenticated,
  isInitialized,
  currentStepId,
  track,
  stepData,
  readinessScore,
  valuationId,
}: UseValuationEventsProps) {
  // Anti-spam guards
  const hasFiredStartedRef = useRef<boolean>(false);
  const previousStepIdRef = useRef<string | null>(null);
  const hasFiredCompletedRef = useRef<boolean>(false);

  // A) valuation_started - Fire once per valuation_id (persisted across refreshes)
  useEffect(() => {
    if (!isAuthenticated || !isInitialized || hasFiredStartedRef.current) {
      return;
    }

    // SSR-safe: only check localStorage in client
    if (typeof window === 'undefined') {
      return;
    }

    // If valuation_id is known, check localStorage for de-duplication
    if (valuationId) {
      const storageKey = `nx_val_started_${valuationId}`;
      const hasLogged = localStorage.getItem(storageKey);
      
      if (hasLogged) {
        // Already logged for this valuation_id, skip
        hasFiredStartedRef.current = true;
        return;
      }

      // Log event and mark as logged
      hasFiredStartedRef.current = true;
      logEvent(
        'valuation_started',
        {
          has_existing_data: Boolean(stepData && Object.keys(stepData).length > 0),
        },
        {
          valuation_id: valuationId,
          step_id: currentStepId,
          step_index: getStepIndex(currentStepId),
          track: track || null,
        }
      )
        .then(() => {
          // Mark as logged in localStorage after successful log
          try {
            localStorage.setItem(storageKey, '1');
          } catch {
            // localStorage write failed, ignore
          }
        })
        .catch(() => {
          // Swallow errors - analytics should never break UI
        });
    } else {
      // valuation_id not yet known, wait for it
      // (This will re-trigger when valuationId becomes available)
      hasFiredStartedRef.current = false;
    }
  }, [isAuthenticated, isInitialized, valuationId, currentStepId, track, stepData]);

  // B) valuation_step_viewed - Fire only when step_id changes
  useEffect(() => {
    if (!isAuthenticated || !isInitialized) {
      return;
    }

    const previousStepId = previousStepIdRef.current;
    
    // Only fire if step actually changed (not on initial render)
    if (previousStepId !== null && previousStepId !== currentStepId) {
      logEvent(
        'valuation_step_viewed',
        {
          previous_step_id: previousStepId,
        },
        {
          valuation_id: valuationId || null,
          step_id: currentStepId,
          step_index: getStepIndex(currentStepId),
          track: track || null,
        }
      ).catch(() => {
        // Swallow errors
      });
    }

    // Update ref for next comparison
    previousStepIdRef.current = currentStepId;
  }, [isAuthenticated, isInitialized, currentStepId, track, valuationId]);

  // Expose function to fire step_completed event (called from navigateNext)
  const fireStepCompleted = (nextStepId: string | null) => {
    if (!isAuthenticated) return;

    logEvent(
      'valuation_step_completed',
      {
        next_step_id: nextStepId,
      },
      {
        valuation_id: valuationId || null,
        step_id: currentStepId,
        step_index: getStepIndex(currentStepId),
        track: track || null,
      }
    ).catch(() => {
      // Swallow errors
    });
  };

  // Expose function to fire completed event (called from next_actions step)
  const fireCompleted = () => {
    if (!isAuthenticated || hasFiredCompletedRef.current) {
      return;
    }

    hasFiredCompletedRef.current = true;
    logEvent(
      'valuation_completed',
      {
        readiness_score: readinessScore || null,
        final_step_id: currentStepId,
      },
      {
        valuation_id: valuationId || null,
        track: track || null,
        step_id: currentStepId,
        step_index: getStepIndex(currentStepId),
      }
    ).catch(() => {
      // Swallow errors
    });
  };

  return {
    fireStepCompleted,
    fireCompleted,
  };
}

