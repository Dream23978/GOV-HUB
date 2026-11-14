"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { broadcastSync } from "@/app/components/AutoRefresh";
import { uploadPrivateDocument } from "@/lib/upload-document";
import { ChevronLeft, Check, AlertCircle } from "lucide-react";
import { AjukanDesilIdentitasCard } from "./AjukanDesilIdentitasCard";
import { AjukanDesilKeluargaCard } from "./AjukanDesilKeluargaCard";
import { AjukanDesilPekerjaanCard } from "./AjukanDesilPekerjaanCard";
import { DataKondisiEkonomiCard, DataKondisiEkonomiValues } from "./DataKondisiEkonomiCard";
import { UploadDokumenVerifikasiCard } from "./UploadDokumenVerifikasiCard";
import { VerifikasiKondisiRumahCard } from "./VerifikasiKondisiRumahCard";
import { RingkasanPengajuanDesilCard } from "./RingkasanPengajuanDesilCard";

interface AjukanDesilContentProps {
  initialNama?: string;
  initialNik?: string;
  initialAlamat?: string;
  initialPekerjaan?: string;
  initialTanggungan?: number;
  initialDesil?: number;
}

export function AjukanDesilContent({
  initialNama = "Warga Terdaftar",
  initialNik = "-",
  initialAlamat = "-",
  initialPekerjaan = "-",
  initialTanggungan = 0,
  initialDesil = 0,
}: AjukanDesilContentProps) {
  const router = useRouter();

  // 4-Step Wizard Flow:
  // Step 1 = Data Identitas, Data Keluarga, Data Pekerjaan
  // Step 2 = Data Kondisi Ekonomi & Pekerjaan + Upload Dokumen
  // Step 3 = Verifikasi Kondisi Rumah / LIVE CAMERA
  // Step 4 = Ringkasan Pengajuan & Kirim Pengajuan (100% Slicing Mockup)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 Data
  const [keluargaData, setKeluargaData] = useState({
    anggotaKeluarga: initialTanggungan > 0 ? `${initialTanggungan} orang` : "-",
    orangDewasa: initialTanggungan > 0 ? `${Math.max(1, initialTanggungan - 1)} orang` : "-",
    anakSekolah: "-",
  });

  const [pekerjaanData, setPekerjaanData] = useState({
    statusPekerjaan: initialPekerjaan || "-",
    perubahanTerakhir: "-",
  });

  // Step 2 Data
  const [ekonomiData, setEkonomiData] = useState<DataKondisiEkonomiValues>({
    statusPekerja: initialPekerjaan && initialPekerjaan !== "-" ? initialPekerjaan : "",
    pendapatan: "",
    jumlahAnggotaKeluarga: initialTanggungan > 0 ? `${initialTanggungan} Orang` : "",
    orangTua: "",
    asetKendaraan: "",
    sumberData: "-",
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [alasanPengajuan, setAlasanPengajuan] = useState("Kondisi ekonomi menurun");
  const [pengeluaranInput, setPengeluaranInput] = useState("");

  // Step 3 Live Camera Photo Data
  const [housePhoto, setHousePhoto] = useState<string | null>(null);
  const [housePhotoPath, setHousePhotoPath] = useState<string | null>(null);
  const [photoValidationWarning, setPhotoValidationWarning] = useState<string | null>(null);
  const autoStepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modal & submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (autoStepTimerRef.current) clearTimeout(autoStepTimerRef.current);
    };
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLanjutkanStep1 = () => {
    setStep(2);
    scrollToTop();
  };

  const handleLanjutkanStep2 = () => {
    setStep(3);
    scrollToTop();
  };

  const handleLanjutkanStep3 = () => {
    if (!housePhoto || !housePhotoPath) {
      setPhotoValidationWarning(
        "Foto kondisi rumah wajib diambil langsung melalui kamera perangkat sebelum melanjutkan."
      );
      return;
    }
    setPhotoValidationWarning(null);
    setStep(4);
    scrollToTop();
  };

  const handleKirimPengajuan = async () => {
    if (!housePhotoPath) {
      setSubmitError("Foto verifikasi kondisi rumah wajib diunggah terlebih dahulu.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const nomorTiket = `DSL-${Date.now().toString().slice(-8)}`;
      const parsedPendapatan = parseInt(ekonomiData.pendapatan.replace(/\D/g, "")) || 0;
      const parsedPengeluaran =
        parseInt(pengeluaranInput.replace(/\D/g, "")) || parsedPendapatan;
      const parsedTanggungan =
        parseInt(keluargaData.anggotaKeluarga.replace(/\D/g, "")) || initialTanggungan || 0;
      const targetDesil = initialDesil > 0 ? Math.max(1, initialDesil - 2) : 1;

      let buktiSlipGajiPath: string | undefined;
      if (uploadedFile) {
        const docUpload = await uploadPrivateDocument(uploadedFile, "bansos");
        if (!docUpload.success || !docUpload.path) {
          setSubmitError(docUpload.error || "Gagal mengunggah dokumen pendukung.");
          return;
        }
        buktiSlipGajiPath = docUpload.path;
      }

      // Simpan ke database Supabase
      const { submitDesilAction } = await import("@/app/actions/bansos");
      const res = await submitDesilAction({
        nomorTiket,
        desilDiajukan: targetDesil,
        jumlahTanggungan: parsedTanggungan,
        pekerjaanKepalaKeluarga:
          ekonomiData.statusPekerja || pekerjaanData.statusPekerjaan,
        penghasilanBulanan: parsedPendapatan,
        pengeluaranBulanan: parsedPengeluaran,
        alasan: alasanPengajuan,
        fotoRumahDepanUrl: housePhotoPath,
        buktiSlipGajiUrl: buktiSlipGajiPath,
      });

      if (!res?.success) {
        setSubmitError(res?.error || "Gagal mengirim pengajuan peninjauan desil. Silakan coba lagi.");
        return;
      }

      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("govhub_last_desil_submission");
        } catch {
          // ignore
        }
      }

      broadcastSync();
      router.refresh();
      setIsSuccess(true);
    } catch (err) {
      console.error("Error submitting desil:", err);
      setSubmitError("Terjadi kesalahan saat menyimpan pengajuan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header with Circular Back Button */}
      <div className="flex items-center gap-3.5 mb-5 select-none">
        {step === 1 ? (
          <Link
            href="/dashboard/layanan-bansos"
            className="w-10 h-10 rounded-full bg-[#1b2b54] hover:bg-[#142040] flex items-center justify-center transition-all duration-200 shadow-sm flex-shrink-0 group"
            aria-label="Kembali ke Layanan Bansos"
          >
            <ChevronLeft
              size={22}
              className="text-white ml-[-1px] group-hover:-translate-x-0.5 transition-transform"
              strokeWidth={2.4}
            />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : 1));
              scrollToTop();
            }}
            className="w-10 h-10 rounded-full bg-[#1b2b54] hover:bg-[#142040] flex items-center justify-center transition-all duration-200 shadow-sm flex-shrink-0 group cursor-pointer"
            aria-label="Kembali ke Langkah Sebelumnya"
          >
            <ChevronLeft
              size={22}
              className="text-white ml-[-1px] group-hover:-translate-x-0.5 transition-transform"
              strokeWidth={2.4}
            />
          </button>
        )}

        <div>
          <h1 className="text-xl md:text-[22px] font-bold text-gray-900 dark:text-white leading-tight">
            Ajukan Peninjauan Desil
          </h1>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">
            Verifikasi kondisi keluarga Anda
          </p>
        </div>
      </div>

      {/* ================= STEP 1: Verifikasi Data Terpadu (Mockup 1) ================= */}
      {step === 1 && (
        <div className="flex flex-col w-full animate-in fade-in duration-200">
          <AjukanDesilIdentitasCard
            nama={initialNama}
            nik={initialNik}
            jumlahKeluarga={keluargaData.anggotaKeluarga}
            alamat={initialAlamat}
          />

          <AjukanDesilKeluargaCard
            anggotaKeluarga={keluargaData.anggotaKeluarga}
            orangDewasa={keluargaData.orangDewasa}
            anakSekolah={keluargaData.anakSekolah}
            onSave={(val) => setKeluargaData(val)}
          />

          <AjukanDesilPekerjaanCard
            statusPekerjaan={pekerjaanData.statusPekerjaan}
            perubahanTerakhir={pekerjaanData.perubahanTerakhir}
            verifikasiText="Data berhasil diverifikasi"
            onSave={(val) => setPekerjaanData(val)}
          />

          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-6 px-0.5">
            Data di atas diperoleh secara otomatis dari sistem yang terintegrasi. Anda tidak perlu mengisi ulang data yang sudah ada.
          </p>

          <div className="flex items-center justify-end gap-3.5">
            <Link
              href="/dashboard/layanan-bansos"
              className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 text-xs md:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer select-none text-center"
            >
              Kembali
            </Link>

            <button
              type="button"
              onClick={handleLanjutkanStep1}
              className="bg-[#0B57D0] hover:bg-blue-700 active:scale-95 text-white text-xs md:text-sm font-semibold px-7 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer select-none text-center"
            >
              Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: Kondisi Ekonomi & Pekerjaan + Upload Dokumen (Mockup 2) ================= */}
      {step === 2 && (
        <div className="flex flex-col w-full animate-in fade-in duration-200">
          <DataKondisiEkonomiCard
            initialValues={ekonomiData}
            onChange={(val) => setEkonomiData(val)}
          />

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5 mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="alasan-peninjauan-select" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Alasan Peninjauan Desil
              </label>
              <select
                id="alasan-peninjauan-select"
                value={alasanPengajuan}
                onChange={(e) => setAlasanPengajuan(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              >
                <option value="Kondisi ekonomi menurun">Kondisi ekonomi menurun</option>
                <option value="Kehilangan pekerjaan / PHK">Kehilangan pekerjaan / PHK</option>
                <option value="Bertambahnya tanggungan keluarga">Bertambahnya tanggungan keluarga</option>
                <option value="Anggota keluarga sakit menahun">Anggota keluarga sakit menahun</option>
              </select>
            </div>
            <div>
              <label htmlFor="estimasi-pengeluaran-input" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Estimasi Pengeluaran Bulanan (Opsional)
              </label>
              <input
                id="estimasi-pengeluaran-input"
                type="text"
                inputMode="numeric"
                value={pengeluaranInput}
                onChange={(e) => setPengeluaranInput(e.target.value)}
                placeholder="Contoh: 1500000"
                className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <UploadDokumenVerifikasiCard
            onFileSelect={(file) => setUploadedFile(file)}
          />

          <div className="flex items-center justify-end gap-3.5">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                scrollToTop();
              }}
              className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 text-xs md:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer select-none text-center"
            >
              Kembali
            </button>

            <button
              type="button"
              onClick={handleLanjutkanStep2}
              className="bg-[#0B57D0] hover:bg-blue-700 active:scale-95 text-white text-xs md:text-sm font-semibold px-7 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer select-none text-center"
            >
              Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: Verifikasi Kondisi Rumah / LIVE CAMERA (Mockup 3) ================= */}
      {step === 3 && (
        <div className="flex flex-col w-full animate-in fade-in duration-200">
          <VerifikasiKondisiRumahCard
            photo={housePhoto}
            onPhotoCaptured={(previewUrl, storagePath) => {
              setHousePhoto(previewUrl);
              setHousePhotoPath(storagePath || null);
              if (previewUrl && storagePath) {
                setPhotoValidationWarning(null);
                if (autoStepTimerRef.current) clearTimeout(autoStepTimerRef.current);
                autoStepTimerRef.current = setTimeout(() => {
                  setStep(4);
                  scrollToTop();
                }, 500);
              }
            }}
          />

          {photoValidationWarning && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/50 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300 animate-in fade-in">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
              <span>{photoValidationWarning}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3.5">
            <button
              type="button"
              onClick={() => {
                setStep(2);
                scrollToTop();
              }}
              className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 text-xs md:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer select-none text-center"
            >
              Kembali
            </button>

            <button
              type="button"
              onClick={handleLanjutkanStep3}
              className="bg-[#0B57D0] hover:bg-blue-700 active:scale-95 text-white text-xs md:text-sm font-semibold px-7 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer select-none text-center"
            >
              Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: Ringkasan Pengajuan & Kirim Pengajuan (Mockup 4) ================= */}
      {step === 4 && (
        <div className="space-y-4">
          {submitError && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}
          <RingkasanPengajuanDesilCard
            nama={initialNama}
            nik={initialNik}
            desilSaatIni={initialDesil > 0 ? `Desil ${initialDesil}` : "-"}
            desilSementara={initialDesil > 0 ? `Desil ${Math.max(1, initialDesil - 2)}` : "-"}
            alasanPengajuan={alasanPengajuan}
            statusPekerjaan={ekonomiData.statusPekerja || pekerjaanData.statusPekerjaan || "-"}
            pendapatan={ekonomiData.pendapatan || "-"}
            anggotaKeluarga={ekonomiData.jumlahAnggotaKeluarga || keluargaData.anggotaKeluarga || "-"}
            housePhoto={housePhoto}
            onBack={() => {
              setSubmitError(null);
              setStep(3);
              scrollToTop();
            }}
            onSubmit={handleKirimPengajuan}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Final Success Notification Modal */}
      {isSuccess && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="desil-success-title"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-slate-700 p-6 md:p-7 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#16a34a] text-white flex items-center justify-center mb-4 shadow-lg">
                <Check size={28} strokeWidth={3} />
              </div>
              <h3 id="desil-success-title" className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Permohonan Berhasil Dikirim!
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm mb-4">
                Pengajuan peninjauan desil Anda beserta verifikasi data keluarga, kondisi ekonomi, dan foto kondisi rumah telah kami terima untuk dicek oleh admin Dinas Sosial.
              </p>
              
              <div className="w-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 font-medium mb-5 text-left">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Check size={14} className="text-amber-600" />
                  <span>Status saat ini: Menunggu Verifikasi dari Admin</span>
                </div>
                {uploadedFile && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 pl-5">
                    Dokumen terlampir: {uploadedFile.name}
                  </div>
                )}
              </div>

              {/* Action Buttons in Notification Modal */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/layanan-bansos/tracking")}
                  className="w-full bg-[#0B57D0] hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs md:text-sm py-2.5 px-4 rounded-xl shadow-sm transition-all text-center cursor-pointer"
                >
                  Lihat Status Pengajuan
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/layanan-bansos")}
                  className="w-full bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 font-semibold text-xs md:text-sm py-2.5 px-4 rounded-xl transition-colors text-center cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
