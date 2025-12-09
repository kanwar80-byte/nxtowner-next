import { requireAuth, getUserProfile } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getPartnerProfileByUserId,
  getConsultationRequestsForPartner,
} from "@/app/actions/partners";
import Link from "next/link";
import { PartnerProfileForm } from "@/components/partners/PartnerProfileForm";
import { ConsultationRequestsList } from "@/components/partners/ConsultationRequestsList";
import { supabase } from "@/lib/supabase";
import { PlanStatus } from "@/components/billing/PlanStatus";

export const revalidate = 0; // Render on demand, not at build time

export default async function PartnerDashboardPage() {
  const user = await requireAuth();
  const { profile } = await getUserProfile();

  if (!profile || profile.role !== "partner") {
    redirect("/dashboard");
  }

  const partnerProfile = await getPartnerProfileByUserId(profile.id);

  // Fetch plan info
  const { data: planData } = await supabase
    .from('profiles')
    .select('plan, plan_renews_at')
    .eq('id', user.id)
    .single();

  // If no partner profile exists, show onboarding form
  if (!partnerProfile) {
    return (
      <main className="bg-brand-bg min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-brand-text">
              Partner Onboarding
            </h1>
            <p className="text-brand-muted mt-2">
              Complete your partner profile to get listed in our directory
            </p>
          </div>

          <PartnerProfileForm profileId={profile.id} />
        </div>
      </main>
    );
  }

  // Get consultation requests for this partner
  const consultationRequests = await getConsultationRequestsForPartner(
    partnerProfile.id
  );

  const pendingRequests = consultationRequests.filter(
    (req) => req.status === "pending"
  );
  const contactedRequests = consultationRequests.filter(
    (req) => req.status === "contacted"
  );

  return (
    <main className="bg-brand-bg min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-brand-text">
            Partner Dashboard
          </h1>
          <p className="text-brand-muted mt-2">
            Manage your profile and consultation requests
          </p>
        </div>

        {/* Plan Status */}
        {planData && (
          <div className="mb-8">
            <PlanStatus 
              plan={
                // @ts-expect-error - plan fields added in migration
                planData.plan || 'free'
              } 
              planRenewsAt={
                // @ts-expect-error - plan fields added in migration
                planData.plan_renews_at
              }
            />
          </div>
        )}

        {/* Status Banner */}
        <div className="mb-8">
          {partnerProfile.status === "pending" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Pending Approval:</strong> Your partner profile is under
                review. You&apos;ll be notified once it&apos;s approved and listed in our
                directory.
              </p>
            </div>
          )}
          {partnerProfile.status === "approved" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Active:</strong> Your profile is live in the{" "}
                <Link href="/partners" className="underline font-semibold">
                  Partner Directory
                </Link>
              </p>
            </div>
          )}
          {partnerProfile.status === "rejected" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>Application Rejected:</strong> Your partner application
                was not approved. Please contact support for details.
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg border border-brand-border p-6">
            <p className="text-sm text-brand-muted uppercase tracking-wide mb-1">
              Total Requests
            </p>
            <p className="text-3xl font-bold text-brand-text">
              {consultationRequests.length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-brand-border p-6">
            <p className="text-sm text-brand-muted uppercase tracking-wide mb-1">
              Pending
            </p>
            <p className="text-3xl font-bold text-orange-600">
              {pendingRequests.length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-brand-border p-6">
            <p className="text-sm text-brand-muted uppercase tracking-wide mb-1">
              In Progress
            </p>
            <p className="text-3xl font-bold text-blue-600">
              {contactedRequests.length}
            </p>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white rounded-lg border border-brand-border p-8 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-brand-text">
              Your Profile
            </h2>
            <Link
              href="/dashboard/partner/edit"
              className="px-4 py-2 bg-brand-orange text-white font-semibold rounded-md hover:bg-orange-600 transition text-sm"
            >
              Edit Profile
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-brand-text mb-1">
                Firm Name
              </p>
              <p className="text-brand-muted">{partnerProfile.firm_name}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-text mb-1">
                Partner Type
              </p>
              <p className="text-brand-muted capitalize">
                {partnerProfile.partner_type}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-text mb-1">
                Contact Email
              </p>
              <p className="text-brand-muted">{partnerProfile.contact_email}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-text mb-1">
                Years Experience
              </p>
              <p className="text-brand-muted">
                {partnerProfile.years_experience || "Not specified"}
              </p>
            </div>
          </div>

          {partnerProfile.specialties && partnerProfile.specialties.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-brand-text mb-2">
                Specialties
              </p>
              <div className="flex flex-wrap gap-2">
                {partnerProfile.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Consultation Requests */}
        <div className="bg-white rounded-lg border border-brand-border p-8">
          <h2 className="text-xl font-bold text-brand-text mb-6">
            Consultation Requests
          </h2>
          <ConsultationRequestsList requests={consultationRequests} />
        </div>
      </div>
    </main>
  );
}
