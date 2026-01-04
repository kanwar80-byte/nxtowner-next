"use server";

import { supabase } from "@/utils/supabase/client";
import type {
  ConsultationRequest,
  ConsultationRequestInsert,
  ConsultationRequestUpdate,
  PartnerProfile,
  PartnerProfileInsert,
  PartnerProfileUpdate,
} from "@/types/database";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// consultation_requests tables don't exist in Supabase until the migration is run.
// After running the migration, regenerate types with: npx supabase gen types typescript

// ============================================================================
// PARTNER PROFILES
// ============================================================================

/**
 * Get all approved partner profiles for public directory
 */
export async function getApprovedPartners(filters?: {
  partner_type?: string;
  regions?: string[];
  specialties?: string[];
}) {
  const supabase = await createClient();
  const sb: any = supabase;
  let query = sb
    .from("partner_profiles")
    .select(`
      *,
      profiles:profile_id (
        full_name,
        avatar_url
      )
    `)
    .eq("status", "approved")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters?.partner_type) {
    query = query.eq("partner_type", filters.partner_type);
  }

  if (filters?.regions && filters.regions.length > 0) {
    query = query.overlaps("regions", filters.regions);
  }

  if (filters?.specialties && filters.specialties.length > 0) {
    query = query.overlaps("specialties", filters.specialties);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching approved partners:", error);
    return [];
  }

  return data as (PartnerProfile & { profiles: { full_name: string | null; avatar_url: string | null } })[];
}

/**
 * Get partner profile by profile_id (for current user)
 */
export async function getPartnerProfileByUserId(userId: string) {
  const sb: any = supabase;
  const { data, error } = await sb
    .from("partner_profiles")
    .select("*")
    .eq("profile_id", userId)
    .single();

  if (error) {
    console.error("Error fetching partner profile:", error);
    return null;
  }

  return data as PartnerProfile;
}

/**
 * Get partner profile by id (public or self)
 */
export async function getPartnerProfileById(partnerId: string) {
  const sb: any = supabase;
  const { data, error } = await sb
    .from("partner_profiles")
    .select(`
      *,
      profiles:profile_id (
        full_name,
        avatar_url
      )
    `)
    .eq("id", partnerId)
    .single();

  if (error) {
    console.error("Error fetching partner profile:", error);
    return null;
  }

  return data as PartnerProfile & { profiles: { full_name: string | null; avatar_url: string | null } };
}

/**
 * Create a partner profile (self-service onboarding)
 */
export async function createPartnerProfile(profileData: PartnerProfileInsert) {
  const sb: any = supabase;
  const { data, error } = await sb
    .from("partner_profiles")
    // @ts-ignore - table exists but not in generated Supabase types until migration
    .insert(profileData)
    .select()
    .single();

  if (error) {
    console.error("Error creating partner profile:", error);
    throw new Error("Failed to create partner profile");
  }

  revalidatePath("/dashboard/partner");
  revalidatePath("/partners");

  return data as PartnerProfile;
}

/**
 * Update partner profile (self-service)
 */
export async function updatePartnerProfile(
  partnerId: string,
  updates: PartnerProfileUpdate
) {
  const sb: any = supabase;
  const { data, error } = await sb
    .from("partner_profiles")
    .update(updates)
    .eq("id", partnerId)
    .select()
    .single();

  if (error) {
    console.error("Error updating partner profile:", error);
    throw new Error("Failed to update partner profile");
  }

  revalidatePath("/dashboard/partner");
  revalidatePath("/partners");

  return data as PartnerProfile;
}

/**
 * Get all pending partner profiles (admin only)
 */
export async function getPendingPartnerProfiles() {
  const sb: any = supabase;
  const { data, error } = await sb
    .from("partner_profiles")
    .select(`
      *,
      profiles:profile_id (
        full_name,
        email:id
      )
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending partners:", error);
    return [];
  }

  return data as (PartnerProfile & { profiles: { full_name: string | null } })[];
}

/**
 * Approve partner profile (admin only)
 */
export async function approvePartnerProfile(partnerId: string) {
  const sb: any = supabase;
  const { data, error } = await sb
    .from("partner_profiles")
    .update({ status: "approved" })
    .eq("id", partnerId)
    .select()
    .single();

  if (error) {
    console.error("Error approving partner:", error);
    throw new Error("Failed to approve partner");
  }

  revalidatePath("/admin");
  revalidatePath("/partners");

  return data as PartnerProfile;
}

/**
 * Reject partner profile (admin only)
 */
export async function rejectPartnerProfile(partnerId: string) {
  const sb: any = supabase;
  const { data, error } = await sb
    .from("partner_profiles")
    .update({ status: "rejected" })
    .eq("id", partnerId)
    .select()
    .single();

  if (error) {
    console.error("Error rejecting partner:", error);
    throw new Error("Failed to reject partner");
  }

  revalidatePath("/admin");

  return data as PartnerProfile;
}

// ============================================================================
// CONSULTATION REQUESTS
// ============================================================================

/**
 * Create a consultation request (buyers/sellers booking partners)
 */
export async function createConsultationRequest(
  requestData: ConsultationRequestInsert
) {
  const sb: any = supabase;
  const { data, error } = await sb
    .from("consultation_requests")
    .insert(requestData)
    .select()
    .single();

  if (error) {
    console.error("Error creating consultation request:", error);
    throw new Error("Failed to create consultation request");
  }

  return data as ConsultationRequest;
}

/**
 * Get consultation requests for a partner
 */
export async function getConsultationRequestsForPartner(partnerProfileId: string) {
  const sb: any = supabase;
  const { data, error } = await sb
    .from("consultation_requests")
    .select(`
      *,
      listings:listing_id (
        title,
        asking_price
      )
    `)
    .eq("partner_profile_id", partnerProfileId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching consultation requests:", error);
    return [];
  }

  return data as (ConsultationRequest & {
    listings: { title: string; asking_price: number | null } | null;
  })[];
}

/**
 * Update consultation request status (partner only)
 */
export async function updateConsultationRequestStatus(
  requestId: string,
  status: ConsultationRequestUpdate["status"]
) {
  const sb: any = supabase;
  const { data, error } = await sb
    .from("consultation_requests")
    .update({ status })
    .eq("id", requestId)
    .select()
    .single();

  if (error) {
    console.error("Error updating consultation request:", error);
    throw new Error("Failed to update consultation request");
  }

  revalidatePath("/dashboard/partner");

  return data as ConsultationRequest;
}

/**
 * Get consultation requests for a user (buyer/seller)
 */
export async function getConsultationRequestsForUser(userId: string) {
  const sb: any = supabase;
  const { data, error } = await sb
    .from("consultation_requests")
    .select(`
      *,
      partner_profiles:partner_profile_id (
        firm_name,
        partner_type,
        contact_email
      )
    `)
    .eq("requester_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user consultation requests:", error);
    return [];
  }

  return data as (ConsultationRequest & {
    partner_profiles: {
      firm_name: string;
      partner_type: string;
      contact_email: string;
    } | null;
  })[];
}
