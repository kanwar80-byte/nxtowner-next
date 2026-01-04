import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getPostLoginRoute } from "@/lib/auth/redirect";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, roles, onboarding_status, preferred_track")
    .eq("id", user.id)
    .single();

  // Admin and Founder bypass onboarding
  if (profile?.role === "admin" || profile?.role === "founder") {
    redirect(getPostLoginRoute(profile));
  }

  // If onboarding is already completed, redirect to appropriate dashboard
  if (profile?.onboarding_status === "completed" && profile?.roles && profile?.preferred_track) {
    redirect(getPostLoginRoute(profile));
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <OnboardingWizard />
    </div>
  );
}


