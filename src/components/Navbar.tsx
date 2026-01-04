/**
 * ARCHIVED (DO NOT USE)
 * V17 live nav: src/components/layout/Navbar.tsx
 * Wired via: src/components/layout/ConditionalLayout.tsx -> src/app/layout.tsx
 */

'use client';

import { supabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Menu, User as UserIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ArchivedNavbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

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
          <Link href="/" className="flex items-center gap-1 group">
            <div className="bg-blue-600 text-white font-bold text-xl h-8 w-8 rounded flex items-center justify-center">N</div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Nxt<span className="text-[#EAB308]">Owner</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Browse</Link>
            <Link href="/valuation" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Valuation</Link>
            <Link href="/resources" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Resources</Link>
            <Link href="/partners" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Partners</Link>
            
            {user ? (
              <>
                {/* THIS IS THE CRITICAL FIX: Linking to /dashboard/buyer */}
                <Link href="/dashboard/buyer" className="text-sm font-bold text-white hover:text-blue-400 transition-colors flex items-center gap-2">
                  <UserIcon size={16} />
                  Dashboard
                </Link>
                <Link href="/sell/onboarding" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">List Your Business</Link>
                <button onClick={handleSignOut} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign Out</button>
              </>
            ) : (
                <Link href="/login" className="text-sm font-bold text-white hover:text-[#EAB308] transition-colors">Sign In</Link>
            )}

            <Link href="/sell/onboarding" className="bg-[#EAB308] hover:bg-[#CA8A04] text-slate-900 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-[#EAB308]/20 transform hover:-translate-y-0.5">
              List Your Business
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-slate-800">
          <div className="px-4 pt-2 pb-8 space-y-1">
             <Link href="/browse" className="block px-3 py-4 text-base font-medium text-slate-300">Browse</Link>
             <Link href="/dashboard/buyer" className="block px-3 py-4 text-base font-bold text-white">Dashboard</Link>
          </div>
        </div>
      )}
    </nav>
  );
}