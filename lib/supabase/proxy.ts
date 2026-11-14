import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminPortalBasePath,
  verifyAdminSessionToken,
} from "@/lib/security";
import { hasEnvVars } from "../utils";

function redirectWithCookies(
  request: NextRequest,
  targetPathname: string,
  supabaseResponse: NextResponse,
  clearAdminCookie = false
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = targetPathname;
  url.search = "";
  const response = NextResponse.redirect(url);

  for (const cookie of supabaseResponse.cookies.getAll()) {
    response.cookies.set(cookie);
  }
  if (clearAdminCookie) {
    response.cookies.delete(ADMIN_SESSION_COOKIE);
  }
  return response;
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let supabaseResponse = NextResponse.next({ request });

  const isProtectedCitizenPath = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isAdminLoginPath = pathname === "/admin/login";
  const isProtectedAdminPath =
    pathname.startsWith("/admin/") && !isAdminLoginPath;

  if (!hasEnvVars) {
    if (isProtectedCitizenPath || isProtectedAdminPath) {
      return new NextResponse("Konfigurasi layanan belum tersedia.", { status: 503 });
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Use getUser() so Auth JWT is validated with Supabase Auth server on every request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Citizen dashboard routes require a valid Supabase Auth session
  if (!user && isProtectedCitizenPath) {
    return redirectWithCookies(request, "/auth/login", supabaseResponse);
  }

  // 2. Signed-in citizens on login/signup go straight to citizen dashboard
  if (user && (pathname === "/auth/login" || pathname === "/auth/sign-up")) {
    return redirectWithCookies(request, "/dashboard", supabaseResponse);
  }

  // 3. Strict HMAC-signed session check & cross-agency isolation for /admin/*
  const adminCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (isAdminLoginPath || isProtectedAdminPath) {
    const adminSession = await verifyAdminSessionToken(adminCookie);

    if (isProtectedAdminPath) {
      if (!adminSession) {
        return redirectWithCookies(request, "/admin/login", supabaseResponse, Boolean(adminCookie));
      }

      const assignedBasePath = getAdminPortalBasePath(
        adminSession.instansi,
        adminSession.tingkat
      );
      const isAllowedPortal =
        assignedBasePath !== "/admin/login" &&
        (pathname === assignedBasePath || pathname.startsWith(`${assignedBasePath}/`));

      if (!isAllowedPortal) {
        return redirectWithCookies(request, assignedBasePath, supabaseResponse);
      }
    }

    if (isAdminLoginPath && adminSession) {
      const assignedBasePath = getAdminPortalBasePath(
        adminSession.instansi,
        adminSession.tingkat
      );
      if (assignedBasePath !== "/admin/login") {
        return redirectWithCookies(request, assignedBasePath, supabaseResponse);
      }
    }
  }

  return supabaseResponse;
}
