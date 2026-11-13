"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  CreditCard,
  Check,
  X,
  Clock,
  IdCard,
  Loader2,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { updateKtpSubmissionStatusAction } from "@/app/actions/admin";

interface DukcapilSubmissionRow {
  id: string;
  nomor: string;
  nama: string;
  layanan: string;
  statusBadge: string;
  statusRaw?: string;
  tanggal: string;
  nik: string;
  initial: string;
  bgInitial: string;
  textInitial: string;
  alamat: string;
  tanggalLahir?: string;
  statusKtp?: string;
  noHp?: string;
  alasan?: string;
  verifikasiNik?: string;
  verifikasiKk?: string;
  statusPenduduk?: string;
  usia?: string;
  alasanPenolakan?: string;
}

interface AdminDukcapilDashboardContentProps {
  roleTitle?: string;
  wilayah?: string;
  initialSubmissions?: DukcapilSubmissionRow[];
  initialCounts?: {
    total: number;
    menungguVerifikasi: number;
    diproses: number;
    selesai: number;
  };
}

export function AdminDukcapilDashboardContent({
  roleTitle = "Admin Dukcapil Kota",
  wilayah = "Kota Surabaya",
  initialSubmissions,
  initialCounts,
}: AdminDukcapilDashboardContentProps) {
  const router = useRouter();
  const [liveWilayah, setLiveWilayah] = useState(wilayah);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("govhub_admin_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.wilayah) setLiveWilayah(parsed.wilayah);
      }
    } catch {
      // ignore
    }
  }, []);

  const [submissions, setSubmissions] = useState<DukcapilSubmissionRow[]>(() => {
    if (initialSubmissions && initialSubmissions.length > 0) {
      return initialSubmissions;
    }
    return [
      {
        id: "1",
        nomor: "KTP-2026-000412",
        nama: "Budi Santoso",
        nik: "357*********002",
        layanan: "Pencetakan KTP-el Baru / Pertama Kali",
        statusBadge: "Menunggu Verifikasi",
        statusRaw: "menunggu_verifikasi",
        tanggal: "06 Nov 2026 09:15 WIB",
        initial: "B",
        bgInitial: "bg-[#DCFCE7]",
        textInitial: "text-[#16A34A]",
        alamat: "Jl. Basuki Rahmat No. 10, Surabaya",
      },
      {
        id: "2",
        nomor: "KTP-2026-000410",
        nama: "Rian Firmansyah",
        nik: "357*********551",
        layanan: "Perekaman KTP Pemula (17 Tahun)",
        statusBadge: "Menunggu Verifikasi",
        statusRaw: "menunggu_verifikasi",
        tanggal: "06 Nov 2026 08:40 WIB",
        initial: "R",
        bgInitial: "bg-[#DBEAFE]",
        textInitial: "text-[#2563EB]",
        alamat: "Jl. Mayjen Sungkono No. 45, Surabaya",
      },
    ];
  });

  const [counts, setCounts] = useState(() => {
    if (initialCounts) return initialCounts;
    const total = submissions.length;
    const menunggu = submissions.filter((r) => r.statusRaw === "menunggu_verifikasi").length;
    const selesai = submissions.filter((r) => r.statusRaw === "selesai").length;
    return {
      total: total || 18,
      menungguVerifikasi: menunggu || 18,
      diproses: 0,
      selesai: selesai || 85,
    };
  });

  const [selectedSubmission, setSelectedSubmission] = useState<DukcapilSubmissionRow | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Status Blangko KTP & Alasan Penolakan
  const [blangkoStatus, setBlangkoStatus] = useState<"tersedia" | "habis">("tersedia");
  const [blangkoStock, setBlangkoStock] = useState<number>(10000);
  const [showBlangkoDropdown, setShowBlangkoDropdown] = useState<boolean>(true);
  const [showRejectInput, setShowRejectInput] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("");

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    try {
      await updateKtpSubmissionStatusAction({ id, status: "selesai" });
      if (blangkoStatus === "tersedia") {
        setBlangkoStock((prev) => Math.max(0, prev - 1));
      }
      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, statusBadge: "Disetujui & Dicetak", statusRaw: "selesai" }
            : item
        )
      );
      setCounts((prev) => ({
        ...prev,
        menungguVerifikasi: Math.max(0, prev.menungguVerifikasi - 1),
        selesai: prev.selesai + 1,
      }));
      setSuccessMsg(
        blangkoStatus === "tersedia"
          ? `Pengajuan KTP-el telah disetujui! Blangko dialokasikan (Sisa stok: ${(blangkoStock - 1).toLocaleString("id-ID")}).`
          : "Pengajuan KTP-el telah disetujui dan masuk antrean cetak (Stok blangko sedang habis)."
      );
      setTimeout(() => {
        setSelectedSubmission(null);
        setSuccessMsg(null);
        setShowRejectInput(false);
        setRejectReason("");
      }, 1400);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) return;
    setIsProcessing(true);
    try {
      await updateKtpSubmissionStatusAction({
        id,
        status: "ditolak",
        catatan: rejectReason.trim(),
      });
      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, statusBadge: "Ditolak", statusRaw: "ditolak", alasanPenolakan: rejectReason.trim() }
            : item
        )
      );
      setCounts((prev) => ({
        ...prev,
        menungguVerifikasi: Math.max(0, prev.menungguVerifikasi - 1),
      }));
      setSuccessMsg(`Pengajuan KTP-el ditolak: "${rejectReason.trim()}".`);
      setTimeout(() => {
        setSelectedSubmission(null);
        setSuccessMsg(null);
        setShowRejectInput(false);
        setRejectReason("");
      }, 1400);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* ── Page Header ── */}
      <div className="flex items-start gap-3 mb-5 select-none">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-300 dark:border-slate-600 flex items-center justify-center text-gray-700 dark:text-gray-200 mt-0.5 cursor-pointer shadow-2xs transition-colors"
          aria-label="Kembali"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-[22px] font-bold text-gray-900 dark:text-white leading-tight">
              Dashboard Pelayanan KTP Dukcapil
            </h1>
            <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              {roleTitle}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
            Selamat datang di Sistem Pelayanan Kependudukan &amp; KTP-el Wilayah {liveWilayah}
          </p>
        </div>
      </div>

      {/* ── Section 1: Ringkasan Pelayanan ── */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          Ringkasan Pelayanan KTP
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-blue-200/90 dark:border-slate-700 shadow-2xs p-4 flex items-center justify-between">
            <div>
              <span className="text-2xl font-black text-gray-900 dark:text-white block">
                {counts.total}
              </span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5 block">
                Permohonan Masuk
              </span>
              <span className="inline-block mt-2 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                {counts.menungguVerifikasi} Perlu Verifikasi
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0284C7] flex items-center justify-center">
              <CreditCard size={22} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-2xs p-4 flex items-center justify-between">
            <div>
              <span className="text-2xl font-black text-[#16a34a] dark:text-emerald-400 block">
                {counts.selesai}
              </span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5 block">
                KTP Selesai Dicetak
              </span>
              <span className="inline-block mt-2 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                Siap Ambil / Kirim
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center">
              <Check size={22} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-2xs p-4 flex items-center justify-between">
            <div>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block">
                6
              </span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-0.5 block">
                Perekaman Biometrik
              </span>
              <span className="inline-block mt-2 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100">
                Jadwal Hari Ini
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Daftar Permohonan KTP Terbaru ── */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          Permohonan KTP Terbaru
        </h2>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700 shadow-2xs divide-y divide-gray-200/80 dark:divide-slate-700 overflow-hidden">
          {submissions.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/70 dark:hover:bg-slate-700/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full ${item.bgInitial} ${item.textInitial} flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-2xs select-none`}
                >
                  {item.initial}
                </div>

                <div className="min-w-0">
                  <span className="text-[11px] font-mono font-medium text-gray-500 dark:text-gray-400 block leading-tight">
                    {item.nomor}
                  </span>
                  <h3 className="text-xs md:text-sm font-bold text-gray-900 dark:text-white leading-snug truncate">
                    {item.nama}
                  </h3>
                  <span className="text-[11px] text-gray-600 dark:text-gray-300 leading-none">
                    Layanan: {item.layanan}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pl-13 sm:pl-0">
                <span className="inline-block bg-[#E0F2FE] text-[#0284C7] dark:bg-sky-950/60 dark:text-sky-300 text-[11px] font-semibold px-3 py-1 rounded-full border border-sky-200/70 whitespace-nowrap">
                  {item.statusBadge}
                </span>

                <div className="text-right text-[11px] text-gray-600 dark:text-gray-400 leading-tight whitespace-nowrap hidden md:block">
                  <div>{item.tanggal}</div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedSubmission(item)}
                  className="border border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 active:scale-95 text-xs font-semibold px-4 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                >
                  Lihat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detail Dukcapil - 100% Match Mockup Screenshot */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
          <div className="bg-white dark:bg-[#101F3C] rounded-2xl w-full max-w-xl shadow-2xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-2 mb-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base">
                <span className="font-extrabold text-slate-900 dark:text-white">
                  Detail Pengajuan KTP
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-300">
                  {selectedSubmission.nomor}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedSubmission(null);
                  setShowRejectInput(false);
                  setRejectReason("");
                }}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-black dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <hr className="border-t border-gray-300 dark:border-white/10 mb-4" />

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* 1. DATA PEMOHON */}
            <div className="space-y-1.5 mb-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Data Pemohon
              </h4>
              <div className="border border-slate-300 dark:border-white/15 rounded-xl p-3.5 space-y-1.5 text-xs sm:text-sm bg-white dark:bg-slate-900/40">
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Nama</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.nama}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">NIK</span>
                  <span className="text-slate-900 dark:text-white font-mono">{selectedSubmission.nik}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Tanggal Lahir</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.tanggalLahir || "02/09/2026"}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Alamat</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.alamat}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Status KTP</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.statusKtp || "Belum memiliki KTP"}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">No HP</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.noHp || "083423423423"}</span>
                </div>
              </div>
            </div>

            {/* 2. DATA PENGAJUAN */}
            <div className="space-y-1.5 mb-4">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                DATA PENGAJUAN
              </h4>
              <div className="border border-slate-300 dark:border-white/15 rounded-xl p-3.5 space-y-1.5 text-xs sm:text-sm bg-white dark:bg-slate-900/40">
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Jenis Pengajuan</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.layanan}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Tanggal Pengajuan</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.tanggal}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Alasan</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.alasan || "Baru berusia 17 tahun"}</span>
                </div>
              </div>
            </div>

            {/* 3. VERIFIKASI DATA */}
            <div className="space-y-1.5 mb-4">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                VERIFIKASI DATA
              </h4>
              <div className="border border-slate-300 dark:border-white/15 rounded-xl p-3.5 space-y-1.5 text-xs sm:text-sm bg-white dark:bg-slate-900/40">
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">NIK</span>
                  <span className="text-slate-900 dark:text-white font-medium">{selectedSubmission.verifikasiNik || "Terverifikasi"}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Data KK</span>
                  <span className="text-slate-900 dark:text-white font-medium">{selectedSubmission.verifikasiKk || "Terverifikasi"}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Status Penduduk</span>
                  <span className="text-slate-900 dark:text-white font-medium">{selectedSubmission.statusPenduduk || "Aktif"}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Usia</span>
                  <span className="text-slate-900 dark:text-white font-medium">{selectedSubmission.usia || "17 Tahun"}</span>
                </div>
              </div>
            </div>

            {/* 4. KETERSEDIAAN BLANGKO KTP (STATUS & STOK) */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowBlangkoDropdown((prev) => !prev)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>Ketersedian Blangko</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    blangkoStatus === "tersedia" ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <ChevronDown size={14} className="text-slate-600 dark:text-slate-400" />
              </button>

              {/* Card Status Blangko KTP */}
              {showBlangkoDropdown && (
                <div className="mt-2.5 p-3.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900/90 shadow-sm space-y-3 max-w-sm animate-in fade-in">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    Status Blangko KTP
                  </h5>

                  {/* Radio 1: Tersedia */}
                  <label
                    onClick={() => setBlangkoStatus("tersedia")}
                    className="flex items-start gap-2.5 cursor-pointer group"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center transition-colors ${
                        blangkoStatus === "tersedia"
                          ? "border-emerald-600 bg-white dark:bg-slate-800"
                          : "border-slate-300 dark:border-slate-600 group-hover:border-slate-400"
                      }`}
                    >
                      {blangkoStatus === "tersedia" && (
                        <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Tersedia
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Blangko KTP Tersedia siap di gunakan ({blangkoStock.toLocaleString("id-ID")})
                      </div>
                    </div>
                  </label>

                  {/* Radio 2: Habis */}
                  <label
                    onClick={() => setBlangkoStatus("habis")}
                    className="flex items-start gap-2.5 cursor-pointer group"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center transition-colors ${
                        blangkoStatus === "habis"
                          ? "border-amber-600 bg-white dark:bg-slate-800"
                          : "border-slate-300 dark:border-slate-600 group-hover:border-slate-400"
                      }`}
                    >
                      {blangkoStatus === "habis" && (
                        <div className="w-2 h-2 rounded-full bg-amber-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Habis
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Blangko KTP Sedang tidak tersedia
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Catatan Alasan Penolakan Jika Sudah Pernah Ditolak */}
            {selectedSubmission.statusRaw === "ditolak" && selectedSubmission.alasanPenolakan && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs">
                <span className="font-bold text-rose-700 dark:text-rose-400 block mb-0.5">
                  Pengajuan Ini Telah Ditolak:
                </span>
                <p className="text-rose-600 dark:text-rose-300">
                  Alasan: {selectedSubmission.alasanPenolakan}
                </p>
              </div>
            )}

            {/* 5. FORM INPUT ALASAN PENOLAKAN */}
            {showRejectInput && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-red-800 dark:text-red-300">
                    Alasan Penolakan Pengajuan KTP:
                  </label>
                  <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold">
                    Wajib diisi
                  </span>
                </div>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ketik alasan penolakan pengajuan KTP (contoh: Foto dokumen biometrik buram, NIK tidak sesuai data KK, domisili tidak terverifikasi)..."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-slate-400"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectInput(false);
                      setRejectReason("");
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={!rejectReason.trim() || isProcessing}
                    onClick={() => handleReject(selectedSubmission.id)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 cursor-pointer shadow-xs transition-colors"
                  >
                    {isProcessing ? "Memproses..." : "Konfirmasi Tolak Pengajuan"}
                  </button>
                </div>
              </div>
            )}

            {/* 6. ACTION BUTTONS */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  setSelectedSubmission(null);
                  setShowRejectInput(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Tutup
              </button>

              {!showRejectInput && selectedSubmission.statusRaw !== "ditolak" && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setShowRejectInput(true)}
                  className="px-4 py-2 rounded-lg text-xs font-bold border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle size={14} />
                  <span>Tolak Pengajuan</span>
                </button>
              )}

              {selectedSubmission.statusRaw !== "ditolak" && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleApprove(selectedSubmission.id)}
                  className="px-6 py-2 rounded-lg text-xs font-bold bg-[#15803D] hover:bg-[#166534] text-white transition-all shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} />}
                  <span>Setuju</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

