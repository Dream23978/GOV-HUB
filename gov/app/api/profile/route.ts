import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Belum login" },
        { status: 401 }
      );
    }

    const sanitizeProfile = (p: Record<string, unknown>) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...safeProfile } = p;
      return safeProfile;
    };

    // Ambil data profil dari public.profiles
    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!pErr && profile) {
      return NextResponse.json({ success: true, data: sanitizeProfile(profile) });
    }

    // Fallback Admin
    const admin = createAdminClient();
    if (admin) {
      const { data: adminP } = await admin
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (adminP) {
        return NextResponse.json({ success: true, data: sanitizeProfile(adminP) });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        nik: user.user_metadata?.nik || null,
        nama_lengkap: user.user_metadata?.nama_lengkap || "Warga",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Belum login" },
        { status: 401 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Format JSON tidak valid" }, { status: 400 });
    }
    const allowedFields = [
      "nama_lengkap",
      "no_kk",
      "tempat_lahir",
      "tanggal_lahir",
      "jenis_kelamin",
      "alamat",
      "rt",
      "rw",
      "kelurahan",
      "kecamatan",
      "kota",
      "provinsi",
      "nomor_telepon",
    ];

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    for (const field of allowedFields) {
      if (field in body) {
        const val = body[field];
        if (val !== null && val !== undefined && typeof val !== "string") {
          return NextResponse.json(
            { success: false, error: `Field ${field} harus berupa teks string` },
            { status: 400 }
          );
        }
        updatePayload[field] = typeof val === "string" ? val.trim().slice(0, 500) : null;
      }
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", user.id)
      .select()
      .maybeSingle();

    const stripHash = (p: Record<string, unknown> | null) => {
      if (!p) return null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...rest } = p;
      return rest;
    };

    if (error) {
      // Fallback admin jika perlu
      const admin = createAdminClient();
      if (admin) {
        const { data: adminData, error: adminErr } = await admin
          .from("profiles")
          .update(updatePayload)
          .eq("id", user.id)
          .select()
          .maybeSingle();
        if (!adminErr && adminData) {
          return NextResponse.json({ success: true, data: stripHash(adminData) });
        }
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: stripHash(data) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
