"use client";

import Link from "next/link";

export function MainNav() {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="text-xl font-bold text-nxt-primary">
          NxtOwner.ca
        </Link>

        {/* Center: Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/">Home</Link>
          <Link href="/browse">Browse Listings</Link>
          <Link href="/sell">Sell a Business</Link>
          <Link href="/pricing">Pricing</Link>
        </div>

        {/* Right: Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm border border-nxt-primary text-nxt-primary rounded-md hover:bg-nxt-primary hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="hidden md:inline-block px-4 py-2 text-sm bg-nxt-orange text-white rounded-md font-semibold hover:opacity-90 transition"
          >
            Join Free
          </Link>
        </div>
      </nav>
    </header>
  );
}
