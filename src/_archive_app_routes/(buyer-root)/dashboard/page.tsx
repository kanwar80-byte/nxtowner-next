import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/getProfile";
import { getDashboardProfile } from "@/app/actions/dashboards";
import ProfileSummaryCard from "@/components/dashboards/ProfileSummaryCard";
import QuickActionsGrid from "@/components/dashboards/QuickActionsGrid";

export default async function BuyerDashboardPage() {
  // Enforce buyer role - redirects to /dashboard if role doesn't match
  const { profile } = await requireRole('buyer', '/buyer/dashboard');

  // Check if onboarding is incomplete
  const onboardingIncomplete = 
    profile.onboarding_status !== 'completed' ||
    !profile.roles ||
    profile.roles.length === 0 ||
    !profile.preferred_track;

  if (onboardingIncomplete) {
    redirect("/onboarding");
  }

  // Fetch dashboard profile data
  const dashboardProfile = await getDashboardProfile();

  // Quick actions for buyers
  const quickActions = [
    {
      title: "Browse Operational Assets",
      description: "Explore real estate and physical businesses",
      href: "/browse/operational",
      icon: "🏢",
    },
    {
      title: "Browse Digital Assets",
      description: "Discover SaaS, online businesses, and digital products",
      href: "/browse/digital",
      icon: "💻",
    },
    {
      title: "My Dashboard",
      description: "View your saved listings and activity",
      href: "/buyer/dashboard",
      icon: "📊",
    },
    {
      title: "Find Partners",
      description: "Connect with brokers, lawyers, and advisors",
      href: "/partners",
      icon: "🤝",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Buyer Dashboard</h1>

      {dashboardProfile && (
        <ProfileSummaryCard profile={dashboardProfile} />
      )}

      <QuickActionsGrid actions={quickActions} />

      {/* Coming Soon Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Saved Listings & NDAs</h2>
        <p className="text-sm text-slate-600">
          Your saved listings and active NDAs will appear here. Coming soon!
        </p>
      </div>
    </div>
  );
}

