"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const menuData = {
  buyers: [
    {
      title: "Browse",
      links: [
        { href: "/browse", label: "Browse Listings" },
        { href: "/browse?type=physical", label: "Physical Businesses" },
        { href: "/browse?type=digital", label: "Digital Businesses" },
      ],
    },
    {
      title: "Tools",
      links: [
        { href: "/valuation", label: "Run Valuation" },
        { href: "/deal-room", label: "Deal Room Access (coming soon)" },
        { href: "/tools/calculators", label: "Calculator Tools (coming soon)" },
      ],
    },
    {
      title: "Insights",
      links: [
        { href: "/resources", label: "Market Insights" },
        { href: "/resources", label: "Articles" },
        { href: "/resources", label: "Industry Reports" },
      ],
    },
  ],
  sellers: [
    {
      title: "Sell",
      links: [
        { href: "/sell", label: "Sell Your Business" },
        { href: "/create-listing", label: "List a Business" },
        { href: "/pricing", label: "Pricing" },
      ],
    },
    {
      title: "Preparation",
      links: [
        { href: "/guides/seller-guide", label: "Seller Guide" },
        { href: "/valuation", label: "How Valuation Works" },
        { href: "/resources", label: "Prepare Financials (coming soon)" },
      ],
    },
    {
      title: "Services",
      links: [
        { href: "/find-a-broker", label: "Find a Broker" },
        { href: "/partners", label: "Partner Program" },
        { href: "/resources", label: "Due Diligence Checklist" },
      ],
    },
  ],
  resources: [
    {
      title: "Learn",
      links: [
        { href: "/resources", label: "Articles" },
        { href: "/resources", label: "Market Insights" },
        { href: "/resources", label: "Case Studies" },
      ],
    },
    {
      title: "Tools",
      links: [
        { href: "/valuation", label: "Valuation Tools" },
        { href: "/tools/calculators", label: "Calculator Tools" },
        { href: "/resources", label: "Templates (coming soon)" },
      ],
    },
    {
      title: "Directory",
      links: [
        { href: "/partners", label: "Partners Directory" },
        { href: "/find-a-broker", label: "Brokers" },
        { href: "/resources", label: "Legal Professionals (coming soon)" },
      ],
    },
  ],
};

type MenuColumn = {
  title: string;
  links: Array<{ href: string; label: string }>;
};

function MegaMenuDropdown({ columns }: { columns: MenuColumn[] }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white shadow-2xl rounded-2xl px-8 py-6 z-50" style={{ width: 'min(64rem, calc(100vw - 2rem))' }}>
      <div className="grid grid-cols-3 gap-8">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link, linkIdx) => (
                <li key={`${colIdx}-${linkIdx}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-700 hover:text-[#F97316] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

type UserProfile = {
  role: 'buyer' | 'seller' | 'partner' | 'admin';
};

export function MainNav() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (authUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', authUser.id)
          .single();
        setProfile(profileData as UserProfile | null);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#0A122A]">
          NxtOwner.ca
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("buyers")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="group text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
              Buyers
              <span className="absolute left-0 -bottom-1 h-0.5 w-full scale-x-0 bg-[#F97316] transition-transform group-hover:scale-x-100" />
            </button>
            {openMenu === "buyers" && <MegaMenuDropdown columns={menuData.buyers} />}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("sellers")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="group text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
              Sellers
              <span className="absolute left-0 -bottom-1 h-0.5 w-full scale-x-0 bg-[#F97316] transition-transform group-hover:scale-x-100" />
            </button>
            {openMenu === "sellers" && <MegaMenuDropdown columns={menuData.sellers} />}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("resources")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="group text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
              Resources
              <span className="absolute left-0 -bottom-1 h-0.5 w-full scale-x-0 bg-[#F97316] transition-transform group-hover:scale-x-100" />
            </button>
            {openMenu === "resources" && <MegaMenuDropdown columns={menuData.resources} />}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          {/* Role-based quick links */}
          {user && profile?.role !== 'admin' && (
            <>
              <Link
                href="/browse"
                className="hidden md:inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition"
              >
                Browse
              </Link>
              {profile?.role === 'seller' && (
                <Link
                  href="/sell"
                  className="hidden md:inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition"
                >
                  Sell
                </Link>
              )}
            </>
          )}

          {/* Admin link for admins */}
          {user && profile?.role === 'admin' && (
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition"
            >
              Admin
            </Link>
          )}

          {/* Public quick actions when not logged in */}
          {!user && (
            <>
              <Link
                href="/pricing"
                className="hidden md:inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition"
              >
                Pricing
              </Link>
              <Link
                href="/valuation"
                className="hidden md:inline-flex items-center rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-[#0A122A] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Run Valuation
              </Link>
              <Link
                href="/sell"
                className="hidden md:inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition"
              >
                Sell your business
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 rounded-full border border-slate-200 hover:bg-slate-50 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white bg-[#F97316] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white bg-[#0A122A] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Dashboard
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
