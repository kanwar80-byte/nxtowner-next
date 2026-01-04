/**
 * Lightweight saved listings management using localStorage.
 * No DB dependency - works immediately for buyer onboarding.
 */

const STORAGE_KEY = 'nx_saved_listings';

export function getSavedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function isSaved(listingId: string): boolean {
  const ids = getSavedIds();
  return ids.includes(listingId);
}

export function toggleSaved(listingId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const ids = getSavedIds();
    const index = ids.indexOf(listingId);
    let newIds: string[];
    let isNowSaved: boolean;

    if (index >= 0) {
      // Remove
      newIds = ids.filter(id => id !== listingId);
      isNowSaved = false;
    } else {
      // Add
      newIds = [...ids, listingId];
      isNowSaved = true;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
    return isNowSaved;
  } catch {
    return false;
  }
}

export function getSavedCount(): number {
  return getSavedIds().length;
}


