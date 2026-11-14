import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasEnvVars) {
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
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Gunakan getUser() yang valid & selaras dengan Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. Jika user belum login dan mengakses halaman dashboard/layanan yang diproteksi
  if (!user && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // 2. Jika user sudah login dan mencoba membuka halaman login atau pendaftaran
  if (user && (pathname === "/auth/login" || pathname === "/auth/sign-up")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 3. Proteksi Akses Portal Admin Kedinasan (/admin/*)
  const adminCookie = request.cookies.get("govhub_admin_session")?.value;
  const isAdminLoginPath =
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login") ||
    pathname.endsWith("/login");

  // Validasi format cookie admin yang sah: {instansi}_{tingkat}
  const validAdminCookies = new Set([
    "pusat_pusat",
    "dukcapil_kota",
    "dukcapil_kecamatan",
    "dukcapil_pusat",
    "dinsos_kota",
    "dinsos_kecamatan",
    "dinsos_provinsi",
    "dinsos_pusat",
  ]);
  const isValidAdminSession = adminCookie && validAdminCookies.has(adminCookie);

  if (pathname.startsWith("/admin") && !isAdminLoginPath) {
    if (!isValidAdminSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Role-Based Access Control (RBAC) Path Isolation:
    // Mencegah admin Dukcapil mengakses rute Dinsos atau sebaliknya
    const [instansi, tingkat] = adminCookie.split("_");
    if (instansi === "dukcapil" && pathname.startsWith("/admin/dinsos")) {
      const url = request.nextUrl.clone();
      url.pathname = tingkat === "kota" ? "/admin/dukcapil/kota/dashboard" : "/admin/dukcapil/kecamatan/dashboard";
      return NextResponse.redirect(url);
    }
    if (instansi === "dinsos" && pathname.startsWith("/admin/dukcapil")) {
      const url = request.nextUrl.clone();
      url.pathname =
        tingkat === "provinsi"
          ? "/admin/dinsos/provinsi/dashboard"
          : tingkat === "kota"
          ? "/admin/dinsos/kota/dashboard"
          : "/admin/dinsos/kecamatan/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Jika sudah login admin dan mencoba membuka /admin/login
  if (isValidAdminSession && isAdminLoginPath) {
    const [instansi, tingkat] = adminCookie.split("_");
    const url = request.nextUrl.clone();
    if (instansi === "pusat" || tingkat === "provinsi" || tingkat === "pusat") {
      url.pathname = "/admin/dashboard";
    } else if (instansi === "dukcapil") {
      url.pathname = tingkat === "kota" ? "/admin/dukcapil/kota/dashboard" : "/admin/dukcapil/kecamatan/dashboard";
    } else {
      url.pathname =
        tingkat === "kota"
          ? "/admin/dinsos/kota/dashboard"
          : "/admin/dinsos/kecamatan/dashboard";
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
