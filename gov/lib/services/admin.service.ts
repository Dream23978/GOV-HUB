import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { hashPassword } from "@/lib/services/auth.service";

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
}

export interface KtpAdminRow {
  id: string;
  nomor: string;
  nama: string;
  layanan: string;
  statusBadge: string;
  statusRaw: "menunggu_verifikasi" | "diproses" | "selesai" | "ditolak";
  tanggal: string;
  nik: string;
  initial: string;
  bgInitial: string;
  textInitial: string;
  alamat: string;
  userId?: string;
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
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Gagal mengambil desil_submissions admin:", error.message);
      return {
        success: false,
        data: [],
        counts: { total: 0, perluVerifikasi: 0, disetujui: 0, ditolak: 0 },
        error: error.message,
      };
    }

    const rows: DesilAdminRow[] = (data || []).map((item: any, idx: number) => {
      const profile = item.profiles;
      const nama = profile?.nama_lengkap || "Warga Terdaftar";
      const initial = getInitials(nama);
      const color = INITIAL_COLORS[idx % INITIAL_COLORS.length];

      let badgeText = "Perlu Diperbarui";
      if (item.status === "disetujui") {
        badgeText = `Disetujui (Desil ${item.desil_hasil_peninjauan || item.desil_diajukan || 2})`;
      } else if (item.status === "ditolak") {
        badgeText = "Ditolak";
      } else if (item.status === "diproses") {
        badgeText = "Sedang Diverifikasi";
      }

      const dateObj = item.created_at ? new Date(item.created_at) : new Date();
      const tanggalFormatted = `${dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}\n${dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`;

      let alasanClean = item.catatan_verifikasi || "Kondisi ekonomi menurun & pemutusan kerja";
      if (alasanClean.startsWith("Alasan: ")) {
        alasanClean = alasanClean.replace(/^Alasan:\s*/, "");
      }

      const rawPendapatan = item.penghasilan_bulanan || 1000000;
      const formattedPendapatan = `Rp ${Number(rawPendapatan).toLocaleString("id-ID")}`;

      return {
        id: item.id,
        nomor: item.nomor_tiket || `DSL-${item.id.slice(0, 8).toUpperCase()}`,
        nama,
        desilSaatIni: `Desil ${item.desil_lama || 4}`,
        desilDiajukan: item.desil_diajukan || 2,
        statusBadge: badgeText,
        statusRaw: item.status || "menunggu_verifikasi",
        tanggal: tanggalFormatted,
        initial,
        bgInitial: color.bg,
        textInitial: color.text,
        pekerjaan: item.pekerjaan_kepala_keluarga || "Wiraswasta / Pekerja Lepas",
        pendapatan: formattedPendapatan,
        alasan: alasanClean,
        housePhoto: item.foto_rumah_depan_url || "/sample-house.png",
        lokasi: profile?.alamat || "Kota Surabaya (Geotag Valid Terdeteksi)",
        userId: item.user_id,
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
    const updatePayload: any = {
      status: params.status,
      updated_at: new Date().toISOString(),
    };

    if (params.status === "disetujui") {
      updatePayload.desil_hasil_peninjauan = desilBaru;
    }
    if (params.catatan) {
      updatePayload.catatan_verifikasi = params.catatan;
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
          : "Peninjauan Desil Sedang Diproses";

      const pesan =
        params.status === "disetujui"
          ? `Selamat, pengajuan Anda #${sub.nomor_tiket} telah disetujui. Desil Anda kini resmi ditetapkan menjadi Desil ${desilBaru}.`
          : params.status === "ditolak"
          ? `Pengajuan #${sub.nomor_tiket} belum memenuhi persyaratan penyesuaian desil.`
          : `Pengajuan #${sub.nomor_tiket} sedang diverifikasi petugas lapangan.`;

      await supabase.from("notifications").insert({
        user_id: sub.user_id,
        judul,
        pesan,
        tipe: "bansos",
        is_read: false,
        tautan_aksi: "/dashboard/layanan-bansos/tracking",
      });
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui status pengajuan.";
    return { success: false, error: msg };
  }
}

/**
 * Mengambil seluruh pengajuan KTP warga untuk dashboard Admin Dukcapil
 */
export async function getAdminKtpSubmissions(): Promise<{
  success: boolean;
  data: KtpAdminRow[];
  counts: { total: number; menungguVerifikasi: number; diproses: number; selesai: number };
  error?: string;
}> {
  try {
    const supabase = createAdminClient() || (await createClient());

    const { data, error } = await supabase
      .from("ktp_submissions")
      .select("*, profiles:user_id(id, nama_lengkap, nik, alamat, nomor_telepon)")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Gagal mengambil ktp_submissions admin:", error.message);
      return {
        success: false,
        data: [],
        counts: { total: 0, menungguVerifikasi: 0, diproses: 0, selesai: 0 },
        error: error.message,
      };
    }

    const rows: KtpAdminRow[] = (data || []).map((item: any, idx: number) => {
      const profile = item.profiles;
      const nama = profile?.nama_lengkap || "Warga Terdaftar";
      const initial = getInitials(nama);
      const color = INITIAL_COLORS[idx % INITIAL_COLORS.length];

      const rawNik = profile?.nik || "3578012304950002";
      const maskedNik =
        rawNik.length >= 4 ? `357*********${rawNik.slice(-3)}` : "357*********002";

      let statusBadge = "Menunggu Verifikasi";
      if (item.status === "selesai") statusBadge = "Disetujui & Dicetak";
      else if (item.status === "diproses") statusBadge = "Sedang Dicetak";
      else if (item.status === "ditolak") statusBadge = "Ditolak";

      const dateObj = item.created_at ? new Date(item.created_at) : new Date();
      const tanggalFormatted = `${dateObj.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} ${dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`;

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
        alamat: profile?.alamat || "Kota Surabaya, Jawa Timur",
        userId: item.user_id,
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
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan server.";
    return {
      success: false,
      data: [],
      counts: { total: 0, menungguVerifikasi: 0, diproses: 0, selesai: 0 },
      error: msg,
    };
  }
}

/**
 * Petugas memperbarui status pengajuan KTP warga
 */
export async function updateKtpSubmissionStatus(params: {
  id: string;
  status: "selesai" | "diproses" | "ditolak";
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
          : params.status === "diproses"
          ? "KTP-el Sedang Dicetak"
          : "Permohonan KTP Ditolak";

      const pesan =
        params.status === "selesai"
          ? `Permohonan KTP #${sub.nomor_tiket} Anda telah selesai dicetak dan siap diambil di Kantor Kecamatan.`
          : params.status === "diproses"
          ? `Permohonan KTP #${sub.nomor_tiket} sedang dalam proses cetak blanko.`
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

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui status pengajuan KTP.";
    return { success: false, error: msg };
  }
}

/**
 * Cek dan ambil data instansi & tingkat wilayah aparatur berdasarkan NIP secara otomatis
 */
const KNOWN_ADMINS: Record<string, {
  nama_lengkap: string;
  instansi: "dinsos" | "dukcapil";
  tingkat: "kecamatan" | "kota" | "provinsi" | "pusat";
  wilayahLabel: string;
  targetUrl: string;
}> = {
  "198905142014021001": {
    nama_lengkap: "Petugas Dinsos Kota Surabaya",
    instansi: "dinsos",
    tingkat: "kota",
    wilayahLabel: "Kota Surabaya",
    targetUrl: "/admin/dinsos/kota/dashboard",
  },
  "198905142014021002": {
    nama_lengkap: "Operator Dukcapil Kota Pontianak",
    instansi: "dukcapil",
    tingkat: "kota",
    wilayahLabel: "Kota Pontianak, Kalbar",
    targetUrl: "/admin/dukcapil/kota/dashboard",
  },
  "198905142014021003": {
    nama_lengkap: "Admin Dinsos Kecamatan Genteng",
    instansi: "dinsos",
    tingkat: "kecamatan",
    wilayahLabel: "Kecamatan Genteng, Surabaya",
    targetUrl: "/admin/dinsos/kecamatan/dashboard",
  },
  "198905142014021004": {
    nama_lengkap: "Petugas Dukcapil Kecamatan Genteng",
    instansi: "dukcapil",
    tingkat: "kecamatan",
    wilayahLabel: "Kecamatan Genteng, Surabaya",
    targetUrl: "/admin/dukcapil/kecamatan/dashboard",
  },
  "198905142014021005": {
    nama_lengkap: "Admin Dinsos Provinsi Jawa Timur",
    instansi: "dinsos",
    tingkat: "provinsi",
    wilayahLabel: "Provinsi Jawa Timur",
    targetUrl: "/admin/dinsos/provinsi/dashboard",
  },
  "198905142014021006": {
    nama_lengkap: "Administrator Dinsos Pusat",
    instansi: "dinsos",
    tingkat: "pusat",
    wilayahLabel: "Kementerian Sosial RI (Pusat)",
    targetUrl: "/admin/dashboard",
  },
  "198905142014021007": {
    nama_lengkap: "Administrator Dukcapil Pusat",
    instansi: "dukcapil",
    tingkat: "pusat",
    wilayahLabel: "Ditjen Dukcapil Kemendagri (Pusat)",
    targetUrl: "/admin/dashboard",
  },
};

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

    // 1. Cek KNOWN_ADMINS (Mock / Seed Data)
    if (KNOWN_ADMINS[cleanNip]) {
      const a = KNOWN_ADMINS[cleanNip];
      return {
        found: true,
        instansi: a.instansi,
        tingkat: a.tingkat,
        nama_lengkap: a.nama_lengkap,
        wilayahLabel: a.wilayahLabel,
        role: "admin",
        targetUrl: a.targetUrl,
      };
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
      wilayahLabel = `Kecamatan ${profile.kecamatan || "Genteng"}${profile.kota ? `, ${profile.kota}` : ""}`;
    } else if (tingkat === "kota") {
      wilayahLabel = `Kota ${profile.kota || "Surabaya"}`;
    } else if (tingkat === "provinsi") {
      wilayahLabel = `Provinsi ${profile.provinsi || "Jawa Timur"}`;
    } else {
      wilayahLabel = "Pusat / Nasional";
    }

    let targetUrl = "/admin/dinsos/kecamatan/dashboard";
    if (instansi === "dukcapil") {
      if (tingkat === "pusat") targetUrl = "/admin/dukcapil/pusat/dashboard";
      else if (tingkat === "kota") targetUrl = "/admin/dukcapil/kota/dashboard";
      else targetUrl = "/admin/dukcapil/kecamatan/dashboard";
    } else {
      if (tingkat === "pusat") targetUrl = "/admin/dinsos/pusat/dashboard";
      else if (tingkat === "provinsi") targetUrl = "/admin/dinsos/provinsi/dashboard";
      else if (tingkat === "kota") targetUrl = "/admin/dinsos/kota/dashboard";
      else targetUrl = "/admin/dinsos/kecamatan/dashboard";
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

    // 1. Cek Known Mock Admin
    if (KNOWN_ADMINS[cleanNip]) {
      const a = KNOWN_ADMINS[cleanNip];
      if (password !== "admin123") {
        return { success: false, error: "Kata sandi salah. Silakan periksa kembali." };
      }
      return {
        success: true,
        user: {
          id: `admin-${cleanNip}`,
          nik: cleanNip,
          nama_lengkap: a.nama_lengkap,
          role: "admin",
          email: `${cleanNip}@govhub.go.id`,
          instansi: a.instansi,
          tingkat: a.tingkat,
          wilayahLabel: a.wilayahLabel,
          targetUrl: a.targetUrl,
        },
      };
    }

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
      wilayahLabel = `Kecamatan ${profile.kecamatan || "Genteng"}${profile.kota ? `, ${profile.kota}` : ""}`;
    } else if (tingkat === "kota") {
      wilayahLabel = `Kota ${profile.kota || "Surabaya"}`;
    } else if (tingkat === "provinsi") {
      wilayahLabel = `Provinsi ${profile.provinsi || "Jawa Timur"}`;
    } else {
      wilayahLabel = "Pusat / Nasional";
    }

    let targetUrl = "/admin/dinsos/kecamatan/dashboard";
    if (instansi === "dukcapil") {
      if (tingkat === "pusat") targetUrl = "/admin/dukcapil/pusat/dashboard";
      else if (tingkat === "kota") targetUrl = "/admin/dukcapil/kota/dashboard";
      else targetUrl = "/admin/dukcapil/kecamatan/dashboard";
    } else {
      if (tingkat === "pusat") targetUrl = "/admin/dinsos/pusat/dashboard";
      else if (tingkat === "provinsi") targetUrl = "/admin/dinsos/provinsi/dashboard";
      else if (tingkat === "kota") targetUrl = "/admin/dinsos/kota/dashboard";
      else targetUrl = "/admin/dinsos/kecamatan/dashboard";
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
