import "server-only";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@/lib/supabaseAdmin";

export type UserKpiData = {
  authTotal: number | null;
  profilesTotal: number;
  buyersCount: number;
  sellersCount: number;
  partnersCount: number;
  adminsFoundersCount: number;
  profilesHealth: Record<string, number> | null;
};

export type UserTableRow = {
  id: string;
  email: string | null;
  role: string | null;
  tier: string | null;
  profile_health: string | null;
  created_at: string | null;
  last_sign_in_at: string | null;
};

/**
 * Get user KPI metrics (counts by role, health, etc.)
 */
export async function getUserKpis(): Promise<UserKpiData> {
  const supabase = await createClient();
  
  // Try to get auth total via admin client (if available)
  let authTotal: number | null = null;
  try {
    const adminClient = createAdminClient();
    if (adminClient) {
      const { data: users, error } = await adminClient.auth.admin.listUsers();
      if (!error && users) {
        authTotal = users.users.length;
      }
    }
  } catch {
    // Admin client not available or auth.users not accessible
    authTotal = null;
  }

  // Get profiles total
  let profilesTotal = 0;
  try {
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
    if (!error && count !== null) {
      profilesTotal = count;
    }
  } catch {
    profilesTotal = 0;
  }

  // Get role counts
  let buyersCount = 0;
  let sellersCount = 0;
  let partnersCount = 0;
  let adminsFoundersCount = 0;

  try {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("role");
    
    if (!error && profiles) {
      profiles.forEach((p) => {
        const role = p.role?.toLowerCase() || "";
        if (role === "buyer") buyersCount++;
        else if (role === "seller") sellersCount++;
        else if (role === "partner") partnersCount++;
        else if (role === "admin" || role === "founder") adminsFoundersCount++;
      });
    }
  } catch {
    // Role counts unavailable
  }

  // Get profile health counts (if column exists)
  let profilesHealth: Record<string, number> | null = null;
  try {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("profile_health");
    
    if (!error && profiles) {
      const healthMap: Record<string, number> = {};
      profiles.forEach((p: any) => {
        const health = p.profile_health || "unknown";
        healthMap[health] = (healthMap[health] || 0) + 1;
      });
      profilesHealth = healthMap;
    }
  } catch {
    // profile_health column doesn't exist or not accessible
    profilesHealth = null;
  }

  return {
    authTotal,
    profilesTotal,
    buyersCount,
    sellersCount,
    partnersCount,
    adminsFoundersCount,
    profilesHealth,
  };
}

/**
 * Get latest users for table (limited to 50)
 */
export async function getLatestUsers(limit: number = 50): Promise<UserTableRow[]> {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  try {
    // Get profiles
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, email, role, created_at, subscription_tier, profile_health")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    if (!profiles) {
      return [];
    }

    // Type guard: ensure profiles is an array (not SelectQueryError)
    if (!Array.isArray(profiles)) {
      return [];
    }

    // Now TypeScript knows profiles is an array, but we need to ensure it's not SelectQueryError
    // Cast via unknown to bypass the union type issue
    const profilesArray = profiles as unknown as Array<{ id: string; email: string | null; role: string | null; created_at: string | null; subscription_tier: string | null; profile_health: string | null }>;

    // Try to enrich with last_sign_in_at from auth.users (if admin client available)
    const userIds = profilesArray.map((p) => p.id);
    const lastSignInMap: Record<string, string | null> = {};

    if (adminClient) {
      try {
        // Fetch auth users in batches if needed
        for (const userId of userIds) {
          try {
            const { data: user, error: userError } = await adminClient.auth.admin.getUserById(userId);
            if (!userError && user?.user?.last_sign_in_at) {
              lastSignInMap[userId] = user.user.last_sign_in_at;
            }
          } catch {
            // Skip if user not found or error
          }
        }
      } catch {
        // Admin client not available or auth.users not accessible
      }
    }

    return profilesArray.map((p) => ({
      id: p.id,
      email: p.email || null,
      role: p.role || null,
      tier: p.subscription_tier || null,
      profile_health: p.profile_health || null,
      created_at: p.created_at || null,
      last_sign_in_at: lastSignInMap[p.id] || null,
    }));
  } catch (error) {
    console.error("[getLatestUsers] Error:", error);
    return [];
  }
}


