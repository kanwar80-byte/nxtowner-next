"use client";

import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";

// ...existing code...

const menuData = {
  buyers: [
    {
      title: "Browse",
      links: [
        { href: "/browse", label: "Browse Listings" },
        { href: "/browse?type=operational", label: "Operational Businesses" },
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
        { href: "/sell/onboarding", label: "List a Business" },
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
  partners: [
    {
      title: "Directory",
      links: [
        { href: "/partners", label: "Partners Directory" },
        { href: "/find-a-broker", label: "Brokers" },
      ],
    },
    {
      title: "For Partners",
      links: [
        { href: "/partners", label: "Partner Program" },
        { href: "/pricing", label: "Pricing" },
        { href: "/resources", label: "Verification Standards (coming soon)" },
      ],
    },
    {
      title: "Services",
      links: [
        { href: "/resources", label: "Due Diligence Support" },
        { href: "/resources", label: "Legal / Contracts (coming soon)" },
        { href: "/deal-room", label: "Deal Room Access (coming soon)" },
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

// UPDATED: MegaMenu now uses Dark Theme (Navy Background)
function MegaMenuDropdown({ columns }: { columns: MenuColumn[] }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-[#0B1221] border border-white/10 shadow-2xl rounded-2xl px-8 py-6 z-50" style={{ width: 'min(64rem, calc(100vw - 2rem))' }}>
      <div className="grid grid-cols-3 gap-8">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide border-b border-white/10 pb-2">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link, linkIdx) => (
                <li key={`${colIdx}-${linkIdx}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-[#D4AF37] transition-colors font-medium"
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
  const [accountOpen, setAccountOpen] = useState(false);

  async function fetchProfile(userId: string) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single();
    setProfile(profileData as UserProfile | null);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setAccountOpen(false);
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      if (authUser) {
        await fetchProfile(authUser.id);
      } else {
        setProfile(null);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    // UPDATED: Changed from 'sticky' to 'fixed' to remove gaps, enforced Navy background
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B1221] backdrop-blur-md border-b border-white/10 h-20 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white hover:opacity-90 transition-opacity">
           {/* If you have the image logo working, uncomment below, otherwise text is fine for now */}
           {/* <Image src="/logo.jpg" alt="NxtOwner" width={40} height={40} className="object-contain" /> */}
           NxtOwner.ca
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/about" className="group text-sm font-semibold text-slate-300 hover:text-white transition-colors relative">
            About
          </Link>
          <Link href="/faq" className="group text-sm font-semibold text-slate-300 hover:text-white transition-colors relative">
            FAQ
          </Link>
          <Link href="/how-it-works" className="group text-sm font-semibold text-slate-300 hover:text-white transition-colors relative">
            How It Works
          </Link>
          
          {/* MEGA MENUS */}
          <div className="relative h-full flex items-center" onMouseEnter={() => setOpenMenu("buyers")} onMouseLeave={() => setOpenMenu(null)}>
            <button className="text-sm font-semibold text-slate-300 hover:text-white transition-colors py-2">
              Buyers
            </button>
            {openMenu === "buyers" && <MegaMenuDropdown columns={menuData.buyers} />}
          </div>
          
          <div className="relative h-full flex items-center" onMouseEnter={() => setOpenMenu("sellers")} onMouseLeave={() => setOpenMenu(null)}>
            <button className="text-sm font-semibold text-slate-300 hover:text-white transition-colors py-2">
              Sellers
            </button>
            {openMenu === "sellers" && <MegaMenuDropdown columns={menuData.sellers} />}
          </div>
          
          <div className="relative h-full flex items-center" onMouseEnter={() => setOpenMenu("partners")} onMouseLeave={() => setOpenMenu(null)}>
            <button className="text-sm font-semibold text-slate-300 hover:text-white transition-colors py-2">
              Partners
            </button>
            {openMenu === "partners" && <MegaMenuDropdown columns={menuData.partners} />}
          </div>
          
          <div className="relative h-full flex items-center" onMouseEnter={() => setOpenMenu("resources")} onMouseLeave={() => setOpenMenu(null)}>
            <button className="text-sm font-semibold text-slate-300 hover:text-white transition-colors py-2">
              Resources
            </button>
            {openMenu === "resources" && <MegaMenuDropdown columns={menuData.resources} />}
          </div>

          <Link href="/valuation" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Valuation
          </Link>

          {/* Guides link for logged in users */}
          {user && (
            <Link href="/guides/buyer-guide" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Guides
            </Link>
          )}
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center justify-end gap-3 pl-4 border-l border-white/10 ml-4">
          {/* Visitor/Authenticated Switch */}
          {!user ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-white/90 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/sell/onboarding"
                className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-bold bg-[#D4AF37] text-[#0B1221] shadow-lg hover:bg-[#C5A028] hover:shadow-yellow-500/20 transition-all"
              >
                List Your Business
              </Link>
            </>
          ) : (
            <>
              {/* Role-based quick links */}
              {profile?.role !== 'admin' && (
                <>
                  <Link href="/browse" className="hidden md:inline-flex text-sm font-semibold text-slate-300 hover:text-white">
                    Browse
                  </Link>
                  {profile?.role === 'seller' && (
                    <Link href="/sell" className="hidden md:inline-flex text-sm font-semibold text-slate-300 hover:text-white">
                      Sell
                    </Link>
                  )}
                  {profile?.role === 'partner' && (
                    <Link href="/partners" className="hidden md:inline-flex text-sm font-semibold text-slate-300 hover:text-white">
                      Partners
                    </Link>
                  )}
                </>
              )}
              {/* Admin link */}
              {profile?.role === 'admin' && (
                <Link href="/admin" className="hidden md:inline-flex text-sm font-semibold text-white bg-white/10 px-3 py-1.5 rounded-md hover:bg-white/20 transition">
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-bold bg-[#D4AF37] text-[#0B1221] shadow-lg hover:bg-[#C5A028] hover:shadow-yellow-500/20 transition-all"
              >
                Dashboard
              </Link>
              {/* Account Dropdown */}
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  className="inline-flex items-center rounded-full border border-white/15 px-3 py-1.5 text-sm font-semibold text-white/85 hover:bg-white/10 transition ml-2"
                  onClick={() => setAccountOpen((v) => !v)}
                >
                  Account
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0B1221] border border-white/10 shadow-2xl rounded-xl p-2 text-white/85 z-50">
                    <div className="px-3 py-2 text-xs font-semibold opacity-60 uppercase tracking-wider">
                      Signed in as
                    </div>
                    <div className="px-3 pb-2 text-sm font-medium border-b border-white/10 mb-2 truncate">
                      {user?.email}
                    </div>
                    <button
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold text-red-400 hover:text-red-300"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}