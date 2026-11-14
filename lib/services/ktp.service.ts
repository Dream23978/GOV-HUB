import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseScheduleToIso, sanitizeDocumentUrl } from "@/lib/validators";
import { KtpSubmission } from "@/types/database";

export { parseScheduleToIso, sanitizeDocumentUrl };

export interface CreateKtpSubmissionParams {
  nomorTiket?: string;
  jenisPengajuan?: string;
  scheduleId?: string;
  dokumenKkUrl?: string;
  dokumenAktaUrl?: string;
  suratKehilanganUrl?: string;
  waktuKehadiranBiometrik?: string;
  profileUpdates?: {
    nama_lengkap?: string;
    alamat?: string;
    jenis_kelamin?: string;
  };
}

/**
 * Service untuk membuat pengajuan KTP baru (termasuk atomic slot booking jika memakai scheduleId)
 */
export async function createKtpSubmission(
  params: CreateKtpSubmissionParams
): Promise<{ success: boolean; data?: KtpSubmission; error?: string }> {
  let bookedScheduleId: string | null = null;
  const adminClient = createAdminClient();

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return { success: false, error: "Sesi login tidak valid. Silakan login kembali." };
    }

    let validIsoTime = parseScheduleToIso(params.waktuKehadiranBiometrik);

    // Atomic slot booking when referencing a biometric_schedules row
    if (params.scheduleId) {
      if (!adminClient) {
        return { success: false, error: "Layanan penjadwalan server tidak tersedia." };
      }
      const { data: bookedRows, error: bookErr } = await adminClient.rpc(
        "book_biometric_schedule",
        { p_schedule_id: params.scheduleId }
      );
      if (bookErr || !bookedRows || bookedRows.length === 0) {
        return {
          success: false,
          error: "Jadwal biometrik yang dipilih sudah penuh atau tidak tersedia.",
        };
      }
      bookedScheduleId = params.scheduleId;
      const sched = bookedRows[0];
      if (!validIsoTime && sched?.tanggal && sched?.jam_mulai) {
        validIsoTime = parseScheduleToIso(`${sched.tanggal} ${String(sched.jam_mulai).slice(0, 5)}`);
      }
    }

    const nomorTiket =
      params.nomorTiket && /^KTP-[A-Z0-9-]+$/i.test(params.nomorTiket)
        ? params.nomorTiket.slice(0, 40)
        : `KTP-${Date.now().toString().slice(-8)}`;

    const payload = {
      nomor_tiket: nomorTiket,
      user_id: user.id,
      jenis_pengajuan: String(params.jenisPengajuan || "KTP Baru / Pertama Kali").slice(0, 100),
      dokumen_kk_url: sanitizeDocumentUrl(params.dokumenKkUrl),
      dokumen_akta_url: sanitizeDocumentUrl(params.dokumenAktaUrl),
      surat_kehilangan_url: sanitizeDocumentUrl(params.suratKehilanganUrl),
      schedule_id: bookedScheduleId,
      waktu_kehadiran_biometrik: validIsoTime,
      status: "menunggu_verifikasi" as const,
    };

    const { data, error } = await supabase
      .from("ktp_submissions")
      .insert(payload)
      .select()
      .maybeSingle();

    if (error || !data) {
      if (bookedScheduleId && adminClient) {
        await adminClient.rpc("release_biometric_schedule", { p_schedule_id: bookedScheduleId });
      }
      return {
        success: false,
        error: "Gagal menyimpan pengajuan KTP ke database.",
      };
    }

    // Tandai pengajuan aktif sebelumnya (hanya yang belum selesai/ditolak) sebagai pengajuan ulang
    if (adminClient) {
      await adminClient
        .from("ktp_submissions")
        .update({
          status: "pengajuan_ulang",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .neq("id", data.id)
        .in("status", ["menunggu_verifikasi", "diproses", "menunggu_cetak"]);
    }

    if (params.profileUpdates) {
      const updateData: Record<string, string> = {};
      if (params.profileUpdates.nama_lengkap?.trim()) {
        updateData.nama_lengkap = params.profileUpdates.nama_lengkap.trim().slice(0, 120);
      }
      if (params.profileUpdates.alamat?.trim()) {
        updateData.alamat = params.profileUpdates.alamat.trim().slice(0, 300);
      }
      if (
        params.profileUpdates.jenis_kelamin === "Laki-laki" ||
        params.profileUpdates.jenis_kelamin === "Perempuan"
      ) {
        updateData.jenis_kelamin = params.profileUpdates.jenis_kelamin;
      }
      if (Object.keys(updateData).length > 0) {
        await supabase.from("profiles").update(updateData).eq("id", user.id);
      }
    }

    return { success: true, data };
  } catch {
    if (bookedScheduleId && adminClient) {
      await adminClient.rpc("release_biometric_schedule", { p_schedule_id: bookedScheduleId });
    }
    return { success: false, error: "Terjadi kesalahan internal." };
  }
}

/**
 * Mengambil daftar pengajuan KTP milik user saat ini (menggunakan RLS session warga)
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

    if (error) {
      return { success: false, error: "Gagal mengambil riwayat pengajuan KTP." };
    }

    return { success: true, data: data || [] };
  } catch {
    return { success: false, error: "Terjadi kesalahan internal." };
  }
}
