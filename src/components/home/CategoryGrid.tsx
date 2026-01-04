"use client";

import { useTrack } from "@/contexts/TrackContext";
import { 
  Fuel, Store, Truck, Utensils, ShoppingBag, 
  Globe, Server, Cpu, Laptop, Briefcase, 
  Building2, Wrench, Smartphone, Search, Users
} from "lucide-react";
import Link from "next/link";

export default function CategoryGrid() {
  const { track } = useTrack();

  // DYNAMIC CATEGORIES
  const categories = {
    operational: [
      { name: "Gas Stations", count: "142", icon: Fuel },
      { name: "Restaurants", count: "320", icon: Utensils },
      { name: "Franchises", count: "85", icon: Store, highlight: true }, // Highlighted High-Trust Category
      { name: "Transport", count: "54", icon: Truck },
      { name: "Retail", count: "210", icon: ShoppingBag },
      { name: "Industrial", count: "45", icon: Building2 },
      { name: "Services", count: "120", icon: Wrench },
      { name: "Main Street", count: "500+", icon: Briefcase },
    ],
    digital: [
      { name: "SaaS", count: "120", icon: Server, highlight: true }, // Highlighted High-Margin Category
      { name: "E-Commerce", count: "340", icon: ShoppingBag },
      { name: "AI Tools", count: "45", icon: Cpu },
      { name: "Agencies", count: "85", icon: Globe },
      { name: "Mobile Apps", count: "65", icon: Smartphone },
      { name: "Content Sites", count: "110", icon: Laptop },
      { name: "Domains", count: "900+", icon: Search },
      { name: "Communities", count: "30", icon: Users },
    ]
  };

  const currentCats = track === 'operational' ? categories.operational : categories.digital;

  return (
    <section className="py-12 bg-slate-950 border-b border-slate-900">
      <div className="container mx-auto px-4">
        
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white">
            Browse by {track === 'operational' ? 'Industry' : 'Business Model'}
          </h3>
          <Link href="/search" className="text-sm text-slate-400 hover:text-white transition-colors">
            View all categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {currentCats.map((cat, idx) => (
            <Link key={idx} href={`/search?category=${cat.name}`} className="group">
              <div className={`
                flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200
                ${cat.highlight 
                  ? (track === 'operational' ? 'bg-amber-900/10 border-amber-500/30 hover:border-amber-500' : 'bg-teal-900/10 border-teal-500/30 hover:border-teal-500') 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800'}
              `}>
                <cat.icon className={`w-8 h-8 mb-3 ${track === 'operational' ? 'text-amber-500' : 'text-teal-500'} group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-bold text-slate-200 text-center">{cat.name}</span>
                <span className="text-xs text-slate-500 mt-1">{cat.count} listings</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
