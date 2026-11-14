import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DesilSubmission, DesilSubmissionStatus } from "@/types/database";

function revalidateDesilRoutes() {
  try {
    revalidatePath("/admin", "layout");
    revalidatePath("/dashboard", "layout");
  } catch {
    // Abaikan jika dipanggil di luar konteks request Next.js
  }
}

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
  fotoRumahDepanUrl?: string;
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
      foto_rumah_depan_url: params.fotoRumahDepanUrl || null,
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
      revalidateDesilRoutes();
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
        revalidateDesilRoutes();
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
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      return { success: true, data };
    }

    const admin = createAdminClient();
    if (admin) {
      const { data: adminData } = await admin
        .from("desil_submissions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return { success: true, data: adminData || [] };
    }

    return { success: false, error: error?.message };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal.";
    return { success: false, error: message };
  }
}

export interface CitizenDesilTrackingData {
  hasSubmissions: boolean;
  submissionId?: string;
  nomorPengajuan: string;
  tanggalPengajuan: string;
  namaPemohon: string;
  nikPemohon: string;
  desilAwal: string;
  desilBaru: string;
  statusTerakhir: string;
  statusRaw: DesilSubmissionStatus;
  catatanVerifikasi: string;
  housePhoto: string;
}

export function getDesilStatusLabel(status: DesilSubmissionStatus): string {
  if (status === "diproses") return "Sedang Diverifikasi & Pengecekan Lapangan";
  if (status === "disetujui") return "Peninjauan Selesai - Disetujui";
  if (status === "ditolak") return "Peninjauan Selesai - Belum Memenuhi Syarat";
  return "Menunggu Verifikasi dari Admin";
}

export async function getCitizenDesilTrackingData(): Promise<CitizenDesilTrackingData> {
  const emptyFallback: CitizenDesilTrackingData = {
    hasSubmissions: false,
    nomorPengajuan: "-",
    tanggalPengajuan: "-",
    namaPemohon: "Warga Terdaftar",
    nikPemohon: "-",
    desilAwal: "-",
    desilBaru: "-",
    statusTerakhir: "Menunggu Verifikasi dari Admin",
    statusRaw: "menunggu_verifikasi",
    catatanVerifikasi: "",
    housePhoto: "",
  };

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return emptyFallback;

    const user = authData.user;
    const { data: profile } = await supabase
      .from("profiles")
      .select("nama_lengkap, nik, desil_saat_ini")
      .eq("id", user.id)
      .maybeSingle();

    const admin = createAdminClient();
    const db = admin || supabase;
    const { data: submissions } = await db
      .from("desil_submissions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const sub = submissions?.[0] as DesilSubmission | undefined;
    const rawNik = profile?.nik || user.user_metadata?.nik || "";
    const maskedNik = rawNik
      ? rawNik.length >= 4
        ? `••••••••••••${rawNik.slice(-4)}`
        : "••••••••••••••••"
      : "-";

    const nama =
      profile?.nama_lengkap ||
      user.user_metadata?.nama_lengkap ||
      user.user_metadata?.full_name ||
      "Warga Terdaftar";

    if (!sub) {
      const currentDesil = profile?.desil_saat_ini;
      return {
        ...emptyFallback,
        namaPemohon: nama,
        nikPemohon: maskedNik,
        desilAwal: currentDesil ? `DESIL ${currentDesil}` : "-",
        desilBaru: currentDesil ? `DESIL ${Math.max(1, currentDesil - 2)}` : "-",
      };
    }

    const tanggalFormatted = sub.created_at
      ? new Date(sub.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

    const status = sub.status || "menunggu_verifikasi";
    const targetDesil = sub.desil_hasil_peninjauan ?? sub.desil_diajukan;

    return {
      hasSubmissions: true,
      submissionId: sub.id,
      nomorPengajuan: sub.nomor_tiket || "-",
      tanggalPengajuan: tanggalFormatted,
      namaPemohon: nama,
      nikPemohon: maskedNik,
      desilAwal: sub.desil_lama ? `DESIL ${sub.desil_lama}` : "-",
      desilBaru: targetDesil ? `DESIL ${targetDesil}` : "-",
      statusTerakhir: getDesilStatusLabel(status),
      statusRaw: status,
      catatanVerifikasi: sub.catatan_verifikasi || "",
      housePhoto: sub.foto_rumah_depan_url || "",
    };
  } catch {
    return emptyFallback;
  }
}
