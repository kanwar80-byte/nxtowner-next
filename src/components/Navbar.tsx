'use client';

import { createClient } from '@/utils/supabase/client';
import { Menu, Search, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const supabase = createClient();

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to browse with the search query
      router.push(`/browse?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Transparent on top, Dark Navy when scrolled
  const navClasses = `fixed w-full z-50 transition-all duration-300 ${
    isScrolled ? 'bg-[#0f172a]/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
  }`;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* LOGO: Nxt(White) Owner(Gold) */}
          <Link href="/" className="flex items-center gap-1 group">
            <div className="bg-blue-600 text-white font-bold text-xl h-8 w-8 rounded flex items-center justify-center">N</div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Nxt<span className="text-[#EAB308]">Owner</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            {['Browse', 'Valuation', 'Resources', 'Partners'].map((item) => (
               <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                 {item}
               </Link>
            ))}
            
            <Link href="/login" className="text-sm font-bold text-white hover:text-[#EAB308] transition-colors">
              Sign In
            </Link>

            {/* GOLD BUTTON (Primary Action) */}
            <Link 
              href="/sell/onboarding" 
              className="bg-[#EAB308] hover:bg-[#CA8A04] text-slate-900 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-[#EAB308]/20 transform hover:-translate-y-0.5"
            >
              List Your Business
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-slate-800">
          <div className="px-4 pt-2 pb-8 space-y-1">
             {['Browse', 'Valuation', 'Resources', 'Partners'].map((item) => (
               <Link key={item} href={`/${item.toLowerCase()}`} className="block px-3 py-4 text-base font-medium text-slate-300 hover:text-white border-b border-slate-800">
                 {item}
               </Link>
             ))}
             <Link href="/sell/onboarding" className="block mt-4 text-center bg-[#EAB308] text-slate-900 py-3 rounded-lg font-bold">
               List Your Business
             </Link>
          </div>
        </div>
      )}

      {/* 2. THE "NXTOWNER" AI SEARCH BAR (Center) - Always Visible */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
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
<<<<<<< HEAD
=======

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

            {/* 👇 THIS IS THE CRITICAL UPDATE 👇 */}
            <Link 
              href="/sell/onboarding"  
              className="bg-[#EAB308] text-slate-900 hover:bg-[#CA8A04] px-4 py-2 rounded-full font-bold text-xs transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Sell Your Business
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300 hover:text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
>>>>>>> 611d1ff (STABLE CHECKPOINT: Baseline structure restored. Ready for canonical cleanup.)
        </div>
      </div>
    </nav>
  );
}
