"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Inbox,
  MapPin,
  Camera,
  Check,
  X,
  FileText,
  Loader2,
  XCircle,
} from "lucide-react";
import { updateDesilSubmissionStatusAction } from "@/app/actions/admin";

export interface SubmissionRow {
  id: string;
  nomor: string;
  nama: string;
  desilSaatIni: string;
  desilDiajukan?: number;
  statusBadge: string;
  statusRaw?: string;
  tanggal: string;
  initial: string;
  bgInitial: string;
  textInitial: string;
  pekerjaan?: string;
  pendapatan?: string;
  alasan?: string;
  housePhoto?: string;
  lokasi?: string;
}

interface AdminDesilDashboardContentProps {
  roleTitle?: string;
  wilayah?: string;
  initialSubmissions?: SubmissionRow[];
  initialCounts?: {
    total: number;
    perluVerifikasi: number;
    disetujui: number;
    ditolak: number;
  };
  canApprove?: boolean;
}

const DESIL_CRITERIA = [
  {
    level: 1,
    badgeColor: "bg-red-600 text-white",
    persen: "10% terbawah",
    kategori: "Sangat Miskin / Miskin Ekstrem",
  },
  {
    level: 2,
    badgeColor: "bg-orange-500 text-white",
    persen: "11–20% terbawah",
    kategori: "Kategori Miskin",
  },
  {
    level: 3,
    badgeColor: "bg-amber-500 text-white",
    persen: "21–30% terbawah",
    kategori: "Hampir Miskin",
  },
  {
    level: 4,
    badgeColor: "bg-yellow-500 text-slate-900",
    persen: "31–40% terbawah",
    kategori: "Rentan Miskin",
  },
  {
    level: 5,
    badgeColor: "bg-lime-600 text-white",
    persen: "41–50% terbawah",
    kategori: "Menengah Transisi (Penyangga)",
  },
  {
    level: 6,
    badgeColor: "bg-emerald-600 text-white",
    persen: "51–60%",
    kategori: "Kategori Menengah",
  },
  {
    level: 7,
    badgeColor: "bg-teal-600 text-white",
    persen: "61–70%",
    kategori: "Kategori Menengah",
  },
  {
    level: 8,
    badgeColor: "bg-cyan-600 text-white",
    persen: "71–80%",
    kategori: "Menengah Atas",
  },
  {
    level: 9,
    badgeColor: "bg-blue-600 text-white",
    persen: "81–90%",
    kategori: "Mampu / Sejahtera",
  },
  {
    level: 10,
    badgeColor: "bg-[#1b3a6b] text-white",
    persen: "10% teratas",
    kategori: "Kesejahteraan Paling Tinggi",
  },
];

export function AdminDesilDashboardContent({
  roleTitle = "Admin Kecamatan & Kota",
  wilayah = "Kota Surabaya",
  initialSubmissions,
  initialCounts,
  canApprove: propCanApprove,
}: AdminDesilDashboardContentProps) {
  const router = useRouter();
  const [liveWilayah, setLiveWilayah] = useState(wilayah);

  const roleLower = (roleTitle || "").toLowerCase();
  const isKecamatanOrKota =
    roleLower.includes("kecamatan") || roleLower.includes("kota");
  const canApprove =
    propCanApprove !== undefined ? propCanApprove : !isKecamatanOrKota;

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

  const [submissions, setSubmissions] = useState<SubmissionRow[]>(() => {
    if (initialSubmissions && initialSubmissions.length > 0) {
      return initialSubmissions;
    }
    return [
      {
        id: "1",
        nomor: "DSL-2026-000124",
        nama: "Ahmad Fauzi",
        desilSaatIni: "Desil 4",
        desilDiajukan: 2,
        statusBadge: "Perlu Diperbarui",
        statusRaw: "menunggu_verifikasi",
        tanggal: "29 Mei 2026\n10:23 WIB",
        initial: "A",
        bgInitial: "bg-[#DCFCE7]",
        textInitial: "text-[#16A34A]",
        pekerjaan: "Tidak Bekerja",
        pendapatan: "Rp 1.000.000",
        alasan: "Kondisi ekonomi menurun & pemutusan kerja",
        housePhoto: "/sample-house.png",
        lokasi: `${wilayah} (Geotag Valid Terdeteksi)`,
      },
      {
        id: "2",
        nomor: "DSL-2026-000125",
        nama: "Rian Firmansyah",
        desilSaatIni: "Desil 4",
        desilDiajukan: 2,
        statusBadge: "Perlu Diperbarui",
        statusRaw: "menunggu_verifikasi",
        tanggal: "29 Mei 2026\n10:23 WIB",
        initial: "R",
        bgInitial: "bg-[#DBEAFE]",
        textInitial: "text-[#2563EB]",
        pekerjaan: "Buruh Harian Lepas",
        pendapatan: "Rp 900.000",
        alasan: "Penurunan penghasilan bulanan",
        housePhoto: "/sample-house.png",
        lokasi: `${wilayah} (Geotag Valid)`,
      },
      {
        id: "3",
        nomor: "DSL-2026-000126",
        nama: "Anisa Ramadhani",
        desilSaatIni: "Desil 4",
        desilDiajukan: 3,
        statusBadge: "Perlu Diperbarui",
        statusRaw: "menunggu_verifikasi",
        tanggal: "29 Mei 2026\n10:23 WIB",
        initial: "A",
        bgInitial: "bg-[#FEF3C7]",
        textInitial: "text-[#D97706]",
        pekerjaan: "Ibu Rumah Tangga",
        pendapatan: "Rp 750.000",
        alasan: "Tanggungan anak sekolah bertambah",
        housePhoto: "/sample-house.png",
        lokasi: `${wilayah} (Geotag Valid)`,
      },
    ];
  });

  const [counts, setCounts] = useState(() => {
    if (initialCounts) return initialCounts;
    const total = submissions.length;
    const perluVerifikasi = submissions.filter(
      (r) => r.statusRaw === "menunggu_verifikasi" || r.statusRaw === "diproses"
    ).length;
    return {
      total: total || 24,
      perluVerifikasi: perluVerifikasi || 24,
      disetujui: 0,
      ditolak: 0,
    };
  });

  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRow | null>(null);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    const targetDesil = selectedSubmission?.desilDiajukan || 2;
    try {
      await updateDesilSubmissionStatusAction({
        id,
        status: "disetujui",
        desilHasil: targetDesil,
      });

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                statusBadge: `Disetujui (Desil ${targetDesil})`,
                statusRaw: "disetujui",
              }
            : item
        )
      );

      setCounts((prev) => ({
        ...prev,
        perluVerifikasi: Math.max(0, prev.perluVerifikasi - 1),
        disetujui: prev.disetujui + 1,
      }));

      setSuccessFeedback(
        `Pengajuan peninjauan desil #${selectedSubmission?.nomor} telah disetujui (Desil ${targetDesil}) dan tersimpan ke DTKS!`
      );

      setTimeout(() => {
        setSelectedSubmission(null);
        setSuccessFeedback(null);
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
      await updateDesilSubmissionStatusAction({
        id,
        status: "ditolak",
        catatan: "Belum memenuhi kriteria peninjauan desil.",
      });

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, statusBadge: "Ditolak", statusRaw: "ditolak" }
            : item
        )
      );

      setCounts((prev) => ({
        ...prev,
        perluVerifikasi: Math.max(0, prev.perluVerifikasi - 1),
        ditolak: prev.ditolak + 1,
      }));

      setSuccessFeedback(`Pengajuan #${selectedSubmission?.nomor} ditolak.`);

      setTimeout(() => {
        setSelectedSubmission(null);
        setSuccessFeedback(null);
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
              Dashboard Desil
            </h1>
            <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              {roleTitle}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
            Selamat datang, Petugas. Berikut ringkasan pengajuan peninjauan desil wilayah {liveWilayah}
          </p>
        </div>
      </div>

      {/* ── Section 1: Ringkasan Pengajuan ── */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          Ringkasan Pengajuan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          {/* Left Card: 24 Pengajuan Masuk */}
          <div className="md:col-span-4 bg-white dark:bg-slate-800 rounded-2xl border border-blue-200/90 dark:border-slate-700 shadow-2xs p-4 flex flex-col justify-between">
            <div className="flex items-center gap-3.5">
              {/* Circular Inbox Icon */}
              <div className="w-12 h-12 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center flex-shrink-0 border border-blue-200 shadow-xs">
                <Inbox size={24} strokeWidth={2.2} />
              </div>

              <div>
                <span className="text-2xl font-black text-gray-900 dark:text-white leading-none block">
                  {counts.total}
                </span>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5 block">
                  Pengajuan Masuk
                </span>
              </div>
            </div>

            <div className="mt-3.5 pt-2 border-t border-gray-100 dark:border-slate-700/60">
              <span className="inline-block bg-[#E0F2FE] text-[#0284C7] dark:bg-sky-950/50 dark:text-sky-300 text-[11px] font-semibold px-3 py-0.5 rounded-full border border-sky-200/60">
                Perlu diperbarui
              </span>
            </div>
          </div>

          {/* Right Card: Klasifikasi Desil 1-10 */}
          <div className="md:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700 shadow-2xs p-3.5 sm:p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  Klasifikasi Desil 1–10
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold">
                  Tingkat Kesejahteraan (DTKS)
                </span>
              </div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:inline">
                Skala 1 (Terendah) s.d. 10 (Tertinggi)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
              {DESIL_CRITERIA.map((item) => (
                <div
                  key={item.level}
                  className="flex items-center gap-2 p-1.5 px-2 rounded-xl bg-gray-50/80 dark:bg-slate-700/30 border border-gray-100 dark:border-slate-700/60 text-left"
                >
                  <span
                    className={`w-6 h-6 rounded-lg ${item.badgeColor} flex items-center justify-center font-bold text-[11px] shrink-0 shadow-2xs`}
                  >
                    {item.level}
                  </span>
                  <div className="min-w-0 flex-1 leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-gray-900 dark:text-white">
                        Desil {item.level}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        ({item.persen})
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium truncate">
                      {item.kategori}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Pengajuan Terbaru ── */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
          Pengajuan Terbaru
        </h2>

        {/* Table / List Container */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700 shadow-2xs divide-y divide-gray-200/80 dark:divide-slate-700 overflow-hidden">
          {submissions.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/70 dark:hover:bg-slate-700/40 transition-colors"
            >
              {/* Left Column: Avatar + Details */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Circular Initial Avatar */}
                <div
                  className={`w-10 h-10 rounded-full ${item.bgInitial} ${item.textInitial} flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-2xs select-none`}
                >
                  {item.initial}
                </div>

                {/* Citizen Details */}
                <div className="min-w-0">
                  <span className="text-[11px] font-mono font-medium text-gray-500 dark:text-gray-400 block leading-tight">
                    {item.nomor}
                  </span>
                  <h3 className="text-xs md:text-sm font-bold text-gray-900 dark:text-white leading-snug truncate">
                    {item.nama}
                  </h3>
                  <span className="text-[11px] text-gray-600 dark:text-gray-300 leading-none">
                    Desil saat ini : {item.desilSaatIni}
                  </span>
                </div>
              </div>

              {/* Middle & Right Column: Status Badge, Date, and Action */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pl-13 sm:pl-0">
                {/* Status Badge */}
                <span className="inline-block bg-[#E0F2FE] text-[#0284C7] dark:bg-sky-950/60 dark:text-sky-300 text-[11px] font-semibold px-3 py-1 rounded-full border border-sky-200/70 whitespace-nowrap">
                  {item.statusBadge}
                </span>

                {/* Date & Time */}
                <div className="text-right text-[11px] text-gray-600 dark:text-gray-400 leading-tight whitespace-nowrap hidden md:block">
                  <div>29 Mei 2026</div>
                  <div className="text-gray-500">10:23 WIB</div>
                </div>

                {/* Action Button: [ Lihat ] */}
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

      {/* ── Modal Detail Verifikasi Pengajuan Warga ── */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-xl shadow-2xl border border-gray-200 dark:border-slate-700 p-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-3 mb-4">
              <div>
                <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400">
                  {selectedSubmission.nomor}
                </span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Tinjauan Pengajuan Desil: {selectedSubmission.nama}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {successFeedback && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check size={16} />
                <span>{successFeedback}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Foto Rumah Live Camera */}
              <div>
                <span className="font-bold text-gray-900 dark:text-white block mb-2">
                  Foto Kondisi Rumah (Live Camera &amp; Geotagging):
                </span>
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-gray-300 dark:border-slate-700 shadow-sm bg-gray-100 dark:bg-slate-900">
                  <Image
                    src={selectedSubmission.housePhoto || "/sample-house.png"}
                    alt="Foto Kondisi Rumah Warga"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 text-[#1e40af] px-3 py-1 rounded-full shadow text-[11px] font-semibold flex items-center gap-1 border border-blue-100">
                    <MapPin size={12} className="text-[#2563eb]" />
                    <span>Lokasi Terdeteksi</span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white p-2 rounded-lg text-[10px] flex items-center justify-between">
                    <span>📍 {selectedSubmission.lokasi}</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Camera size={11} /> Terverifikasi
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Detail Ringkas */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                <div>
                  <span className="text-gray-500 block">Nama Warga</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {selectedSubmission.nama}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Pekerjaan</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedSubmission.pekerjaan}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Desil Saat Ini</span>
                  <span className="font-bold text-amber-600">
                    {selectedSubmission.desilSaatIni}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Rekomendasi Desil Baru</span>
                  <span className="font-black text-emerald-600 text-sm">
                    Desil 2
                  </span>
                </div>
              </div>

              {/* Alasan */}
              <div className="p-3 rounded-xl border border-gray-200 dark:border-slate-700">
                <span className="font-bold text-gray-900 dark:text-white block mb-1">
                  Alasan Peninjauan:
                </span>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedSubmission.alasan}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer disabled:opacity-50"
                >
                  Tutup
                </button>
                {canApprove && (
                  <>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleReject(selectedSubmission.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      <span>Tolak Pengajuan</span>
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
                        <FileText size={14} />
                      )}
                      <span>
                        Setujui Peninjauan Desil (Ubah ke Desil {selectedSubmission.desilDiajukan || 2})
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

