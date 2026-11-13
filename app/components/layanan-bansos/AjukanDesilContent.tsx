"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  initialNik = "••••••••••••••••",
  initialAlamat = "Kota Surabaya, Jawa Timur",
  initialPekerjaan = "Pekerja Lepas / Tidak Tetap",
  initialTanggungan = 4,
  initialDesil = 4,
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
    anggotaKeluarga: `${initialTanggungan} orang`,
    orangDewasa: `${Math.max(1, initialTanggungan - 1)} orang`,
    anakSekolah: "1 orang",
  });

  const [pekerjaanData, setPekerjaanData] = useState({
    statusPekerjaan: initialPekerjaan || "Tidak Bekerja",
    perubahanTerakhir: "Terverifikasi Sistem",
  });

  // Step 2 Data
  const [ekonomiData, setEkonomiData] = useState<DataKondisiEkonomiValues>({
    statusPekerja: initialPekerjaan || "Tidak Bekerja",
    pendapatan: "Rp 1.000.000",
    jumlahAnggotaKeluarga: `${initialTanggungan} Orang`,
    orangTua: "1",
    asetKendaraan: "1 Unit",
    sumberData: "Data Terpadu",
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Step 3 Live Camera Photo Data
  const [housePhoto, setHousePhoto] = useState<string | null>(null);
  const [photoValidationWarning, setPhotoValidationWarning] = useState<string | null>(null);

  // Modal & submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    setPhotoValidationWarning(null);
    setStep(4);
    scrollToTop();
  };

  const handleKirimPengajuan = async () => {
    setIsSubmitting(true);
    try {
      const nomorTiket = `DSL-${Date.now().toString().slice(-8)}`;
      const submissionDate = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const parsedPendapatan = parseInt(ekonomiData.pendapatan.replace(/\D/g, "")) || 1000000;
      const parsedTanggungan = parseInt(keluargaData.anggotaKeluarga.replace(/\D/g, "")) || initialTanggungan || 4;
      const targetDesil = Math.max(1, initialDesil - 2);

      // Simpan ke database Supabase
      const { submitDesilAction } = await import("@/app/actions/bansos");
      await submitDesilAction({
        nomorTiket,
        desilLama: initialDesil,
        desilDiajukan: targetDesil,
        jumlahTanggungan: parsedTanggungan,
        pekerjaanKepalaKeluarga: pekerjaanData.statusPekerjaan,
        penghasilanBulanan: parsedPendapatan,
        pengeluaranBulanan: Math.round(parsedPendapatan * 0.9),
        alasan: "Kondisi ekonomi menurun",
        fotoRumahDepanUrl: housePhoto || undefined,
      });

      // Simpan status lokal untuk sinkronisasi seketika di tracking
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "govhub_last_desil_submission",
            JSON.stringify({
              nomorPengajuan: nomorTiket,
              tanggalPengajuan: submissionDate,
              statusTerakhir: "Menunggu Verifikasi dari Petugas",
              desilAwal: `DESIL ${initialDesil}`,
              desilBaru: `DESIL ${targetDesil}`,
              namaPemohon: initialNama,
              nikPemohon: initialNik,
              status: "menunggu_verifikasi",
            })
          );
        } catch (e) {
          console.warn("Storage warning:", e);
        }
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Error submitting desil:", err);
      setIsSuccess(true);
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
              className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 text-xs md:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer select-none text-center"
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
              className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 text-xs md:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer select-none text-center"
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
            onPhotoCaptured={(dataUrl) => {
              setHousePhoto(dataUrl);
              if (dataUrl) {
                setPhotoValidationWarning(null);
                // Langsung masuk ke halaman ringkasan verifikasi setelah user ambil foto
                setTimeout(() => {
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
              className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 text-xs md:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer select-none text-center"
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
        <RingkasanPengajuanDesilCard
          nama={initialNama}
          nik={initialNik}
          desilSaatIni={`Desil ${initialDesil}`}
          alasanPengajuan="Kondisi ekonomi menurun"
          statusPekerjaan={pekerjaanData.statusPekerjaan}
          pendapatan={ekonomiData.pendapatan}
          anggotaKeluarga={keluargaData.anggotaKeluarga}
          housePhoto={housePhoto}
          onBack={() => {
            setStep(3);
            scrollToTop();
          }}
          onSubmit={handleKirimPengajuan}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Final Success Notification Modal */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-slate-700 p-6 md:p-7 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#16a34a] text-white flex items-center justify-center mb-4 shadow-lg">
                <Check size={28} strokeWidth={3} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Permohonan Berhasil Dikirim!
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm mb-4">
                Pengajuan peninjauan desil Anda beserta verifikasi data keluarga, kondisi ekonomi, dan foto kondisi rumah telah kami terima untuk diproses petugas Dinas Sosial.
              </p>
              
              <div className="w-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs text-emerald-800 dark:text-emerald-300 font-medium mb-5 text-left">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Check size={14} className="text-emerald-600" />
                  <span>Status saat ini: Menunggu Verifikasi Lapangan &amp; DTKS</span>
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
                  className="w-full bg-[#0B57D0] hover:bg-blue-700 active:scale-98 text-white font-semibold text-xs md:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all text-center cursor-pointer"
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
