"use client";

import { useTrack } from "@/contexts/TrackContext";
import { TrendingUp, Users, ShieldCheck, Activity } from "lucide-react";

export default function StatsTicker() {
  const { track } = useTrack();

  // DYNAMIC DATA CONFIG
  const stats = {
    operational: [
      { label: "Deal Volume", value: "$125M+", icon: TrendingUp },
      { label: "Active Buyers", value: "2,400+", icon: Users },
      { label: "Verified Brokers", value: "150+", icon: ShieldCheck },
      { label: "Avg. Close Time", value: "4.5 Months", icon: Activity },
    ],
    digital: [
      { label: "Tech Volume", value: "$45M+", icon: TrendingUp },
      { label: "SaaS Investors", value: "850+", icon: Users },
      { label: "Founder Exits", value: "300+", icon: ShieldCheck },
      { label: "Avg. Close Time", value: "32 Days", icon: Activity },
    ]
  };

  const currentStats = track === 'operational' ? stats.operational : stats.digital;

  return (
    <div className="w-full bg-slate-900 border-y border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-800">
          {currentStats.map((stat, index) => (
            <div key={index} className="py-6 flex flex-col items-center justify-center text-center group hover:bg-slate-800/50 transition-colors cursor-default">
              <div className="flex items-center space-x-2 mb-1">
                <stat.icon className={`w-4 h-4 ${track === 'operational' ? 'text-amber-500' : 'text-teal-500'}`} />
                <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
              </div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




