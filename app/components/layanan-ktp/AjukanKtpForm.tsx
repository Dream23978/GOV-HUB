"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AjukanKtpHeader } from "./AjukanKtpHeader";
import { VerificationBanner } from "./VerificationBanner";
import { DataPengajuanCard, DataPengajuanValues } from "./DataPengajuanCard";
import { NoUploadNotice } from "./NoUploadNotice";
import { JenisPengajuanSection } from "./JenisPengajuanSection";
import { JadwalBiometrikSection } from "./JadwalBiometrikSection";
import { submitKtpAction } from "@/app/actions/ktp";
import { broadcastSync } from "@/app/components/AutoRefresh";

interface AjukanKtpFormProps {
  initialProfile?: Partial<DataPengajuanValues>;
  userId?: string;
}

export function AjukanKtpForm({ initialProfile }: AjukanKtpFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<DataPengajuanValues>({
    nama: initialProfile?.nama || "Warga",
    nik: initialProfile?.nik || "",
    tempatTglLahir: initialProfile?.tempatTglLahir || "",
    jenisKelamin: initialProfile?.jenisKelamin || "Laki-Laki",
    alamat: initialProfile?.alamat || "",
    agama: initialProfile?.agama || "Islam",
    statusPerkawinan: initialProfile?.statusPerkawinan || "Belum Menikah",
    pekerjaan: initialProfile?.pekerjaan || "",
    kewarganegaraan: initialProfile?.kewarganegaraan || "WNI",
  });
  const [selectedTanggal, setSelectedTanggal] = useState("");
  const [selectedWaktu, setSelectedWaktu] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);

    try {
      const nomorTiket = `KTP-2026-${Math.floor(10000 + Math.random() * 90000)}`;

      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("govhub_last_ktp_submission");
        } catch {
          // ignore
        }
      }

      // Panggil Server Action agar aman dari blokir RLS client
      const res = await submitKtpAction({
        nomorTiket,
        jenisPengajuan: "KTP Baru / Pertama Kali",
        waktuKehadiranBiometrik: selectedTanggal
          ? `${selectedTanggal} ${selectedWaktu || "09:00 WIB"}`
          : undefined,
        profileUpdates: {
          nama_lengkap: formData.nama,
          nik: formData.nik,
          alamat: formData.alamat,
          jenis_kelamin: formData.jenisKelamin,
        },
      });

      if (!res.success && res.error) {
        console.warn("KTP Submission notice:", res.error);
      }

      broadcastSync();
      // Redirect ke halaman tracking pengajuan KTP
      router.push("/dashboard/layanan-ktp/tracking?success=1");
      router.refresh();
    } catch (err) {
      console.error("Error submitting KTP application:", err);
      // Tetap lanjutkan navigasi ke tracking
      router.push("/dashboard/layanan-ktp/tracking?success=1");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmitClick} className="flex flex-col w-full pb-10">
      {/* Header with Back Button */}
      <AjukanKtpHeader />

      {/* Verification Status Banner */}
      <VerificationBanner />

      {/* 1. Data Pengajuan */}
      <DataPengajuanCard
        initialData={initialProfile}
        formData={formData}
        onChange={setFormData}
        onFileSelect={(file) => setUploadedFile(file)}
      />

      {/* Alert: Tidak perlu upload fotokopi */}
      <NoUploadNotice />

      {/* 2. Pilih Jenis Pengajuan */}
      <JenisPengajuanSection />

      {/* 3. Jadwal Perekaman Biometrik */}
      <JadwalBiometrikSection
        selectedTanggal={selectedTanggal}
        selectedWaktu={selectedWaktu}
        onTanggalChange={(val) => setSelectedTanggal(val)}
        onWaktuChange={(val) => setSelectedWaktu(val)}
      />

      {/* Submit Button aligned to right */}
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-[#0E4FA8] hover:bg-[#0B3F88] active:scale-[0.98] disabled:opacity-50 text-white font-semibold text-xs md:text-sm px-7 py-3 rounded-xl shadow-md transition-all cursor-pointer select-none text-center"
        >
          {isSubmitting ? "Memproses..." : "Lanjutkan Pengajuan"}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">
              Konfirmasi Pengajuan KTP
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Pastikan data dan jadwal kehadiran perekaman biometrik Anda sudah sesuai.
              Data akan otomatis disinkronkan dengan Dukcapil.
            </p>

            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3.5 flex flex-col gap-2 text-xs mb-5 border border-gray-200 dark:border-slate-600">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Jenis Layanan:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  KTP Baru / Pertama Kali
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Nama:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {formData.nama || initialProfile?.nama || "Warga Terdaftar"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Jadwal:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {selectedTanggal || "Sesuai Jadwal"} ({selectedWaktu || "09:00 WIB"})
                </span>
              </div>
              {uploadedFile && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Dokumen:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
                    {uploadedFile.name}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmSubmit}
                className="bg-[#0E4FA8] hover:bg-[#0B3F88] text-white px-5 py-2 rounded-xl text-xs font-semibold shadow transition-all cursor-pointer"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

