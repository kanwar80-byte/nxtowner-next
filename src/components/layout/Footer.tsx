"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowUp, Twitter, Linkedin, Github, Mail, 
  ShieldCheck, Globe, MapPin 
} from 'lucide-react';

export default function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Scroll Listener for Back-to-Top Button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#02040a] border-t border-white/5 pt-20 pb-10 relative">
      <div className="container mx-auto px-4">
        
        {/* TOP ROW: Brand & CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white tracking-tight mb-6 block">
              NxtOwner<span className="text-teal-500">.</span>
            </Link>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              The operating system for acquisitions. We verify data, structure deal rooms, and automate diligence for the next generation of owners.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink icon={Twitter} href="#" />
              <SocialLink icon={Linkedin} href="#" />
              <SocialLink icon={Mail} href="mailto:support@nxtowner.com" />
            </div>
          </div>

          {/* LINKS GRID */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Column 1: Marketplace */}
            <div>
              <h4 className="font-bold text-white mb-4">Marketplace</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/browse/operational" className="hover:text-amber-500 transition-colors">Real World Assets</Link></li>
                <li><Link href="/browse/digital" className="hover:text-teal-500 transition-colors">Digital Assets</Link></li>
                <li><Link href="/browse/operational?category=fuel_auto" className="hover:text-white transition-colors">Gas Stations</Link></li>
                <li><Link href="/browse/digital?model=saas" className="hover:text-white transition-colors">SaaS Listings</Link></li>
              </ul>
            </div>

            {/* Column 2: Tools */}
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing & Plans</Link></li>
                <li><Link href="/sell/valuation" className="hover:text-white transition-colors">NxtValuation™</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Due Diligence</Link></li>
                <li><Link href="/sell" className="hover:text-white transition-colors">Exit Planning</Link></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                <li><Link href="/partners" className="hover:text-white transition-colors">Partner Program</Link></li>
                <li><Link href="/trust/verification" className="hover:text-white transition-colors">Trust & Verification</Link></li>
              </ul>
            </div>

            {/* Column 4: Compliance */}
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/legal/nda" className="hover:text-white transition-colors">NDA Standards</Link></li>
                <li><Link href="/legal/cookies" className="hover:text-white transition-colors">Cookie Settings</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Status & Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-xs font-mono text-green-500 uppercase">All Systems Operational</span>
          </div>
          
          <div className="text-slate-600 text-xs">
            © {new Date().getFullYear()} NxtOwner Inc. All rights reserved. Toronto, Canada.
          </div>
        </div>

      </div>

      {/* --- BACK TO TOP BUTTON --- */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-white text-black shadow-lg shadow-white/10 transition-all duration-500 z-50 hover:-translate-y-1 ${
          showTopBtn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

    </footer>
  );
}

function SocialLink({ icon: Icon, href }: { icon: any, href: string }) {
  return (
    <a href={href} className="p-2 rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all">
      <Icon className="w-4 h-4" />
    </a>
  );
}
