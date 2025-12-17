

'use client';

'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react'; // Keeping state for mobile menu if you have it

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // CHANGE 1: Main Bar Background -> Navy Blue (#0B1221)
    <nav
      className="fixed top-0 left-0 right-0 w-full z-50 h-20 transition-all border-b"
      style={{
        background: 'linear-gradient(90deg, var(--nx-nav-bg) 80%, #101a2e 100%)',
        color: 'var(--nx-nav-text)',
        borderBottom: '1px solid var(--nx-nav-border)',
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* LOGO SECTION */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nx-nav-ring)]">
              <Image 
                src="/logo.jpg" 
                alt="NxtOwner" 
                width={140} 
                height={45} 
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* DESKTOP LINKS - PRESERVING YOUR WIRED LINKS */}
          <div className="hidden lg:flex items-center gap-8">
            {['About', 'FAQ', 'How It Works', 'Buyers', 'Sellers', 'Resources'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="group text-sm font-semibold transition-colors relative text-[color:var(--nx-nav-text)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nx-nav-ring)]"
              >
                {item}
                <span className="absolute left-0 -bottom-1 h-0.5 w-full scale-x-0 bg-white/70 transition-transform group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          {/* ACTION BUTTONS (Admin / Dashboard) */}
          <div className="hidden lg:flex items-center gap-2 sm:gap-3">
            <Link 
              href="/admin" 
              className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold text-[color:var(--nx-nav-text)] border-[color:var(--nx-nav-border)] hover:bg-[color:var(--nx-nav-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nx-nav-ring)] transition-all"
            >
              Admin
            </Link>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white bg-[color:var(--nx-nav-cta)] border border-[color:var(--nx-nav-border)] shadow-md hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nx-nav-ring)] transition-all"
            >
              Dashboard
            </Link>
          </div>

          {/* MOBILE MENU BUTTON (If needed) */}
          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[color:var(--nx-nav-text)] hover:text-white p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nx-nav-ring)]"
            >
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Logic would go here (styled with bg-[#0B1221]) */}
    </nav>
  );
}
