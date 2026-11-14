"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AjukanKtpHeader } from "./AjukanKtpHeader";
import { VerificationBanner } from "./VerificationBanner";
import { DataPengajuanCard, DataPengajuanValues } from "./DataPengajuanCard";
import { NoUploadNotice } from "./NoUploadNotice";
import { JenisPengajuanSection } from "./JenisPengajuanSection";
import { JadwalBiometrikSection } from "./JadwalBiometrikSection";
import { uploadPrivateDocument } from "@/lib/upload-document";
import { broadcastSync } from "@/app/components/AutoRefresh";
import { AlertCircle } from "lucide-react";

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
    jenisKelamin: initialProfile?.jenisKelamin || "Laki-laki",
    alamat: initialProfile?.alamat || "",
    agama: initialProfile?.agama || "Islam",
    statusPerkawinan: initialProfile?.statusPerkawinan || "Belum Menikah",
    pekerjaan: initialProfile?.pekerjaan || "",
    kewarganegaraan: initialProfile?.kewarganegaraan || "WNI",
  });
  const [jenisPengajuan, setJenisPengajuan] = useState("KTP Baru / Pertama Kali");
  const [selectedTanggal, setSelectedTanggal] = useState("");
  const [selectedWaktu, setSelectedWaktu] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | undefined>(undefined);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!selectedTanggal && !selectedScheduleId) {
      setSubmitError("Silakan pilih tanggal dan waktu perekaman biometrik terlebih dahulu.");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("govhub_last_ktp_submission");
        } catch {
          // ignore
        }
      }

      let dokumenKkUrl: string | undefined;
      let suratKehilanganUrl: string | undefined;
      if (uploadedFile) {
        const uploadRes = await uploadPrivateDocument(uploadedFile, "ktp");
        if (!uploadRes.success || !uploadRes.path) {
          setSubmitError(uploadRes.error || "Gagal mengunggah dokumen pendukung KTP.");
          return;
        }
        if (jenisPengajuan.toLowerCase().includes("hilang")) {
          suratKehilanganUrl = uploadRes.path;
        } else {
          dokumenKkUrl = uploadRes.path;
        }
      }

      const scheduleString = selectedTanggal
        ? `${selectedTanggal} ${selectedWaktu || "09:00 WIB"}`
        : undefined;

      const res = await fetch("/api/ktp/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jenisPengajuan,
          scheduleId: selectedScheduleId,
          dokumenKkUrl,
          suratKehilanganUrl,
          waktuKehadiranBiometrik: scheduleString,
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setSubmitError(json?.error || "Gagal mengirim pengajuan KTP. Silakan periksa data Anda.");
        return;
      }

      // Sinkronkan pembaruan profil jika ada perubahan elemen data pemohon
      const normalizedGender = /perempuan/i.test(formData.jenisKelamin)
        ? "Perempuan"
        : "Laki-laki";
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_lengkap: formData.nama,
          alamat: formData.alamat,
          jenis_kelamin: normalizedGender,
        }),
      }).catch(() => {});

      broadcastSync();
      setShowConfirmModal(false);
      router.push("/dashboard/layanan-ktp/tracking?success=1");
      router.refresh();
    } catch {
      setSubmitError("Terjadi kesalahan jaringan saat mengirim pengajuan KTP.");
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
      <JenisPengajuanSection
        selectedJenis={jenisPengajuan}
        onSelect={setJenisPengajuan}
      />

      {/* 3. Jadwal Perekaman Biometrik */}
      <JadwalBiometrikSection
        selectedTanggal={selectedTanggal}
        selectedWaktu={selectedWaktu}
        selectedScheduleId={selectedScheduleId}
        onTanggalChange={(val) => setSelectedTanggal(val)}
        onWaktuChange={(val) => setSelectedWaktu(val)}
        onScheduleIdChange={setSelectedScheduleId}
      />

      {submitError && !showConfirmModal && (
        <div role="alert" className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

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
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ktp-confirm-title"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
            <h3 id="ktp-confirm-title" className="font-bold text-base text-gray-900 dark:text-white mb-2">
              Konfirmasi Pengajuan KTP
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Pastikan data dan jadwal kehadiran perekaman biometrik Anda sudah sesuai.
              Data akan otomatis disinkronkan dengan Dukcapil.
            </p>

            {submitError && (
              <div role="alert" className="mb-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3.5 flex flex-col gap-2 text-xs mb-5 border border-gray-200 dark:border-slate-600">
              <div className="flex justify-between gap-2">
                <span className="text-gray-500 dark:text-gray-400">Jenis Layanan:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-right">
                  {jenisPengajuan}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500 dark:text-gray-400">Nama:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-right">
                  {formData.nama || initialProfile?.nama || "Warga Terdaftar"}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500 dark:text-gray-400">Jadwal:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 text-right">
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

