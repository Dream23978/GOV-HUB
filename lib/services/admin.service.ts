import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  ADMIN_SESSION_COOKIE,
  getAdminPortalBasePath,
  signAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/security";
import {
  formatWibDate,
  formatWibDateTime,
  maskNik,
  normalizeRegionName,
} from "@/lib/format";
import type { WargaDesilItem } from "@/app/components/admin/dinsos/DataWargaDesilContent";

export type AdminPortalKind = "pusat" | "dinsos" | "dukcapil";

export interface VerifiedAdminSession {
  id: string;
  nik: string;
  nama: string;
  email: string | null;
  role: string;
  instansi: "dinsos" | "dukcapil" | "pusat";
  tingkat: "kecamatan" | "kota" | "provinsi" | "pusat";
  portalKind: AdminPortalKind;
  basePath: string;
  wilayahLabel: string;
  provinsi: string | null;
  kota: string | null;
  kecamatan: string | null;
  canApproveFinal: boolean;
}

export function getAdminPortalKind(
  instansi: string | null | undefined,
  tingkat: string | null | undefined
): AdminPortalKind | null {
  const normInstansi = (instansi ?? "").trim().toLowerCase();
  const normTingkat = (tingkat ?? "").trim().toLowerCase();

  if (normInstansi === "pusat" || normTingkat === "pusat" || normTingkat === "provinsi") {
    return "pusat";
  }
  if (normInstansi === "dinsos") return "dinsos";
  if (normInstansi === "dukcapil") return "dukcapil";
  return null;
}

export function formatAdminWilayahLabel(profile: {
  tingkat?: string | null;
  provinsi?: string | null;
  kota?: string | null;
  kecamatan?: string | null;
}): string {
  const tingkat = (profile.tingkat ?? "").trim().toLowerCase();
  if (tingkat === "kecamatan") {
    return (
      [profile.kecamatan ? `Kecamatan ${profile.kecamatan}` : "", profile.kota]
        .filter(Boolean)
        .join(", ") || "Kecamatan"
    );
  }
  if (tingkat === "kota") {
    return profile.kota ? `Kota ${profile.kota}` : "Kota / Kabupaten";
  }
  if (tingkat === "provinsi") {
    return profile.provinsi ? `Provinsi ${profile.provinsi}` : "Provinsi";
  }
  return "Pusat / Nasional";
}

function isProfileInAdminScope(
  target: { kota?: string | null; kecamatan?: string | null } | null | undefined,
  session: VerifiedAdminSession
): boolean {
  if (
    session.portalKind === "pusat" ||
    session.tingkat === "pusat" ||
    session.tingkat === "provinsi"
  ) {
    return true;
  }

  const targetKota = normalizeRegionName(target?.kota);
  const targetKec = normalizeRegionName(target?.kecamatan);
  const scopeKota = normalizeRegionName(session.kota);
  const scopeKec = normalizeRegionName(session.kecamatan);

  if (session.tingkat === "kota") {
    if (!scopeKota || !targetKota) return false;
    return targetKota === scopeKota || targetKota.includes(scopeKota);
  }

  if (session.tingkat === "kecamatan") {
    if (!scopeKec || !targetKec) return false;
    const kecMatch = targetKec === scopeKec || targetKec.includes(scopeKec);
    if (!kecMatch) return false;
    if (scopeKota && targetKota) {
      return targetKota === scopeKota || targetKota.includes(scopeKota);
    }
    return true;
  }

  return false;
}

/**
 * Verifies the HMAC-signed govhub_admin_session cookie AND live DB staff role.
 * Fails closed when service-role client or DB row is missing or reassigned.
 */
export async function verifyAdminSession(
  allowedPortals?: AdminPortalKind[]
): Promise<
  | { authorized: true; session: VerifiedAdminSession; canApprove: boolean; status: 200 }
  | { authorized: false; canApprove: false; status: number; error: string }
> {
  try {
    const cookieStore = await cookies();
    const tokenValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const tokenPayload = await verifyAdminSessionToken(tokenValue);

    if (!tokenPayload) {
      return {
        authorized: false,
        canApprove: false,
        status: 401,
        error: "Sesi aparatur tidak ditemukan atau telah kedaluwarsa.",
      };
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return {
        authorized: false,
        canApprove: false,
        status: 503,
        error: "Konfigurasi autentikasi server belum lengkap.",
      };
    }

    const { data: profile, error } = await adminClient
      .from("profiles")
      .select("id, nik, nama_lengkap, email, role, instansi, tingkat, provinsi, kota, kecamatan")
      .eq("id", tokenPayload.id)
      .maybeSingle();

    if (error || !profile) {
      return {
        authorized: false,
        canApprove: false,
        status: 401,
        error: "Akun aparatur tidak ditemukan.",
      };
    }

    if (profile.role !== "admin" && profile.role !== "petugas") {
      return {
        authorized: false,
        canApprove: false,
        status: 403,
        error: "Akses ditolak: akun bukan aparatur/petugas.",
      };
    }

    const dbBasePath = getAdminPortalBasePath(profile.instansi, profile.tingkat);
    const tokenBasePath = getAdminPortalBasePath(tokenPayload.instansi, tokenPayload.tingkat);
    const portalKind = getAdminPortalKind(profile.instansi, profile.tingkat);

    if (!portalKind || dbBasePath === "/admin/login" || dbBasePath !== tokenBasePath) {
      return {
        authorized: false,
        canApprove: false,
        status: 403,
        error: "Sesi instansi tidak valid atau telah berubah.",
      };
    }

    if (allowedPortals && !allowedPortals.includes(portalKind)) {
      return {
        authorized: false,
        canApprove: false,
        status: 403,
        error: "Akses ditolak: instansi tidak berwenang untuk modul ini.",
      };
    }

    const instansi = ((profile.instansi ?? "dinsos").trim().toLowerCase() || "dinsos") as
      | "dinsos"
      | "dukcapil"
      | "pusat";
    const tingkat = ((profile.tingkat ?? "kecamatan").trim().toLowerCase() || "kecamatan") as
      | "kecamatan"
      | "kota"
      | "provinsi"
      | "pusat";

    const canApproveFinal = portalKind === "pusat";

    return {
      authorized: true,
      canApprove: canApproveFinal,
      status: 200,
      session: {
        id: profile.id,
        nik: profile.nik,
        nama: profile.nama_lengkap || "Petugas",
        email: profile.email ?? null,
        role: profile.role,
        instansi,
        tingkat,
        portalKind,
        basePath: dbBasePath,
        wilayahLabel: formatAdminWilayahLabel(profile),
        provinsi: profile.provinsi ?? null,
        kota: profile.kota ?? null,
        kecamatan: profile.kecamatan ?? null,
        canApproveFinal,
      },
    };
  } catch {
    return {
      authorized: false,
      canApprove: false,
      status: 401,
      error: "Sesi admin tidak valid.",
    };
  }
}

export async function verifyDinsosAdminSession() {
  return verifyAdminSession(["dinsos", "pusat"]);
}

export async function requireAdminPageSession(
  expectedPortal: AdminPortalKind,
  expectedTingkat?: "kota" | "kecamatan"
): Promise<VerifiedAdminSession> {
  const auth = await verifyAdminSession();
  if (!auth.authorized) {
    redirect("/admin/login");
  }
  if (
    auth.session.portalKind !== expectedPortal ||
    (expectedTingkat && auth.session.tingkat !== expectedTingkat)
  ) {
    redirect(auth.session.basePath);
  }
  return auth.session;
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
  statusRaw:
    | "menunggu_verifikasi"
    | "diproses"
    | "menunggu_cetak"
    | "selesai"
    | "ditolak"
    | "pengajuan_ulang";
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
 * Mengambil seluruh pengajuan desil warga sesuai cakupan wilayah aparatur Dinsos / Pusat
 */
export async function getAdminDesilSubmissions(): Promise<{
  success: boolean;
  data: DesilAdminRow[];
  counts: { total: number; perluVerifikasi: number; disetujui: number; ditolak: number };
  error?: string;
}> {
  try {
    const auth = await verifyAdminSession(["dinsos", "pusat"]);
    if (!auth.authorized) {
      return {
        success: false,
        data: [],
        counts: { total: 0, perluVerifikasi: 0, disetujui: 0, ditolak: 0 },
        error: auth.error,
      };
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return {
        success: false,
        data: [],
        counts: { total: 0, perluVerifikasi: 0, disetujui: 0, ditolak: 0 },
        error: "Layanan database server tidak tersedia.",
      };
    }

    const { data, error } = await supabase
      .from("desil_submissions")
      .select(
        "id, nomor_tiket, user_id, desil_lama, desil_diajukan, pekerjaan_kepala_keluarga, penghasilan_bulanan, foto_rumah_depan_url, status, desil_hasil_peninjauan, catatan_verifikasi, created_at, profiles:user_id(id, nama_lengkap, nik, alamat, nomor_telepon, kota, kecamatan)"
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return {
        success: false,
        data: [],
        counts: { total: 0, perluVerifikasi: 0, disetujui: 0, ditolak: 0 },
        error: "Gagal mengambil daftar pengajuan desil.",
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scopedData = (data || []).filter((item: any) =>
      isProfileInAdminScope(item.profiles, auth.session)
    );

    const storagePaths = Array.from(
      new Set(
        scopedData
          .map((item: { foto_rumah_depan_url?: string | null }) =>
            String(item.foto_rumah_depan_url || "").trim()
          )
          .filter(
            (p: string) =>
              Boolean(p) &&
              !p.startsWith("http://") &&
              !p.startsWith("https://") &&
              !p.startsWith("data:")
          )
          .map((p: string) => p.replace(/^govhub-documents\//, ""))
      )
    );

    const signedPhotoMap = new Map<string, string>();
    if (storagePaths.length > 0) {
      const { data: signedList } = await supabase.storage
        .from("govhub-documents")
        .createSignedUrls(storagePaths, 3600);
      for (const entry of signedList || []) {
        if (entry.path && entry.signedUrl) {
          signedPhotoMap.set(entry.path, entry.signedUrl);
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: DesilAdminRow[] = scopedData.map((item: any, idx: number) => {
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

      const alasanClean = (item.catatan_verifikasi || "-").replace(/^Alasan:\s*/, "");
      const rawPendapatan = item.penghasilan_bulanan;
      const formattedPendapatan =
        rawPendapatan !== null && rawPendapatan !== undefined
          ? `Rp ${Number(rawPendapatan).toLocaleString("id-ID")}`
          : "-";

      const rawPhoto = String(item.foto_rumah_depan_url || "").trim();
      const normalizedPhoto = rawPhoto.replace(/^govhub-documents\//, "");
      const resolvedHousePhoto =
        signedPhotoMap.get(normalizedPhoto) ||
        (rawPhoto.startsWith("http://") || rawPhoto.startsWith("https://") ? rawPhoto : "");

      return {
        id: item.id,
        nomor: item.nomor_tiket || `DSL-${item.id.slice(0, 8).toUpperCase()}`,
        nama,
        desilSaatIni: item.desil_lama ? `Desil ${item.desil_lama}` : "Belum Terdata",
        desilDiajukan: item.desil_diajukan || 2,
        statusBadge: badgeText,
        statusRaw: item.status || "menunggu_verifikasi",
        tanggal: formatWibDateTime(item.created_at, "\n"),
        initial,
        bgInitial: color.bg,
        textInitial: color.text,
        pekerjaan: item.pekerjaan_kepala_keluarga || "-",
        pendapatan: formattedPendapatan,
        alasan: alasanClean,
        housePhoto: resolvedHousePhoto,
        lokasi: profile?.alamat || "-",
        userId: item.user_id,
        nik: maskNik(profile?.nik),
      };
    });

    return {
      success: true,
      data: rows,
      counts: {
        total: rows.length,
        perluVerifikasi: rows.filter(
          (r) => r.statusRaw === "menunggu_verifikasi" || r.statusRaw === "diproses"
        ).length,
        disetujui: rows.filter((r) => r.statusRaw === "disetujui").length,
        ditolak: rows.filter((r) => r.statusRaw === "ditolak").length,
      },
    };
  } catch {
    return {
      success: false,
      data: [],
      counts: { total: 0, perluVerifikasi: 0, disetujui: 0, ditolak: 0 },
      error: "Terjadi kesalahan server.",
    };
  }
}

/**
 * Petugas menyetujui, mengecek lapangan, atau menolak permohonan peninjauan desil
 */
export async function updateDesilSubmissionStatus(params: {
  id: string;
  status: "disetujui" | "ditolak" | "diproses";
  desilHasil?: number;
  catatan?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await verifyAdminSession(["dinsos", "pusat"]);
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }
    if ((params.status === "disetujui" || params.status === "ditolak") && !auth.canApprove) {
      return {
        success: false,
        error:
          "Penetapan final hanya dapat dilakukan Admin Dinsos Provinsi / Pusat. Gunakan status Pengecekan Lapangan.",
      };
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return { success: false, error: "Layanan database server tidak tersedia." };
    }

    const { data: sub, error: subErr } = await supabase
      .from("desil_submissions")
      .select("id, user_id, nomor_tiket, desil_diajukan, profiles:user_id(kota, kecamatan)")
      .eq("id", params.id)
      .maybeSingle();

    if (subErr || !sub) {
      return { success: false, error: "Data pengajuan tidak ditemukan." };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const targetProfile = (sub as any).profiles;
    if (!isProfileInAdminScope(targetProfile, auth.session)) {
      return {
        success: false,
        error: "Akses ditolak: pengajuan berada di luar wilayah tugas Anda.",
      };
    }

    const rawDesil = params.desilHasil ?? sub.desil_diajukan ?? 2;
    if (
      params.status === "disetujui" &&
      (!Number.isInteger(rawDesil) || rawDesil < 1 || rawDesil > 10)
    ) {
      return { success: false, error: "Nilai desil hasil harus antara 1 sampai 10." };
    }

    const updatePayload: Record<string, unknown> = {
      status: params.status,
      petugas_id: auth.session.id,
      updated_at: new Date().toISOString(),
    };
    if (params.status === "disetujui") {
      updatePayload.desil_hasil_peninjauan = rawDesil;
    }
    if (params.catatan?.trim()) {
      updatePayload.catatan_verifikasi = params.catatan.trim();
    }

    const { error: updateErr } = await supabase
      .from("desil_submissions")
      .update(updatePayload)
      .eq("id", params.id);

    if (updateErr) {
      return { success: false, error: "Gagal memperbarui status pengajuan." };
    }

    if (params.status === "disetujui" && sub.user_id) {
      const { error: profErr } = await supabase
        .from("profiles")
        .update({
          desil_saat_ini: rawDesil,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sub.user_id);

      if (profErr) {
        return { success: false, error: "Status pengajuan disimpan, tetapi gagal memperbarui desil profil warga." };
      }
    }

    if (sub.user_id) {
      const judul =
        params.status === "disetujui"
          ? "Peninjauan Desil Disetujui"
          : params.status === "ditolak"
          ? "Peninjauan Desil Belum Disetujui"
          : "Peninjauan Desil Sedang Diverifikasi";

      const pesan =
        params.status === "disetujui"
          ? `Selamat, pengajuan Anda #${sub.nomor_tiket} telah disetujui. Desil Anda kini resmi ditetapkan menjadi Desil ${rawDesil}.`
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
  } catch {
    return { success: false, error: "Gagal memperbarui status pengajuan." };
  }
}

/**
 * Mengambil seluruh pengajuan KTP warga sesuai cakupan wilayah aparatur Dukcapil / Pusat
 */
export async function getAdminKtpSubmissions(): Promise<{
  success: boolean;
  data: KtpAdminRow[];
  counts: { total: number; menungguVerifikasi: number; diproses: number; selesai: number };
  biometricCount: number;
  error?: string;
}> {
  try {
    const auth = await verifyAdminSession(["dukcapil", "pusat"]);
    if (!auth.authorized) {
      return {
        success: false,
        data: [],
        counts: { total: 0, menungguVerifikasi: 0, diproses: 0, selesai: 0 },
        biometricCount: 0,
        error: auth.error,
      };
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return {
        success: false,
        data: [],
        counts: { total: 0, menungguVerifikasi: 0, diproses: 0, selesai: 0 },
        biometricCount: 0,
        error: "Layanan database server tidak tersedia.",
      };
    }

    const [{ data, error }, { count: biometricCount }] = await Promise.all([
      supabase
        .from("ktp_submissions")
        .select(
          "id, nomor_tiket, user_id, jenis_pengajuan, waktu_kehadiran_biometrik, status, catatan_petugas, created_at, profiles:user_id(id, nama_lengkap, nik, alamat, nomor_telepon, tanggal_lahir, jenis_kelamin, kota, kecamatan)"
        )
        .order("created_at", { ascending: false })
        .limit(150),
      supabase.from("biometric_schedules").select("id", { count: "exact", head: true }),
    ]);

    if (error) {
      return {
        success: false,
        data: [],
        counts: { total: 0, menungguVerifikasi: 0, diproses: 0, selesai: 0 },
        biometricCount: 0,
        error: "Gagal mengambil data pengajuan KTP.",
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scopedData = (data || []).filter((item: any) =>
      isProfileInAdminScope(item.profiles, auth.session)
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: KtpAdminRow[] = scopedData.map((item: any, idx: number) => {
      const profile = item.profiles;
      const nama = profile?.nama_lengkap || "Warga Terdaftar";
      const initial = getInitials(nama);
      const color = INITIAL_COLORS[idx % INITIAL_COLORS.length];
      const maskedNik = maskNik(profile?.nik);

      let statusBadge = "Menunggu Verifikasi";
      if (item.status === "selesai") statusBadge = "KTP Selesai";
      else if (item.status === "menunggu_cetak") statusBadge = "Menunggu Cetak";
      else if (item.status === "diproses") statusBadge = "Perekaman Biometrik";
      else if (item.status === "ditolak") statusBadge = "Ditolak";
      else if (item.status === "pengajuan_ulang") statusBadge = "Pengajuan Ulang";

      const tanggalFormatted = item.waktu_kehadiran_biometrik
        ? formatWibDate(item.waktu_kehadiran_biometrik, "short")
        : formatWibDateTime(item.created_at, " ");

      let usiaStr = "-";
      if (profile?.tanggal_lahir) {
        const birthDate = new Date(profile.tanggal_lahir);
        if (!Number.isNaN(birthDate.getTime())) {
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age -= 1;
          usiaStr = `${Math.max(0, age)} Tahun`;
        }
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
        nikFull: maskedNik,
        initial,
        bgInitial: color.bg,
        textInitial: color.text,
        alamat: profile?.alamat || "-",
        userId: item.user_id,
        nomorRegistrasi: item.nomor_tiket ? item.nomor_tiket.replace("KTP-", "") : "-",
        noHp: profile?.nomor_telepon || "-",
        alasan: item.catatan_petugas || "-",
        statusPenduduk: "Aktif",
        usia: usiaStr,
        tanggalLahir: profile?.tanggal_lahir || "-",
      };
    });

    return {
      success: true,
      data: rows,
      counts: {
        total: rows.length,
        menungguVerifikasi: rows.filter((r) => r.statusRaw === "menunggu_verifikasi").length,
        diproses: rows.filter((r) => r.statusRaw === "diproses").length,
        selesai: rows.filter((r) => r.statusRaw === "selesai").length,
      },
      biometricCount: biometricCount ?? 0,
    };
  } catch {
    return {
      success: false,
      data: [],
      counts: { total: 0, menungguVerifikasi: 0, diproses: 0, selesai: 0 },
      biometricCount: 0,
      error: "Kesalahan server.",
    };
  }
}

/**
 * Petugas memperbarui status pengajuan KTP warga sesuai wewenang Dukcapil / Pusat
 */
export async function updateKtpSubmissionStatus(params: {
  id: string;
  status: "selesai" | "diproses" | "menunggu_cetak" | "ditolak";
  catatan?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await verifyAdminSession(["dukcapil", "pusat"]);
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return { success: false, error: "Layanan database server tidak tersedia." };
    }

    const { data: sub, error: subErr } = await supabase
      .from("ktp_submissions")
      .select("id, user_id, nomor_tiket, status, profiles:user_id(kota, kecamatan)")
      .eq("id", params.id)
      .maybeSingle();

    if (subErr || !sub) {
      return { success: false, error: "Data pengajuan KTP tidak ditemukan." };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const targetProfile = (sub as any).profiles;
    if (!isProfileInAdminScope(targetProfile, auth.session)) {
      return {
        success: false,
        error: "Akses ditolak: permohonan berada di luar wilayah tugas Anda.",
      };
    }

    if (
      auth.session.instansi === "dukcapil" &&
      auth.session.tingkat === "kecamatan" &&
      (params.status === "selesai" || params.status === "ditolak")
    ) {
      return {
        success: false,
        error: "Akses ditolak: penyelesaian cetak & penolakan KTP hanya untuk Dukcapil Kota atau Admin Pusat.",
      };
    }

    const nowIso = new Date().toISOString();
    const { error } = await supabase
      .from("ktp_submissions")
      .update({
        status: params.status,
        catatan_petugas: params.catatan?.trim() || null,
        petugas_id: auth.session.id,
        completed_at: params.status === "selesai" ? nowIso : null,
        updated_at: nowIso,
      })
      .eq("id", params.id);

    if (error) {
      return { success: false, error: "Gagal memperbarui status pengajuan KTP." };
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
  } catch {
    return { success: false, error: "Gagal memperbarui status pengajuan KTP." };
  }
}

/**
 * Mengambil seluruh data warga terdaftar (khusus role warga) dalam cakupan wilayah sesi admin
 */
export async function getAdminDataWarga(): Promise<{
  success: boolean;
  data: WargaDesilItem[];
  error?: string;
}> {
  try {
    const auth = await verifyAdminSession(["dinsos", "dukcapil", "pusat"]);
    if (!auth.authorized) {
      return { success: false, data: [], error: auth.error };
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return { success: false, data: [], error: "Layanan database server tidak tersedia." };
    }

    const [{ data: wargaList, error: wargaError }, { data: submissions }] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, nik, nama_lengkap, no_kk, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, rt, rw, kelurahan, kecamatan, kota, provinsi, nomor_telepon, pekerjaan, penghasilan_bulanan, role, desil_saat_ini, created_at"
        )
        .eq("role", "warga")
        .order("nama_lengkap", { ascending: true })
        .limit(200),
      supabase
        .from("desil_submissions")
        .select("id, user_id, status, desil_diajukan, penghasilan_bulanan")
        .order("created_at", { ascending: false })
        .limit(300),
    ]);

    if (wargaError) {
      return { success: false, data: [], error: "Gagal mengambil data warga." };
    }

    const submissionMap = new Map<
      string,
      { status: string; desilDiajukan?: number; penghasilanBulanan?: number | null }
    >();
    (submissions || []).forEach((s) => {
      if (s.user_id && !submissionMap.has(s.user_id)) {
        submissionMap.set(s.user_id, {
          status: s.status,
          desilDiajukan: s.desil_diajukan,
          penghasilanBulanan:
            s.penghasilan_bulanan !== null && s.penghasilan_bulanan !== undefined
              ? Number(s.penghasilan_bulanan)
              : null,
        });
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scopedWarga = (wargaList || []).filter((w: any) =>
      isProfileInAdminScope(w, auth.session)
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedWarga: WargaDesilItem[] = scopedWarga.map((w: any) => {
      const nikMasked = maskNik(w.nik);
      const tglLahir = w.tanggal_lahir ? formatWibDate(w.tanggal_lahir, "short") : "";
      const ttl = [w.tempat_lahir, tglLahir !== "-" ? tglLahir : ""].filter(Boolean).join(", ") || "-";

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

      const rawPenghasilan =
        w.penghasilan_bulanan !== null && w.penghasilan_bulanan !== undefined
          ? Number(w.penghasilan_bulanan)
          : userSub?.penghasilanBulanan;

      return {
        id: w.id,
        nikMasked,
        nikFull: nikMasked,
        nama: w.nama_lengkap || "-",
        desil: w.desil_saat_ini ?? 0,
        status: "Aktif" as const,
        kecamatan: w.kecamatan ? `Kecamatan ${w.kecamatan}` : "-",
        kelurahan: w.kelurahan || "-",
        alamat: w.alamat || "-",
        ttl,
        jenisKelamin: (w.jenis_kelamin || "-") as "Laki-laki" | "Perempuan",
        pekerjaan: w.pekerjaan || "-",
        pendapatan:
          rawPenghasilan !== null && rawPenghasilan !== undefined
            ? `Rp ${rawPenghasilan.toLocaleString("id-ID")} / bulan`
            : "-",
        noTelepon: w.nomor_telepon || "-",
        statusAjuanDesil,
      };
    });

    return { success: true, data: formattedWarga };
  } catch {
    return { success: false, data: [], error: "Gagal mengambil data warga." };
  }
}

/**
 * Autentikasi petugas aparatur berdasarkan data akun di tabel profiles & sign HMAC token
 */
export async function authenticateAdmin(
  nip: string,
  password: string
): Promise<{
  success: boolean;
  token?: string;
  user?: {
    id: string;
    nik: string;
    nama_lengkap: string;
    role: string;
    email?: string | null;
    instansi: "dinsos" | "dukcapil" | "pusat";
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
    if (!cleanNip || cleanNip.length < 8 || !password || password.length < 6) {
      return { success: false, error: "NIP atau kata sandi tidak valid." };
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return { success: false, error: "Konfigurasi autentikasi server belum tersedia." };
    }

    const { data: profile, error } = await adminClient
      .from("profiles")
      .select(
        "id, nik, nama_lengkap, role, email, password_hash, instansi, tingkat, kecamatan, kota, provinsi"
      )
      .eq("nik", cleanNip)
      .maybeSingle();

    if (error || !profile || (profile.role !== "admin" && profile.role !== "petugas")) {
      return { success: false, error: "NIP atau kata sandi tidak cocok." };
    }

    const { valid, needsRehash } = verifyPassword(password, profile.password_hash);
    if (!valid) {
      return { success: false, error: "NIP atau kata sandi tidak cocok." };
    }

    if (needsRehash) {
      await adminClient
        .from("profiles")
        .update({
          password_hash: hashPassword(password),
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);
    }

    const instansi = ((profile.instansi ?? "dinsos").trim().toLowerCase() || "dinsos") as
      | "dinsos"
      | "dukcapil"
      | "pusat";
    const tingkat = ((profile.tingkat ?? "kecamatan").trim().toLowerCase() || "kecamatan") as
      | "kecamatan"
      | "kota"
      | "provinsi"
      | "pusat";
    const targetUrl = getAdminPortalBasePath(instansi, tingkat);

    if (targetUrl === "/admin/login") {
      return { success: false, error: "Konfigurasi instansi/tingkat akun tidak valid." };
    }

    const token = await signAdminSessionToken({
      id: profile.id,
      nik: profile.nik,
      instansi,
      tingkat,
      role: profile.role,
      provinsi: profile.provinsi ?? null,
      kota: profile.kota ?? null,
      kecamatan: profile.kecamatan ?? null,
    });

    return {
      success: true,
      token,
      user: {
        id: profile.id,
        nik: profile.nik,
        nama_lengkap: profile.nama_lengkap,
        role: profile.role,
        email: profile.email,
        instansi,
        tingkat,
        wilayahLabel: formatAdminWilayahLabel({
          tingkat,
          provinsi: profile.provinsi,
          kota: profile.kota,
          kecamatan: profile.kecamatan,
        }),
        targetUrl,
        kecamatan: profile.kecamatan,
        kota: profile.kota,
        provinsi: profile.provinsi,
      },
    };
  } catch {
    return { success: false, error: "Kesalahan server saat verifikasi admin." };
  }
}

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

/**
 * Mengambil daftar akun (khusus Admin Pusat terautentikasi)
 */
export async function getAdminAccountsList(): Promise<{
  success: boolean;
  data: AdminAccountItem[];
  error?: string;
}> {
  try {
    const auth = await verifyAdminSession(["pusat"]);
    if (!auth.authorized) {
      return { success: false, data: [], error: auth.error };
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return { success: false, data: [], error: "Layanan database server tidak tersedia." };
    }

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select(
        "id, nik, nama_lengkap, email, nomor_telepon, role, instansi, tingkat, kecamatan, kota, provinsi, desil_saat_ini, created_at, alamat, tempat_lahir, tanggal_lahir, jenis_kelamin, no_kk"
      )
      .order("created_at", { ascending: false })
      .limit(250);

    if (error) {
      return { success: false, data: [], error: "Gagal mengambil daftar akun." };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped: AdminAccountItem[] = (profiles || []).map((p: any) => {
      const role = (p.role as "admin" | "petugas" | "warga") || "warga";
      const instansi =
        (p.instansi as "dinsos" | "dukcapil" | "pusat" | "umum") ||
        (role === "warga" ? "umum" : "dinsos");
      const tingkat =
        (p.tingkat as "kecamatan" | "kota" | "provinsi" | "pusat" | "-") ||
        (role === "warga" ? "-" : "kecamatan");

      let wilayah = "Indonesia";
      if (role === "warga") {
        wilayah =
          [p.kecamatan ? `Kec. ${p.kecamatan}` : "", p.kota].filter(Boolean).join(", ") ||
          "Indonesia";
      } else {
        wilayah = formatAdminWilayahLabel(p);
      }

      const tglFormatted = formatWibDate(p.created_at, "short");
      const ttlDate = p.tanggal_lahir ? formatWibDate(p.tanggal_lahir, "short") : "";
      const ttl = [p.tempat_lahir, ttlDate !== "-" ? ttlDate : ""].filter(Boolean).join(", ");

      return {
        id: p.id,
        nik: role === "warga" ? maskNik(p.nik) : p.nik || "-",
        nama: p.nama_lengkap || "Pengguna",
        email: p.email || "-",
        nomorTelepon: p.nomor_telepon || "-",
        role,
        instansi,
        tingkat,
        wilayah,
        desil: p.desil_saat_ini,
        status: role === "warga" ? "Terverifikasi" : "Aktif",
        createdAt: tglFormatted !== "-" ? tglFormatted : "Baru saja",
        alamat: p.alamat || "-",
        tempatTanggalLahir: ttl || "-",
        jenisKelamin: p.jenis_kelamin || "-",
        noKk: role === "warga" ? maskNik(p.no_kk) : p.no_kk || "-",
      };
    });

    return { success: true, data: mapped };
  } catch {
    return { success: false, data: [], error: "Gagal mengambil daftar akun." };
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
    const auth = await verifyAdminSession(["pusat"]);
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }

    const { accountId, newPassword } = params;
    if (!accountId || !/^[0-9a-f-]{36}$/i.test(accountId)) {
      return { success: false, error: "ID Akun tidak valid." };
    }
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: "Kata sandi baru minimal 8 karakter." };
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return { success: false, error: "Layanan database server tidak tersedia." };
    }

    const { data: target, error: findErr } = await adminClient
      .from("profiles")
      .select("id")
      .eq("id", accountId)
      .maybeSingle();

    if (findErr || !target) {
      return { success: false, error: "Akun tidak ditemukan." };
    }

    const newHash = hashPassword(newPassword);
    const { error: profErr } = await adminClient
      .from("profiles")
      .update({
        password_hash: newHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", accountId);

    if (profErr) {
      return { success: false, error: "Gagal memperbarui kata sandi profil." };
    }

    const { error: authErr } = await adminClient.auth.admin.updateUserById(accountId, {
      password: newPassword,
    });
    if (authErr && !/not found/i.test(authErr.message)) {
      return { success: false, error: "Gagal menyinkronkan kata sandi autentikasi." };
    }

    revalidateAdminAndDashboard();
    return {
      success: true,
      message: "Kata sandi akun berhasil diperbarui.",
    };
  } catch {
    return { success: false, error: "Gagal memperbarui kata sandi akun." };
  }
}

/**
 * Admin Pusat menghapus akun pengguna/petugas
 */
export async function adminDeleteAccount(params: {
  accountId: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const auth = await verifyAdminSession(["pusat"]);
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }

    const { accountId } = params;
    if (!accountId || !/^[0-9a-f-]{36}$/i.test(accountId)) {
      return { success: false, error: "ID Akun tidak valid." };
    }
    if (accountId === auth.session.id) {
      return { success: false, error: "Tidak dapat menghapus akun Anda sendiri yang sedang aktif." };
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return { success: false, error: "Layanan database server tidak tersedia." };
    }

    await adminClient.from("desil_submissions").delete().eq("user_id", accountId);
    await adminClient.from("ktp_submissions").delete().eq("user_id", accountId);
    await adminClient.from("notifications").delete().eq("user_id", accountId);

    const { error: delProfErr } = await adminClient
      .from("profiles")
      .delete()
      .eq("id", accountId);

    if (delProfErr) {
      return { success: false, error: "Gagal menghapus profil akun." };
    }

    const { error: delAuthErr } = await adminClient.auth.admin.deleteUser(accountId);
    if (delAuthErr && !/not found/i.test(delAuthErr.message)) {
      return { success: false, error: "Profil terhapus, tetapi gagal menghapus kredensial Auth." };
    }

    revalidateAdminAndDashboard();
    return {
      success: true,
      message: "Akun berhasil dihapus dari sistem GOV-HUB.",
    };
  } catch {
    return { success: false, error: "Gagal menghapus akun." };
  }
}
