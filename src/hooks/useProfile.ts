import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type UserProfile = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: 'buyer' | 'seller' | 'admin' | null;
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

        // Query profiles table using user_id
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('user_id, email, full_name, role')
          .eq('user_id', user.id)
          .maybeSingle();

        // Handle errors
        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 is "no rows found" - we handle that separately
          if (process.env.NODE_ENV !== 'production') {
            console.error('[useUserProfile] error loading profile:', profileError);
          }
          throw profileError;
        }

        // If no profile exists, create one with default role 'buyer'
        if (!data) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[useUserProfile] no profile found, creating default...');
          }

          // Use role from user metadata if available, otherwise default to 'buyer'
          const userRole = (user.user_metadata?.role as 'buyer' | 'seller' | 'admin') || 'buyer';

          const { data: insertedData, error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              email: user.email,
              full_name: null,
              role: userRole,
            })
            .select('user_id, email, full_name, role')
            .single();

          if (insertError) {
            if (process.env.NODE_ENV !== 'production') {
              console.error('[useUserProfile] error creating profile:', insertError);
            }
            throw insertError;
          }

          if (mounted) {
            setProfile(insertedData as UserProfile);
            if (process.env.NODE_ENV !== 'production') {
              console.log('[useUserProfile] created profile:', insertedData);
            }
          }
        } else {
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
          const errorMessage = err instanceof Error ? err.message : String(err);
          const errorCode = typeof err === 'object' && err !== null && 'code' in err ? String(err.code) : '';
          const errorStack = err instanceof Error ? err.stack : '';
          console.error(
            '[useUserProfile] Unexpected error:',
            errorMessage,
            errorCode,
            errorStack
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
