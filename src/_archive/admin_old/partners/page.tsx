import { requireAuth, getUserProfile } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPendingPartnerProfiles } from "@/app/actions/partners";
import { PartnerApprovalCard } from "@/components/admin/PartnerApprovalCard";

export const revalidate = 0;

export default async function AdminPartnersPage() {
  await requireAuth();
  const profile = await getUserProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const pendingPartners = await getPendingPartnerProfiles();

  return (
    <main className="bg-brand-bg min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-brand-text">
            Partner Applications
          </h1>
          <p className="text-brand-muted mt-2">
            Review and approve partner applications
          </p>
        </div>

        {pendingPartners.length === 0 ? (
          <div className="bg-white rounded-lg border border-brand-border p-12 text-center">
            <div className="text-6xl mb-6">✓</div>
            <h3 className="text-xl font-semibold text-brand-text mb-2">
              No pending applications
            </h3>
            <p className="text-brand-muted">
              All partner applications have been reviewed
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingPartners.map((partner) => (
              <PartnerApprovalCard key={partner.id} partner={partner} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
