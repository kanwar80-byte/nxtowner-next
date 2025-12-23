"use client";

import { useUserProfile } from "@/hooks/useProfile";
import { supabase } from "@/utils/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface RawData {
  data: unknown;
  error: PostgrestError | null;
}

export default function DebugPage() {
  const { profile, loading, error } = useUserProfile();
  const [rawData, setRawData] = useState<RawData | null>(null);
  const [debugError, setDebugError] = useState<Error | null>(null);

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        // Try direct query
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        console.log('Direct query result:', { data, error });
        setRawData({ data, error });
      } catch (err) {
        console.error('Direct query exception:', err);
        setDebugError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    checkProfile();
  }, []);

  return (
    <main className="min-h-screen bg-brand-bg py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Debug Page</h1>

        <div className="space-y-6">
          <section className="bg-brand-card border border-brand-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">useUserProfile Hook</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(
                {
                  loading,
                  profile,
                  error: error?.message,
                },
                null,
                2
              )}
            </pre>
          </section>

          <section className="bg-brand-card border border-brand-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Raw Supabase Query</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </section>

          {debugError && (
            <section className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-800 mb-4">Query Error</h2>
              <pre className="bg-red-100 p-4 rounded text-sm text-red-800 overflow-auto">
                {JSON.stringify(debugError, null, 2)}
              </pre>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
