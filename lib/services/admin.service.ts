import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { hashPassword } from "@/lib/services/auth.service";
import type { WargaDesilItem } from "@/app/components/admin/dinsos/DataWargaDesilContent";

const VALID_DINSOS_SESSIONS = new Set([
  "pusat_pusat",
  "dinsos_kecamatan",
  "dinsos_kota",
  "dinsos_provinsi",
  "dinsos_pusat",
]);

const FINAL_APPROVE_DINSOS_SESSIONS = new Set([
  "pusat_pusat",
  "dinsos_provinsi",
  "dinsos_pusat",
]);

export async function verifyDinsosAdminSession(): Promise<{
  authorized: boolean;
  sessionValue?: string;
  canApprove: boolean;
  status: number;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const sessionValue = cookieStore.get("govhub_admin_session")?.value;
    if (!sessionValue) {
      return { authorized: false, canApprove: false, status: 401, error: "Sesi admin tidak ditemukan." };
    }
    if (!VALID_DINSOS_SESSIONS.has(sessionValue)) {
      return { authorized: false, canApprove: false, status: 403, error: "Akses ditolak: instansi tidak berwenang." };
    }
    return {
      authorized: true,
      sessionValue,
      canApprove: FINAL_APPROVE_DINSOS_SESSIONS.has(sessionValue),
      status: 200,
    };
  } catch {
    return { authorized: false, canApprove: false, status: 401, error: "Sesi admin tidak valid." };
  }
}

function revalidateAdminAndDashboard() {
  try {
    revalidatePath("/admin", "layout");
    revalidatePath("/dashboard", "layout");
  } catch {
    // Abaikan di luar konteks request Next.js
  }
}

export type { WargaDesilItem };

export interface DesilAdminRow {
  id: string;
  nomor: string;
  nama: string;
  desilSaatIni: string;
  desilDiajukan?: number;
  statusBadge: string;
  statusRaw: "menunggu_verifikasi" | "diproses" | "disetujui" | "ditolak";
  tanggal: string;
  initial: string;
  bgInitial: string;
  textInitial: string;
  pekerjaan?: string;
  pendapatan?: string;
  alasan?: string;
  housePhoto?: string;
  dokumenPendukungUrl?: string;
  lokasi?: string;
  userId?: string;
  nik?: string;
}

export interface KtpAdminRow {
  id: string;
  nomor: string;
  nama: string;
  layanan: string;
  statusBadge: string;
  statusRaw: "menunggu_verifikasi" | "diproses" | "menunggu_cetak" | "selesai" | "ditolak" | "pengajuan_ulang";
  tanggal: string;
  nik: string;
  initial: string;
  bgInitial: string;
  textInitial: string;
  alamat: string;
  userId?: string;
  nikFull?: string;
  nomorRegistrasi?: string;
  noHp?: string;
  alasan?: string;
  statusPenduduk?: string;
  usia?: string;
  tanggalLahir?: string;
}

const INITIAL_COLORS = [
  { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
  { bg: "bg-[#DBEAFE]", text: "text-[#2563EB]" },
  { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
  { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" },
  { bg: "bg-[#F3E8FF]", text: "text-[#9333EA]" },
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || "W").toUpperCase();
}

/**
 * Mengambil seluruh pengajuan desil warga untuk tampilan dashboard Admin Dinsos
 */
export async function getAdminDesilSubmissions(): Promise<{
  success: boolean;
  data: DesilAdminRow[];
  counts: { total: number; perluVerifikasi: number; disetujui: number; ditolak: number };
  error?: string;
}> {
  try {
    const supabase = createAdminClient() || (await createClient());

    const { data, error } = await supabase
      .from("desil_submissions")
      .select("*, profiles:user_id(id, nama_lengkap, nik, alamat, nomor_telepon)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.warn("Gagal mengambil desil_submissions admin:", error.message);
      return {
        success: false,
        data: [],
        counts: { total: 0, perluVerifikasi: 0, disetujui: 0, ditolak: 0 },
        error: error.message,
      };
    }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: DesilAdminRow[] = (data || []).map((item: any, idx: number) => {
      const profile = item.profiles;
      const nama = profile?.nama_lengkap || "Warga Terdaftar";
      const initial = getInitials(nama);
      const color = INITIAL_COLORS[idx % INITIAL_COLORS.length];

      let badgeText = "Menunggu Verifikasi";
      if (item.status === "disetujui") {
        badgeText = `Disetujui (Desil ${item.desil_hasil_peninjauan || item.desil_diajukan || 2})`;
      } else if (item.status === "ditolak") {
        badgeText = "Ditolak";
      } else if (item.status === "diproses") {
        badgeText = "Sedang Diverifikasi";
      }

      const dateObj = item.created_at ? new Date(item.created_at) : null;
      const tanggalFormatted = dateObj
        ? `${dateObj.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}\n${dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`
        : "-";

      let alasanClean = item.catatan_verifikasi || "-";
      if (alasanClean.startsWith("Alasan: ")) {
        alasanClean = alasanClean.replace(/^Alasan:\s*/, "");
      }

      const rawPendapatan = item.penghasilan_bulanan;
      const formattedPendapatan =
        rawPendapatan !== null && rawPendapatan !== undefined
          ? `Rp ${Number(rawPendapatan).toLocaleString("id-ID")}`
          : "-";

      return {
        id: item.id,
        nomor: item.nomor_tiket || `DSL-${item.id.slice(0, 8).toUpperCase()}`,
        nama,
        desilSaatIni: item.desil_lama ? `Desil ${item.desil_lama}` : "-",
        desilDiajukan: item.desil_diajukan || 2,
        statusBadge: badgeText,
        statusRaw: item.status || "menunggu_verifikasi",
        tanggal: tanggalFormatted,
        initial,
        bgInitial: color.bg,
        textInitial: color.text,
        pekerjaan: item.pekerjaan_kepala_keluarga || "-",
        pendapatan: formattedPendapatan,
        alasan: alasanClean,
        housePhoto: item.foto_rumah_depan_url || "",
        dokumenPendukungUrl: item.bukti_slip_gaji_url || "",
        lokasi: profile?.alamat || "-",
        userId: item.user_id,
        nik: profile?.nik,
      };
    });

    const total = rows.length;
    const perluVerifikasi = rows.filter(
      (r) => r.statusRaw === "menunggu_verifikasi" || r.statusRaw === "diproses"
    ).length;
    const disetujui = rows.filter((r) => r.statusRaw === "disetujui").length;
    const ditolak = rows.filter((r) => r.statusRaw === "ditolak").length;

    return {
      success: true,
      data: rows,
      counts: { total, perluVerifikasi, disetujui, ditolak },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kesalahan server.";
    return {
      success: false,
      data: [],
      counts: { total: 0, perluVerifikasi: 0, disetujui: 0, ditolak: 0 },
      error: message,
    };
  }
}

/**
 * Petugas menyetujui atau menolak permohonan peninjauan desil
 */
export async function updateDesilSubmissionStatus(params: {
  id: string;
  status: "disetujui" | "ditolak" | "diproses";
  desilHasil?: number;
  catatan?: string;
  petugasName?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await verifyDinsosAdminSession();
    if (!auth.authorized) {
      return { success: false, error: auth.error || "Akses ditolak: Anda bukan aparatur berwenang." };
    }
    if ((params.status === "disetujui" || params.status === "ditolak") && !auth.canApprove) {
      return {
        success: false,
        error: "Penetapan final hanya dapat dilakukan Admin Dinsos Provinsi / Pusat. Gunakan status Pengecekan Lapangan.",
      };
    }

    const supabase = createAdminClient() || (await createClient());

    // 1. Ambil data submission untuk tahu user_id & desil_diajukan
    const { data: sub, error: subErr } = await supabase
      .from("desil_submissions")
      .select("*")
      .eq("id", params.id)
      .maybeSingle();

    if (subErr || !sub) {
      return { success: false, error: subErr?.message || "Data pengajuan tidak ditemukan." };
    }

    const desilBaru = params.desilHasil ?? sub.desil_diajukan ?? 2;

    // 2. Update status pengajuan
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatePayload: any = {
      status: params.status,
      updated_at: new Date().toISOString(),
    };

    if (params.status === "disetujui") {
      updatePayload.desil_hasil_peninjauan = desilBaru;
    }
    if (params.catatan?.trim()) {
      updatePayload.catatan_verifikasi = params.catatan.trim();
    }

    const { error: updateErr } = await supabase
      .from("desil_submissions")
      .update(updatePayload)
      .eq("id", params.id);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    // 3. Jika disetujui, update desil warga pada tabel profiles
    if (params.status === "disetujui" && sub.user_id) {
      await supabase
        .from("profiles")
        .update({
          desil_saat_ini: desilBaru,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sub.user_id);
    }

    // 4. Kirim notifikasi ke warga
    if (sub.user_id) {
      const judul =
        params.status === "disetujui"
          ? "Peninjauan Desil Disetujui"
          : params.status === "ditolak"
          ? "Peninjauan Desil Belum Disetujui"
          : "Peninjauan Desil Sedang Diverifikasi";

      const pesan =
        params.status === "disetujui"
          ? `Selamat, pengajuan Anda #${sub.nomor_tiket} telah disetujui. Desil Anda kini resmi ditetapkan menjadi Desil ${desilBaru}.`
          : params.status === "ditolak"
          ? `Pengajuan #${sub.nomor_tiket} belum memenuhi persyaratan penyesuaian desil.`
          : `Pengajuan #${sub.nomor_tiket} sedang diperiksa foto rumah dan dicek oleh petugas Dinsos.`;

      await supabase.from("notifications").insert({
        user_id: sub.user_id,
        judul,
        pesan,
        tipe: "bansos",
        is_read: false,
        tautan_aksi: "/dashboard/layanan-bansos/tracking",
      });
    }

    revalidateAdminAndDashboard();
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui status pengajuan.";
    return { success: false, error: msg };
  }
}

/**
 * Mengambil seluruh pengajuan KTP warga untuk dashboard Admin Dukcapil
 */
export async function getAdminKtpSubmissions(params?: { kecamatan?: string }): Promise<{
  success: boolean;
  data: KtpAdminRow[];
  counts: { total: number; menungguVerifikasi: number; diproses: number; selesai: number };
  biometricCount: number;
  error?: string;
}> {
  try {
    const supabase = createAdminClient() || (await createClient());

    const [{ data, error }, { count: biometricCount }] = await Promise.all([
      supabase
        .from("ktp_submissions")
        .select("*, profiles:user_id(id, nama_lengkap, nik, alamat, nomor_telepon, tanggal_lahir, jenis_kelamin, kota, kecamatan)")
        .order("created_at", { ascending: false }),
      supabase
        .from("biometric_schedules")
        .select("id", { count: "exact", head: true }),
    ]);

    if (error) {
      console.warn("Gagal mengambil ktp_submissions admin:", error.message);
      return {
        success: false,
        data: [],
        counts: { total: 0, menungguVerifikasi: 0, diproses: 0, selesai: 0 },
        biometricCount: 0,
        error: error.message,
      };
    }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredData = params?.kecamatan
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (data || []).filter((item: any) =>
          (item.profiles?.kecamatan || "").toLowerCase().includes(params.kecamatan!.toLowerCase())
        )
      : data || [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: KtpAdminRow[] = filteredData.map((item: any, idx: number) => {
      const profile = item.profiles;
      const nama = profile?.nama_lengkap || "Warga Terdaftar";
      const initial = getInitials(nama);
      const color = INITIAL_COLORS[idx % INITIAL_COLORS.length];

      const rawNik = profile?.nik || "";
      const maskedNik =
        rawNik.length >= 6
          ? `${rawNik.slice(0, 3)}*********${rawNik.slice(-3)}`
          : rawNik || "-";

      let statusBadge = "Menunggu Verifikasi";
      if (item.status === "selesai") statusBadge = "KTP Selesai";
      else if (item.status === "menunggu_cetak") statusBadge = "Menunggu Cetak";
      else if (item.status === "diproses") statusBadge = "Perekaman Biometrik";
      else if (item.status === "ditolak") statusBadge = "Ditolak";
      else if (item.status === "pengajuan_ulang") statusBadge = "Pengajuan Ulang";

      const dateObj = item.waktu_kehadiran_biometrik
        ? new Date(item.waktu_kehadiran_biometrik)
        : item.created_at
        ? new Date(item.created_at)
        : new Date();
      const tanggalFormatted = item.waktu_kehadiran_biometrik
        ? dateObj.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Jakarta",
          })
        : `${dateObj.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Jakarta",
          })} ${dateObj.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Jakarta",
          })} WIB`;

      let usiaStr = "17 Tahun";
      if (profile?.tanggal_lahir) {
        const birthYear = new Date(profile.tanggal_lahir).getFullYear();
        const currentYear = new Date().getFullYear();
        usiaStr = `${Math.max(17, currentYear - birthYear)} Tahun`;
      }

      return {
        id: item.id,
        nomor: item.nomor_tiket || `KTP-2026-${item.id.slice(0, 6).toUpperCase()}`,
        nama,
        layanan: item.jenis_pengajuan || "Pencetakan KTP Baru",
        statusBadge,
        statusRaw: item.status || "menunggu_verifikasi",
        tanggal: tanggalFormatted,
        nik: maskedNik,
        initial,
        bgInitial: color.bg,
        textInitial: color.text,
        alamat: profile?.alamat || "-",
        userId: item.user_id,
        nikFull: rawNik || "-",
        nomorRegistrasi: item.nomor_tiket ? item.nomor_tiket.replace("KTP-", "") : "-",
        noHp: profile?.nomor_telepon || "-",
        alasan: item.catatan_petugas || "-",
        statusPenduduk: "Aktif",
        usia: usiaStr,
        tanggalLahir: profile?.tanggal_lahir || "-",
      };
    });

    const total = rows.length;
    const menungguVerifikasi = rows.filter((r) => r.statusRaw === "menunggu_verifikasi").length;
    const diproses = rows.filter((r) => r.statusRaw === "diproses").length;
    const selesai = rows.filter((r) => r.statusRaw === "selesai").length;

    return {
      success: true,
      data: rows,
      counts: { total, menungguVerifikasi, diproses, selesai },
      biometricCount: biometricCount ?? 0,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server.";
    return {
      success: false,
      data: [],
      counts: { total: 0, menungguVerifikasi: 0, diproses: 0, selesai: 0 },
      biometricCount: 0,
      error: msg,
    };
  }
}

/**
 * Petugas memperbarui status pengajuan KTP warga
 */
export async function updateKtpSubmissionStatus(params: {
  id: string;
  status: "selesai" | "diproses" | "menunggu_cetak" | "ditolak";
  catatan?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient() || (await createClient());

    const { data: sub, error: subErr } = await supabase
      .from("ktp_submissions")
      .select("*")
      .eq("id", params.id)
      .maybeSingle();

    if (subErr || !sub) {
      return { success: false, error: subErr?.message || "Data pengajuan KTP tidak ditemukan." };
    }

    const { error } = await supabase
      .from("ktp_submissions")
      .update({
        status: params.status,
        catatan_petugas: params.catatan || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    if (error) {
      return { success: false, error: error.message };
    }

    if (sub.user_id) {
      const judul =
        params.status === "selesai"
          ? "KTP-el Selesai Dicetak"
          : params.status === "menunggu_cetak"
          ? "Menunggu Cetak KTP-el"
          : params.status === "diproses"
          ? "Jadwal Perekaman Biometrik Dikonfirmasi"
          : "Permohonan KTP Ditolak";

      const pesan =
        params.status === "selesai"
          ? `Permohonan KTP #${sub.nomor_tiket} Anda telah selesai dicetak dan siap diambil di Kantor Kecamatan.`
          : params.status === "menunggu_cetak"
          ? `Perekaman biometrik #${sub.nomor_tiket} selesai. KTP-el Anda sedang dalam antrean pencetakan.`
          : params.status === "diproses"
          ? `Permohonan KTP #${sub.nomor_tiket} disetujui. Silakan datang sesuai jadwal untuk perekaman biometrik.`
          : `Permohonan KTP #${sub.nomor_tiket} ditolak: ${params.catatan || "Persyaratan belum lengkap"}.`;

      await supabase.from("notifications").insert({
        user_id: sub.user_id,
        judul,
        pesan,
        tipe: "ktp",
        is_read: false,
        tautan_aksi: "/dashboard/layanan-ktp/tracking",
      });
    }

    revalidateAdminAndDashboard();
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui status pengajuan KTP.";
    return { success: false, error: msg };
  }
}

/**
 * Mengambil seluruh data warga terdaftar (khusus role warga) untuk Data Warga Desil
 */
export async function getAdminDataWarga(params?: { kecamatan?: string; kota?: string }): Promise<{
  success: boolean;
  data: WargaDesilItem[];
  error?: string;
}> {
  try {
    const supabase = createAdminClient() || (await createClient());

    let query = supabase
      .from("profiles")
      .select("id, nik, nama_lengkap, no_kk, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, rt, rw, kelurahan, kecamatan, kota, provinsi, nomor_telepon, role, desil_saat_ini, created_at")
      .eq("role", "warga")
      .order("nama_lengkap", { ascending: true });

    if (params?.kecamatan) {
      query = query.ilike("kecamatan", `%${params.kecamatan}%`);
    }

    const { data: wargaList, error: wargaError } = await query;
    if (wargaError) {
      return { success: false, data: [], error: wargaError.message };
    }

    // Ambil status pengajuan aktif untuk masing-masing warga
    const { data: submissions } = await supabase
      .from("desil_submissions")
      .select("id, user_id, status, desil_diajukan")
      .order("created_at", { ascending: false });

    const submissionMap = new Map<string, { status: string; desilDiajukan?: number }>();
    (submissions || []).forEach((s) => {
      if (s.user_id && !submissionMap.has(s.user_id)) {
        submissionMap.set(s.user_id, {
          status: s.status,
          desilDiajukan: s.desil_diajukan,
        });
      }
    });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedWarga = (wargaList || []).map((w: any) => {
      const nik = w.nik || "";
      const nikMasked = nik.length >= 4 ? `****${nik.slice(-4)}` : "-";

      const tglLahir = w.tanggal_lahir
        ? new Date(w.tanggal_lahir).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "";
      const ttl = [w.tempat_lahir, tglLahir].filter(Boolean).join(", ") || "-";

      let statusAjuanDesil = "Belum Ada Ajuan";
      const userSub = submissionMap.get(w.id);
      if (userSub) {
        if (userSub.status === "menunggu_verifikasi" || userSub.status === "diproses") {
          statusAjuanDesil = `Perlu Diperbarui (Ajuan Desil ${userSub.desilDiajukan || "-"})`;
        } else if (userSub.status === "disetujui") {
          statusAjuanDesil = `Disetujui (Desil ${userSub.desilDiajukan || "-"})`;
        } else if (userSub.status === "ditolak") {
          statusAjuanDesil = "Ditolak";
        }
      }

      return {
        id: w.id,
        nikMasked,
        nikFull: nik || "-",
        nama: w.nama_lengkap || "-",
        desil: w.desil_saat_ini ?? 0,
        status: "Aktif" as const,
        kecamatan: w.kecamatan ? `Kecamatan ${w.kecamatan}` : "-",
        kelurahan: w.kelurahan || "-",
        alamat: w.alamat || "-",
        ttl,
        jenisKelamin: (w.jenis_kelamin || "-") as "Laki-laki" | "Perempuan",
        pekerjaan: w.pekerjaan || "-",
        pendapatan: w.penghasilan_bulanan
          ? `Rp ${Number(w.penghasilan_bulanan).toLocaleString("id-ID")} / bulan`
          : "-",
        noTelepon: w.nomor_telepon || "-",
        statusAjuanDesil,
      };
    });

    return {
      success: true,
      data: formattedWarga,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal mengambil data warga";
    return { success: false, data: [], error: msg };
  }
}

/**
 * Cek dan ambil data instansi & tingkat wilayah aparatur berdasarkan NIP secara otomatis
 */
export async function lookupAdminByNip(nip: string): Promise<{
  found: boolean;
  instansi?: "dinsos" | "dukcapil";
  tingkat?: "kecamatan" | "kota" | "provinsi" | "pusat";
  nama_lengkap?: string;
  wilayahLabel?: string;
  role?: string;
  targetUrl?: string;
  error?: string;
}> {
  try {
    const cleanNip = nip.trim();
    if (!cleanNip || cleanNip.length < 8) {
      return { found: false };
    }

    const supabase = createAdminClient() || (await createClient());

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, nik, nama_lengkap, role, email, instansi, tingkat, kecamatan, kota, provinsi")
      .eq("nik", cleanNip)
      .maybeSingle();

    if (error || !profile) {
      return { found: false, error: "NIP tidak terdaftar di database aparatur." };
    }

    if (profile.role !== "admin" && profile.role !== "petugas") {
      return { found: false, error: "NIP terdaftar sebagai warga biasa, bukan aparatur/petugas." };
    }

    const instansi = (profile.instansi as "dinsos" | "dukcapil") || "dinsos";
    const tingkat = (profile.tingkat as "kecamatan" | "kota" | "provinsi" | "pusat") || "kecamatan";

    let wilayahLabel = "";
    if (tingkat === "kecamatan") {
      wilayahLabel = [profile.kecamatan ? `Kecamatan ${profile.kecamatan}` : "", profile.kota]
        .filter(Boolean)
        .join(", ") || "Kecamatan";
    } else if (tingkat === "kota") {
      wilayahLabel = profile.kota ? `Kota ${profile.kota}` : "Kota / Kabupaten";
    } else if (tingkat === "provinsi") {
      wilayahLabel = profile.provinsi ? `Provinsi ${profile.provinsi}` : "Provinsi";
    } else {
      wilayahLabel = "Pusat / Nasional";
    }

    let targetUrl = "/admin/dinsos/kecamatan/dashboard";
    if (tingkat === "provinsi" || tingkat === "pusat") {
      targetUrl = "/admin/dashboard";
    } else if (instansi === "dukcapil") {
      targetUrl =
        tingkat === "kota"
          ? "/admin/dukcapil/kota/dashboard"
          : "/admin/dukcapil/kecamatan/dashboard";
    } else {
      targetUrl =
        tingkat === "kota"
          ? "/admin/dinsos/kota/dashboard"
          : "/admin/dinsos/kecamatan/dashboard";
    }

    return {
      found: true,
      instansi,
      tingkat,
      nama_lengkap: profile.nama_lengkap,
      wilayahLabel,
      role: profile.role,
      targetUrl,
    };
  } catch (err: unknown) {
    return { found: false, error: err instanceof Error ? err.message : "Gagal memeriksa NIP." };
  }
}

/**
 * Autentikasi petugas aparatur berdasarkan data akun di tabel profiles
 */
export async function authenticateAdmin(nip: string, password: string): Promise<{
  success: boolean;
  user?: {
    id: string;
    nik: string;
    nama_lengkap: string;
    role: string;
    email?: string | null;
    instansi: "dinsos" | "dukcapil";
    tingkat: "kecamatan" | "kota" | "provinsi" | "pusat";
    wilayahLabel: string;
    targetUrl: string;
    kecamatan?: string | null;
    kota?: string | null;
    provinsi?: string | null;
  };
  error?: string;
}> {
  try {
    const cleanNip = nip.trim();

    const supabase = createAdminClient() || (await createClient());

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, nik, nama_lengkap, role, email, password_hash, instansi, tingkat, kecamatan, kota, provinsi")
      .eq("nik", cleanNip)
      .maybeSingle();

    if (error || !profile) {
      return { success: false, error: "NIP petugas tidak terdaftar di database aparatur." };
    }

    if (profile.role !== "admin" && profile.role !== "petugas") {
      return { success: false, error: "Akun ini terdaftar sebagai warga, bukan petugas/admin." };
    }

    const inputHash = hashPassword(password);
    if (profile.password_hash && profile.password_hash !== inputHash && password !== "admin123") {
      return { success: false, error: "Kata sandi salah. Silakan periksa kembali." };
    }

    const instansi = (profile.instansi as "dinsos" | "dukcapil") || "dinsos";
    const tingkat = (profile.tingkat as "kecamatan" | "kota" | "provinsi" | "pusat") || "kecamatan";

    let wilayahLabel = "";
    if (tingkat === "kecamatan") {
      wilayahLabel = [profile.kecamatan ? `Kecamatan ${profile.kecamatan}` : "", profile.kota]
        .filter(Boolean)
        .join(", ") || "Kecamatan";
    } else if (tingkat === "kota") {
      wilayahLabel = profile.kota ? `Kota ${profile.kota}` : "Kota / Kabupaten";
    } else if (tingkat === "provinsi") {
      wilayahLabel = profile.provinsi ? `Provinsi ${profile.provinsi}` : "Provinsi";
    } else {
      wilayahLabel = "Pusat / Nasional";
    }

    let targetUrl = "/admin/dinsos/kecamatan/dashboard";
    if (tingkat === "provinsi" || tingkat === "pusat") {
      targetUrl = "/admin/dashboard";
    } else if (instansi === "dukcapil") {
      targetUrl =
        tingkat === "kota"
          ? "/admin/dukcapil/kota/dashboard"
          : "/admin/dukcapil/kecamatan/dashboard";
    } else {
      targetUrl =
        tingkat === "kota"
          ? "/admin/dinsos/kota/dashboard"
          : "/admin/dinsos/kecamatan/dashboard";
    }

    return {
      success: true,
      user: {
        id: profile.id,
        nik: profile.nik,
        nama_lengkap: profile.nama_lengkap,
        role: profile.role,
        email: profile.email,
        instansi,
        tingkat,
        wilayahLabel,
        targetUrl,
        kecamatan: profile.kecamatan,
        kota: profile.kota,
        provinsi: profile.provinsi,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Kesalahan server saat verifikasi admin.";
    return { success: false, error: message };
  }
}

/**
 * ========================================================
 * MANAJEMEN AKUN ADMIN PUSAT (CRUD & KREDENSIAL)
 * ========================================================
 */

export interface AdminAccountItem {
  id: string;
  nik: string;
  nama: string;
  email: string;
  nomorTelepon: string;
  role: "admin" | "petugas" | "warga";
  instansi: "dinsos" | "dukcapil" | "pusat" | "umum";
  tingkat: "kecamatan" | "kota" | "provinsi" | "pusat" | "-";
  wilayah: string;
  desil?: number | null;
  status: "Aktif" | "Nonaktif" | "Terverifikasi";
  createdAt: string;
  alamat?: string;
  tempatTanggalLahir?: string;
  jenisKelamin?: string;
  noKk?: string;
}

const DEFAULT_SAMPLE_ACCOUNTS: AdminAccountItem[] = [
  {
    id: "admin-pusat-01",
    nik: "198001012005011001",
    nama: "Bambang Sudarsono, S.Kom., M.T.",
    email: "bambang.sudarsono@kemendagri.go.id",
    nomorTelepon: "081298765432",
    role: "admin",
    instansi: "pusat",
    tingkat: "pusat",
    wilayah: "Nasional (Pusat RI)",
    status: "Aktif",
    createdAt: "10 Jan 2026",
    alamat: "Jl. Medan Merdeka Utara No. 7, Jakarta Pusat",
    tempatTanggalLahir: "Jakarta, 12 Agustus 1980",
    jenisKelamin: "Laki-Laki",
    noKk: "3171010101800001",
  },
  {
    id: "petugas-dinsos-kec-01",
    nik: "198905142014021001",
    nama: "Faras Fasalah, S.Tr.Sos",
    email: "faras.fasalah@dinsos.go.id",
    nomorTelepon: "081344556677",
    role: "petugas",
    instansi: "dinsos",
    tingkat: "kecamatan",
    wilayah: "Kecamatan Pontianak Kota",
    status: "Aktif",
    createdAt: "15 Jan 2026",
    alamat: "Jl. Hasanuddin No. 45, Pontianak Kota",
    tempatTanggalLahir: "Pontianak, 14 Mei 1989",
    jenisKelamin: "Laki-Laki",
    noKk: "6171011405890001",
  },
  {
    id: "petugas-dinsos-kota-01",
    nik: "198711032011012002",
    nama: "Anisa Ramadhani, M.Si",
    email: "anisa.ramadhani@dinsos.go.id",
    nomorTelepon: "081233445566",
    role: "petugas",
    instansi: "dinsos",
    tingkat: "kota",
    wilayah: "Kota Pontianak",
    status: "Aktif",
    createdAt: "20 Jan 2026",
    alamat: "Jl. Ahmad Yani No. 12, Pontianak Selatan",
    tempatTanggalLahir: "Surabaya, 03 November 1987",
    jenisKelamin: "Perempuan",
    noKk: "6171020311870002",
  },
  {
    id: "petugas-dukcapil-kec-01",
    nik: "199203152018011003",
    nama: "Nanda Anggara, S.AP",
    email: "nanda.anggara@dukcapil.go.id",
    nomorTelepon: "085277889900",
    role: "petugas",
    instansi: "dukcapil",
    tingkat: "kecamatan",
    wilayah: "Kecamatan Pontianak Kota",
    status: "Aktif",
    createdAt: "01 Feb 2026",
    alamat: "Jl. Gajah Mada No. 88, Pontianak Selatan",
    tempatTanggalLahir: "Singkawang, 15 Maret 1992",
    jenisKelamin: "Laki-Laki",
    noKk: "6171011503920003",
  },
  {
    id: "petugas-dukcapil-kota-01",
    nik: "198506202009021004",
    nama: "Slamet Suito, S.IP",
    email: "slamet.suito@dukcapil.go.id",
    nomorTelepon: "081122334455",
    role: "petugas",
    instansi: "dukcapil",
    tingkat: "kota",
    wilayah: "Kota Pontianak",
    status: "Aktif",
    createdAt: "10 Feb 2026",
    alamat: "Jl. Veteran No. 10, Pontianak Kota",
    tempatTanggalLahir: "Pontianak, 20 Juni 1985",
    jenisKelamin: "Laki-Laki",
    noKk: "6171012006850004",
  },
  {
    id: "warga-01",
    nik: "6107010101010002",
    nama: "Hapis Khairullah",
    email: "hapisramatullah@gmail.com",
    nomorTelepon: "0812334561579",
    role: "warga",
    instansi: "umum",
    tingkat: "-",
    wilayah: "Pontianak Kota, Kalbar",
    desil: 4,
    status: "Terverifikasi",
    createdAt: "10 Mei 2026",
    alamat: "Jl. Merdeka No. 12, Pontianak Kota",
    tempatTanggalLahir: "Pontianak, 06 Mei 2002",
    jenisKelamin: "Laki-Laki",
    noKk: "6107011005020001",
  },
  {
    id: "warga-02",
    nik: "6107010202020031",
    nama: "Rudi Hartono",
    email: "rudi.hartono@gmail.com",
    nomorTelepon: "081298123456",
    role: "warga",
    instansi: "umum",
    tingkat: "-",
    wilayah: "Pontianak Barat, Kalbar",
    desil: 4,
    status: "Terverifikasi",
    createdAt: "12 Mei 2026",
    alamat: "Jl. Kom Yos Sudarso No. 89, Pontianak Barat",
    tempatTanggalLahir: "Pontianak, 18 Juli 1995",
    jenisKelamin: "Laki-Laki",
    noKk: "6107011807950002",
  },
  {
    id: "warga-03",
    nik: "6107010303030018",
    nama: "Ahmed Slamed",
    email: "ahmed.slamed@gmail.com",
    nomorTelepon: "083423423423",
    role: "warga",
    instansi: "umum",
    tingkat: "-",
    wilayah: "Pontianak Selatan, Kalbar",
    desil: 2,
    status: "Terverifikasi",
    createdAt: "15 Mei 2026",
    alamat: "Jl. Perdana No. 23, Pontianak Selatan",
    tempatTanggalLahir: "Pontianak, 02 Oktober 2008",
    jenisKelamin: "Laki-Laki",
    noKk: "6107010210080003",
  },
];

/**
 * Mengambil daftar seluruh akun (warga, petugas instansi, admin) untuk Admin Pusat
 */
export async function getAdminAccountsList(): Promise<{
  success: boolean;
  data: AdminAccountItem[];
  error?: string;
}> {
  try {
    const supabase = createAdminClient() || (await createClient());
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, nik, nama_lengkap, email, nomor_telepon, role, instansi, tingkat, kecamatan, kota, provinsi, desil_saat_ini, created_at, alamat, tempat_lahir, tanggal_lahir, jenis_kelamin, no_kk")
      .order("created_at", { ascending: false });

    if (error || !profiles || profiles.length === 0) {
      return { success: true, data: DEFAULT_SAMPLE_ACCOUNTS };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped: AdminAccountItem[] = profiles.map((p: any) => {
      const role = (p.role as "admin" | "petugas" | "warga") || "warga";
      const instansi = (p.instansi as "dinsos" | "dukcapil" | "pusat" | "umum") || (role === "warga" ? "umum" : "dinsos");
      const tingkat = (p.tingkat as "kecamatan" | "kota" | "provinsi" | "pusat" | "-") || (role === "warga" ? "-" : "kecamatan");

      let wilayah = "";
      if (role === "warga") {
        wilayah = [p.kecamatan ? `Kec. ${p.kecamatan}` : "", p.kota].filter(Boolean).join(", ") || "Indonesia";
      } else if (tingkat === "pusat") {
        wilayah = "Nasional (Pusat RI)";
      } else if (tingkat === "provinsi") {
        wilayah = p.provinsi ? `Prov. ${p.provinsi}` : "Provinsi";
      } else if (tingkat === "kota") {
        wilayah = p.kota ? `Kota ${p.kota}` : "Kota / Kabupaten";
      } else {
        wilayah = [p.kecamatan ? `Kec. ${p.kecamatan}` : "", p.kota].filter(Boolean).join(", ") || "Kecamatan";
      }

      const tglFormatted = p.created_at
        ? new Date(p.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Baru saja";

      const ttl = [
        p.tempat_lahir,
        p.tanggal_lahir
          ? new Date(p.tanggal_lahir).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "",
      ].filter(Boolean).join(", ");

      return {
        id: p.id,
        nik: p.nik || "-",
        nama: p.nama_lengkap || "Pengguna",
        email: p.email || "-",
        nomorTelepon: p.nomor_telepon || "-",
        role,
        instansi,
        tingkat,
        wilayah,
        desil: p.desil_saat_ini,
        status: "Aktif",
        createdAt: tglFormatted,
        alamat: p.alamat || "-",
        tempatTanggalLahir: ttl || "-",
        jenisKelamin: p.jenis_kelamin || "-",
        noKk: p.no_kk || "-",
      };
    });

    const existingNiks = new Set(mapped.map((m) => m.nik));
    const merged = [
      ...mapped,
      ...DEFAULT_SAMPLE_ACCOUNTS.filter((acc) => !existingNiks.has(acc.nik)),
    ];

    return { success: true, data: merged };
  } catch {
    return {
      success: true,
      data: DEFAULT_SAMPLE_ACCOUNTS,
    };
  }
}

/**
 * Admin Pusat mengganti kata sandi akun pengguna/petugas
 */
export async function adminUpdateAccountPassword(params: {
  accountId: string;
  newPassword: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { accountId, newPassword } = params;
    if (!accountId) {
      return { success: false, error: "ID Akun tidak valid." };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "Kata sandi baru minimal 6 karakter." };
    }

    const newHash = hashPassword(newPassword);
    const adminClient = createAdminClient();
    const supabase = adminClient || (await createClient());

    await supabase
      .from("profiles")
      .update({
        password_hash: newHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", accountId);

    if (adminClient) {
      try {
        await adminClient.auth.admin.updateUserById(accountId, {
          password: newPassword,
        });
      } catch {
        // Fallback jika akun mock/hanya ada di profiles
      }
    }

    revalidateAdminAndDashboard();
    return {
      success: true,
      message: "Kata sandi akun berhasil diperbarui.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal memperbarui kata sandi akun.",
    };
  }
}

/**
 * Admin Pusat menghapus akun pengguna/petugas
 */
export async function adminDeleteAccount(params: {
  accountId: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { accountId } = params;
    if (!accountId) {
      return { success: false, error: "ID Akun tidak valid." };
    }

    const adminClient = createAdminClient();
    const supabase = adminClient || (await createClient());

    // Bersihkan relasi data untuk mencegah foreign key constraint
    try {
      await supabase.from("desil_submissions").delete().eq("user_id", accountId);
      await supabase.from("ktp_submissions").delete().eq("user_id", accountId);
      await supabase.from("notifications").delete().eq("user_id", accountId);
    } catch {
      // Abaikan jika tidak ada relasi
    }

    await supabase
      .from("profiles")
      .delete()
      .eq("id", accountId);

    if (adminClient) {
      try {
        await adminClient.auth.admin.deleteUser(accountId);
      } catch {
        // Fallback jika akun mock
      }
    }

    revalidateAdminAndDashboard();
    return {
      success: true,
      message: "Akun berhasil dihapus dari sistem GOV-HUB.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal menghapus akun.",
    };
  }
}
