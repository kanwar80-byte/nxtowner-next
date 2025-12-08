"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }
      
      setUserEmail(user.email || null);
      setLoading(false);
    }
    
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <main className="bg-brand-bg min-h-screen py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center text-brand-muted">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-brand-bg min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-brand-text mb-4">
            Your NxtOwner Dashboard
          </h1>
          <p className="text-brand-muted mb-2">
            Welcome, {userEmail}
          </p>
          <p className="text-brand-muted mb-6">
            This is a simple placeholder dashboard. 
            We will later replace this with:
          </p>
          <ul className="list-disc list-inside text-brand-text space-y-1">
            <li>Saved searches &amp; watched listings</li>
            <li>Active offers &amp; NDAs</li>
            <li>My listings (as a seller)</li>
            <li>Profile &amp; verification status</li>
          </ul>
          
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="mt-6 px-4 py-2 bg-brand-navy text-white rounded-md hover:bg-slate-900 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
