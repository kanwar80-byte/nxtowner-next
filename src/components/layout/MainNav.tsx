"use client";

import { supabaseBrowser } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MainNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      setEmail(data.user?.email ?? null);
    })();
    return () => { active = false; };
  }, []);

  const logout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">NxtOwner</Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link href="/browse" className={pathname?.startsWith("/browse") ? "font-semibold" : "text-slate-700"}>
            Browse
          </Link>

          <Link href="/dashboard" className={pathname?.startsWith("/dashboard") ? "font-semibold" : "text-slate-700"}>
            Dashboard
          </Link>

          {email ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-slate-600">{email}</span>
              <button onClick={logout} className="rounded-md border border-slate-200 px-3 py-1 hover:bg-slate-50">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="rounded-md border border-slate-200 px-3 py-1 hover:bg-slate-50">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
