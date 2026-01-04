'use client';

import React, { useState } from 'react';
import { 
  Linkedin, 
  Twitter, 
  MapPin, 
  ShieldCheck, 
  ChevronDown, 
  ArrowRight,
  Mail
} from 'lucide-react';
import Link from 'next/link';

// --- Configuration: Define your links here for easy management ---
const FOOTER_LINKS = [
  {
    title: "Marketplace",
    links: [
      { label: "Browse Acquisitions", href: "/marketplace" },
      { label: "Franchise Resales", href: "/marketplace/franchise" },
      { label: "Distressed Assets", href: "/marketplace/distressed" },
      { label: "Off-Market Deals", href: "/marketplace/off-market" }, // High value link
    ]
  },
  {
    title: "For Owners & Brokers",
    links: [
      { label: "List a Business", href: "/sell" },
      { label: "Valuation Calculator", href: "/tools/valuation" },
      { label: "Broker Partner Program", href: "/partners" }, // Supply side engine
      { label: "Seller FAQ", href: "/resources/seller-faq" },
    ]
  },
  {
    title: "Market Intelligence",
    links: [
      { label: "V17 Market Briefings", href: "/intelligence" },
      { label: "Comparable Sales Data", href: "/data/comps" }, // Enterprise grade data
      { label: "Due Diligence Checklist", href: "/resources/dd-checklist" },
      { label: "Ontario Growth Trends", href: "/intelligence/ontario" },
    ]
  },
  {
    title: "Corporate",
    links: [
      { label: "About NxtOwner", href: "/about" },
      { label: "Investor Relations", href: "/ir" }, // Trust signal
      { label: "Careers", href: "/careers" },
      { label: "Contact Deal Desk", href: "/contact" },
    ]
  }
];

export default function Footer() {
  // State for mobile accordion toggle
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  return (
    <footer className="bg-[#050505] text-white border-t border-white/10 font-sans">
      
      {/* 1. PRE-FOOTER: High Value CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold tracking-tight mb-2">
              Get the V17 Market Briefing
            </h3>
            <p className="text-gray-400 text-sm max-w-md">
              Exclusive deal flow, off-market alerts, and valuation trends for Ontario's commercial sector.
            </p>
          </div>
          
          <div className="w-full md:w-auto">
            <form className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="investor@example.com"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 w-full md:w-80 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2">
                Get Data <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Logo Placeholder */}
            <div className="text-2xl font-bold tracking-tighter text-white">
              NxtOwner<span className="text-orange-500">.</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              The operating system for real world acquisitions. We bring data-driven clarity to the chaotic world of buying and selling businesses.
            </p>
            
            {/* Trust Badges / Socials */}
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>

            {/* Location Trust Signal */}
            <div className="flex items-center gap-2 text-gray-500 text-xs pt-4">
              <MapPin size={14} />
              <span>Toronto, ON • Canada</span>
            </div>
          </div>

          {/* Links Columns (4 Cols) */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            {FOOTER_LINKS.map((section) => (
              <div key={section.title} className="border-b border-white/10 md:border-none pb-4 md:pb-0">
                {/* Header - Interactive on Mobile, Static on Desktop */}
                <button 
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex justify-between items-center md:cursor-default text-left group"
                >
                  <h4 className="font-semibold text-white tracking-wide text-sm uppercase opacity-90">
                    {section.title}
                  </h4>
                  {/* Chevron only shows on Mobile */}
                  <ChevronDown 
                    size={16} 
                    className={`md:hidden text-gray-500 transition-transform ${openSection === section.title ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Links List - Toggle on Mobile, Always Block on Desktop */}
                <ul className={`mt-4 space-y-3 ${openSection === section.title ? 'block' : 'hidden'} md:block`}>
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href}
                        className="text-gray-500 hover:text-orange-500 text-sm transition-colors duration-200 block"
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
      </div>

      {/* 3. BOTTOM UTILITY BAR */}
      <div className="border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
            
            <div className="flex items-center gap-6">
              <span>© {new Date().getFullYear()} NxtOwner Inc.</span>
              <span className="hidden md:inline">|</span>
              <div className="flex items-center gap-1 text-emerald-500/80">
                <ShieldCheck size={12} />
                <span>Secure Platform</span>
              </div>
            </div>

            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
              <Link href="/sitemap" className="hover:text-gray-400 transition-colors">Sitemap</Link>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
