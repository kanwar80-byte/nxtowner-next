"use client";

import { BrandMark } from "@/components/shared/BrandMark";
import Link from "next/link";

type UserRole = "visitor" | "buyer" | "seller" | "broker" | "partner" | "admin";

// TODO: Plug in real user/role logic here
const role: UserRole = "visitor";

// Nav config per role
const navConfig: Record<UserRole, {
  links: { label: string; href: string }[];
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
}> = {
  visitor: {
    links: [
      { label: "About", href: "/about" },
      { label: "How it Works", href: "/how-it-works" },
      { label: "Browse", href: "/browse" },
      { label: "Valuation", href: "/valuation" },
      { label: "Resources", href: "/resources" },
    ],
    cta: { label: "Sell Your Business", href: "/sell/onboarding" },
    secondary: { label: "Sign In", href: "/dashboard" },
  },
  buyer: {
    links: [
      { label: "Browse", href: "/browse" },
      { label: "Saved", href: "/dashboard/saved" },
      { label: "Deal Room", href: "/dashboard/deal-room" },
      { label: "Resources", href: "/resources" },
      { label: "Valuation", href: "/valuation" },
    ],
    cta: { label: "Browse Verified Listings", href: "/browse" },
  },
  seller: {
    links: [
      { label: "Seller Dashboard", href: "/sell/dashboard" },
      { label: "Listings", href: "/sell/listings" },
      { label: "Deal Tracker", href: "/sell/deals" },
      { label: "Resources", href: "/resources" },
    ],
    cta: { label: "Create Listing", href: "/sell/onboarding" },
  },
  broker: {
    links: [
      { label: "Partner Hub", href: "/partners/hub" },
      { label: "Listings", href: "/partners/listings" },
      { label: "Clients", href: "/partners/clients" },
      { label: "Deal Tracker", href: "/partners/deals" },
      { label: "Resources", href: "/resources" },
    ],
    cta: { label: "Add Client Listing", href: "/sell/onboarding" },
  },
  partner: {
    links: [
      { label: "Partner Directory", href: "/partners/directory" },
      { label: "Lead Inbox", href: "/partners/leads" },
      { label: "Deal Rooms", href: "/partners/deal-rooms" },
      { label: "Resources", href: "/resources" },
    ],
    cta: { label: "Become Verified Partner", href: "/partners/apply" },
  },
  admin: {
    links: [
      { label: "Admin Dashboard", href: "/admin" },
      { label: "Listings", href: "/admin/listings" },
      { label: "Users", href: "/admin/users" },
      { label: "Reviews/Verification", href: "/admin/reviews" },
      { label: "Reports", href: "/admin/reports" },
    ],
    cta: { label: "Admin Console", href: "/admin" },
  },
};

export function MainNav() {
  const { links, cta, secondary } = navConfig[role];

  return (
<<<<<<< HEAD
    // UPDATED: Changed from 'sticky' to 'fixed' to remove gaps, enforced Navy background
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B1221] backdrop-blur-md border-b border-white/10 h-20 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-1 group">
          <div className="bg-blue-600 text-white font-bold text-xl h-8 w-8 rounded flex items-center justify-center">N</div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Nxt<span className="text-[#EAB308]">Owner</span>
          </span>
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
=======
    <nav className="sticky top-0 z-50 bg-[#020617] border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <BrandMark size="md" />
>>>>>>> da316d3 (Fix metadata encoding and stabilize nav/valuation labels)
            </Link>
          </div>
          {/* Center: Primary nav links */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex gap-6 text-sm font-medium text-slate-300">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Right: Auth + CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {secondary && (
              <Link
                href={secondary.href}
                className="flex items-center gap-2 hover:text-white text-sm font-medium text-slate-300"
              >
                {secondary.label}
              </Link>
            )}
            <Link
              href={cta.href}
              className="bg-[#D4AF37] text-[#0B1221] hover:bg-[#C5A028] px-4 py-2 rounded-full font-bold text-xs transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {cta.label}
            </Link>
          </div>
          {/* Mobile Menu Button (unchanged) */}
          {/* ...existing code for mobile menu button... */}
        </div>
      </div>
      {/* Mobile Menu (Dropdown) */}
      {/* ...existing code for mobile menu... */}
    </nav>
  );
}