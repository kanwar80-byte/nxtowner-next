"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Database } from "@/types/database.types";

export type OnboardingData = {
  roles: string[];
  preferred_track: 'all' | 'operational' | 'digital';
  full_name?: string;
  company_name?: string;
};

/**
 * Save onboarding data to user profile.
 * Requires authentication.
 * Upserts profiles table safely without changing user ID.
 */
export async function saveOnboarding(data: OnboardingData) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Determine primary role (first in array, or 'buyer' as fallback)
  const primaryRole = data.roles[0] || 'buyer';

  type ProfileRole = Database["public"]["Enums"]["user_role"];
  const role = primaryRole as ProfileRole;

  // Upsert profile
  const payload: Database["public"]["Tables"]["profiles"]["Insert"] = {
    id: user.id,
    email: user.email ?? null,
    role,
    roles: data.roles,
    preferred_track: data.preferred_track,
    full_name: data.full_name || null,
    company_name: data.company_name || null,
    subscription_tier: 'free',
    is_verified: false,
    onboarding_status: 'completed',
    onboarding_step: 'done',
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("profiles")
    .upsert(payload, {
      onConflict: 'id'
    });

  if (error) {
    console.error("[saveOnboarding] Error upserting profile:", error);
    return {
      success: false,
      error: error.message || "Failed to save onboarding data",
    };
  }

  return {
    success: true,
  };
}

