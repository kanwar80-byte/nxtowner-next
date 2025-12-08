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
      <main className="py-16 max-w-5xl mx-auto px-4">
        <div className="text-center text-gray-600">Loading...</div>
      </main>
    );
  }

  return (
    <main className="py-16 max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-nxt-primary mb-4">
        Your NxtOwner Dashboard
      </h1>
      <p className="text-gray-600 mb-2">
        Welcome, {userEmail}
      </p>
      <p className="text-gray-600 mb-6">
        This is a simple placeholder dashboard. 
        We will later replace this with:
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
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
        className="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
      >
        Sign Out
      </button>
    </main>
  );
}
