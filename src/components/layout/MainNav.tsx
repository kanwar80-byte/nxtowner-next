import Link from "next/link";
import MainNavClient from "./MainNavClient";

type NavItem = { href: string; label: string };

export function MainNav({ isAuthed }: { isAuthed: boolean }) {
  const items: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/sell", label: "Sell" },
    { href: "/valuation", label: "Valuation" },
    { href: "/resources", label: "Resources" },
    { href: "/partners", label: "Partners" },
    { href: "/pricing", label: "Pricing" },

    // Optional / coming soon
    { href: "/deal-room/preview", label: "Deal Room (coming soon)" },
    { href: "/tools/calculators", label: "Calculators (coming soon)" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative">
        <Link href="/" className="font-extrabold text-slate-900 tracking-tight">
          NxtOwner
        </Link>

        <MainNavClient isAuthed={isAuthed} items={items} />
      </nav>
    </header>
  );
}
