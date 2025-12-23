"use client";

import { useUserProfile } from "@/hooks/useProfile";
import { supabase } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AuthGateProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGate({ children, requireAdmin = false }: AuthGateProps) {
  const { profile, loading, error } = useUserProfile();
  const [user, setUser] = useState<User | null>(null);

  // Get current auth user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-brand-muted">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-brand-text">
              Account Required
            </h1>
            <p className="text-brand-muted">
              You need an account to access this area.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 border border-brand-navy text-brand-navy rounded-md font-medium hover:bg-brand-navy hover:text-white transition"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 bg-brand-orange text-white rounded-md font-medium hover:bg-orange-700 transition"
            >
              Join Free
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check admin requirement
  if (requireAdmin && profile?.role !== "admin") {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[AuthGate] Access denied:', {
        userId: user.id,
        role: profile?.role,
        requireAdmin,
        error: error?.message
      });
    }

    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-brand-text">
              Access Denied
            </h1>
            <p className="text-brand-muted">
              This area is restricted to administrators only.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-brand-navy text-white rounded-md font-medium hover:bg-slate-900 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('[AuthGate] Access granted:', {
      userId: user.id,
      role: profile?.role,
      requireAdmin
    });
  }

  return <>{children}</>;
}
