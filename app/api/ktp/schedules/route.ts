import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Silakan masuk terlebih dahulu." },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    const { data, error } = await supabase
      .from("biometric_schedules")
      .select("id, lokasi, tanggal, jam_mulai, jam_selesai, kuota_maksimal, kuota_terisi, is_active")
      .eq("is_active", true)
      .order("tanggal", { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Gagal mengambil jadwal biometrik." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json({ success: true, data: data || [] }, { headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
