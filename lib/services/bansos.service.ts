import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formatWibDate, maskNik } from "@/lib/format";
import { sanitizeDocumentOrPhotoRef } from "@/lib/validators";
import { DesilSubmission, DesilSubmissionStatus } from "@/types/database";

export { sanitizeDocumentOrPhotoRef };

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
  desilDiajukan?: number;
  jumlahTanggungan?: number;
  pekerjaanKepalaKeluarga?: string;
  penghasilanBulanan?: number;
  pengeluaranBulanan?: number;
  dayaListrikVa?: number;
  sumberAir?: string;
  statusKepemilikanRumah?: string;
  luasLantaiM2?: number;
  jenisLantai?: string;
  jenisDinding?: string;
  alasan?: string;
  keterangan?: string;
  fotoRumahDepanUrl?: string;
  fotoRuangTengahUrl?: string;
  fotoDapurUrl?: string;
  buktiSlipGajiUrl?: string;
  buktiRekeningListrikUrl?: string;
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("desil_saat_ini")
      .eq("id", user.id)
      .maybeSingle();

    // Derive desilLama strictly from server DB profile (never client input)
    const desilLama =
      typeof profile?.desil_saat_ini === "number" &&
      profile.desil_saat_ini >= 0 &&
      profile.desil_saat_ini <= 10
        ? profile.desil_saat_ini
        : 5;

    const requestedDesil =
      typeof params.desilDiajukan === "number" &&
      Number.isInteger(params.desilDiajukan) &&
      params.desilDiajukan >= 1 &&
      params.desilDiajukan <= 10
        ? params.desilDiajukan
        : Math.max(1, desilLama - 1 || 1);

    const jumlahTanggungan = Math.max(0, Math.floor(params.jumlahTanggungan ?? 0));
    const penghasilanBulanan = Math.max(0, Number(params.penghasilanBulanan ?? 0));
    const pengeluaranBulanan = Math.max(0, Number(params.pengeluaranBulanan ?? 0));

    const nomorTiket =
      params.nomorTiket && /^DSL-[A-Z0-9-]+$/i.test(params.nomorTiket)
        ? params.nomorTiket.slice(0, 40)
        : `DSL-${Date.now().toString().slice(-8)}`;

    const catatanAwal = [
      params.alasan?.trim() ? `Alasan: ${params.alasan.trim().slice(0, 300)}` : null,
      params.keterangan?.trim() ? `Keterangan: ${params.keterangan.trim().slice(0, 1000)}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const payload = {
      nomor_tiket: nomorTiket,
      user_id: user.id,
      desil_lama: desilLama,
      desil_diajukan: requestedDesil,
      jumlah_tanggungan: jumlahTanggungan,
      pekerjaan_kepala_keluarga: params.pekerjaanKepalaKeluarga?.trim().slice(0, 120) || null,
      penghasilan_bulanan: penghasilanBulanan,
      pengeluaran_bulanan: pengeluaranBulanan,
      daya_listrik_va:
        typeof params.dayaListrikVa === "number" && params.dayaListrikVa >= 0
          ? Math.floor(params.dayaListrikVa)
          : null,
      sumber_air: params.sumberAir?.trim().slice(0, 80) || null,
      status_kepemilikan_rumah: params.statusKepemilikanRumah?.trim().slice(0, 80) || null,
      luas_lantai_m2:
        typeof params.luasLantaiM2 === "number" && params.luasLantaiM2 >= 0
          ? Math.floor(params.luasLantaiM2)
          : null,
      jenis_lantai: params.jenisLantai?.trim().slice(0, 80) || null,
      jenis_dinding: params.jenisDinding?.trim().slice(0, 80) || null,
      foto_rumah_depan_url: sanitizeDocumentOrPhotoRef(params.fotoRumahDepanUrl),
      foto_ruang_tengah_url: sanitizeDocumentOrPhotoRef(params.fotoRuangTengahUrl),
      foto_dapur_url: sanitizeDocumentOrPhotoRef(params.fotoDapurUrl),
      bukti_slip_gaji_url: sanitizeDocumentOrPhotoRef(params.buktiSlipGajiUrl),
      bukti_rekening_listrik_url: sanitizeDocumentOrPhotoRef(params.buktiRekeningListrikUrl),
      catatan_verifikasi: catatanAwal || null,
      status: "menunggu_verifikasi" as const,
    };

    const { data, error } = await supabase
      .from("desil_submissions")
      .insert(payload)
      .select()
      .maybeSingle();

    if (error || !data) {
      return {
        success: false,
        error: "Gagal menyimpan pengajuan peninjauan desil.",
      };
    }

    revalidateDesilRoutes();
    return { success: true, data };
  } catch {
    return { success: false, error: "Terjadi kesalahan internal." };
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

    if (error) {
      return { success: false, error: "Gagal mengambil riwayat pengajuan desil." };
    }

    return { success: true, data: data || [] };
  } catch {
    return { success: false, error: "Terjadi kesalahan internal." };
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
    const [{ data: profile }, { data: submissions }] = await Promise.all([
      supabase
        .from("profiles")
        .select("nama_lengkap, nik, desil_saat_ini")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("desil_submissions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1),
    ]);

    const sub = submissions?.[0] as DesilSubmission | undefined;
    const rawNik = profile?.nik || user.user_metadata?.nik || "";
    const maskedNik = maskNik(rawNik);
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

    const status = sub.status || "menunggu_verifikasi";
    const targetDesil = sub.desil_hasil_peninjauan ?? sub.desil_diajukan;

    let resolvedHousePhoto = sub.foto_rumah_depan_url || "";
    if (
      resolvedHousePhoto &&
      !resolvedHousePhoto.startsWith("https://") &&
      !resolvedHousePhoto.startsWith("data:")
    ) {
      const { data: signed } = await supabase.storage
        .from("govhub-documents")
        .createSignedUrl(resolvedHousePhoto, 3600);
      resolvedHousePhoto = signed?.signedUrl || "";
    }

    return {
      hasSubmissions: true,
      submissionId: sub.id,
      nomorPengajuan: sub.nomor_tiket || "-",
      tanggalPengajuan: formatWibDate(sub.created_at, "long"),
      namaPemohon: nama,
      nikPemohon: maskedNik,
      desilAwal: sub.desil_lama ? `DESIL ${sub.desil_lama}` : "-",
      desilBaru: targetDesil ? `DESIL ${targetDesil}` : "-",
      statusTerakhir: getDesilStatusLabel(status),
      statusRaw: status,
      catatanVerifikasi: sub.catatan_verifikasi || "",
      housePhoto: resolvedHousePhoto,
    };
  } catch {
    return emptyFallback;
  }
}
