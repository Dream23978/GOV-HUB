"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, MapPin, ExternalLink, Check, FileText, CheckCircle2 } from "lucide-react";

export interface DetailPengajuanData {
  nomor?: string;
  nama?: string;
  nik?: string;
  alamat?: string;
  tanggalPengajuan?: string;
  statusText?: string;
  identitasVerified?: boolean;
  keluargaVerified?: boolean;
  ekonomiVerified?: boolean;
  housePhoto?: string;
  alamatLengkapRumah?: string;
  desilAwal?: string;
  desilSementara?: string;
  tanggalUpdateDesil?: string;
}

interface DetailPengajuanDesilViewProps {
  data?: DetailPengajuanData;
  onBack: () => void;
  onApproveSuccess?: () => void;
}

export function DetailPengajuanDesilView({
  data,
  onBack,
  onApproveSuccess,
}: DetailPengajuanDesilViewProps) {
  // Default values sesuai 100% dengan mockup yang diunggah
  const nomor = data?.nomor || "DESIL- 2026-000123";
  const nama = data?.nama || "Hapis Khairullah";
  const nik = data?.nik || "6105438987667002";
  const alamat = data?.alamat || "JL.. Merdeka";
  const tanggalPengajuan = data?.tanggalPengajuan || "23 September 2026";
  const statusText = data?.statusText || "Dalam Proses";
  const housePhoto = data?.housePhoto || "/sample-house.png";
  const alamatLengkapRumah =
    data?.alamatLengkapRumah ||
    "Jl. Reformasi No.15, Bansir Laut, Kec. Pontianak Tenggara, Kota Pontianak, Kalimantan Barat 78113";
  const desilAwal = data?.desilAwal || "Desil 4";
  const desilSementara = data?.desilSementara || "Desil 2";
  const tanggalUpdateDesil = data?.tanggalUpdateDesil || "02 Oktober 2026";

  const [showDataLengkapModal, setShowDataLengkapModal] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleBukaMap = () => {
    const query = encodeURIComponent(
      "Jl. Reformasi No.15, Bansir Laut, Pontianak Tenggara, Kalimantan Barat"
    );
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const handleApprove = () => {
    setIsApproved(true);
    setToastMsg("Peninjauan Desil berhasil disetujui! Status data warga telah diperbarui ke Desil 2.");
    if (onApproveSuccess) {
      onApproveSuccess();
    }
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full pb-10 animate-in fade-in duration-200">
      {/* ── Page Header ── */}
      <div className="flex items-start gap-3 mb-4 select-none">
        <button
          type="button"
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-300 dark:border-slate-600 flex items-center justify-center text-gray-700 dark:text-gray-200 mt-0.5 cursor-pointer shadow-2xs transition-colors"
          aria-label="Kembali"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        <div>
          <h1 className="text-xl md:text-[22px] font-bold text-gray-900 dark:text-white leading-tight">
            Dashboard Desil
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
            Selamat datang, Admin. Berikut ringkasan pengajuan peninjauan desil
          </p>
        </div>
      </div>

      {/* Sub-header section title */}
      <div className="text-sm font-bold text-gray-900 dark:text-white mb-3">
        Ringkasan Pengajuan
      </div>

      {/* ── Main Detail Container Card ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/90 dark:border-slate-700 shadow-xs p-5 md:p-6 space-y-4">
        {/* Top Header of Detail Card */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700/60 pb-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
            <span>Detail Pengajuan Desil</span>
            <span className="font-mono ml-2 text-gray-700 dark:text-gray-300 font-semibold">
              {nomor}
            </span>
          </button>

          {/* Status Badge: [🔵 Dalam Proses] */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isApproved ? "bg-emerald-500" : "bg-[#2563EB]"
              }`}
            />
            <span>{isApproved ? "Disetujui" : statusText}</span>
          </div>
        </div>

        {/* Success Alert if approved */}
        {toastMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* ── Two Column Grid: Data Pemohonan & VERIFIKASI DATA WARGA ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Data Pemohonan */}
          <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800">
            <h3 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white mb-3">
              Data Pemohonan
            </h3>

            <div className="space-y-2 text-xs">
              {/* Nama */}
              <div className="grid grid-cols-12 items-center gap-2">
                <span className="col-span-4 text-gray-700 dark:text-gray-300">Nama</span>
                <div className="col-span-8 bg-[#F5F2EB] dark:bg-slate-700/60 rounded-md px-3 py-1.5 font-medium text-gray-900 dark:text-white truncate">
                  {nama}
                </div>
              </div>

              {/* NIK */}
              <div className="grid grid-cols-12 items-center gap-2">
                <span className="col-span-4 text-gray-700 dark:text-gray-300">NIK</span>
                <div className="col-span-8 bg-[#F5F2EB] dark:bg-slate-700/60 rounded-md px-3 py-1.5 font-medium text-gray-900 dark:text-white truncate font-mono">
                  {nik}
                </div>
              </div>

              {/* Alamat */}
              <div className="grid grid-cols-12 items-center gap-2">
                <span className="col-span-4 text-gray-700 dark:text-gray-300">Alamat</span>
                <div className="col-span-8 bg-[#F5F2EB] dark:bg-slate-700/60 rounded-md px-3 py-1.5 font-medium text-gray-900 dark:text-white truncate">
                  {alamat}
                </div>
              </div>

              {/* Tanggal Pengajuan */}
              <div className="grid grid-cols-12 items-center gap-2">
                <span className="col-span-4 text-gray-700 dark:text-gray-300">
                  Tanggal Pengajuan
                </span>
                <div className="col-span-8 bg-[#F5F2EB] dark:bg-slate-700/60 rounded-md px-3 py-1.5 font-medium text-gray-900 dark:text-white truncate">
                  {tanggalPengajuan}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: VERIFIKASI DATA WARGA */}
          <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white mb-3 tracking-wide">
                VERIFIKASI DATA WARGA
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Identitas
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Terverifikasi
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Data Keluarga
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Terverifikasi
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Kondisi Ekonomi
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Terverifikasi
                  </span>
                </div>
              </div>
            </div>

            {/* Link: Lihat Data Lengkap */}
            <div className="text-right pt-3">
              <button
                type="button"
                onClick={() => setShowDataLengkapModal(true)}
                className="text-xs text-[#2563EB] dark:text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                Lihat Data Lengkap
              </button>
            </div>
          </div>
        </div>

        {/* ── Section: VERIFIKASI KONDISI RUMAH ── */}
        <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 md:p-5 bg-white dark:bg-slate-800">
          <h3 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white mb-3 tracking-wide">
            VERIFIKASI KONDISI RUMAH
          </h3>

          {/* House Photo with Floating Pill Badge */}
          <div className="flex justify-center mb-3">
            <div className="relative w-full max-w-[520px] aspect-[16/10] rounded-2xl overflow-hidden shadow-xs border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900">
              <Image
                src={housePhoto}
                alt="Foto Kondisi Rumah Warga"
                fill
                sizes="(max-width: 768px) 100vw, 520px"
                className="object-cover"
                priority
              />

              {/* Floating Top-Right Pill Badge: [ 📍 Lokasi Terdeteksi ] */}
              <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-xs text-[#1e40af] px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-blue-100">
                <MapPin size={14} className="text-[#2563eb]" />
                <span className="text-xs font-semibold">Lokasi Terdeteksi</span>
              </div>
            </div>
          </div>

          {/* Address Bar with [ Buka di Map ] Button */}
          <div className="max-w-[520px] mx-auto border border-gray-200 dark:border-slate-700 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50 dark:bg-slate-900/30">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={14} className="text-red-600" />
              </div>
              <p className="text-xs text-gray-800 dark:text-gray-200 leading-snug">
                {alamatLengkapRumah}
              </p>
            </div>

            <button
              type="button"
              onClick={handleBukaMap}
              className="bg-[#2563EB] hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs flex-shrink-0"
            >
              <span>Buka di Map</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>

        {/* ── Section: HASIL VERIFIKASI ── */}
        <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 md:p-5 bg-white dark:bg-slate-800">
          <h3 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white mb-2 tracking-wide">
            HASIL VERIFIKASI
          </h3>

          <div className="space-y-1 text-xs md:text-sm">
            <div className="font-bold text-gray-900 dark:text-white">
              Desil Awal: {desilAwal}
            </div>
            <div className="font-bold text-gray-900 dark:text-white">
              Desil semetra ini : {desilSementara} ({tanggalUpdateDesil} Pengajuan)
            </div>
          </div>

          {/* Action Approval Bar */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Kembali ke Daftar
            </button>

            {!isApproved ? (
              <button
                type="button"
                onClick={handleApprove}
                className="bg-[#1b3a6b] hover:bg-[#152e55] active:scale-95 text-white text-xs font-bold px-5 py-2 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Setujui Peninjauan Desil ({desilSementara})</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg text-xs font-bold">
                <Check size={14} />
                <span>Pengajuan Telah Disetujui</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal Pop-up: Data Lengkap Warga ── */}
      {showDataLengkapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-slate-700 p-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  Data Lengkap Terverifikasi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDataLengkapModal(false)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  1. Data Identitas &amp; Keluarga
                </h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
                  <div>Nama: <strong>{nama}</strong></div>
                  <div>NIK: <strong>{nik}</strong></div>
                  <div>Jumlah Anggota: <strong>4 Orang</strong></div>
                  <div>Anak Sekolah: <strong>2 Orang</strong></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  2. Kondisi Ekonomi &amp; Pekerjaan
                </h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
                  <div>Status Pekerjaan: <strong>Tidak Bekerja</strong></div>
                  <div>Pendapatan: <strong>Rp.1.000.00</strong></div>
                  <div>Aset Kendaraan: <strong>1 Unit</strong></div>
                  <div>Orang Tua Ditanggung: <strong>1 Orang</strong></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200">
                <span className="font-semibold block">Catatan Sistem Terintegrasi:</span>
                <span className="text-[11px]">
                  Data kependudukan telah sinkron dengan Dukcapil RI, dan data penghasilan telah lolos uji silang awal DTKS.
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700 text-right">
              <button
                type="button"
                onClick={() => setShowDataLengkapModal(false)}
                className="bg-[#1b3a6b] hover:bg-[#152e55] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
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

