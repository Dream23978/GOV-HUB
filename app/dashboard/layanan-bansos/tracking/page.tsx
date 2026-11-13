import React from "react";
import { TrackingPengajuanContent } from "@/app/components/layanan-bansos/TrackingPengajuanContent";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Tracking Pengajuan Desil | GOV-HUB",
  description: "Pantau status verifikasi dan hasil peninjauan desil bansos Anda secara real-time.",
};

async function getTrackingData() {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .maybeSingle();

    const { data: submissions } = await supabase
      .from("desil_submissions")
      .select("*")
      .eq("user_id", authData.user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const latest = submissions?.[0] || null;

    return {
      user: authData.user,
      profile,
      submission: latest,
    };
  } catch {
    return null;
  }
}

export default async function TrackingPengajuanPage() {
  const result = await getTrackingData();
  const profile = result?.profile;
  const user = result?.user;
  const sub = result?.submission;

  const rawNik = profile?.nik || user?.user_metadata?.nik || "";
  const maskedNik = rawNik
    ? rawNik.length >= 4
      ? `••••••••••••${rawNik.slice(-4)}`
      : "••••••••••••••••"
    : "••••••••••••••••";

  const nama =
    profile?.nama_lengkap ||
    user?.user_metadata?.nama_lengkap ||
    user?.user_metadata?.full_name ||
    "Warga Terdaftar";

  if (!sub) {
    return (
      <TrackingPengajuanContent
        hasSubmissions={false}
        namaPemohon={nama}
        nikPemohon={maskedNik}
        desilAwal={`DESIL ${profile?.desil_saat_ini || 4}`}
        desilBaru={`DESIL ${Math.max(1, (profile?.desil_saat_ini || 4) - 2)}`}
      />
    );
  }

  const tanggalFormatted = sub.created_at
    ? new Date(sub.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Hari Ini";

  let statusText = "Menunggu Verifikasi dari Petugas";
  if (sub.status === "diproses") statusText = "Sedang Diverifikasi & Pengecekan Lapangan";
  if (sub.status === "disetujui") statusText = "Peninjauan Selesai - Disetujui";
  if (sub.status === "ditolak") statusText = "Peninjauan Selesai - Belum Memenuhi Syarat";

  return (
    <TrackingPengajuanContent
      hasSubmissions={true}
      nomorPengajuan={sub.nomor_tiket}
      tanggalPengajuan={tanggalFormatted}
      namaPemohon={nama}
      nikPemohon={maskedNik}
      desilAwal={`DESIL ${sub.desil_lama}`}
      desilBaru={`DESIL ${sub.desil_hasil_peninjauan || sub.desil_diajukan}`}
      statusTerakhir={statusText}
      statusRaw={sub.status}
    />
  );
}

