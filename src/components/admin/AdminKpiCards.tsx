import { UserKpiData } from "@/lib/admin/queries";

interface AdminKpiCardsProps {
  kpis: UserKpiData;
}

export default function AdminKpiCards({ kpis }: AdminKpiCardsProps) {
  const formatValue = (value: number | null): string => {
    if (value === null) return "n/a";
    return value.toLocaleString();
  };

  const formatHealth = (health: Record<string, number> | null): string => {
    if (!health) return "n/a";
    const entries = Object.entries(health);
    if (entries.length === 0) return "n/a";
    return entries.map(([key, count]) => `${key}: ${count}`).join(", ");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Users (Auth) */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-slate-600 mb-2">Total Users (Auth)</div>
        <div className="text-2xl font-bold text-slate-900">{formatValue(kpis.authTotal)}</div>
      </div>

      {/* Total Profiles */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-slate-600 mb-2">Total Profiles</div>
        <div className="text-2xl font-bold text-slate-900">{kpis.profilesTotal.toLocaleString()}</div>
      </div>

      {/* Buyers Count */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-slate-600 mb-2">Buyers</div>
        <div className="text-2xl font-bold text-blue-600">{kpis.buyersCount.toLocaleString()}</div>
      </div>

      {/* Sellers Count */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-slate-600 mb-2">Sellers</div>
        <div className="text-2xl font-bold text-green-600">{kpis.sellersCount.toLocaleString()}</div>
      </div>

      {/* Partners Count */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-slate-600 mb-2">Partners</div>
        <div className="text-2xl font-bold text-purple-600">{kpis.partnersCount.toLocaleString()}</div>
      </div>

      {/* Admins + Founders Count */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-slate-600 mb-2">Admins + Founders</div>
        <div className="text-2xl font-bold text-orange-600">{kpis.adminsFoundersCount.toLocaleString()}</div>
      </div>

      {/* Profiles Health */}
      <div className="rounded-xl border bg-white p-5 shadow-sm col-span-1 sm:col-span-2">
        <div className="text-sm font-medium text-slate-600 mb-2">Profiles Health</div>
        <div className="text-sm text-slate-700">{formatHealth(kpis.profilesHealth)}</div>
      </div>
    </div>
  );
}
