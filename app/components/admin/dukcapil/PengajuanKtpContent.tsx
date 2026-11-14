"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Search,
  ChevronDown,
  Calendar,
  Download,
  X,
  CheckCircle2,
  Check,
  XCircle,
  Loader2,
} from "lucide-react";
import { updateKtpSubmissionStatusAction } from "@/app/actions/admin";
import { broadcastSync } from "@/app/components/AutoRefresh";

export interface PengajuanKtpRow {
  id: string;
  noPengajuan: string;
  nomorRegistrasi: string;
  pemohon: string;
  lokasi: string;
  alamatLengkap: string;
  jenis: string;
  status: "Proses" | "Perekaman Biometrik" | "Menunggu Cetak" | "KTP Selesai" | "Ditolak" | "Pengajuan Ulang";
  tanggal: string;
  nik: string;
  tanggalLahir?: string;
  statusKtp?: string;
  noHp?: string;
  alasan?: string;
  verifikasiNik?: string;
  verifikasiKk?: string;
  statusPenduduk?: string;
  usia?: string;
  alasanPenolakan?: string;
  tahapan: {
    biometrik: boolean;
    cetak: boolean;
    selesai: boolean;
  };
}

interface PengajuanKtpContentProps {
  wilayah?: string;
  initialSubmissions?: PengajuanKtpRow[];
  canManageBlangko?: boolean;
  canApprove?: boolean;
  canManageTracking?: boolean;
  adminLevel?: "pusat" | "kota" | "kecamatan";
}

export function PengajuanKtpContent({
  initialSubmissions,
  canManageBlangko = true,
  canApprove = true,
  canManageTracking = false,
  adminLevel = "pusat",
}: PengajuanKtpContentProps) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedKota, setSelectedKota] = useState("all");
  const [selectedKecamatan, setSelectedKecamatan] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<PengajuanKtpRow | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // State Ketersediaan Blangko KTP (Default: Tersedia, Stok: 10.000)
  const [blangkoStatus, setBlangkoStatus] = useState<"tersedia" | "habis">("tersedia");
  const [blangkoStock, setBlangkoStock] = useState<number>(10000);
  const [showBlangkoDropdown, setShowBlangkoDropdown] = useState<boolean>(true);

  // State Penolakan dengan Alasan
  const [showRejectInput, setShowRejectInput] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [submissions, setSubmissions] = useState<PengajuanKtpRow[]>(() => {
    return initialSubmissions ?? [];
  });

  useEffect(() => {
    if (initialSubmissions) {
      setSubmissions(initialSubmissions);
      setSelectedSubmission((prev) =>
        prev ? initialSubmissions.find((item) => item.id === prev.id) ?? prev : null
      );
    }
  }, [initialSubmissions]);

  // Filtered list
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      // Status Filter
      if (selectedStatus !== "all" && item.status !== selectedStatus) {
        return false;
      }

      // Kota Filter (Admin Pusat)
      if (adminLevel === "pusat" && selectedKota !== "all") {
        if (!item.lokasi.toLowerCase().includes(selectedKota.toLowerCase())) return false;
      }

      // Kecamatan Filter (Admin Pusat & Admin Kota)
      if ((adminLevel === "pusat" || adminLevel === "kota") && selectedKecamatan !== "all") {
        if (!item.lokasi.toLowerCase().includes(selectedKecamatan.toLowerCase())) return false;
      }

      // Date Filter
      if (selectedDate && item.tanggal !== selectedDate) {
        return false;
      }

      // Search Filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = item.pemohon.toLowerCase().includes(q);
        const matchNik = item.nik.toLowerCase().includes(q);
        const matchNo = item.noPengajuan.toLowerCase().includes(q);
        const matchReg = item.nomorRegistrasi.toLowerCase().includes(q);
        if (!matchName && !matchNik && !matchNo && !matchReg) return false;
      }

      return true;
    });
  }, [submissions, selectedStatus, selectedKota, selectedKecamatan, adminLevel, selectedDate, searchQuery]);

  // Handle Setujui Pengajuan KTP
  const handleApproveSubmission = async (id: string) => {
    const target = submissions.find((s) => s.id === id);
    if (!target) return;

    setIsProcessing(true);
    try {
      const res = await updateKtpSubmissionStatusAction({
        id,
        status: "diproses",
        catatan: "Berkas disetujui dan dilanjutkan ke tahap perekaman biometrik.",
      });
      if (!res.success) {
        throw new Error(res.error || "Gagal menyetujui pengajuan");
      }

      if (blangkoStatus === "tersedia") {
        setBlangkoStock((prev) => Math.max(0, prev - 1));
      }

      setSubmissions((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              status: "Perekaman Biometrik",
              tahapan: { biometrik: true, cetak: true, selesai: false },
            };
          }
          return item;
        })
      );

      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission({
          ...selectedSubmission,
          status: "Perekaman Biometrik",
          tahapan: { biometrik: true, cetak: true, selesai: false },
        });
      }

      const sisa = blangkoStatus === "tersedia" ? blangkoStock - 1 : 0;
      setNotification(
        blangkoStatus === "tersedia"
          ? `Pengajuan KTP ${target.pemohon} disetujui! 1 blangko KTP dialokasikan (Sisa stok: ${sisa.toLocaleString("id-ID")}).`
          : `Pengajuan KTP ${target.pemohon} disetujui dan dimasukkan ke antrean cetak (Stok blangko saat ini sedang habis).`
      );
      broadcastSync();
      router.refresh();

      setTimeout(() => {
        setSelectedSubmission(null);
        setShowRejectInput(false);
        setRejectReason("");
      }, 900);
    } catch (err) {
      console.error(err);
      setNotification(`Gagal menyetujui pengajuan KTP: ${err instanceof Error ? err.message : "Kesalahan server"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Perekaman Biometrik Selesai -> Menunggu Cetak
  const handleCompleteBiometric = async (id: string) => {
    const target = submissions.find((s) => s.id === id);
    if (!target) return;

    setIsProcessing(true);
    try {
      const res = await updateKtpSubmissionStatusAction({
        id,
        status: "menunggu_cetak",
        catatan: "Perekaman biometrik selesai, menunggu proses cetak KTP.",
      });

      if (!res.success) {
        throw new Error(res.error || "Gagal memperbarui status");
      }

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "Menunggu Cetak",
                tahapan: { biometrik: true, cetak: true, selesai: false },
              }
            : item
        )
      );

      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission({
          ...selectedSubmission,
          status: "Menunggu Cetak",
          tahapan: { biometrik: true, cetak: true, selesai: false },
        });
      }

      setNotification(`Perekaman biometrik ${target.pemohon} selesai. Status diubah menjadi Menunggu Cetak.`);
      broadcastSync();
      router.refresh();
      setTimeout(() => {
        setSelectedSubmission(null);
      }, 900);
    } catch (err) {
      console.error(err);
      setNotification(`Gagal memperbarui status: ${err instanceof Error ? err.message : "Kesalahan server"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle KTP Selesai Dicetak (khusus Admin Kota)
  const handleCompleteKtp = async (id: string) => {
    const target = submissions.find((s) => s.id === id);
    if (!target) return;

    setIsProcessing(true);
    try {
      const res = await updateKtpSubmissionStatusAction({
        id,
        status: "selesai",
        catatan: "KTP-el selesai dicetak dan siap diambil.",
      });

      if (!res.success) {
        throw new Error(res.error || "Gagal memperbarui status");
      }

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "KTP Selesai",
                tahapan: { biometrik: true, cetak: true, selesai: true },
              }
            : item
        )
      );

      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission({
          ...selectedSubmission,
          status: "KTP Selesai",
          tahapan: { biometrik: true, cetak: true, selesai: true },
        });
      }

      setNotification(`KTP ${target.pemohon} telah selesai dicetak.`);
      broadcastSync();
      router.refresh();
      setTimeout(() => {
        setSelectedSubmission(null);
      }, 900);
    } catch (err) {
      console.error(err);
      setNotification(`Gagal memperbarui status: ${err instanceof Error ? err.message : "Kesalahan server"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Konfirmasi Tolak Pengajuan KTP dengan Alasan
  const handleConfirmReject = async (id: string) => {
    if (!rejectReason.trim()) return;

    const target = submissions.find((s) => s.id === id);
    if (!target) return;

    setIsProcessing(true);
    try {
      const res = await updateKtpSubmissionStatusAction({
        id,
        status: "ditolak",
        catatan: rejectReason.trim(),
      });
      if (!res.success) {
        throw new Error(res.error || "Gagal menolak pengajuan");
      }

      setSubmissions((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              status: "Ditolak",
              alasanPenolakan: rejectReason.trim(),
            };
          }
          return item;
        })
      );

      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission({
          ...selectedSubmission,
          status: "Ditolak",
          alasanPenolakan: rejectReason.trim(),
        });
      }

      setNotification(
        `Pengajuan KTP ${target.pemohon} telah ditolak dengan alasan: "${rejectReason.trim()}".`
      );
      broadcastSync();
      router.refresh();

      setTimeout(() => {
        setSelectedSubmission(null);
        setShowRejectInput(false);
        setRejectReason("");
      }, 900);
    } catch (err) {
      console.error(err);
      setNotification(`Gagal menolak pengajuan: ${err instanceof Error ? err.message : "Kesalahan server"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["No Pengajuan", "No Registrasi", "Nama Pemohon", "Lokasi", "Jenis", "Status", "Tanggal", "NIK"];
    const rows = filteredSubmissions.map((s) => [
      s.noPengajuan,
      s.nomorRegistrasi,
      `"${s.pemohon}"`,
      `"${s.lokasi}"`,
      s.jenis,
      s.status,
      s.tanggal,
      `'${s.nik}`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `data_pengajuan_ktp_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotification("Data pengajuan berhasil diekspor ke file CSV!");
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="flex flex-col w-full pb-10 select-none">
      {/* ── Page Header: Back Arrow, Title "Pengajuan KTP", Subtitle ── */}
      <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1 -ml-1 text-gray-800 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer mt-0.5"
          aria-label="Kembali"
        >
          <ChevronLeft size={28} strokeWidth={2.2} />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            Pengajuan KTP
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-0.5">
            Kelola dan pantau pengajuan KTP warga secara langsung.
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Search Bar (Cari NIK / Nama) ── */}
      <div className="relative w-full mb-3">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-800 font-bold pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari NIK / Nama"
          aria-label="Cari NIK atau Nama"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-400 bg-white text-xs sm:text-sm text-gray-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 font-medium"
        />
      </div>

      {/* ── Filter Controls Row: "Lokasi Daerah" + Black Buttons (Calendar, Download) ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 mb-4">
        {/* Left: Role-based Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter Status (Semua Admin) */}
          <div className="relative w-full sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 pr-8 rounded-lg border border-gray-400 bg-white text-xs sm:text-sm text-gray-900 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            >
              <option value="all">Semua Status</option>
              <option value="Proses">Proses</option>
              <option value="Perekaman Biometrik">Perekaman Biometrik</option>
              <option value="Menunggu Cetak">Menunggu Cetak</option>
              <option value="KTP Selesai">KTP Selesai</option>
              <option value="Ditolak">Ditolak</option>
              <option value="Pengajuan Ulang">Pengajuan Ulang</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
            />
          </div>

          {/* Filter Kota (Khusus Admin Pusat) */}
          {adminLevel === "pusat" && (
            <div className="relative w-full sm:w-48">
              <select
                value={selectedKota}
                onChange={(e) => setSelectedKota(e.target.value)}
                className="w-full px-3 py-2 pr-8 rounded-lg border border-gray-400 bg-white text-xs sm:text-sm text-gray-900 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              >
                <option value="all">Semua Kota</option>
                {Array.from(
                  new Set(submissions.map((s) => s.lokasi).filter((l) => Boolean(l) && l !== "-"))
                ).map((loc) => (
                  <option key={`kota-${loc}`} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
              />
            </div>
          )}

          {/* Filter Kecamatan (Admin Pusat & Admin Kota) */}
          {(adminLevel === "pusat" || adminLevel === "kota") && (
            <div className="relative w-full sm:w-52">
              <select
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
                className="w-full px-3 py-2 pr-8 rounded-lg border border-gray-400 bg-white text-xs sm:text-sm text-gray-900 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              >
                <option value="all">Semua Kecamatan</option>
                {Array.from(
                  new Set(submissions.map((s) => s.lokasi).filter((l) => Boolean(l) && l !== "-"))
                ).map((loc) => (
                  <option key={`kec-${loc}`} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
              />
            </div>
          )}
        </div>

        {/* Right: Black Rounded Filter Buttons (Calendar & Download) */}
        <div className="flex items-center gap-2 justify-end">
          {/* Date Filter Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDatePicker((prev) => !prev)}
              title="Filter Tanggal"
              className={`bg-black hover:bg-gray-800 active:scale-95 text-white px-5 py-2 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                selectedDate ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <Calendar size={18} />
            </button>

            {showDatePicker && (
              <div className="absolute right-0 top-full mt-2 z-30 bg-white border border-gray-300 rounded-xl shadow-xl p-3 w-64 animate-in fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-800">Pilih Tanggal</span>
                  {selectedDate && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDate("");
                        setShowDatePicker(false);
                      }}
                      className="text-[10px] text-red-600 hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setShowDatePicker(false);
                  }}
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:outline-blue-500"
                />
              </div>
            )}
          </div>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            title="Download CSV"
            className="bg-black hover:bg-gray-800 active:scale-95 text-white px-5 py-2 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Header */}
            <thead>
              <tr className="bg-[#0084FF] text-white text-xs sm:text-sm">
                <th className="py-3 px-4 font-bold tracking-tight">No Pengajuan</th>
                <th className="py-3 px-4 font-bold tracking-tight">Pemohonan</th>
                <th className="py-3 px-4 font-bold tracking-tight">Jenis</th>
                <th className="py-3 px-4 font-bold tracking-tight text-center">Status</th>
                <th className="py-3 px-4 font-bold tracking-tight text-center">Tanggal</th>
                <th className="py-3 px-4 font-bold tracking-tight text-center">Aksi</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 font-medium">
                    Tidak ada data pengajuan yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50/40 transition-colors bg-white"
                  >
                    {/* No Pengajuan */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="font-bold text-gray-900 leading-tight">
                        {row.noPengajuan}
                      </div>
                      <div className="text-[11px] sm:text-xs text-gray-600 font-mono mt-0.5">
                        {row.nomorRegistrasi}
                      </div>
                    </td>

                    {/* Pemohonan */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="font-bold text-gray-900 leading-tight">
                        {row.pemohon}
                      </div>
                      <div className="text-[11px] sm:text-xs text-gray-600 mt-0.5">
                        {row.lokasi}
                      </div>
                    </td>

                    {/* Jenis */}
                    <td className="py-3.5 px-4 align-middle font-medium text-gray-800">
                      {row.jenis}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      <span
                        className={`inline-block font-semibold text-xs px-3.5 py-1 rounded-md shadow-2xs whitespace-nowrap ${
                          row.status === "Ditolak"
                            ? "bg-rose-100 text-rose-700"
                            : row.status === "KTP Selesai"
                            ? "bg-emerald-100 text-emerald-800"
                            : row.status === "Menunggu Cetak"
                            ? "bg-sky-100 text-sky-800"
                            : row.status === "Pengajuan Ulang"
                            ? "bg-slate-200 text-slate-700"
                            : "bg-[#FED7AA] text-[#C2410C]"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    {/* Tanggal */}
                    <td className="py-3.5 px-4 align-middle text-center text-gray-800 font-medium whitespace-nowrap">
                      {row.tanggal}
                    </td>

                    {/* Aksi Button */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      {row.status !== "Pengajuan Ulang" ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSubmission(row);
                            setShowRejectInput(false);
                            setRejectReason("");
                          }}
                          className="bg-black hover:bg-gray-800 active:scale-95 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs whitespace-nowrap"
                        >
                          Lihat Detail
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ── DETAIL MODAL KTP (100% SESUAI SCREENSHOT MOCKUP PENGGUNA) ── */}
      {/* ========================================================================= */}
      {selectedSubmission && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in"
        >
          <div className="bg-white dark:bg-[#101F3C] rounded-2xl w-full max-w-xl shadow-2xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Header Modal: Detail Pengajuan KTP KTP – 2026 – 001 */}
            <div className="flex items-center justify-between pb-2 mb-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base">
                <span className="font-extrabold text-slate-900 dark:text-white">
                  Detail Pengajuan KTP
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-300">
                  {selectedSubmission.noPengajuan}
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

            {/* 1. DATA PEMOHON */}
            <div className="space-y-1.5 mb-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Data Pemohon
              </h4>
              <div className="border border-slate-300 dark:border-white/15 rounded-xl p-3.5 space-y-1.5 text-xs sm:text-sm bg-white dark:bg-slate-900/40">
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Nama</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.pemohon}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">NIK</span>
                  <span className="text-slate-900 dark:text-white font-mono">{selectedSubmission.nik}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Tanggal Lahir</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.tanggalLahir || "-"}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Alamat</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.alamatLengkap || selectedSubmission.lokasi}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Status KTP</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.statusKtp || "-"}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">No HP</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.noHp || "-"}</span>
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
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.jenis}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Tanggal Pengajuan</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.tanggal}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Alasan</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedSubmission.alasan || "-"}</span>
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

            {/* 4. KETERSEDIAAN BLANGKO KTP (STATUS & STOK) - Hanya Kota & Pusat */}
            {canManageBlangko && (
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
            )}

            {/* Catatan Alasan Penolakan Jika Sudah Pernah Ditolak */}
            {selectedSubmission.status === "Ditolak" && selectedSubmission.alasanPenolakan && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs">
                <span className="font-bold text-rose-700 dark:text-rose-400 block mb-0.5">
                  Pengajuan Ini Telah Ditolak:
                </span>
                <p className="text-rose-600 dark:text-rose-300">
                  Alasan: {selectedSubmission.alasanPenolakan}
                </p>
              </div>
            )}

            {/* 5. FORM INPUT ALASAN PENOLAKAN (KETIK ALASAN) */}
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
                    onClick={() => handleConfirmReject(selectedSubmission.id)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    {isProcessing ? <Loader2 size={13} className="animate-spin" /> : null}
                    <span>Konfirmasi Tolak Pengajuan</span>
                  </button>
                </div>
              </div>
            )}

            {/* 6. ACTION BUTTONS: SETUJU & TOLAK PENGAJUAN */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedSubmission(null);
                  setShowRejectInput(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Tutup
              </button>

              {canApprove && !showRejectInput && selectedSubmission.status !== "Ditolak" && selectedSubmission.status !== "Pengajuan Ulang" && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setShowRejectInput(true)}
                  className="px-4 py-2 rounded-lg text-xs font-bold border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <XCircle size={14} />
                  <span>Tolak Pengajuan</span>
                </button>
              )}

              {canManageTracking && selectedSubmission.status === "Menunggu Cetak" && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleCompleteKtp(selectedSubmission.id)}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#15803D] hover:bg-[#166534] text-white transition-all shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} />}
                  <span>KTP Selesai</span>
                </button>
              )}

              {canManageTracking && selectedSubmission.status === "Perekaman Biometrik" && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleCompleteBiometric(selectedSubmission.id)}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#0E4FA8] hover:bg-[#0B3F88] text-white transition-all shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} />}
                  <span>Perekaman Selesai</span>
                </button>
              )}

              {canApprove && selectedSubmission.status !== "Ditolak" && selectedSubmission.status !== "Pengajuan Ulang" && selectedSubmission.status !== "Perekaman Biometrik" && selectedSubmission.status !== "Menunggu Cetak" && selectedSubmission.status !== "KTP Selesai" && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleApproveSubmission(selectedSubmission.id)}
                  className="px-6 py-2 rounded-lg text-xs font-bold bg-[#15803D] hover:bg-[#166534] text-white transition-all shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={15} />}
                  <span>Setujui Pengajuan</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
