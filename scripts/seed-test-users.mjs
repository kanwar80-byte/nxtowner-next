// scripts/seed-test-users.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

/**
 * Helper to dump response details for debugging
 */
async function dumpResponse(res) {
  const text = await res.text().catch(() => "");
  return {
    status: res.status,
    statusText: res.statusText,
    bodyPreview: text.slice(0, 500),
  };
}

/**
 * Smoke test: Verify Supabase admin API is accessible
 */
async function smokeTestAdminAPI() {
  try {
    const res = await fetch(`${ADMIN_ENDPOINT}?page=1&per_page=1`, {
      method: "GET",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    });

    if (!res.ok) {
      const dump = await dumpResponse(res);
      console.error("❌ Admin API smoke test failed:");
      console.error("  Status:", dump.status, dump.statusText);
      console.error("  Body preview:", dump.bodyPreview);
      throw new Error(`Admin API returned ${dump.status}: ${dump.statusText}`);
    }

    const text = await res.text();
    if (!text) {
      console.error("❌ Admin API returned empty response");
      throw new Error("Empty response body from Supabase admin API");
    }

    try {
      JSON.parse(text);
      console.log("✓ Admin API smoke test passed");
      return true;
    } catch (parseError) {
      console.error("❌ Admin API returned non-JSON response:");
      console.error("  Body preview:", text.slice(0, 500));
      throw new Error("Admin API returned non-JSON response");
    }
  } catch (error) {
    if (error.message.includes("Admin API")) {
      throw error;
    }
    throw new Error(`Admin API smoke test failed: ${error.message}`);
  }
}

// Load .env.local if it exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const envPath = join(rootDir, ".env.local");

try {
  const envFile = readFileSync(envPath, "utf-8");
  envFile.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = value;
        }
      }
    }
  });
  console.log("Loaded environment variables from .env.local");
} catch (e) {
  // .env.local not found, continue with existing env vars
  console.warn("Note: .env.local not found, using existing environment variables");
}

const rawUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!rawUrl) {
  throw new Error(
    'Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in environment'
  );
}

// Normalize (strip dashboard URLs if someone pastes wrong thing)
let SUPABASE_URL = rawUrl;

if (SUPABASE_URL.includes('supabase.com/dashboard')) {
  const match = SUPABASE_URL.match(/project\/([a-z0-9-]+)/i);
  if (!match) {
    throw new Error('Invalid Supabase dashboard URL provided');
  }
  SUPABASE_URL = `https://${match[1]}.supabase.co`;
}

// One-line guard: ensure URL is valid API endpoint
if (!SUPABASE_URL.endsWith('.supabase.co')) {
  throw new Error(`Invalid Supabase API URL: ${SUPABASE_URL}`);
}

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ADMIN_ENDPOINT = `${SUPABASE_URL}/auth/v1/admin/users`;

// Note: Smoke test will run at the start of the main async function

// Your desired 5 test users
const TEST_USERS = [
  {
    uid: "267523be-de62-4015-8788-9cb5fad3726b",
    email: "buyer@test.com",
    password: "Test1234!",
    role: "buyer",
    full_name: "Test Buyer",
    company_name: "Buyer Demo Co",
    subscription_tier: "free",
  },
  {
    uid: "74149a9e-771d-4721-bd8e-852ede93aff3",
    email: "seller@test.com",
    password: "Test1234!",
    role: "seller",
    full_name: "Test Seller",
    company_name: "Seller Demo Co",
    subscription_tier: "pro",
  },
  {
    uid: "a0a4da6e-ade6-4117-8282-8d8258d7b6b2",
    email: "admin@test.com",
    password: "Test1234!",
    role: "admin",
    full_name: "Test Admin",
    company_name: "NxtOwner Ops",
    subscription_tier: "pro",
  },
  {
    // new
    email: "partner@test.com",
    password: "Test1234!",
    role: "partner",
    full_name: "Test Partner",
    company_name: "Partner Demo Firm",
    subscription_tier: "pro",
  },
  {
    // new
    email: "founder@test.com",
    password: "Test1234!",
    role: "founder",
    full_name: "Test Founder",
    company_name: "NxtOwner HQ",
    subscription_tier: "pro",
  },
];

async function upsertProfile(user) {
  const payload = {
    id: user.uid,
    email: user.email,
    role: user.role,
    full_name: user.full_name,
    company_name: user.company_name,
    subscription_tier: user.subscription_tier,
    is_verified: false,
    updated_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
    if (error) {
      console.error(`  Error upserting profile for ${user.email}:`, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    throw new Error(`Failed to upsert profile: ${error}`);
  }
}

async function updateExistingAuthUser(user) {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(user.uid, {
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        role: user.role,
        subscription_tier: user.subscription_tier,
        onboarding_status: 'completed',
        full_name: user.full_name,
      },
    });
    if (error) {
      console.error(`  Error updating user ${user.email}:`, {
        message: error.message,
        status: error.status,
        name: error.name,
      });
      throw error;
    }
    return data.user;
  } catch (error) {
    if (error.message) {
      throw error;
    }
    throw new Error(`Failed to update user: ${error}`);
  }
}

async function createNewAuthUser(user) {
  // Check if user already exists by email
  let existingUsers;
  try {
    const result = await supabase.auth.admin.listUsers();
    if (result.error) {
      console.error("  Error listing users:", {
        message: result.error.message,
        status: result.error.status,
      });
    }
    existingUsers = result.data;
  } catch (e) {
    console.warn("  Could not list users, proceeding with create...");
  }
  
  const existing = existingUsers?.users?.find((u) => u.email === user.email);
  
  if (existing) {
    console.log(`  User ${user.email} already exists, updating instead...`);
    return await updateExistingAuthUser({ ...user, uid: existing.id });
  }

  try {
    const payload = {
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        role: user.role,
        subscription_tier: user.subscription_tier,
        onboarding_status: 'completed',
        full_name: user.full_name,
      },
    };

    const { data, error } = await supabase.auth.admin.createUser(payload);
    if (error) {
      // Enhanced error logging for 500 errors
      if (error.status === 500) {
        console.error(`  ❌ 500 Error creating user ${user.email}:`);
        console.error(`     Payload: role=${user.role}, tier=${user.subscription_tier}, email=${user.email}`);
        console.error(`     Error message: ${error.message}`);
        console.error(`     Suggestion: Check Postgres logs/triggers for constraints on auth.users or profiles table`);
        console.error(`     Common causes: RLS policies, database triggers, or foreign key constraints`);
      } else {
        console.error(`  Error creating user ${user.email}:`, {
          message: error.message,
          status: error.status,
          name: error.name,
        });
      }
      throw error;
    }
    return data.user;
  } catch (error) {
    // If user already exists (database constraint), try to find and update
    if (error.message?.includes("already registered") || 
        error.message?.includes("already exists") ||
        error.message?.includes("Database error")) {
      // Try to find the user by listing all users
      try {
        const { data: allUsers, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
          console.error("  Error listing users for recovery:", listError.message);
        }
        const found = allUsers?.users?.find((u) => u.email === user.email);
        if (found) {
          console.log(`  User ${user.email} found in database, updating instead...`);
          return await updateExistingAuthUser({ ...user, uid: found.id });
        }
      } catch (listErr) {
        console.error("  Could not list users for recovery:", listErr.message);
      }
    }
    throw error;
  }
}

(async () => {
  console.log("Seeding test users...\n");

  // Run smoke test first
  console.log("Running admin API smoke test...");
  try {
    await smokeTestAdminAPI();
    console.log("");
  } catch (error) {
    console.error("\n❌ Smoke test failed. Please check:");
    console.error("  1. SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is set correctly");
    console.error("  2. SUPABASE_SERVICE_ROLE_KEY is correct");
    console.error("\nError:", error.message);
    process.exit(1);
  }

  // First, get all existing users to check for duplicates
  let existingUsers = [];
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error("Error listing existing users:", {
        message: error.message,
        status: error.status,
      });
    }
    existingUsers = data?.users || [];
  } catch (e) {
    console.warn("Could not list existing users:", e.message || e);
  }

  for (const u of TEST_USERS) {
    try {
      if (u.uid) {
        // existing UID: update auth user
        const user = await updateExistingAuthUser(u);
        console.log(`✓ Updated auth user: ${user.email} (${user.id})`);
        await upsertProfile({ ...u, uid: user.id });
        console.log(`  ✓ Updated profile\n`);
      } else {
        // new: check if user exists by email
        const existing = existingUsers.find((eu) => eu.email === u.email);
        if (existing) {
          console.log(`✓ User ${u.email} already exists, updating...`);
          const user = await updateExistingAuthUser({ ...u, uid: existing.id });
          console.log(`  ✓ Updated auth user: ${user.id}`);
          await upsertProfile({ ...u, uid: user.id });
          console.log(`  ✓ Updated profile\n`);
        } else {
          // Try to create new user
          try {
            const user = await createNewAuthUser(u);
            console.log(`✓ Created auth user: ${user.email} (${user.id})`);
            await upsertProfile({ ...u, uid: user.id });
            console.log(`  ✓ Created profile\n`);
          } catch (createError) {
            // If creation fails, try to find user that might have been created
            try {
              const { data: allUsers, error: listError } = await supabase.auth.admin.listUsers();
              if (listError) {
                console.error("  Error listing users for recovery:", listError.message);
              }
              const found = allUsers?.users?.find((eu) => eu.email === u.email);
              if (found) {
                console.log(`✓ Found existing user ${u.email}, updating...`);
                const user = await updateExistingAuthUser({ ...u, uid: found.id });
                await upsertProfile({ ...u, uid: user.id });
                console.log(`  ✓ Updated profile\n`);
              } else {
                throw createError;
              }
            } catch (recoveryError) {
              throw createError; // Throw original error
            }
          }
        }
      }
    } catch (error) {
      console.error(`✗ Failed to seed user ${u.email}:`);
      if (error.message) {
        console.error(`  Error: ${error.message}`);
      }
      if (error.status) {
        console.error(`  Status: ${error.status}`);
      }
      if (error.code) {
        console.error(`  Code: ${error.code}`);
      }
      console.log(""); // Empty line for readability
      // Continue with next user
    }
  }

  console.log("Done seeding test users.");
})().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});

