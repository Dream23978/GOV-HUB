import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

const SAFE_PROFILE_COLUMNS =
  "id, nik, nama_lengkap, no_kk, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, rt, rw, kelurahan, kecamatan, kota, provinsi, nomor_telepon, email, agama, pekerjaan, jumlah_tanggungan, penghasilan_bulanan, role, desil_saat_ini, created_at, updated_at";

const profileUpdateSchema = z
  .object({
    nama_lengkap: z.string().trim().min(1).max(120).optional(),
    no_kk: z
      .union([z.string().trim().regex(/^\d{16}$/, "Nomor KK harus 16 digit"), z.literal(""), z.null()])
      .optional(),
    tempat_lahir: z.string().trim().max(120).nullable().optional(),
    tanggal_lahir: z
      .union([z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"), z.literal(""), z.null()])
      .optional(),
    jenis_kelamin: z.union([z.enum(["Laki-laki", "Perempuan"]), z.literal(""), z.null()]).optional(),
    alamat: z.string().trim().max(300).nullable().optional(),
    rt: z.union([z.string().trim().regex(/^\d{1,4}$/), z.literal(""), z.null()]).optional(),
    rw: z.union([z.string().trim().regex(/^\d{1,4}$/), z.literal(""), z.null()]).optional(),
    kelurahan: z.string().trim().max(120).nullable().optional(),
    kecamatan: z.string().trim().max(120).nullable().optional(),
    kota: z.string().trim().max(120).nullable().optional(),
    provinsi: z.string().trim().max(120).nullable().optional(),
    nomor_telepon: z.string().trim().max(25).nullable().optional(),
    agama: z.string().trim().max(40).nullable().optional(),
    pekerjaan: z.string().trim().max(120).nullable().optional(),
    jumlah_tanggungan: z.number().int().min(0).max(30).nullable().optional(),
    penghasilan_bulanan: z.number().min(0).max(1_000_000_000).nullable().optional(),
  })
  .strict();

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
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select(SAFE_PROFILE_COLUMNS)
      .eq("id", user.id)
      .maybeSingle();

    if (!pErr && profile) {
      return NextResponse.json({ success: true, data: profile }, { headers: NO_STORE_HEADERS });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          nik: user.user_metadata?.nik || null,
          nama_lengkap: user.user_metadata?.nama_lengkap || "Warga",
        },
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
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
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Format JSON tidak valid" },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (!rawBody || typeof rawBody !== "object" || Array.isArray(rawBody)) {
      return NextResponse.json(
        { success: false, error: "Payload harus berupa objek JSON." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const parsed = profileUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || "Data profil tidak valid.";
      return NextResponse.json(
        { success: false, error: firstIssue },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    for (const [key, val] of Object.entries(parsed.data)) {
      if (val !== undefined) {
        updatePayload[key] = val === "" ? null : val;
      }
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", user.id)
      .select(SAFE_PROFILE_COLUMNS)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: "Gagal memperbarui data profil." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json({ success: true, data }, { headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
