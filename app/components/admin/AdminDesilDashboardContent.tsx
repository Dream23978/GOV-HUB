"use client";

import React, { useMemo, useState } from "react";
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
  SearchCheck,
} from "lucide-react";
import { updateDesilSubmissionStatusAction } from "@/app/actions/admin";
import { getDesilBadgeClass, useLiveDesilSync } from "@/lib/hooks/useLiveDesilSync";

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

import { DESIL_TIERS } from "@/lib/desil";

const DESIL_CRITERIA = DESIL_TIERS;

export function AdminDesilDashboardContent({
  roleTitle = "Admin Kecamatan & Kota",
  wilayah = "Kota Surabaya",
  initialSubmissions,
  canApprove: propCanApprove,
}: AdminDesilDashboardContentProps) {
  const router = useRouter();
  const liveWilayah = wilayah;

  const roleLower = (roleTitle || "").toLowerCase();
  const isKecamatanOrKota =
    roleLower.includes("kecamatan") || roleLower.includes("kota");
  const canApprove =
    propCanApprove !== undefined ? propCanApprove : !isKecamatanOrKota;

  const [submissions, setSubmissions] = useState<SubmissionRow[]>(() => {
    return initialSubmissions ?? [];
  });

  React.useEffect(() => {
    if (initialSubmissions) {
      setSubmissions(initialSubmissions);
    }
  }, [initialSubmissions]);

  const counts = useMemo(() => {
    const total = submissions.length;
    const perluVerifikasi = submissions.filter(
      (r) => r.statusRaw === "menunggu_verifikasi" || r.statusRaw === "diproses"
    ).length;
    const disetujui = submissions.filter((r) => r.statusRaw === "disetujui").length;
    const ditolak = submissions.filter((r) => r.statusRaw === "ditolak").length;
    return {
      total,
      perluVerifikasi,
      disetujui,
      ditolak,
    };
  }, [submissions]);

  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRow | null>(null);
  const [targetDesilInput, setTargetDesilInput] = useState<number>(2);
  const [catatanInput, setCatatanInput] = useState<string>("");
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { syncNow } = useLiveDesilSync<SubmissionRow>(
    (rows) => rows,
    (synced) => {
      setSubmissions(synced);
      setSelectedSubmission((prev) =>
        prev ? synced.find((item) => item.id === prev.id) ?? prev : null
      );
    }
  );

  const openSubmissionModal = (item: SubmissionRow) => {
    setSelectedSubmission(item);
    setTargetDesilInput(item.desilDiajukan || 2);
    setCatatanInput("");
    setSuccessFeedback(null);
    setErrorFeedback(null);
  };

  const handleProcessFieldCheck = async (id: string) => {
    setIsProcessing(true);
    setErrorFeedback(null);
    setSuccessFeedback(null);
    try {
      const res = await updateDesilSubmissionStatusAction({
        id,
        status: "diproses",
        catatan:
          catatanInput.trim() ||
          `Foto rumah & kondisi warga telah diverifikasi admin (${roleTitle}). Dilanjutkan ke pengecekan lapangan.`,
      });

      if (!res.success) {
        setErrorFeedback(res.error || "Gagal memproses pengajuan desil.");
        return;
      }

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                statusBadge: "Sedang Diverifikasi",
                statusRaw: "diproses",
              }
            : item
        )
      );

      setSuccessFeedback(
        `Pengajuan #${selectedSubmission?.nomor} ditandai sedang diverifikasi & dicek lapangan.`
      );
      await syncNow();
      router.refresh();
    } catch (err) {
      console.error(err);
      setErrorFeedback("Terjadi kesalahan jaringan saat memproses pengajuan.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    setErrorFeedback(null);
    setSuccessFeedback(null);
    const targetDesil = targetDesilInput || selectedSubmission?.desilDiajukan || 2;
    try {
      const res = await updateDesilSubmissionStatusAction({
        id,
        status: "disetujui",
        desilHasil: targetDesil,
        catatan:
          catatanInput.trim() ||
          `Pengajuan peninjauan desil disetujui oleh ${roleTitle} ke Desil ${targetDesil}.`,
      });

      if (!res.success) {
        setErrorFeedback(res.error || "Gagal menyetujui pengajuan desil.");
        return;
      }

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

      setSuccessFeedback(
        `Pengajuan peninjauan desil #${selectedSubmission?.nomor} telah disetujui (Desil ${targetDesil}) dan tersimpan ke DTKS!`
      );

      await syncNow();
      router.refresh();

      setTimeout(() => {
        setSelectedSubmission(null);
        setSuccessFeedback(null);
      }, 1300);
    } catch (err) {
      console.error(err);
      setErrorFeedback("Terjadi kesalahan saat menyetujui pengajuan.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    setIsProcessing(true);
    setErrorFeedback(null);
    setSuccessFeedback(null);
    try {
      const res = await updateDesilSubmissionStatusAction({
        id,
        status: "ditolak",
        catatan: catatanInput.trim() || "Belum memenuhi kriteria peninjauan desil.",
      });

      if (!res.success) {
        setErrorFeedback(res.error || "Gagal menolak pengajuan desil.");
        return;
      }

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, statusBadge: "Ditolak", statusRaw: "ditolak" }
            : item
        )
      );

      setSuccessFeedback(`Pengajuan #${selectedSubmission?.nomor} ditolak.`);

      await syncNow();
      router.refresh();

      setTimeout(() => {
        setSelectedSubmission(null);
        setSuccessFeedback(null);
      }, 1300);
    } catch (err) {
      console.error(err);
      setErrorFeedback("Terjadi kesalahan saat menolak pengajuan.");
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
          className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-300 dark:border-slate-600 flex items-center justify-center text-gray-700 dark:text-gray-200 mt-0.5 cursor-pointer shadow-sm transition-colors"
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
          <div className="md:col-span-4 bg-white dark:bg-slate-800 rounded-2xl border border-blue-200/90 dark:border-slate-700 shadow-sm p-4 flex flex-col justify-between">
            <div className="flex items-center gap-3.5">
              {/* Circular Inbox Icon */}
              <div className="w-12 h-12 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center flex-shrink-0 border border-blue-200 shadow-sm">
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
                Perlu Verifikasi: {counts.perluVerifikasi}
              </span>
            </div>
          </div>

          {/* Right Card: Klasifikasi Desil 1-10 */}
          <div className="md:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700 shadow-sm p-3.5 sm:p-4 flex flex-col justify-between">
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
                    className={`w-6 h-6 rounded-lg ${item.badgeColor} flex items-center justify-center font-bold text-[11px] shrink-0 shadow-sm`}
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
                    <p className="text-[11px] text-gray-700 dark:text-gray-200 font-semibold truncate">
                      {item.kategori}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                      {item.deskripsi}
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
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700 shadow-sm divide-y divide-gray-200/80 dark:divide-slate-700 overflow-hidden">
          {submissions.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500 dark:text-gray-400">
              Belum ada pengajuan peninjauan desil di database.
            </div>
          ) : submissions.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/70 dark:hover:bg-slate-700/40 transition-colors"
            >
              {/* Left Column: Avatar + Details */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Circular Initial Avatar */}
                <div
                  className={`w-10 h-10 rounded-full ${item.bgInitial} ${item.textInitial} flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm select-none`}
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
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pl-0">
                {/* Status Badge */}
                <span
                  className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full border whitespace-nowrap ${getDesilBadgeClass(
                    item.statusRaw
                  )}`}
                >
                  {item.statusBadge}
                </span>

                {/* Date & Time */}
                <div className="text-right text-[11px] text-gray-600 dark:text-gray-400 leading-tight whitespace-pre-line hidden md:block">
                  {item.tanggal || "-"}
                </div>

                {/* Action Button: [ Lihat ] */}
                <button
                  type="button"
                  onClick={() => openSubmissionModal(item)}
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
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
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

            {errorFeedback && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-300 text-xs font-semibold flex items-center gap-2">
                <XCircle size={16} />
                <span>{errorFeedback}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Foto Rumah Live Camera */}
              <div>
                <span className="font-bold text-gray-900 dark:text-white block mb-2">
                  Foto Kondisi Rumah (Live Camera &amp; Geotagging):
                </span>
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-gray-300 dark:border-slate-700 shadow-sm bg-gray-100 dark:bg-slate-900">
                  {selectedSubmission.housePhoto ? (
                    <>
                      <Image
                        src={selectedSubmission.housePhoto}
                        alt="Foto Kondisi Rumah Warga"
                        fill
                        unoptimized
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
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4 text-center">
                      <Camera size={24} className="mb-1.5 opacity-60" />
                      <span className="text-xs font-medium">Belum ada foto kondisi rumah</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Detail Ringkas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                <div>
                  <span className="text-gray-500 block">Nama Warga</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {selectedSubmission.nama}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Pekerjaan</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedSubmission.pekerjaan || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Desil Saat Ini</span>
                  <span className="font-bold text-amber-600">
                    {selectedSubmission.desilSaatIni || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Rekomendasi Desil Baru</span>
                  <span className="font-black text-emerald-600 text-sm">
                    Desil {selectedSubmission.desilDiajukan || "-"}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-500 block">Status Saat Ini</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {selectedSubmission.statusBadge}
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

              {/* Catatan Verifikasi & Penentuan Desil */}
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-700">
                {canApprove && (
                  <div>
                    <label
                      htmlFor="admin-desil-target"
                      className="font-bold text-gray-900 dark:text-white block mb-1"
                    >
                      Tetapkan Desil Hasil:
                    </label>
                    <select
                      id="admin-desil-target"
                      value={targetDesilInput}
                      onChange={(e) => setTargetDesilInput(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-gray-800 dark:text-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                        <option key={level} value={level}>
                          Desil {level}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label
                    htmlFor="admin-desil-catatan"
                    className="font-bold text-gray-900 dark:text-white block mb-1"
                  >
                    Catatan Pemeriksaan Admin (Opsional):
                  </label>
                  <textarea
                    id="admin-desil-catatan"
                    rows={2}
                    value={catatanInput}
                    onChange={(e) => setCatatanInput(e.target.value)}
                    placeholder="Tulis hasil pengecekan foto rumah, kondisi keluarga, atau alasan keputusan..."
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-gray-800 dark:text-white resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer disabled:opacity-50"
                >
                  Tutup
                </button>
                {selectedSubmission.statusRaw === "menunggu_verifikasi" && (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleProcessFieldCheck(selectedSubmission.id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <SearchCheck size={14} />
                    )}
                    <span>Proses &amp; Cek Lapangan</span>
                  </button>
                )}
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
                        Setujui (Desil {targetDesilInput || selectedSubmission.desilDiajukan || 2})
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

