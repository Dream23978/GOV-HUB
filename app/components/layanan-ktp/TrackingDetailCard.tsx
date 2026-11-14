import React from "react";
import Image from "next/image";

interface TrackingDetailCardProps {
  nama?: string;
  maskedNik?: string;
  nomorPengajuan?: string;
  jenisLayanan?: string;
  tanggalPengajuan?: string;
  lokasiLayanan?: string;
  avatarUrl?: string;
}

export function TrackingDetailCard({
  nama = "Warga Terdaftar",
  maskedNik = "NIK: -",
  nomorPengajuan = "-",
  jenisLayanan = "Pembuatan KTP-el",
  tanggalPengajuan = "-",
  lokasiLayanan = "Kecamatan setempat",
  avatarUrl,
}: TrackingDetailCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-5 md:p-6 mb-4 w-full">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-sm md:text-base font-bold text-gray-900 dark:text-white leading-tight">
          Tracking Pengajuan KTP
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
          Pantau proses pembuatan KTP-el Anda secara transparan.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-slate-700/80 my-3.5" />

      {/* User Profile Snippet */}
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border border-gray-200 dark:border-slate-600 flex-shrink-0 relative">
            <Image
              src={avatarUrl}
              alt={nama}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0 border-2 border-white dark:border-slate-700 select-none">
            {nama
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-bold text-xs md:text-sm text-gray-900 dark:text-white leading-tight">
            {nama}
          </p>
          <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
            {maskedNik}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-slate-700/80 my-3.5" />

      {/* Sub-heading: Informasi Pengajuan */}
      <div>
        <h3 className="text-xs md:text-[13px] font-bold text-gray-900 dark:text-white mb-0.5">
          Informasi Pengajuan
        </h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
          Nomor Pengajuan
        </p>
        <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white tracking-tight mb-3">
          {nomorPengajuan}
        </p>
      </div>

      {/* Key-Value Details List */}
      <div className="flex flex-col gap-2 pt-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">Jenis layanan</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {jenisLayanan}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">Tanggal pengajuan</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {tanggalPengajuan}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">Lokasi layanan</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {lokasiLayanan}
          </span>
        </div>
      </div>
    </div>
  );
}

