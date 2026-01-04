import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/getProfile";
import { getDashboardProfile, getSellerListingsSummary } from "@/app/actions/dashboards";
import ProfileSummaryCard from "@/components/dashboards/ProfileSummaryCard";
import QuickActionsGrid from "@/components/dashboards/QuickActionsGrid";
import SellerListingsSummary from "@/components/dashboards/SellerListingsSummary";

export default async function SellerDashboardPage() {
  // Enforce seller role - redirects to /dashboard if role doesn't match
  const { user, profile } = await requireRole('seller', '/seller/dashboard');

  // Check if onboarding is incomplete
  const onboardingIncomplete = 
    profile.onboarding_status !== 'completed' ||
    !profile.roles ||
    profile.roles.length === 0 ||
    !profile.preferred_track;

  if (onboardingIncomplete) {
    redirect("/onboarding");
  }

  // Fetch dashboard data
  const dashboardProfile = await getDashboardProfile();
  const listingsSummary = await getSellerListingsSummary(user.id);

  // Determine if user is admin/founder (for conditional link)
  const isAdmin = profile.role === 'admin' || profile.role === 'founder';

  // Quick actions for sellers
  const quickActionsBase = [
    {
      title: "List Your Business",
      description: "Create a new listing to attract buyers",
      href: "/sell",
      icon: "➕",
    },
    {
      title: "Browse Marketplace",
      description: "See what other sellers are listing",
      href: "/browse/operational",
      icon: "🔍",
    },
    {
      title: "Find Partners",
      description: "Connect with brokers and advisors",
      href: "/partners",
      icon: "🤝",
    },
  ];

  const quickActions = isAdmin
    ? [
        ...quickActionsBase,
        {
          title: "Manage All Listings",
          description: "Admin access to all platform listings",
          href: "/admin/listings",
          icon: "🔧",
        },
      ]
    : quickActionsBase;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Seller Dashboard</h1>

      {dashboardProfile && (
        <ProfileSummaryCard profile={dashboardProfile} />
      )}

      <SellerListingsSummary summary={listingsSummary} />

      <QuickActionsGrid actions={quickActions} />
    </div>
  );
}

