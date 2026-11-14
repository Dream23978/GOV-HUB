import React from "react";
import Link from "next/link";
import { ArrowRight, CreditCard, FileText, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCitizenDesilTrackingData } from "@/lib/services/bansos.service";
import { TrackingKtpCard, TrackingData } from "@/app/components/layanan-ktp/TrackingKtpCard";
import { formatWibDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengajuan Saya | GOV-HUB",
  description: "Pantau seluruh status pengajuan KTP & Dukcapil serta Peninjauan Desil Bansos Anda.",
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function mapKtpTracking(submission: Record<string, string | null> | null): {
  active: TrackingData | null;
  expired: boolean;
} {
  if (!submission) return { active: null, expired: false };

  const completedTs =
    submission.completed_at || submission.updated_at || submission.created_at;
  const completedMs = completedTs ? Date.parse(completedTs) : NaN;
  const isExpired =
    submission.status === "selesai" &&
    !Number.isNaN(completedMs) &&
    Date.now() - completedMs >= SEVEN_DAYS_MS;

  if (isExpired) {
    return { active: null, expired: true };
  }

  let statusText = "Verifikasi Data";
  let statusBadge = "Proses";
  if (submission.status === "selesai") {
    statusText = "KTP Selesai";
    statusBadge = "Selesai";
  } else if (submission.status === "menunggu_cetak") {
    statusText = "Menunggu Cetak";
    statusBadge = "Terkonfirmasi";
  } else if (submission.status === "diproses") {
    statusText = "Perekaman Biometrik";
    statusBadge = "Terkonfirmasi";
  } else if (submission.status === "ditolak") {
    statusText = "Pengajuan Ditolak";
    statusBadge = "Ditolak";
  }

  const tanggalRaw = submission.waktu_kehadiran_biometrik || submission.created_at;

  return {
    expired: false,
    active: {
      nomorPengajuan: submission.nomor_tiket || "-",
      statusSaatIni: statusText,
      tanggalPengajuan: formatWibDate(tanggalRaw, "short"),
      statusBadge,
      statusRaw: submission.status || "menunggu_verifikasi",
      jenisLayanan: submission.jenis_pengajuan || "Pembuatan KTP-el",
      catatanPetugas: submission.catatan_petugas || null,
    },
  };
}

export default async function PengajuanSayaPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const db = createAdminClient() || supabase;

  const [desilTracking, ktpQuery] = await Promise.all([
    getCitizenDesilTrackingData(),
    authData?.user
      ? db
          .from("ktp_submissions")
          .select("*")
          .eq("user_id", authData.user.id)
          .neq("status", "pengajuan_ulang")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const ktpState = mapKtpTracking(
    (ktpQuery?.data as Record<string, string | null> | null) || null
  );

  const desilBadgeClass =
    desilTracking.statusRaw === "disetujui"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
      : desilTracking.statusRaw === "ditolak"
      ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
      : desilTracking.statusRaw === "diproses"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
      : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300";

  return (
    <div className="flex flex-col w-full max-w-2xl pb-10 gap-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0B57D0] text-white flex items-center justify-center shadow-sm flex-shrink-0">
          <FileText size={20} />
        </div>
        <div>
          <h1 className="text-xl md:text-[22px] font-bold text-gray-900 dark:text-white leading-tight">
            Pengajuan Saya
          </h1>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
            Pantau seluruh permohonan KTP & Dukcapil serta Peninjauan Desil Bansos Anda secara real-time.
          </p>
        </div>
      </div>

      {/* Section 1: KTP & Dukcapil */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <CreditCard size={16} className="text-[#2563EB]" />
            <span>Layanan KTP & Dukcapil</span>
          </h2>
          {ktpState.active && (
            <Link
              href="/dashboard/layanan-ktp/tracking?detail=1"
              className="text-xs font-semibold text-[#0B57D0] dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Lihat Detail <ArrowRight size={13} />
            </Link>
          )}
        </div>

        {ktpState.active ? (
          <Link href="/dashboard/layanan-ktp/tracking?detail=1" className="block">
            <TrackingKtpCard data={ktpState.active} />
          </Link>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {ktpState.expired ? "Tidak Ada Pengajuan KTP Aktif" : "Belum Ada Pengajuan KTP"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {ktpState.expired
                  ? "Pengajuan KTP Anda sebelumnya telah selesai lebih dari 7 hari lalu."
                  : "Anda belum mengajukan pembuatan atau pembaruan KTP-el."}
              </p>
            </div>
            <Link
              href="/dashboard/layanan-ktp/ajukan"
              className="inline-flex items-center justify-center gap-1.5 bg-[#0B57D0] hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex-shrink-0"
            >
              Ajukan KTP <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>

      {/* Section 2: Peninjauan Desil & Bansos */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Users size={16} className="text-[#16A34A]" />
            <span>Layanan Bansos & Peninjauan Desil</span>
          </h2>
          {desilTracking.hasSubmissions && (
            <Link
              href="/dashboard/layanan-bansos/tracking"
              className="text-xs font-semibold text-[#0B57D0] dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Lihat Tracking Lengkap <ArrowRight size={13} />
            </Link>
          )}
        </div>

        {desilTracking.hasSubmissions ? (
          <Link
            href="/dashboard/layanan-bansos/tracking"
            className="block bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-5 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-slate-700">
              <div>
                <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 block">
                  {desilTracking.nomorPengajuan}
                </span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                  {desilTracking.statusTerakhir}
                </h3>
              </div>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${desilBadgeClass}`}>
                {desilTracking.statusRaw === "disetujui"
                  ? "Disetujui"
                  : desilTracking.statusRaw === "ditolak"
                  ? "Ditolak"
                  : desilTracking.statusRaw === "diproses"
                  ? "Diproses"
                  : "Menunggu Verifikasi"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 text-xs">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-[11px]">Desil Awal</span>
                <span className="font-bold text-gray-900 dark:text-white">{desilTracking.desilAwal}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-[11px]">Usulan / Hasil</span>
                <span className="font-bold text-[#0B57D0] dark:text-blue-400">{desilTracking.desilBaru}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block text-[11px]">Tanggal</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{desilTracking.tanggalPengajuan}</span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Belum Ada Peninjauan Desil
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Ajukan pembaruan kategori desil bila kondisi ekonomi keluarga mengalami perubahan.
              </p>
            </div>
            <Link
              href="/dashboard/layanan-bansos/ajukan"
              className="inline-flex items-center justify-center gap-1.5 bg-[#16A34A] hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex-shrink-0"
            >
              Ajukan Peninjauan <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
