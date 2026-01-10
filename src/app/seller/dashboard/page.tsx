import { requireUser } from "@/lib/auth/requireUser";
import { getSellerDashboardData } from "@/lib/seller/sellerDashboard.repo";
import SellerDashboardShell from "./components/SellerDashboardShell";

export default async function SellerDashboardPage() {
  const user = await requireUser();
  
  const dashboardData = await getSellerDashboardData(user.id);

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-[#050505] text-slate-200 pt-24">
        <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <p className="text-slate-400">Unable to load dashboard data. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return <SellerDashboardShell dashboardData={dashboardData} />;
}
