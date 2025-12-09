"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useProfile";
import type { User } from "@supabase/supabase-js";

type ActiveTab = "buyer" | "seller" | "admin";

export default function DashboardPage() {
  const router = useRouter();
  const { profile, loading } = useUserProfile();
  const [user, setUser] = useState<User | null>(null);
  
  // Get current auth user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      if (!authUser) {
        router.push("/login");
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Derive active tab from profile role
  const getDefaultTab = (): ActiveTab => {
    if (!profile) return "buyer";
    if (profile.role === "admin") return "admin";
    if (profile.role === "seller") return "seller";
    return "buyer";
  };
  
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => getDefaultTab());

  // Update active tab when profile loads
  useEffect(() => {
    setActiveTab(getDefaultTab());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.role]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="bg-brand-bg min-h-screen py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center text-brand-muted">Loading...</div>
        </div>
      </main>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !profile) {
    return null;
  }

  return (
    <main className="bg-brand-bg min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brand-text mb-2">
                Your Dashboard
              </h1>
              <p className="text-brand-muted">
                Welcome, {profile.full_name || profile.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-brand-navy text-white rounded-md font-medium hover:bg-slate-900 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Role Tabs */}
        <div className="flex gap-2 border-b border-brand-border">
          <button
            onClick={() => setActiveTab("buyer")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === "buyer"
                ? "border-brand-navy text-brand-navy"
                : "border-transparent text-brand-muted hover:text-brand-text"
            }`}
          >
            Buyer
          </button>
          <button
            onClick={() => setActiveTab("seller")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === "seller"
                ? "border-brand-navy text-brand-navy"
                : "border-transparent text-brand-muted hover:text-brand-text"
            }`}
          >
            Seller
          </button>
          {profile.role === "admin" && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === "admin"
                  ? "border-brand-navy text-brand-navy"
                  : "border-transparent text-brand-muted hover:text-brand-text"
              }`}
            >
              Admin
            </button>
          )}
        </div>

        {/* Buyer Panel */}
        {activeTab === "buyer" && (
          <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-brand-text">
              Buyer Dashboard
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-brand-text mb-2">Watchlist</h3>
                <p className="text-sm text-brand-muted">
                  Your saved listings and businesses you&apos;re tracking will appear here.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-brand-text mb-2">Signed NDAs</h3>
                <p className="text-sm text-brand-muted">
                  Access deal rooms for businesses where you&apos;ve signed an NDA.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-brand-text mb-2">Active Deals</h3>
                <p className="text-sm text-brand-muted">
                  Track your ongoing negotiations and purchase processes.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-brand-border">
              <p className="text-xs text-brand-muted">
                <strong>TODO:</strong> Fetch watchlist, bids, and signed NDAs from Supabase. 
                Display real data from user_watchlist, offers, and deal_rooms tables.
              </p>
            </div>
          </div>
        )}

        {/* Seller Panel */}
        {activeTab === "seller" && (
          <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-brand-text">
              Seller Dashboard
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-brand-text mb-2">My Listings</h3>
                <p className="text-sm text-brand-muted">
                  View and manage all your active business listings.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-brand-text mb-2">Incoming NDAs</h3>
                <p className="text-sm text-brand-muted">
                  Review and manage NDA requests from potential buyers.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-brand-text mb-2">Offers</h3>
                <p className="text-sm text-brand-muted">
                  Track and respond to purchase offers on your listings.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-brand-border">
              <p className="text-xs text-brand-muted">
                <strong>TODO:</strong> Fetch seller&apos;s listings with analytics from Supabase. 
                Display data from listings table with view counts and message threads.
              </p>
            </div>
          </div>
        )}

        {/* Admin Panel */}
        {activeTab === "admin" && profile.role === "admin" && (
          <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-brand-text">
              Admin Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-3xl font-bold text-brand-navy">XXX</p>
                <p className="text-sm text-brand-muted mt-1">Total Listings</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-3xl font-bold text-brand-navy">XXX</p>
                <p className="text-sm text-brand-muted mt-1">Active Users</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-3xl font-bold text-brand-navy">XXX</p>
                <p className="text-sm text-brand-muted mt-1">Pending Verifications</p>
              </div>
            </div>
            <div className="space-y-3">
              <a
                href="/admin/listings"
                className="block p-4 border border-brand-border rounded-lg hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold text-brand-text">Listings Queue</h3>
                <p className="text-sm text-brand-muted">Review, approve, or flag listings</p>
              </a>
              <a
                href="/admin/users"
                className="block p-4 border border-brand-border rounded-lg hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold text-brand-text">User Management</h3>
                <p className="text-sm text-brand-muted">View user accounts and permissions</p>
              </a>
              <a
                href="/admin/verifications"
                className="block p-4 border border-brand-border rounded-lg hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold text-brand-text">Platform Overview</h3>
                <p className="text-sm text-brand-muted">Monitor platform health and KPIs</p>
              </a>
            </div>
            <div className="pt-4 border-t border-brand-border">
              <p className="text-xs text-brand-muted">
                <strong>TODO:</strong> Fetch platform KPIs from Supabase analytics. 
                Calculate counts from listings, profiles, and verification_requests tables.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


