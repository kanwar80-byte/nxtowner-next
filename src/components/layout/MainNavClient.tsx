"use client";

import * as React from "react";
import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
};

export default function MainNavClient({
  isAuthed,
  items,
}: {
  isAuthed: boolean;
  items: NavItem[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-3">
      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            {it.label}
          </Link>
        ))}

        {!isAuthed ? (
          <>
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Sign up
            </Link>
          </>
        ) : (
          <Link
            href="/dashboard"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Dashboard
          </Link>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle menu"
      >
        Menu
      </button>

      {/* Mobile menu panel */}
      {open ? (
        <div className="md:hidden absolute left-0 right-0 top-full border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
                onClick={() => setOpen(false)}
              >
                {it.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              {!isAuthed ? (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    onClick={() => setOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
