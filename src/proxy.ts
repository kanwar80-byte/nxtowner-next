import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals and static assets
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Validate env vars
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protected routes by role
  const protectedRoutes: Record<string, string[]> = {
    "/admin": ["admin", "founder"],
    "/api/admin": ["admin", "founder"],
    "/seller": ["seller"],
    "/partner": ["partner"],
    "/buyer": ["buyer"],
  };

  const matchedRoute = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route)
  );
  const isProtectedRoute = Boolean(matchedRoute);

  // Create response we will return (so any refreshed cookies are included)
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Keep request cookies in sync during this middleware run
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          // Recreate response and attach new cookies
          response = NextResponse.next({
            request: { headers: request.headers },
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // ✅ This is the refresh "touchpoint" for @supabase/ssr@0.8.0
  // It will cause any needed cookie updates to flow through cookies.setAll(...)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If route is not protected, still return response so refreshed cookies persist
  if (!isProtectedRoute) {
    return response;
  }

  // Protected route: must be authenticated
  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Role check
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile?.role) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const allowedRoles = protectedRoutes[matchedRoute!];
  if (!allowedRoles.includes(profile.role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$).*)"
  ],
};
