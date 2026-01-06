/**
 * V17 Moderation Rules & Detection Helpers
 * Pure functions for fraud detection (no DB writes)
 */

import { FRAUD_RULES, RISK_FLAGS } from '@/types/v17/moderation';

/**
 * Risk flag codes (from Phase 1 contract)
 */
export const RISK_FLAG_CODES = {
  ABNORMAL_PRICE_CHANGE: RISK_FLAGS.ABNORMAL_PRICE_CHANGE,
  DUPLICATE_PHONE: RISK_FLAGS.DUPLICATE_PHONE,
  KEYWORD_SPAM: RISK_FLAGS.KEYWORD_SPAM,
  FAKE_FINANCIALS: RISK_FLAGS.FAKE_FINANCIALS,
} as const;

/**
 * Detect price spike
 * Returns true if next > prev * 1.3 (30% increase) within same edit context
 * Note: This is a pure function - actual verification status check happens elsewhere
 */
export function detectPriceSpike(
  prevPrice: number | null,
  nextPrice: number | null
): boolean {
  if (!prevPrice || !nextPrice || prevPrice === 0) {
    return false;
  }

  // Check if next price is > 30% higher than previous (spike up)
  const threshold = prevPrice * (1 + FRAUD_RULES.PRICE_SPIKE_THRESHOLD_PCT / 100);
  return nextPrice > threshold;
}

/**
 * Detect keyword spam
 * Returns true if text contains repeated city names or competitor brands > threshold
 * Simple repetition threshold check
 */
export function detectKeywordSpam(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const lowerText = text.toLowerCase();
  
  // Common city names in Canada
  const cities = [
    'toronto', 'vancouver', 'montreal', 'calgary', 'edmonton',
    'ottawa', 'winnipeg', 'quebec', 'hamilton', 'kitchener',
  ];

  // Check for repeated city mentions
  for (const city of cities) {
    const regex = new RegExp(city, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > FRAUD_RULES.KEYWORD_SPAM_THRESHOLD) {
      return true;
    }
  }

  // Check for excessive repetition of any word (simple heuristic)
  const words = lowerText.split(/\s+/);
  const wordCounts: Record<string, number> = {};
  
  for (const word of words) {
    if (word.length > 3) { // Ignore short words
      wordCounts[word] = (wordCounts[word] || 0) + 1;
      if (wordCounts[word] > FRAUD_RULES.KEYWORD_SPAM_THRESHOLD) {
        return true;
      }
    }
  }

  return false;
}

