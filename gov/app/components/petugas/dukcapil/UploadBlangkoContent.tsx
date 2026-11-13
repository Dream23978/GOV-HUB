"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Upload,
  CheckCircle2,
  X,
  FileCheck2,
  Layers,
  Building,
} from "lucide-react";

export function UploadBlangkoContent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Statistik: "Dalam Pengiriman" TELAH DIHAPUS sesuai permintaan user
  // Menyisakan 2 metrik utama: Total Ketersediaan & Blangko Terdistribusi
  const stats = [
    {
      label: "Total Ketersediaan Blangko Kota",
      value: "14.250",
      unit: "keping",
      badge: "Status: Aman & Mencukupi",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      label: "Blangko Terdistribusi",
      value: "3.140",
      unit: "keping",
      badge: "6 Kecamatan Terlayani",
      badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
    },
  ];

  const alokasiKecamatan = [
    { nama: "Kecamatan Pontianak Kota", kuota: 1200, terpakai: 840, sisa: 360 },
    { nama: "Kecamatan Pontianak Barat", kuota: 1000, terpakai: 620, sisa: 380 },
    { nama: "Kecamatan Pontianak Selatan", kuota: 900, terpakai: 510, sisa: 390 },
    { nama: "Kecamatan Pontianak Tenggara", kuota: 700, terpakai: 430, sisa: 270 },
    { nama: "Kecamatan Pontianak Timur", kuota: 600, terpakai: 390, sisa: 210 },
    { nama: "Kecamatan Pontianak Utara", kuota: 600, terpakai: 350, sisa: 250 },
  ];

  const handleFileProcess = (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setSuccessToast(`Berkas "${file.name}" berhasil diunggah ke sistem database blangko!`);
          setTimeout(() => setSuccessToast(null), 4000);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col w-full pb-10 select-none">
      {/* ── Page Header (100% Sesuai Screenshot): "Blangko KTP" ── */}
      <div className="flex items-start gap-2 sm:gap-3 mb-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1 -ml-1 text-gray-800 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer mt-0.5"
          aria-label="Kembali"
        >
          <ChevronLeft size={28} strokeWidth={2.2} />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Blangko KTP
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Selamat datang, Petugas. di Konfirmasi Pembuatan KTP
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Statistik (Hanya 2 metrik, "Dalam Pengiriman" TELAH DIHAPUS) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-xl border border-gray-300 p-4 shadow-2xs"
          >
            <span className="text-xs text-gray-600 block">{item.label}</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] mt-1 block">
              {item.value} <span className="text-xs font-medium text-gray-500">{item.unit}</span>
            </span>
            <span
              className={`text-[11px] font-semibold mt-1 inline-block px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}
            >
              {item.badge}
            </span>
          </div>
        ))}
      </div>

      {/* ── Gray Upload Card (100% Mirip Screenshot Mockup) ── */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`w-full rounded-2xl bg-[#969BA3] hover:bg-[#8D929A] transition-all cursor-pointer p-8 sm:p-12 md:p-14 flex flex-col items-center justify-center min-h-[220px] sm:min-h-[260px] shadow-sm select-none border-2 ${
          isDragOver ? "border-blue-400 bg-[#888E96] scale-[1.01]" : "border-transparent"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.xlsx,.xls,.csv,.zip"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Blue Rounded Square with Upload Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0091FF] flex items-center justify-center text-white shadow-md mb-3 sm:mb-4 hover:scale-105 transition-transform">
          <Upload size={34} strokeWidth={2.4} />
        </div>

        {/* Text "Upload Data Blangko" */}
        <span className="text-white text-sm sm:text-base font-bold tracking-wide">
          Upload Data Blangko
        </span>
        <span className="text-white/80 text-xs mt-1">
          Klik atau seret file PDF / Excel Blangko
        </span>

        {/* Uploading progress bar */}
        {isUploading && (
          <div className="w-full max-w-xs mt-4">
            <div className="flex justify-between text-xs text-white mb-1">
              <span>Mengunggah...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-2 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Uploaded File Pill */}
        {uploadedFile && !isUploading && (
          <div className="mt-4 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/40 text-white text-xs font-medium flex items-center gap-2">
            <FileCheck2 size={14} />
            <span>{uploadedFile.name} (Tersimpan)</span>
          </div>
        )}
      </div>

      {/* ── Tabel Distribusi Kuota Blangko Kecamatan (Tetap responsif dan informatif) ── */}
      <div className="mt-6 bg-white rounded-xl border border-gray-300 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building size={16} className="text-blue-600" />
            <h3 className="font-bold text-sm sm:text-base text-gray-900">
              Distribusi Kuota Blangko ke Kecamatan
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Pemutakhiran otomatis
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-[#2563EB] text-white text-xs sm:text-sm font-bold">
                <th className="py-2.5 px-4">Nama Kecamatan</th>
                <th className="py-2.5 px-4 text-center">Total Kuota Diberikan</th>
                <th className="py-2.5 px-4 text-center">Telah Terpakai (Cetak)</th>
                <th className="py-2.5 px-4 text-center">Sisa Blangko</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
              {alokasiKecamatan.map((row) => (
                <tr key={row.nama} className="hover:bg-gray-50/70">
                  <td className="py-3 px-4 font-semibold text-gray-900 flex items-center gap-1.5">
                    <Layers size={14} className="text-gray-400" />
                    <span>{row.nama}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-gray-800">
                    {row.kuota.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700">
                    {row.terpakai.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-blue-700 font-mono">
                    {row.sisa.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 size={12} /> Siap
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
