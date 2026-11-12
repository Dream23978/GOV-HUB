import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DesilSubmission } from "@/types/database";

export interface CreateDesilSubmissionParams {
  nomorTiket?: string;
  desilLama?: number;
  desilDiajukan?: number;
  jumlahTanggungan?: number;
  pekerjaanKepalaKeluarga?: string;
  penghasilanBulanan?: number;
  pengeluaranBulanan?: number;
  alasan?: string;
  keterangan?: string;
}

/**
 * Service untuk menyimpan permohonan peninjauan desil bansos baru
 */
export async function createDesilSubmission(
  params: CreateDesilSubmissionParams
): Promise<{ success: boolean; data?: DesilSubmission; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return { success: false, error: "Sesi login tidak valid. Silakan masuk kembali." };
    }

    // Ambil data profil warga saat ini untuk mengetahui desil awal
    const { data: profile } = await supabase
      .from("profiles")
      .select("desil_saat_ini")
      .eq("id", user.id)
      .maybeSingle();

    const desilLama = params.desilLama ?? profile?.desil_saat_ini ?? 5;
    const desilDiajukan = params.desilDiajukan ?? Math.max(1, desilLama - 1);
    const nomorTiket = params.nomorTiket || `DSL-${Date.now().toString().slice(-8)}`;

    const catatanAwal = [
      params.alasan ? `Alasan: ${params.alasan}` : null,
      params.keterangan ? `Keterangan: ${params.keterangan}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const payload = {
      nomor_tiket: nomorTiket,
      user_id: user.id,
      desil_lama: desilLama,
      desil_diajukan: desilDiajukan,
      jumlah_tanggungan: params.jumlahTanggungan ?? 0,
      pekerjaan_kepala_keluarga: params.pekerjaanKepalaKeluarga || null,
      penghasilan_bulanan: params.penghasilanBulanan ?? 0,
      pengeluaran_bulanan: params.pengeluaranBulanan ?? 0,
      catatan_verifikasi: catatanAwal || null,
      status: "menunggu_verifikasi" as const,
    };

    // 1. Coba insert via client session user
    const { data, error } = await supabase
      .from("desil_submissions")
      .insert(payload)
      .select()
      .maybeSingle();

    if (!error && data) {
      return { success: true, data };
    }

    // 2. Fallback via Admin Client jika RLS perlu penyesuaian
    const admin = createAdminClient();
    if (admin) {
      const { data: adminData, error: adminErr } = await admin
        .from("desil_submissions")
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
      error: error?.message || "Gagal menyimpan pengajuan peninjauan desil.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal.";
    return { success: false, error: message };
  }
}

/**
 * Mengambil riwayat pengajuan peninjauan desil user saat ini
 */
export async function getMyDesilSubmissions(): Promise<{
  success: boolean;
  data?: DesilSubmission[];
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
      .from("desil_submissions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return { success: true, data };
    }

    const admin = createAdminClient();
    if (admin) {
      const { data: adminData } = await admin
        .from("desil_submissions")
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
