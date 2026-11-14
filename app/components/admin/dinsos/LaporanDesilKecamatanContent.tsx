"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Upload,
  CheckCircle2,
  X,
  FileCheck2,
  FileText,
  Clock,
  Trash2,
} from "lucide-react";

interface UploadedReportItem {
  id: string;
  name: string;
  size: string;
  date: string;
  status: "Terkirim" | "Diproses" | "Terverifikasi";
}

interface LaporanDesilKecamatanContentProps {
  tingkat?: string;
}

export function LaporanDesilKecamatanContent({
  tingkat = "Khusus Kecamatan",
}: LaporanDesilKecamatanContentProps = {}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const [historyReports, setHistoryReports] = useState<UploadedReportItem[]>([]);

  const handleFileProcess = (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const newReport: UploadedReportItem = {
            id: `lap-${Date.now()}`,
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            date: "Hari ini, Baru saja",
            status: "Terkirim",
          };
          setHistoryReports((prevHist) => [newReport, ...prevHist]);
          setSuccessToast(`Berkas "${file.name}" berhasil diunggah! Data hasil cek lapangan siap ditinjau.`);
          setTimeout(() => setSuccessToast(null), 5000);
          return 100;
        }
        return prev + 25;
      });
    }, 140);
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

  const handleDeleteHistory = (id: string) => {
    setHistoryReports((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col w-full pb-10 select-none">
      {/* ── Page Header: "< Laporan Desil / Silahkan upload data hasil cek lapangan" ── */}
      <div className="flex items-start gap-2.5 sm:gap-3 mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1 -ml-1 text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-slate-700/60 rounded-xl transition-colors cursor-pointer mt-0.5"
          aria-label="Kembali"
        >
          <ChevronLeft size={28} strokeWidth={2.4} />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            Laporan Desil
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
            Silahkan upload data hasil cek lapangan
          </p>
        </div>
      </div>

      {/* Success Alert Toast */}
      {successToast && (
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Card Utama Upload Box (100% Sesuai Screenshot) ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`w-full rounded-2xl sm:rounded-3xl bg-[#A9C7ED] dark:bg-[#1E2E4A]/90 hover:bg-[#9EBFEC] dark:hover:bg-[#233555] transition-all cursor-pointer p-8 sm:p-12 md:p-14 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[230px] md:min-h-[250px] shadow-sm select-none border-2 ${
          isDragOver
            ? "border-blue-500 dark:border-blue-400 bg-[#96B8E8] dark:bg-[#283d63] scale-[1.01]"
            : "border-transparent"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.zip,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Blue Square with Upload Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0084FF] hover:bg-[#0074E0] flex items-center justify-center text-white shadow-md mb-3 sm:mb-4 hover:scale-105 transition-transform">
          <Upload size={34} strokeWidth={2.4} />
        </div>

        {/* Text "Upload Data laporan Desil" */}
        <span className="text-gray-900 dark:text-white text-sm sm:text-base font-bold tracking-tight">
          Upload Data laporan Desil
        </span>
        <span className="text-gray-700 dark:text-gray-300 text-xs mt-1 text-center">
          Klik atau seret file PDF / Excel hasil survei lapangan
        </span>

        {/* Uploading progress bar */}
        {isUploading && (
          <div className="w-full max-w-xs mt-4">
            <div className="flex justify-between text-xs text-gray-900 dark:text-white font-medium mb-1">
              <span>Mengunggah berkas...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-white/50 dark:bg-slate-700/80 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#0084FF] h-2 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Uploaded File Pill */}
        {uploadedFile && !isUploading && (
          <div className="mt-4 px-4 py-1.5 rounded-full bg-white/70 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-600 text-gray-900 dark:text-white text-xs font-semibold flex items-center gap-2 shadow-2xs">
            <FileCheck2 size={15} className="text-emerald-600 dark:text-emerald-400" />
            <span>{uploadedFile.name} (Tersimpan)</span>
          </div>
        )}
      </div>

      {/* ── Riwayat Upload Laporan Hasil Cek Lapangan ── */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={17} className="text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
              Riwayat Berkas Laporan Hasil Lapangan
            </h3>
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            {tingkat}
          </span>
        </div>

        {historyReports.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500 dark:text-gray-400">
            Belum ada berkas laporan yang diunggah.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {historyReports.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/70 dark:hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white block truncate">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      <span>{item.size}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {item.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pl-12 sm:pl-0">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      item.status === "Terverifikasi"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                        : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                    }`}
                  >
                    {item.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteHistory(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus riwayat"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

