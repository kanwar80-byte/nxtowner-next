/**
 * V17 Canonical Admin Moderation & Fraud Types
 */

/**
 * Moderation Subject Type
 */
export type ModerationSubjectType = 'listing' | 'profile' | 'lead' | 'nda';

/**
 * Moderation Case Status
 */
export type ModerationCaseStatus = 'open' | 'investigating' | 'resolved' | 'dismissed';

/**
 * Moderation Case Entity
 */
export interface ModerationCase {
  id: string; // uuid pk
  subject_type: ModerationSubjectType;
  subject_id: string; // uuid
  status: ModerationCaseStatus;
  reason_codes: string[]; // e.g. ['fake_numbers','spam','impersonation']
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Risk Flag Severity
 */
export type RiskFlagSeverity = 'low' | 'medium' | 'high';

/**
 * Risk Flag Entity (system generated)
 */
export interface RiskFlag {
  listing_id: string; // uuid
  flags: string[]; // e.g. ['abnormal_price_change','duplicate_phone','keyword_spam']
  severity: RiskFlagSeverity;
  created_at: string;
}

/**
 * Fraud Rule Trigger Conditions
 */
export const FRAUD_RULES = {
  /**
   * Price spike rule:
   * if asking_price changes > 30% within 24h AND listing not verified => flag 'abnormal_price_change'
   */
  PRICE_SPIKE_THRESHOLD_PCT: 30,
  PRICE_SPIKE_TIME_WINDOW_HOURS: 24,
  PRICE_SPIKE_FLAG: 'abnormal_price_change',

  /**
   * Keyword spam rule:
   * if title/description contains repeated city names or competitor brands > threshold => flag 'keyword_spam'
   */
  KEYWORD_SPAM_THRESHOLD: 3, // repeated occurrences
  KEYWORD_SPAM_FLAG: 'keyword_spam',

  /**
   * Duplicate contact rule:
   * if same phone/email used across >2 profiles => flag 'duplicate_contact'
   */
  DUPLICATE_CONTACT_THRESHOLD: 2,
  DUPLICATE_CONTACT_FLAG: 'duplicate_contact',

  /**
   * Fake financials rule:
   * if annual_revenue present but no docs_uploaded_count and seller claims verified => block "verified" toggles; flag
   */
  FAKE_FINANCIALS_FLAG: 'fake_financials',
} as const;

/**
 * Enforcement Actions (admin)
 */
export type EnforcementAction =
  | 'soft_hide_listing' // removes from search
  | 'require_reverification' // sets verification_status='pending'
  | 'suspend_profile'
  | 'block_ip'; // optional if tracked

/**
 * Common Reason Codes
 */
export const REASON_CODES = {
  FAKE_NUMBERS: 'fake_numbers',
  SPAM: 'spam',
  IMPERSONATION: 'impersonation',
  ABNORMAL_PRICE_CHANGE: 'abnormal_price_change',
  KEYWORD_SPAM: 'keyword_spam',
  DUPLICATE_CONTACT: 'duplicate_contact',
  FAKE_FINANCIALS: 'fake_financials',
} as const;

/**
 * Common Risk Flags
 */
export const RISK_FLAGS = {
  ABNORMAL_PRICE_CHANGE: 'abnormal_price_change',
  DUPLICATE_PHONE: 'duplicate_phone',
  KEYWORD_SPAM: 'keyword_spam',
  FAKE_FINANCIALS: 'fake_financials',
} as const;


