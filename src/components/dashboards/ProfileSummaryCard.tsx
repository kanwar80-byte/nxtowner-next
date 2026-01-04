import type { DashboardProfile } from "@/app/actions/dashboards";

interface ProfileSummaryCardProps {
  profile: DashboardProfile;
}

export default function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile Summary</h2>
      <div className="space-y-3">
        <div>
          <div className="text-sm text-slate-500">Email</div>
          <div className="text-base font-medium text-slate-900">{profile.email || "Not set"}</div>
        </div>
        {profile.full_name && (
          <div>
            <div className="text-sm text-slate-500">Name</div>
            <div className="text-base font-medium text-slate-900">{profile.full_name}</div>
          </div>
        )}
        {profile.role && (
          <div>
            <div className="text-sm text-slate-500">Role</div>
            <div className="text-base font-medium text-slate-900 capitalize">{profile.role}</div>
          </div>
        )}
        {profile.tier && (
          <div>
            <div className="text-sm text-slate-500">Subscription Tier</div>
            <div className="text-base font-medium text-slate-900 capitalize">{profile.tier}</div>
          </div>
        )}
      </div>
    </div>
  );
}


