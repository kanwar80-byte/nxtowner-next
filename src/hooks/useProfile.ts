import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export type UserProfile = {
  id: string;
  email: string | null;
  role: string | null;
  full_name: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type UseUserProfileResult = {
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
};

export function useUserProfile(): UseUserProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (!user) {
          if (mounted) {
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        if (process.env.NODE_ENV !== 'production') {
          console.log('[useUserProfile] session user:', user.id);
        }

        // Query profiles table using id (profiles.id is the auth uid)
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('id,email,role,full_name,created_at,updated_at')
          .eq('id', user.id)               // ✅ profiles.id is the auth uid
          .maybeSingle();                  // ✅ avoids throwing on no rows

        // Handle errors
        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 is "no rows found" - we handle that separately
          if (process.env.NODE_ENV !== 'production') {
            const safeErr =
              profileError && typeof profileError === 'object'
                ? JSON.parse(JSON.stringify(profileError))
                : profileError;
            console.error('[useUserProfile] error loading profile:', safeErr);
          }
          throw profileError;
        }

        // Handle missing profile row explicitly
        if (!data) {
          // No profile row exists yet (common on older setups)
          // The trigger should create it automatically, but if it doesn't exist,
          // we can either auto-create it here or show onboarding
          if (process.env.NODE_ENV !== 'production') {
            console.log('[useUserProfile] no profile found - trigger should create it, or user needs onboarding');
          }

          // Option 1: Auto-create profile (if trigger didn't fire)
          // Note: The trigger should handle this, but we can create it as fallback
          try {
            const profilePayload = {
              id: user.id,  // ✅ profiles.id is the auth uid
              email: user.email,
              role: 'user', // Default role
              full_name: null,
            };

            const { data: insertedData, error: insertError } = await supabase
              .from('profiles')
              .insert(profilePayload as never)
              .select('id,email,role,full_name,created_at,updated_at')
              .maybeSingle();

            if (insertError) {
              // If insert fails (e.g., RLS policy), that's ok - trigger will handle it
              if (process.env.NODE_ENV !== 'production') {
                const safeErr =
                  insertError && typeof insertError === 'object'
                    ? JSON.parse(JSON.stringify(insertError))
                    : insertError;
                console.warn('[useUserProfile] could not create profile (may be handled by trigger):', safeErr);
              }
              // Set profile to null - user may need to complete onboarding
              if (mounted) {
                setProfile(null);
              }
            } else if (insertedData && mounted) {
              setProfile(insertedData as UserProfile);
              if (process.env.NODE_ENV !== 'production') {
                console.log('[useUserProfile] created profile:', insertedData);
              }
            }
          } catch (createErr) {
            // Silent fail - profile creation may be handled by trigger or require onboarding
            if (process.env.NODE_ENV !== 'production') {
              const safeErr =
                createErr && typeof createErr === 'object'
                  ? JSON.parse(JSON.stringify(createErr))
                  : createErr;
              console.warn(
                '[useUserProfile] profile creation failed (may be expected):',
                safeErr?.message ?? String(createErr),
                safeErr?.code ?? '',
                safeErr?.details ?? '',
                safeErr?.hint ?? ''
              );
            }
            if (mounted) {
              setProfile(null);
            }
          }
        } else {
          // Profile exists - use it
          if (mounted) {
            setProfile(data as UserProfile);
            if (process.env.NODE_ENV !== 'production') {
              console.log('[useUserProfile] loaded profile:', data);
            }
          }
        }
      } catch (err: unknown) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        if (process.env.NODE_ENV !== 'production') {
          const safeErr =
            err && typeof err === 'object'
              ? JSON.parse(JSON.stringify(err))
              : err;
          console.error(
            '[useUserProfile] Unexpected error:',
            safeErr?.message ?? String(err),
            safeErr?.code ?? '',
            safeErr?.details ?? '',
            safeErr?.hint ?? ''
          );
        }
        if (mounted) {
          setError(errorObj);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (mounted) {
        fetchProfile();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { profile, loading, error };
}
