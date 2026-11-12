"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, MapPin, Camera } from "lucide-react";

interface RingkasanPengajuanDesilCardProps {
  nama?: string;
  nik?: string;
  desilSaatIni?: string;
  alasanPengajuan?: string;
  statusPekerjaan?: string;
  pendapatan?: string;
  anggotaKeluarga?: string;
  housePhoto?: string | null;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function RingkasanPengajuanDesilCard({
  nama = "Hapis Khairullah",
  nik = "*******002",
  desilSaatIni = "Deil 4",
  alasanPengajuan = "Kondisi ekonomi menurun",
  statusPekerjaan = "Tidak Bekerja",
  pendapatan = "Rp.1.000.00",
  anggotaKeluarga = "4 orang",
  housePhoto,
  onBack,
  onSubmit,
  isSubmitting = false,
}: RingkasanPengajuanDesilCardProps) {
  const [isAgreed, setIsAgreed] = useState(false);

  return (
    <div className="flex flex-col w-full space-y-4 animate-in fade-in duration-200">
      {/* 1. Top Navy Banner Bar */}
      <div className="bg-[#1b3a6b] dark:bg-[#152a4d] text-white px-5 py-3 rounded-lg flex items-center justify-between shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-white hover:text-gray-200 text-xs md:text-sm font-semibold transition-colors cursor-pointer"
        >
          Kembali
        </button>
        <span className="text-xs md:text-sm font-semibold text-white tracking-wide">
          Detail warga
        </span>
      </div>

      {/* 2. Step Progress Indicator with 3 Green Checked Badges */}
      <div className="py-2 px-4 flex items-center justify-center">
        <div className="flex items-center w-full max-w-md justify-between relative">
          {/* Connecting Line 1-2 */}
          <div className="absolute top-4 left-[20%] right-[50%] h-[2px] bg-[#16a34a] -z-0" />
          {/* Connecting Line 2-3 */}
          <div className="absolute top-4 left-[50%] right-[20%] h-[2px] bg-[#16a34a] -z-0" />

          {/* Step 1: Data Identitas */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-xs">
              <Check size={16} strokeWidth={3} />
            </div>
            <span className="text-[11px] md:text-xs font-medium text-gray-800 dark:text-gray-200 mt-1.5 text-center">
              Data Identitas
            </span>
          </div>

          {/* Step 2: Kondisi Ekonomi */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-xs">
              <Check size={16} strokeWidth={3} />
            </div>
            <span className="text-[11px] md:text-xs font-medium text-gray-800 dark:text-gray-200 mt-1.5 text-center">
              Kondisi Ekonomi
            </span>
          </div>

          {/* Step 3: Kondisi Rumah */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-xs">
              <Check size={16} strokeWidth={3} />
            </div>
            <span className="text-[11px] md:text-xs font-medium text-gray-800 dark:text-gray-200 mt-1.5 text-center">
              Kondisi Rumah
            </span>
          </div>
        </div>
      </div>

      {/* 3. Card 1: "Pengajuan" */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-300 dark:border-slate-700 p-5 md:p-6 shadow-2xs">
        <h2 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-3">
          Pengajuan
        </h2>
        <div className="space-y-2.5 text-xs md:text-sm">
          <div className="flex justify-between items-start">
            <span className="text-gray-800 dark:text-gray-300">Nama</span>
            <span className="font-semibold text-gray-900 dark:text-white text-right">
              {nama}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-gray-800 dark:text-gray-300">NIK</span>
            <span className="font-semibold text-gray-900 dark:text-white text-right">
              {nik}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-gray-800 dark:text-gray-300">Desil Saat Ini</span>
            <span className="font-semibold text-gray-900 dark:text-white text-right">
              {desilSaatIni}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-gray-800 dark:text-gray-300">Alasan Pengajuan</span>
            <div className="font-semibold text-gray-900 dark:text-white text-right leading-tight max-w-[200px]">
              {alasanPengajuan === "Kondisi ekonomi menurun" ? (
                <>
                  <div>Kondisi ekonomi</div>
                  <div>menurun</div>
                </>
              ) : (
                <div>{alasanPengajuan}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Card 2: "DATA KELUARGA" */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-300 dark:border-slate-700 p-5 md:p-6 shadow-2xs">
        <h2 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-3 tracking-wide">
          DATA KELUARGA
        </h2>
        <div className="space-y-2.5 text-xs md:text-sm">
          <div className="flex justify-between items-start">
            <span className="text-gray-800 dark:text-gray-300">Status pekerjaan</span>
            <span className="font-semibold text-gray-900 dark:text-white text-right">
              {statusPekerjaan}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-gray-800 dark:text-gray-300">Pendapatan</span>
            <span className="font-semibold text-gray-900 dark:text-white text-right">
              {pendapatan}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-gray-800 dark:text-gray-300">Anggota Keluarga</span>
            <span className="font-semibold text-gray-900 dark:text-white text-right">
              {anggotaKeluarga}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Card 3: "KONDISI RUMAH" */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-300 dark:border-slate-700 p-5 md:p-6 shadow-2xs">
        <h2 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-4 tracking-wide">
          KONDISI RUMAH
        </h2>

        {/* House Photo with Floating Pill Badge */}
        <div className="flex justify-center mb-4">
          <div className="relative w-full max-w-[420px] aspect-[16/10] rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900">
            {housePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={housePhoto}
                alt="Kondisi Rumah Terverifikasi"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src="/sample-house.png"
                alt="Kondisi Rumah Terverifikasi"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
                priority
              />
            )}

            {/* Floating Top-Right Pill Badge: [ 📍 Lokasi Terdeteksi ] */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#1e40af] px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-blue-100">
              <MapPin size={13} className="text-[#2563eb]" />
              <span className="text-[11px] md:text-xs font-semibold">Lokasi Terdeteksi</span>
            </div>
          </div>
        </div>

        {/* Two Status Badges: [Foto Live Camera] & [Lokasi] */}
        <div className="grid grid-cols-2 gap-3 max-w-[420px] mx-auto mb-5">
          {/* Badge 1: Foto Live Camera */}
          <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 rounded-lg p-2.5 flex items-center gap-2.5 shadow-2xs">
            <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center flex-shrink-0">
              <Camera size={15} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-gray-900 dark:text-white truncate">
                  Foto Live Camera
                </span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#16a34a] text-white flex items-center justify-center flex-shrink-0 text-[9px] font-black">
                  ✓
                </span>
              </div>
              <span className="text-[10px] text-[#16a34a] font-semibold">
                Terverifikasi
              </span>
            </div>
          </div>

          {/* Badge 2: Lokasi */}
          <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 rounded-lg p-2.5 flex items-center gap-2.5 shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
              <MapPin size={15} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-gray-900 dark:text-white truncate">
                  Lokasi
                </span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#16a34a] text-white flex items-center justify-center flex-shrink-0 text-[9px] font-black">
                  ✓
                </span>
              </div>
              <span className="text-[10px] text-[#16a34a] font-semibold">
                Terverifikasi
              </span>
            </div>
          </div>
        </div>

        {/* Temporary Desil Prediction Text */}
        <div className="mb-4 text-xs md:text-sm font-semibold text-gray-900 dark:text-white">
          Desil Sementara: Desil 2
        </div>

        {/* Agreement Checkbox */}
        <label className="flex items-start gap-2.5 cursor-pointer mb-5 select-none group">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#1b3a6b] focus:ring-[#1b3a6b] cursor-pointer"
          />
          <span className="text-xs text-gray-800 dark:text-gray-300 leading-tight">
            Saya menyatakan bahwa data yang digunakan dalam pengajuan ini benar.
          </span>
        </label>

        {/* Bottom Actions: [ Kembali ] & [ Kirim pengajuan ] */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onBack}
            className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 text-xs font-semibold px-5 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer text-center"
          >
            Kembali
          </button>
          <button
            type="button"
            disabled={!isAgreed || isSubmitting}
            onClick={onSubmit}
            className={`text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-sm transition-all text-center ${
              isAgreed && !isSubmitting
                ? "bg-[#18345c] hover:bg-[#122847] active:scale-95 cursor-pointer"
                : "bg-gray-400 dark:bg-slate-600 cursor-not-allowed opacity-75"
            }`}
          >
            {isSubmitting ? "Mengirim..." : "Kirim pengajuan"}
          </button>
        </div>
      </div>
    </div>
  );
}
