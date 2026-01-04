import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getDashboardProfile, getSellerListingsSummary } from "@/app/actions/dashboards";
import ProfileSummaryCard from "@/components/dashboards/ProfileSummaryCard";
import QuickActionsGrid from "@/components/dashboards/QuickActionsGrid";
import SellerListingsSummary from "@/components/dashboards/SellerListingsSummary";

export default async function SellerDashboardPage() {
  // Get current user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch dashboard data
  const dashboardProfile = await getDashboardProfile();
  const listingsSummary = await getSellerListingsSummary(user.id);

  if (!dashboardProfile) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Seller Dashboard</h1>
        <p className="text-slate-600 mt-4">Unable to load profile data.</p>
      </div>
    );
  }

  // Check if user is admin/founder (for conditional link)
  const isAdmin = dashboardProfile.role === 'admin' || dashboardProfile.role === 'founder';

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

      <ProfileSummaryCard profile={dashboardProfile} />

      <SellerListingsSummary summary={listingsSummary} />

      <QuickActionsGrid actions={quickActions} />
    </div>
  );
}


