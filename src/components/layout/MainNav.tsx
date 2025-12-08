"use client";

import Link from "next/link";

export function MainNav() {
  return (
    <header className="sticky top-0 z-20 border-b" style={{ backgroundColor: '#020617', borderColor: '#02081F' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="text-xl font-bold text-white">
          NxtOwner.ca
        </Link>

        {/* Center: Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-100 hover:text-white text-sm font-medium transition">Home</Link>
          <Link href="/browse" className="text-gray-100 hover:text-white text-sm font-medium transition">Browse Listings</Link>
          <Link
            href="/create-listing"
            className="text-gray-100 hover:text-white text-sm font-medium transition"
          >
            Sell a Business
          </Link>
          <Link href="/pricing" className="text-gray-100 hover:text-white text-sm font-medium transition">Pricing</Link>
        </div>

        {/* Right: Auth buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-white/80 text-white rounded-md bg-transparent hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="hidden md:inline-block px-4 py-2 text-sm bg-brand-orange text-white rounded-md font-semibold hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 transition"
          >
            Join Free
          </Link>
        </div>
      </nav>
    </header>
  );
}
