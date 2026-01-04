import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/getProfile";

export default async function PartnerDashboardPage() {
  // Enforce partner role - redirects to /dashboard if role doesn't match
  const { profile } = await requireRole('partner', '/partner/dashboard');

  // Check if onboarding is incomplete
  const onboardingIncomplete = 
    profile.onboarding_status !== 'completed' ||
    !profile.roles ||
    profile.roles.length === 0 ||
    !profile.preferred_track;

  if (onboardingIncomplete) {
    redirect("/onboarding");
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Partner Dashboard</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="font-medium mb-2 text-slate-900">Getting Started</h2>
        <p className="text-sm text-slate-600">
          Manage your listings, track leads, and connect buyers with sellers.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="font-medium mb-2 text-slate-900">Your Network</h2>
        <p className="text-sm text-slate-600">
          View your active listings and lead pipeline here.
        </p>
      </section>
    </div>
  );
}

