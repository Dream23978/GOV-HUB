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

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    try {
      await updateKtpSubmissionStatusAction({ id, status: "selesai" });
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
      setSuccessMsg("Pengajuan KTP-el telah disetujui untuk proses penerbitan!");
      setTimeout(() => {
        setSelectedSubmission(null);
        setSuccessMsg(null);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    setIsProcessing(true);
    try {
      await updateKtpSubmissionStatusAction({
        id,
        status: "ditolak",
        catatan: "Persyaratan data biometrik/berkas belum lengkap.",
      });
      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, statusBadge: "Ditolak", statusRaw: "ditolak" } : item
        )
      );
      setCounts((prev) => ({
        ...prev,
        menungguVerifikasi: Math.max(0, prev.menungguVerifikasi - 1),
      }));
      setSuccessMsg("Pengajuan KTP-el ditolak.");
      setTimeout(() => {
        setSelectedSubmission(null);
        setSuccessMsg(null);
      }, 1500);
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

      {/* Modal Detail Dukcapil */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-slate-700 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-3 mb-4">
              <div>
                <span className="text-[11px] font-mono font-semibold text-blue-600">
                  {selectedSubmission.nomor}
                </span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Verifikasi Berkas KTP: {selectedSubmission.nama}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                <div>
                  <span className="text-gray-500 block">Nama Pemohon</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {selectedSubmission.nama}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">NIK</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {selectedSubmission.nik}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block">Jenis Layanan</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {selectedSubmission.layanan}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block">Alamat Kependudukan</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {selectedSubmission.alamat}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleReject(selectedSubmission.id)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <XCircle size={14} />
                  <span>Tolak Permohonan</span>
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleApprove(selectedSubmission.id)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1b3a6b] hover:bg-[#152e55] text-white shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <IdCard size={14} />
                  )}
                  <span>Setujui &amp; Terbitkan KTP-el</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

