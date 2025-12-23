"use client";

import { supabaseBrowser } from "@/lib/supabase/client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MainNav() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const supabase = supabaseBrowser();

  useEffect(() => {
    "use client";

    import React, { useState, useEffect } from 'react';
    import Link from 'next/link';
    import { useRouter } from 'next/navigation';
    import { supabaseBrowser } from "@/lib/supabase/client";

    export default function MainNav() {
      const router = useRouter();
      const [user, setUser] = useState<any>(null);
      const supabase = supabaseBrowser();

      useEffect(() => {
        const checkUser = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          setUser(user);
        };
        checkUser();
      }, []);

      const handleDashboardClick = async () => {
        if (!user) return router.push('/login');

        // WIRING: This queries the exact table we verified in Supabase
        const { data: participant } = await supabase
          .from('deal_participants')
          .select('deal_id')
          .eq('user_id', user.id)
          .single();

        if (participant?.deal_id) {
          // Redirects you to the specific room we built
          router.push(`/platform/deals/${participant.deal_id}`);
        } else {
          router.push('/platform/browse');
        }
      };

      return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B1221] h-20 border-b border-white/10 shadow-lg">
          <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 group">
              <div className="bg-blue-600 text-white font-bold text-xl h-8 w-8 rounded flex items-center justify-center">N</div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Nxt<span className="text-[#EAB308]">Owner</span>
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/browse" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                Browse
              </Link>
              {!user ? (
                <Link href="/login" className="text-sm font-semibold text-white">Sign In</Link>
              ) : (
                <button
                  onClick={handleDashboardClick}
                  className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-bold bg-[#D4AF37] text-[#0B1221] shadow-lg hover:bg-[#C5A028] transition-all"
                >
                  Dashboard
                </button>
              )}
            </div>
          </nav>
        </header>
      );
    }