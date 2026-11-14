"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Check,
  Clock,
  Home,
  Info,
  TrendingDown,
  FileCheck2,
  X,
  XCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import type { DesilSubmissionStatus } from "@/types/database";

interface TrackingPengajuanContentProps {
  hasSubmissions?: boolean;
  submissionId?: string;
  nomorPengajuan?: string;
  tanggalPengajuan?: string;
  namaPemohon?: string;
  nikPemohon?: string;
  desilAwal?: string;
  desilBaru?: string;
  statusTerakhir?: string;
  statusRaw?: DesilSubmissionStatus;
  catatanVerifikasi?: string;
  housePhoto?: string;
}

const TRACKING_STEPS = [
  { id: 1, label: "Pengajuan di buat" },
  { id: 2, label: "Data Otomatis diverifikasi" },
  { id: 3, label: "Menunggu verifikasi dari admin" },
  { id: 4, label: "Hasil sementara" },
  { id: 5, label: "Pengecekan tempat" },
  { id: 6, label: "Verifikasi dinsos" },
  { id: 7, label: "Hasil peninjauan" },
];

type StepState = "completed" | "active" | "pending" | "rejected";

function getStepState(stepId: number, statusRaw: DesilSubmissionStatus): StepState {
  if (statusRaw === "disetujui") {
    return "completed";
  }
  if (statusRaw === "ditolak") {
    return stepId === 7 ? "rejected" : "completed";
  }
  if (statusRaw === "diproses") {
    if (stepId <= 4) return "completed";
    if (stepId === 5) return "active";
    return "pending";
  }
  // menunggu_verifikasi: setelah upload foto, berhenti menunggu verifikasi admin di langkah ke-3
  if (stepId <= 2) return "completed";
  if (stepId === 3) return "active";
  return "pending";
}

function getStatusLabel(status: DesilSubmissionStatus): string {
  if (status === "diproses") return "Sedang Diverifikasi & Pengecekan Lapangan";
  if (status === "disetujui") return "Peninjauan Selesai - Disetujui";
  if (status === "ditolak") return "Peninjauan Selesai - Belum Memenuhi Syarat";
  return "Menunggu Verifikasi dari Admin";
}

export function TrackingPengajuanContent({
  hasSubmissions: initialHasSubmissions,
  submissionId: initialSubmissionId,
  nomorPengajuan: initialNomor = "-",
  tanggalPengajuan: initialTanggal = "-",
  namaPemohon: initialNama = "Warga Terdaftar",
  nikPemohon: initialNik = "-",
  desilAwal: initialDesilAwal = "-",
  desilBaru: initialDesilBaru = "-",
  statusTerakhir: initialStatus = "Menunggu Verifikasi dari Admin",
  statusRaw: initialStatusRaw = "menunggu_verifikasi",
  catatanVerifikasi: initialCatatan = "",
  housePhoto: initialHousePhoto = "",
}: TrackingPengajuanContentProps) {
  const router = useRouter();
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [data, setData] = useState({
    hasSubmissions: initialHasSubmissions ?? initialNomor !== "-",
    submissionId: initialSubmissionId || "",
    nomorPengajuan: initialNomor,
    tanggalPengajuan: initialTanggal,
    namaPemohon: initialNama,
    nikPemohon: initialNik,
    desilAwal: initialDesilAwal,
    desilBaru: initialDesilBaru,
    statusTerakhir: initialStatus,
    statusRaw: initialStatusRaw,
    catatanVerifikasi: initialCatatan,
    housePhoto: initialHousePhoto,
  });

  // Sinkronkan state ketika props SSR berubah
  useEffect(() => {
    setData({
      hasSubmissions: initialHasSubmissions ?? initialNomor !== "-",
      submissionId: initialSubmissionId || "",
      nomorPengajuan: initialNomor,
      tanggalPengajuan: initialTanggal,
      namaPemohon: initialNama,
      nikPemohon: initialNik,
      desilAwal: initialDesilAwal,
      desilBaru: initialDesilBaru,
      statusTerakhir: initialStatus,
      statusRaw: initialStatusRaw,
      catatanVerifikasi: initialCatatan,
      housePhoto: initialHousePhoto,
    });
  }, [
    initialHasSubmissions,
    initialSubmissionId,
    initialNomor,
    initialTanggal,
    initialNama,
    initialNik,
    initialDesilAwal,
    initialDesilBaru,
    initialStatus,
    initialStatusRaw,
    initialCatatan,
    initialHousePhoto,
  ]);

  // Bersihkan cache lama agar tidak menimpa status riil dari Supabase
  useEffect(() => {
    try {
      localStorage.removeItem("govhub_last_desil_submission");
    } catch {
      // ignore
    }
  }, []);

  // Polling real-time dari Supabase API agar perubahan admin langsung terlihat
  const syncLatestSubmission = useCallback(async () => {
    try {
      const res = await fetch("/api/bansos/submissions", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) return;
      const json = await res.json();
      if (!json?.success || !Array.isArray(json.data) || json.data.length === 0) return;

      const latest = json.data[0];
      const nextStatus: DesilSubmissionStatus = latest.status || "menunggu_verifikasi";
      const nextTarget = latest.desil_hasil_peninjauan ?? latest.desil_diajukan;
      const nextTanggal = latest.created_at
        ? new Date(latest.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "-";

      setData((prev) => {
        const nextDesilAwal = latest.desil_lama ? `DESIL ${latest.desil_lama}` : prev.desilAwal;
        const nextDesilBaru = nextTarget ? `DESIL ${nextTarget}` : prev.desilBaru;
        const nextNomor = latest.nomor_tiket || prev.nomorPengajuan;
        const nextCatatan = latest.catatan_verifikasi || "";
        const nextPhoto = latest.foto_rumah_depan_url || prev.housePhoto;

        const changed =
          !prev.hasSubmissions ||
          prev.statusRaw !== nextStatus ||
          prev.desilBaru !== nextDesilBaru ||
          prev.nomorPengajuan !== nextNomor ||
          prev.catatanVerifikasi !== nextCatatan;

        if (!changed) return prev;

        router.refresh();
        return {
          ...prev,
          hasSubmissions: true,
          submissionId: latest.id || prev.submissionId,
          nomorPengajuan: nextNomor,
          tanggalPengajuan: nextTanggal,
          desilAwal: nextDesilAwal,
          desilBaru: nextDesilBaru,
          statusTerakhir: getStatusLabel(nextStatus),
          statusRaw: nextStatus,
          catatanVerifikasi: nextCatatan,
          housePhoto: nextPhoto,
        };
      });
    } catch {
      // Abaikan gangguan jaringan sementara
    }
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") {
        void syncLatestSubmission();
      }
    }, 5000);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void syncLatestSubmission();
      }
    };

    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [syncLatestSubmission]);

  const statusBadgeBg =
    data.statusRaw === "disetujui"
      ? "bg-[#16a34a]"
      : data.statusRaw === "ditolak"
      ? "bg-red-600"
      : data.statusRaw === "diproses"
      ? "bg-[#0B57D0]"
      : "bg-amber-500";

  return (
    <div className="flex flex-col w-full pb-10 animate-in fade-in duration-200">
      {/* 1. Header with Circular Navy Back Button */}
      <div className="flex items-center justify-between gap-3.5 mb-5 select-none">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-[#1b2b54] hover:bg-[#142040] flex items-center justify-center transition-all duration-200 shadow-sm flex-shrink-0 group cursor-pointer"
            aria-label="Kembali"
          >
            <ChevronLeft
              size={22}
              className="text-white ml-[-1px] group-hover:-translate-x-0.5 transition-transform"
              strokeWidth={2.4}
            />
          </button>

          <div>
            <h1 className="text-xl md:text-[22px] font-bold text-gray-900 dark:text-white leading-tight">
              Tracking Pengajuan
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void syncLatestSubmission()}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-blue-400 transition-colors cursor-pointer shadow-2xs"
          title="Perbarui status pengajuan"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <RefreshCw size={12} />
          <span className="hidden sm:inline">Sinkron Otomatis</span>
        </button>
      </div>

      {!data.hasSubmissions ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-slate-700 text-[#0B57D0] dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <Info size={28} />
          </div>
          <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-2">
            Belum Ada Pengajuan Peninjauan Desil
          </h2>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
            Anda belum memiliki pengajuan peninjauan desil bansos yang sedang berjalan. Ajukan peninjauan desil baru untuk memperbarui data DTKS keluarga Anda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
            <Link
              href="/dashboard/layanan-bansos/ajukan"
              className="w-full bg-[#0B57D0] hover:bg-blue-700 text-white font-semibold text-xs md:text-sm py-2.5 px-5 rounded-xl shadow-xs transition-all text-center select-none"
            >
              Ajukan Peninjauan Sekarang
            </Link>
            <Link
              href="/dashboard/layanan-bansos"
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-semibold text-xs md:text-sm py-2.5 px-5 rounded-xl transition-colors text-center select-none"
            >
              Kembali ke Layanan
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* ================= CARD 1: Status Proses Pengajuan (Vertical Stepper) ================= */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700 shadow-xs p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                Status Proses Pengajuan
              </h2>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                {data.nomorPengajuan}
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="relative pl-1 md:pl-3 space-y-4">
              {TRACKING_STEPS.map((s, idx) => {
                const stepState = getStepState(s.id, data.statusRaw);
                const isLast = idx === TRACKING_STEPS.length - 1;

                const lineColor =
                  stepState === "completed"
                    ? "bg-[#22c55e]"
                    : "bg-gray-200 dark:bg-slate-700";

                const dotClass =
                  stepState === "completed"
                    ? "bg-[#16a34a] ring-4 ring-emerald-100 dark:ring-emerald-950/60"
                    : stepState === "active"
                    ? "bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-950/60 animate-pulse"
                    : stepState === "rejected"
                    ? "bg-red-600 ring-4 ring-red-100 dark:ring-red-950/60"
                    : "bg-gray-200 dark:bg-slate-700 ring-4 ring-gray-50 dark:ring-slate-800/80";

                const boxClass =
                  stepState === "completed"
                    ? "bg-white dark:bg-slate-900/60 border-emerald-200/80 dark:border-emerald-900/50"
                    : stepState === "active"
                    ? "bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60"
                    : stepState === "rejected"
                    ? "bg-red-50/70 dark:bg-red-950/20 border-red-300 dark:border-red-800/60"
                    : "bg-gray-50/60 dark:bg-slate-900/30 border-gray-200/70 dark:border-slate-700/60";

                const labelClass =
                  stepState === "pending"
                    ? "text-gray-400 dark:text-slate-500"
                    : stepState === "active"
                    ? "text-amber-900 dark:text-amber-200 font-semibold"
                    : stepState === "rejected"
                    ? "text-red-700 dark:text-red-300 font-semibold"
                    : "text-gray-800 dark:text-gray-200 font-medium";

                return (
                  <div key={s.id} className="relative flex items-center gap-4">
                    {!isLast && (
                      <div
                        className={`absolute left-[9px] top-6 bottom-[-18px] w-[2.5px] ${lineColor}`}
                      />
                    )}

                    {/* Status Dot */}
                    <div
                      className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs ${dotClass}`}
                    >
                      {stepState === "completed" ? (
                        <Check size={12} strokeWidth={3} className="text-white" />
                      ) : stepState === "rejected" ? (
                        <X size={12} strokeWidth={3} className="text-white" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>

                    {/* Step Box */}
                    <div
                      className={`flex-1 border rounded-lg px-4 py-2.5 shadow-2xs transition-colors flex items-center justify-between gap-2 ${boxClass}`}
                    >
                      <span className={`text-xs md:text-sm ${labelClass}`}>{s.label}</span>
                      {stepState === "active" && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white whitespace-nowrap">
                          {data.statusRaw === "diproses" ? "Sedang Dicek" : "Tahap Saat Ini"}
                        </span>
                      )}
                      {stepState === "rejected" && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-600 text-white whitespace-nowrap">
                          Ditolak
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= CARD 2: Tracking Pengajuan Result Summary ================= */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700 shadow-xs p-5 md:p-6">
            {/* Status Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <div
                className={`w-10 h-10 md:w-11 md:h-11 rounded-full ${statusBadgeBg} text-white flex items-center justify-center shadow-sm flex-shrink-0`}
              >
                {data.statusRaw === "disetujui" ? (
                  <Check size={22} strokeWidth={3} />
                ) : data.statusRaw === "ditolak" ? (
                  <XCircle size={22} strokeWidth={2.5} />
                ) : (
                  <Clock size={21} strokeWidth={2.4} />
                )}
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  Tracking Pengajuan
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                  {data.statusTerakhir}
                </p>
              </div>
            </div>

            {/* 3 Status Info Columns with Thin Inner Divider */}
            <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-3 md:p-4 mb-5 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-slate-700 bg-gray-50/50 dark:bg-slate-900/30">
              {/* Kolom 1: Perubahan Desil */}
              <div className="flex items-center gap-3 md:px-3 pt-2 md:pt-0 first:pt-0">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0B57D0] flex items-center justify-center flex-shrink-0 border border-blue-200/60 dark:border-blue-900/50">
                  <TrendingDown size={20} strokeWidth={2.2} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {data.statusRaw === "disetujui" ? "Perubahan Desil" : "Usulan Perubahan Desil"}
                  </span>
                  <span className="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate">
                    {data.desilAwal} → {data.desilBaru}
                  </span>
                </div>
              </div>

              {/* Kolom 2: Keputusan Pengajuan */}
              <div className="flex items-center gap-3 md:px-4 pt-3 md:pt-0">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0B57D0] flex items-center justify-center flex-shrink-0 border border-blue-200/60 dark:border-blue-900/50">
                  <FileCheck2 size={20} strokeWidth={2.2} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Keputusan Pengajuan
                  </span>
                  <span className="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate">
                    {data.statusRaw === "disetujui"
                      ? "Pengajuan disetujui"
                      : data.statusRaw === "ditolak"
                      ? "Pengajuan ditolak"
                      : data.statusRaw === "diproses"
                      ? "Sedang ditinjau petugas"
                      : "Menunggu verifikasi admin"}
                  </span>
                </div>
              </div>

              {/* Kolom 3: Status Pembaruan Data */}
              <div className="flex items-center gap-3 md:px-4 pt-3 md:pt-0">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0B57D0] flex items-center justify-center flex-shrink-0 border border-blue-200/60 dark:border-blue-900/50">
                  <Info size={20} strokeWidth={2.2} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Status Pembaruan Data
                  </span>
                  <span className="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate">
                    {data.statusRaw === "disetujui"
                      ? "Data telah diperbarui"
                      : data.statusRaw === "ditolak"
                      ? "Tidak ada perubahan data"
                      : data.statusRaw === "diproses"
                      ? "Dalam pengecekan lapangan"
                      : "Menunggu pengecekan admin"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: [Lihat Detail] & [Kembali ke Beranda] */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowDetailModal(true)}
                className="w-full bg-[#0B57D0] hover:bg-blue-700 active:scale-98 text-white font-semibold text-xs md:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Info size={16} />
                <span>Lihat Detail</span>
              </button>

              <Link
                href="/dashboard"
                className="w-full bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-800 dark:text-gray-200 font-semibold text-xs md:text-sm py-2.5 px-4 rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 text-center select-none"
              >
                <Home size={16} className="text-gray-600 dark:text-gray-300" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: Rincian Keputusan Peninjauan Desil ================= */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-slate-700 p-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Rincian Keputusan Peninjauan Desil
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Nomor: {data.nomorPengajuan}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Status Pengajuan</span>
                <span className={`px-2.5 py-0.5 rounded-full ${statusBadgeBg} text-white font-bold text-[10px]`}>
                  {data.statusRaw === "disetujui"
                    ? "Disetujui"
                    : data.statusRaw === "ditolak"
                    ? "Ditolak"
                    : data.statusRaw === "diproses"
                    ? "Sedang Dicek"
                    : "Menunggu Verifikasi Admin"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                <div>
                  <span className="text-gray-500 block">Nama Pemohon</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {data.namaPemohon}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">NIK</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {data.nikPemohon}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Tanggal Pengajuan</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {data.tanggalPengajuan}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Instansi Verifikator</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Dinas Sosial / Kemensos
                  </span>
                </div>
              </div>

              {data.housePhoto && (
                <div className="space-y-1.5">
                  <span className="font-bold text-gray-900 dark:text-white block">
                    Foto Kondisi Rumah Terunggah:
                  </span>
                  <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.housePhoto}
                      alt="Foto Kondisi Rumah Anda"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-gray-900 dark:text-white">
                  Catatan Verifikasi / Pengajuan:
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {data.catatanVerifikasi ||
                    "Pengajuan beserta foto kondisi rumah telah diterima sistem dan sedang menunggu pengecekan dari admin Dinas Sosial."}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-900 dark:text-blue-200 block">
                    {data.statusRaw === "disetujui" ? "Penetapan Desil Baru" : "Usulan Desil Tujuan"}
                  </span>
                  <span className="text-[11px] text-blue-700 dark:text-blue-300">
                    {data.statusRaw === "disetujui"
                      ? "Berlaku sejak disetujui"
                      : "Menunggu verifikasi & persetujuan admin"}
                  </span>
                </div>
                <span className="text-lg font-black text-[#0B57D0] dark:text-blue-400">
                  {data.desilBaru}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-5 pt-3 border-t border-gray-200 dark:border-slate-700">
              <Link
                href="/dashboard/layanan-bansos"
                className="text-xs text-[#0B57D0] hover:underline flex items-center gap-1 font-semibold"
              >
                Lihat di Layanan Bansos <ExternalLink size={13} />
              </Link>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="bg-[#0B57D0] hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
