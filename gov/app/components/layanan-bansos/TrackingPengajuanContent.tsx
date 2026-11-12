"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Check,
  Home,
  Info,
  TrendingDown,
  FileCheck2,
  X,
  ExternalLink,
} from "lucide-react";

interface TrackingPengajuanContentProps {
  nomorPengajuan?: string;
  tanggalPengajuan?: string;
  namaPemohon?: string;
  nikPemohon?: string;
  desilAwal?: string;
  desilBaru?: string;
  statusTerakhir?: string;
}

export function TrackingPengajuanContent({
  nomorPengajuan = "REG-DS-2026-08149",
  tanggalPengajuan = "05 November 2026",
  namaPemohon = "Hapis Khairullah",
  nikPemohon = "610*********002",
  desilAwal = "DESIL 4",
  desilBaru = "DESIL 2",
  statusTerakhir = "Peninjauan Selesai",
}: TrackingPengajuanContentProps) {
  const router = useRouter();
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 7 Tahapan Sesuai Mockup 100%
  const steps = [
    { id: 1, label: "Pengajuan di buat" },
    { id: 2, label: "Data Otomatis diverifikasi" },
    { id: 3, label: "Menunggu verifikasi dari admin" },
    { id: 4, label: "Hasil sementara" },
    { id: 5, label: "Pengechekkan tempat" },
    { id: 6, label: "Verifikasi dinsos" },
    { id: 7, label: "Hasil peninjauan" },
  ];

  return (
    <div className="flex flex-col w-full pb-10 animate-in fade-in duration-200">
      {/* 1. Header with Circular Navy Back Button */}
      <div className="flex items-center gap-3.5 mb-5 select-none">
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

      <div className="space-y-5">
        {/* ================= CARD 1: Status Proses Pengajuan (Vertical Stepper) ================= */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700 shadow-xs p-5 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-6">
            Status Proses Pengajuan
          </h2>

          {/* Stepper Timeline */}
          <div className="relative pl-2 md:pl-4 space-y-4">
            {/* Continuous Vertical Green Line */}
            <div className="absolute left-[17px] md:left-[25px] top-3 bottom-6 w-[2.5px] bg-[#22c55e] -z-0" />

            {steps.map((s) => (
              <div key={s.id} className="relative flex items-center gap-4 z-10 group">
                {/* Green Status Node */}
                <div className="w-5 h-5 rounded-full bg-[#16a34a] ring-4 ring-emerald-100 dark:ring-emerald-950/60 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Step Box */}
                <div className="flex-1 bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2.5 shadow-2xs hover:border-emerald-300 transition-colors">
                  <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CARD 2: Tracking Pengajuan Result Summary ================= */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700 shadow-xs p-5 md:p-6">
          {/* Status Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-sm flex-shrink-0">
              <Check size={22} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                Tracking Pengajuan
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                {statusTerakhir}
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
                  Perubahan Desil
                </span>
                <span className="text-xs md:text-sm font-bold text-gray-900 dark:text-white truncate">
                  {desilAwal} → {desilBaru}
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
                  Pengajuan disetujui
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
                  Data telah diperbarui
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
                  Nomor: {nomorPengajuan}
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
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span className="font-semibold">Status Pengajuan</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#16a34a] text-white font-bold text-[10px]">
                  Disetujui
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                <div>
                  <span className="text-gray-500 block">Nama Pemohon</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {namaPemohon}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">NIK</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {nikPemohon}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Tanggal Pengajuan</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {tanggalPengajuan}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Petugas Verifikator</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Dinas Sosial Pontianak
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-gray-900 dark:text-white">
                  Catatan Verifikasi Lapangan:
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Berdasarkan verifikasi data kependudukan, kondisi ekonomi keluarga berpenghasilan tidak tetap, serta verifikasi foto geotagging kondisi rumah, kondisi pemohon memenuhi kriteria klasifikasi kemiskinan Desil 2. Data telah terintegrasi ke dalam pangkalan data DTKS &amp; BPS.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-900 dark:text-blue-200 block">
                    Penetapan Desil Baru
                  </span>
                  <span className="text-[11px] text-blue-700 dark:text-blue-300">
                    Berlaku mulai November 2026
                  </span>
                </div>
                <span className="text-lg font-black text-[#0B57D0] dark:text-blue-400">
                  DESIL 2
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

