"use server";

import { revalidatePath } from "next/cache";

// --- MOCK DATABASE (Persists while server is running) ---
const mockDb: Record<string, { ndaSigned: boolean; loiSubmitted: boolean }> = {};

/**
 * Gets the current deal state (NDA/LOI status)
 */
export async function getDealState(dealId: string) {
  // Return existing state or default to false
  return mockDb[dealId] || { ndaSigned: false, loiSubmitted: false };
}

/**
 * Signs the NDA and updates the "Database"
 */
export async function signNDA(dealId: string) {
  console.log(`[Server] Signing NDA for deal ${dealId}`);
  
  // Get current state or default
  const current = mockDb[dealId] || { ndaSigned: false, loiSubmitted: false };

  // Update state to SIGNED
  mockDb[dealId] = { ...current, ndaSigned: true };

  // Revalidate the page so the UI updates immediately
  revalidatePath(`/deals/${dealId}`);
  return { success: true };
}

/**
 * Sends a message
 */
export async function sendMessage(formData: FormData) {
  const message = formData.get("message");
  const dealId = formData.get("dealId");
  
  console.log(`[Server] Message for deal ${dealId}:`, message);
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return { success: true };
}


/**
 * Submits a Letter of Intent (LOI)
 */
export async function submitLOI(formData: FormData) {
  const dealId = formData.get("dealId") as string;
  const amount = formData.get("amount");
  const terms = formData.get("terms");
  
  console.log(`[Server] LOI Submitted for ${dealId}: $${amount}`);

  // 1. Update Mock DB
  const current = mockDb[dealId] || { ndaSigned: false, loiSubmitted: false };
  mockDb[dealId] = { ...current, loiSubmitted: true };

  // 2. Revalidate Page
  revalidatePath(`/deals/${dealId}`);
  
  return { success: true };
}