import "server-only";

/**
 * Single source of truth for post-login routing.
 * Determines where a user should be redirected after authentication.
 */
export function getPostLoginRoute(profile: {
  role?: string | null;
  roles?: string[] | null;
  onboarding_status?: string | null;
  preferred_track?: string | null;
}): string {
  // Admin and Founder bypass onboarding
  if (profile.role === 'admin') {
    return '/admin';
  }

  if (profile.role === 'founder') {
    return '/founder';
  }

  // Check if onboarding is incomplete
  const onboardingIncomplete = 
    profile.onboarding_status !== 'completed' ||
    !profile.roles ||
    profile.roles.length === 0 ||
    !profile.preferred_track;

  if (onboardingIncomplete) {
    return '/onboarding';
  }

  // Determine primary role for routing
  const primaryRole = profile.role ?? (profile.roles?.[0] ?? 'buyer');

  // Route based on primary role
  switch (primaryRole) {
    case 'buyer':
      return '/buyer/dashboard';
    case 'seller':
      return '/seller/dashboard';
    case 'partner':
      return '/partner/dashboard';
    default:
      // Fallback to buyer dashboard
      return '/buyer/dashboard';
  }
}




