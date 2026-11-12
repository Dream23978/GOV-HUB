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

  // Jika sudah berformat ISO atau timestamp valid
  const directDate = new Date(raw);
  if (!isNaN(directDate.getTime())) {
    return directDate.toISOString();
  }

  // Jika formatnya seperti "November 3rd, 2026 08:00 - 09:30 WIB"
  // Ambil tanggal dan jam mulai "08:00"
  try {
    const cleaned = raw
      .replace(/(\d+)(st|nd|rd|th)/i, "$1") // Hapus ordinal: 3rd -> 3
      .replace(/\s*WIB/i, "") // Hapus WIB
      .trim();

    // Pisahkan tanggal dan slot waktu ("November 3, 2026" dan "08:00 - 09:30")
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
      nomor_tiket: params.nomorTiket,
      user_id: user.id,
      jenis_pengajuan: params.jenisPengajuan || "KTP Baru / Pertama Kali",
      dokumen_kk_url: params.dokumenKkUrl || null,
      dokumen_akta_url: params.dokumenAktaUrl || null,
      surat_kehilangan_url: params.suratKehilanganUrl || null,
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

    // Fallback admin jika perlu
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
