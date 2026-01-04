'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard, 
  Briefcase 
} from 'lucide-react';

// --- TYPES ---
interface NavLinkChild {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href: string;
  children?: NavLinkChild[];
}

// --- CONFIGURATION ---
const NAV_LINKS_PUBLIC: NavLink[] = [
  { 
    label: 'Browse', 
    href: '/browse',
    children: [
      { label: 'All Listings', href: '/browse' },
      { label: 'Operational', href: '/browse/operational' },
      { label: 'Digital', href: '/browse/digital' },
    ]
  },
  { label: 'Sell', href: '/sell' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/resources' },
];

const NAV_LINKS_USER: NavLink[] = [
  { label: 'Browse', href: '/browse' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'My Deal Rooms', href: '/deal-room' },
  { label: 'Saved', href: '/buyer/saved' },
];

export default function Navbar() {
  // SIMULATE AUTH STATE (Hook up to Supabase/NextAuth later)
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeLinks = isLoggedIn ? NAV_LINKS_USER : NAV_LINKS_PUBLIC;

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/5 
      ${isScrolled ? 'bg-[#050505]/90 backdrop-blur-md py-3 shadow-lg' : 'bg-[#050505] py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* 1. LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-bold tracking-tighter text-white">
              NxtOwner<span className="text-orange-500 group-hover:animate-pulse">.</span>
            </div>
          </Link>

          {/* 2. DESKTOP NAVIGATION (CENTER) */}
          <div className="hidden md:flex items-center gap-8">
            {activeLinks.map((link) => (
              <div 
                key={link.label} 
                className="relative group"
              >
                <Link 
                  href={link.href} 
                  className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {link.label}
                  {link.children && <ChevronDown size={14} className="opacity-50" />}
                </Link>

                {/* Dropdown Menu */}
                {link.children && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="py-2">
                      {link.children?.map((child: NavLinkChild) => (
                        <Link 
                          key={child.label} 
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-orange-400"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 3. ACTIONS (RIGHT SIDE) */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* Search Icon (Always visible) */}
            <button className="text-gray-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>

            {isLoggedIn ? (
              // --- LOGGED IN STATE ---
              <div className="flex items-center gap-4">
                <button className="relative text-gray-400 hover:text-white">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full"></span>
                </button>
                
                {/* User Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="h-9 w-9 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      U
                    </div>
                  </button>
                  
                  {/* User Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#111] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2 space-y-1">
                      <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-md">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <Link href="/billing" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-md">
                        <Briefcase size={16} /> Billing
                      </Link>
                      <div className="h-px bg-white/10 my-1"></div>
                      <button 
                        onClick={() => setIsLoggedIn(false)} 
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md text-left"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // --- PUBLIC / GUEST STATE ---
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsLoggedIn(true)} 
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Log In
                </button>
                <Link 
                  href="/sell" 
                  className="bg-white text-black hover:bg-orange-500 hover:text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,107,0,0.4)]"
                >
                  List a Business
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 4. MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#050505] border-t border-white/10 absolute top-full left-0 w-full h-screen px-4 py-6 space-y-6">
          <div className="space-y-4">
            {activeLinks.map((link) => (
              <div key={link.label}>
                <Link 
                  href={link.href} 
                  className="block text-lg font-medium text-white py-2 border-b border-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
                {/* Mobile Submenu Items */}
                {link.children && (
                  <div className="pl-4 mt-2 space-y-2">
                    {link.children.map((child: NavLinkChild) => (
                       <Link 
                       key={child.label} 
                       href={child.href} 
                       className="block text-sm text-gray-500 py-1"
                     >
                       {child.label}
                     </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="pt-6 border-t border-white/10">
            {isLoggedIn ? (
               <button 
               onClick={() => setIsLoggedIn(false)}
               className="w-full bg-white/10 text-white py-3 rounded-lg font-medium"
             >
               Sign Out
             </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" className="w-full bg-white/5 text-center text-white py-3 rounded-lg font-medium">
                  Log In
                </Link>
                <Link href="/sell" className="w-full bg-orange-600 text-center text-white py-3 rounded-lg font-medium">
                  List Your Business
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
