'use client';

import { supabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js'; // Import User type
import { Menu, Search, Sparkles, User as UserIcon, X } from 'lucide-react'; // Added UserIcon
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null); // State for User

  // 1. Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Handle Auth State (Check if user is logged in)
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for changes (login/logout) so the navbar updates instantly
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const navClasses = `fixed w-full z-50 transition-all duration-300 ${
    isScrolled ? 'bg-[#0f172a]/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
  }`;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* LOGO */}
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
            
            {/* 3. CONDITIONAL AUTH LINKS */}
            {user ? (
                // IF LOGGED IN: Show Dashboard & Sign Out
                <>
                    <Link href="/dashboard" className="text-sm font-bold text-white hover:text-blue-400 transition-colors flex items-center gap-2">
                        <UserIcon size={16} />
                        Dashboard
                    </Link>
                    <button onClick={handleSignOut} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Sign Out
                    </button>
                </>
            ) : (
                // IF LOGGED OUT: Show Sign In
                <Link href="/login" className="text-sm font-bold text-white hover:text-[#EAB308] transition-colors">
                    Sign In
                </Link>
            )}

            {/* GOLD BUTTON */}
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

      {/* Mobile Menu (Dropdown) - Updated with Conditional Logic */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-slate-800">
          <div className="px-4 pt-2 pb-8 space-y-1">
             {['Browse', 'Valuation', 'Resources', 'Partners'].map((item) => (
               <Link key={item} href={`/${item.toLowerCase()}`} className="block px-3 py-4 text-base font-medium text-slate-300 hover:text-white border-b border-slate-800">
                 {item}
               </Link>
             ))}

             {user ? (
                 <>
                    <Link href="/dashboard" className="block px-3 py-4 text-base font-bold text-white border-b border-slate-800">
                        Dashboard
                    </Link>
                    <button onClick={handleSignOut} className="block w-full text-left px-3 py-4 text-base font-medium text-slate-400 border-b border-slate-800">
                        Sign Out
                    </button>
                 </>
             ) : (
                 <Link href="/login" className="block px-3 py-4 text-base font-bold text-white border-b border-slate-800">
                    Sign In
                 </Link>
             )}

             <Link href="/sell/onboarding" className="block mt-4 text-center bg-[#EAB308] text-slate-900 py-3 rounded-lg font-bold">
               List Your Business
             </Link>
          </div>
        </div>
      )}

      {/* AI SEARCH BAR (Unchanged) */}
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
              <button 
                type="submit"
                className="absolute inset-y-1 right-1 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-105"
              >
                <Sparkles size={12} className="animate-pulse" />
                Ask NxtOwner
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}