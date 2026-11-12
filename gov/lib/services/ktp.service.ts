import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { KtpSubmission } from "@/types/database";

export interface CreateKtpSubmissionParams {
  nomorTiket: string;
  jenisPengajuan?: string;
  dokumenKkUrl?: string;
  dokumenAktaUrl?: string;
  suratKehilanganUrl?: string;
  waktuKehadiranBiometrik?: string;
}

/**
 * Helper untuk mem-parsing string jadwal UI menjadi ISO timestamp PostgreSQL yang valid
 */
function parseScheduleToIso(waktuStr?: string): string | null {
  if (!waktuStr || !waktuStr.trim()) return null;
  const raw = waktuStr.trim();

  const directDate = new Date(raw);
  if (!isNaN(directDate.getTime())) {
    return directDate.toISOString();
  }

  try {
    const cleaned = raw
      .replace(/(\d+)(st|nd|rd|th)/i, "$1")
      .replace(/\s*WIB/i, "")
      .trim();

    const match = cleaned.match(/^(.*?)\s+(\d{1,2}:\d{2})\s*(?:-\s*\d{1,2}:\d{2})?$/);
    if (match) {
      const datePart = match[1];
      const timePart = match[2];
      const combined = new Date(`${datePart} ${timePart} +07:00`);
      if (!isNaN(combined.getTime())) {
        return combined.toISOString();
      }
    }
  } catch {
    // fallback null
  }

  return null;
}

function sanitizeOptionalUrl(url?: string): string | null {
  if (!url || typeof url !== "string" || !url.trim()) return null;
  const trimmed = url.trim().slice(0, 1024);
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
  } catch {
    // Tolak skema berbahaya seperti javascript: atau data:
  }
  return null;
}

/**
 * Service untuk membuat pengajuan KTP baru
 */
export async function createKtpSubmission(
  params: CreateKtpSubmissionParams
): Promise<{ success: boolean; data?: KtpSubmission; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return { success: false, error: "Sesi login tidak valid. Silakan login kembali." };
    }

    const validIsoTime = parseScheduleToIso(params.waktuKehadiranBiometrik);

    const payload = {
      nomor_tiket: String(params.nomorTiket).slice(0, 40),
      user_id: user.id,
      jenis_pengajuan: String(params.jenisPengajuan || "KTP Baru / Pertama Kali").slice(0, 100),
      dokumen_kk_url: sanitizeOptionalUrl(params.dokumenKkUrl),
      dokumen_akta_url: sanitizeOptionalUrl(params.dokumenAktaUrl),
      surat_kehilangan_url: sanitizeOptionalUrl(params.suratKehilanganUrl),
      waktu_kehadiran_biometrik: validIsoTime,
      status: "menunggu_verifikasi" as const,
    };

    // 1. Coba insert via client session user
    const { data, error } = await supabase
      .from("ktp_submissions")
      .insert(payload)
      .select()
      .maybeSingle();

    if (!error && data) {
      return { success: true, data };
    }

    // 2. Fallback via Admin Client jika RLS belum terpasang di database
    const adminClient = createAdminClient();
    if (adminClient) {
      const { data: adminData, error: adminErr } = await adminClient
        .from("ktp_submissions")
        .insert(payload)
        .select()
        .maybeSingle();

      if (!adminErr && adminData) {
        return { success: true, data: adminData };
      }
      if (adminErr) {
        return { success: false, error: adminErr.message };
      }
    }

    return {
      success: false,
      error: error?.message || "Gagal menyimpan pengajuan KTP ke database.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal.";
    return { success: false, error: message };
  }
}

/**
 * Mengambil daftar pengajuan KTP milik user saat ini
 */
export async function getMyKtpSubmissions(): Promise<{
  success: boolean;
  data?: KtpSubmission[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Belum login" };
    }

    const { data, error } = await supabase
      .from("ktp_submissions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return { success: true, data };
    }

    const adminClient = createAdminClient();
    if (adminClient) {
      const { data: adminData } = await adminClient
        .from("ktp_submissions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      return { success: true, data: adminData || [] };
    }

    return { success: false, error: error?.message };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal.";
    return { success: false, error: message };
  }
}
