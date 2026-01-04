'use server';

import { computeConfidence, ConfidenceSummary } from '@/lib/founder/confidence';

export async function getConfidence(): Promise<ConfidenceSummary> {
  return await computeConfidence();
}


