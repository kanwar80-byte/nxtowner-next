'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, Menu, X, UserCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const supabase = createClient();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to browse with the search query
      router.push(`/browse?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#020617] border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* 1. LOGO */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">N</div>
            <span className="text-xl font-bold tracking-tight">NxtOwner<span className="text-blue-500">.ca</span></span>
          </Link>

          {/* 2. THE "NXTOWNER" AI SEARCH BAR (Center) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask NxtOwner (e.g. 'SaaS under $1M with high cashflow')..."
                className="block w-full pl-10 pr-32 py-2.5 border border-slate-700 rounded-full leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all shadow-inner"
              />
              {/* THE "NXTOWNER" BUTTON */}
              <button 
                type="submit"
                className="absolute inset-y-1 right-1 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-105"
              >
                <Sparkles size={12} className="animate-pulse" />
                Ask NxtOwner
              </button>
            </form>
          </div>

          {/* 3. NAVIGATION LINKS (Right) */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/browse" className="hover:text-white transition-colors">Buy</Link>
            <Link href="/sell" className="hover:text-white transition-colors">Sell</Link>
            <Link href="/valuation" className="hover:text-white transition-colors">Valuation</Link>
            
            <div className="h-6 w-px bg-white/10 mx-2"></div>
            
            <Link href="/dashboard" className="flex items-center gap-2 hover:text-white">
              <UserCircle size={20} />
              <span>Sign In</span>
            </Link>
            <Link 
              href="/sell/onboarding" 
              className="bg-white text-slate-900 hover:bg-slate-200 px-4 py-2 rounded-full font-bold text-xs transition-colors"
            >
              List Your Business
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300 hover:text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-white/10 p-4 space-y-4">
          <form onSubmit={handleSearch} className="relative">
             <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-slate-800 text-white p-3 pl-4 rounded-lg border border-slate-700 focus:border-blue-500 outline-none"
             />
             <button type="submit" className="absolute right-2 top-2 bg-blue-600 p-1.5 rounded-md text-white"><Search size={16} /></button>
          </form>
          <div className="flex flex-col space-y-3 text-slate-300 font-medium">
            <Link href="/browse" className="block py-2 hover:text-white">Buy a Business</Link>
            <Link href="/sell" className="block py-2 hover:text-white">Sell a Business</Link>
            <Link href="/valuation" className="block py-2 hover:text-white">Free Valuation</Link>
            <Link href="/dashboard" className="block py-2 text-blue-400">My Dashboard</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
