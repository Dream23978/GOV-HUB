"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Search,
  ChevronDown,
  Calendar,
  Download,
  X,
  CheckCircle2,
  Printer,
  IdCard,
  User,
  MapPin,
  FileCheck,
} from "lucide-react";

export interface PengajuanKtpRow {
  id: string;
  noPengajuan: string;
  nomorRegistrasi: string;
  pemohon: string;
  lokasi: string;
  alamatLengkap: string;
  jenis: string;
  status: "Proses" | "Mencetak KTP" | "KTP Selesai";
  tanggal: string;
  nik: string;
  tahapan: {
    biometrik: boolean;
    cetak: boolean;
    selesai: boolean;
  };
}

interface PengajuanKtpContentProps {
  wilayah?: string;
}

export function PengajuanKtpContent({
  wilayah = "Kota Pontianak",
}: PengajuanKtpContentProps) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilayah, setSelectedWilayah] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<PengajuanKtpRow | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // 100% Match Mockup (Screenshot 1: Hapis Khirullah & Ahmed Slamed)
  const [submissions, setSubmissions] = useState<PengajuanKtpRow[]>([
    {
      id: "1",
      noPengajuan: "KTP - 2026 001",
      nomorRegistrasi: "043423423423",
      pemohon: "Hapis Khirullah",
      lokasi: "Pontianak",
      alamatLengkap: "Jl. Merdeka Barat No. 12, Kel. Tengah, Pontianak Kota",
      jenis: "KTP Baru",
      status: "Proses",
      tanggal: "02/09/2026",
      nik: "6104342342342301",
      tahapan: { biometrik: true, cetak: false, selesai: false },
    },
    {
      id: "2",
      noPengajuan: "KTP - 2026 002",
      nomorRegistrasi: "043423423423",
      pemohon: "Ahmed Slamed",
      lokasi: "Pontianak",
      alamatLengkap: "Jl. Gajah Mada No. 42, Kel. Benua Melayu Darat, Pontianak",
      jenis: "KTP Baru",
      status: "Proses",
      tanggal: "12/09/2026",
      nik: "6104342342342302",
      tahapan: { biometrik: true, cetak: false, selesai: false },
    },
    {
      id: "3",
      noPengajuan: "KTP - 2026 003",
      nomorRegistrasi: "043423423424",
      pemohon: "Rudi Hartono",
      lokasi: "Pontianak Selatan",
      alamatLengkap: "Jl. Tanjungpura Komp. Melati No. 5, Pontianak Selatan",
      jenis: "KTP Hilang/Rusak",
      status: "Proses",
      tanggal: "15/09/2026",
      nik: "6171015409890031",
      tahapan: { biometrik: true, cetak: false, selesai: false },
    },
    {
      id: "4",
      noPengajuan: "KTP - 2026 004",
      nomorRegistrasi: "043423423425",
      pemohon: "Siti Rahmah",
      lokasi: "Pontianak Barat",
      alamatLengkap: "Jl. Kom Yos Sudarso No. 88, Pontianak Barat",
      jenis: "Perubahan Data KTP",
      status: "Proses",
      tanggal: "18/09/2026",
      nik: "6171021406050032",
      tahapan: { biometrik: true, cetak: false, selesai: false },
    },
  ]);

  // Filtered list
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      // Wilayah Filter
      if (selectedWilayah !== "all") {
        if (!item.lokasi.toLowerCase().includes(selectedWilayah.toLowerCase())) return false;
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
  }, [submissions, selectedWilayah, selectedDate, searchQuery]);

  // Handle status update
  const handleUpdateStatus = (id: string, newStatus: PengajuanKtpRow["status"]) => {
    setSubmissions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedTahapan = { ...item.tahapan };
          if (newStatus === "Mencetak KTP") {
            updatedTahapan.biometrik = true;
            updatedTahapan.cetak = true;
          } else if (newStatus === "KTP Selesai") {
            updatedTahapan.biometrik = true;
            updatedTahapan.cetak = true;
            updatedTahapan.selesai = true;
          }
          return {
            ...item,
            status: newStatus,
            tahapan: updatedTahapan,
          };
        }
        return item;
      })
    );

    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              tahapan: {
                biometrik: true,
                cetak: newStatus === "Mencetak KTP" || newStatus === "KTP Selesai",
                selesai: newStatus === "KTP Selesai",
              },
            }
          : null
      );
    }

    setNotification(`Status permohonan berhasil diperbarui menjadi "${newStatus}"!`);
    setTimeout(() => setNotification(null), 3000);
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ["No Pengajuan", "No Registrasi", "Pemohon", "Lokasi", "Jenis", "Status", "Tanggal", "NIK"];
    const rows = filteredSubmissions.map((s) => [
      `"${s.noPengajuan}"`,
      `"${s.nomorRegistrasi}"`,
      `"${s.pemohon}"`,
      `"${s.lokasi}"`,
      `"${s.jenis}"`,
      `"${s.status}"`,
      `"${s.tanggal}"`,
      `"${s.nik}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Pengajuan_KTP_${wilayah.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`);
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Pengajuan KTP
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Kelola dan pantau pengajuan KTP warga.
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

      {/* ── Search Bar (100% Mockup: "Cari NIK / Nama" with Magnifier Icon) ── */}
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
        {/* Left: Lokasi Daerah Select */}
        <div className="relative w-full sm:w-72">
          <select
            value={selectedWilayah}
            onChange={(e) => setSelectedWilayah(e.target.value)}
            className="w-full px-3 py-2 pr-8 rounded-lg border border-gray-400 bg-white text-xs sm:text-sm text-gray-900 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          >
            <option value="all">Lokasi Daerah</option>
            <option value="Pontianak">Semua Pontianak</option>
            <option value="Pontianak Kota">Pontianak Kota</option>
            <option value="Pontianak Selatan">Pontianak Selatan</option>
            <option value="Pontianak Barat">Pontianak Barat</option>
            <option value="Pontianak Timur">Pontianak Timur</option>
            <option value="Pontianak Utara">Pontianak Utara</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
          />
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

            {/* Date Picker Popover */}
            {showDatePicker && (
              <div className="absolute right-0 top-full mt-2 z-30 bg-white rounded-xl shadow-xl border border-gray-300 p-3 w-64 animate-in fade-in">
                <span className="block text-xs font-bold text-gray-800 mb-2">
                  Pilih Tanggal Pengajuan:
                </span>
                <input
                  type="date"
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split("-");
                      setSelectedDate(`${d}/${m}/${y}`);
                    } else {
                      setSelectedDate("");
                    }
                    setShowDatePicker(false);
                  }}
                  className="w-full p-2 text-xs border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 cursor-pointer"
                />
                <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate("");
                      setShowDatePicker(false);
                    }}
                    className="text-[11px] text-red-600 hover:underline font-medium cursor-pointer"
                  >
                    Reset Tanggal
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(false)}
                    className="text-[11px] text-gray-600 hover:text-black font-semibold cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export / Download CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            title="Unduh / Ekspor Data Pengajuan KTP"
            className="bg-black hover:bg-gray-800 active:scale-95 text-white px-5 py-2 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Active Filter Pill */}
      {(selectedWilayah !== "all" || selectedDate || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-600">
          <span className="font-semibold text-gray-700">Filter Aktif:</span>
          {selectedWilayah !== "all" && (
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
              Wilayah: {selectedWilayah}
            </span>
          )}
          {selectedDate && (
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
              Tanggal: {selectedDate}
            </span>
          )}
          {searchQuery && (
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
              Cari: &quot;{searchQuery}&quot;
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setSelectedWilayah("all");
              setSelectedDate("");
              setSearchQuery("");
            }}
            className="text-blue-600 hover:underline font-semibold ml-1 cursor-pointer"
          >
            Reset Semua
          </button>
        </div>
      )}

      {/* ── Table Container (100% Mockup: Blue Header #2563EB) ── */}
      <div className="rounded-xl border border-gray-300 shadow-xs bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            {/* Header: Solid Blue #2563EB */}
            <thead>
              <tr className="bg-[#2563EB] text-white text-xs sm:text-sm font-bold">
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

                    {/* Status Badge (Peach / Orange Pill) */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      <span className="inline-block bg-[#FED7AA] text-[#C2410C] font-semibold text-xs px-3.5 py-1 rounded-md shadow-2xs whitespace-nowrap">
                        {row.status}
                      </span>
                    </td>

                    {/* Tanggal */}
                    <td className="py-3.5 px-4 align-middle text-center text-gray-800 font-medium whitespace-nowrap">
                      {row.tanggal}
                    </td>

                    {/* Aksi Button (Black "Lihat Detail") */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedSubmission(row)}
                        className="bg-black hover:bg-gray-800 active:scale-95 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs whitespace-nowrap"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-gray-200 p-5 sm:p-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600">
                  {selectedSubmission.noPengajuan} • {selectedSubmission.nomorRegistrasi}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900">
                  Detail Pengajuan KTP-el
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tahapan Alur */}
            <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-200/70 mb-4">
              <span className="text-xs font-bold text-blue-900 block mb-2">
                Tahapan Proses Pelayanan KTP-el:
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
                <div
                  className={`p-2 rounded-lg border ${
                    selectedSubmission.tahapan.biometrik
                      ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                      : "bg-white border-gray-200 text-gray-500"
                  }`}
                >
                  1. Biometrik
                </div>
                <div
                  className={`p-2 rounded-lg border ${
                    selectedSubmission.tahapan.cetak
                      ? "bg-amber-100 border-amber-300 text-amber-800"
                      : "bg-white border-gray-200 text-gray-500"
                  }`}
                >
                  2. Mencetak KTP
                </div>
                <div
                  className={`p-2 rounded-lg border ${
                    selectedSubmission.tahapan.selesai
                      ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                      : "bg-white border-gray-200 text-gray-500"
                  }`}
                >
                  3. KTP Selesai
                </div>
              </div>
            </div>

            {/* Citizen Details */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-gray-500 flex items-center gap-1.5 mb-0.5">
                    <User size={13} /> Nama Lengkap Pemohon
                  </span>
                  <span className="font-bold text-gray-900 text-sm">
                    {selectedSubmission.pemohon}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 flex items-center gap-1.5 mb-0.5">
                    <IdCard size={13} /> NIK Kependudukan
                  </span>
                  <span className="font-mono font-bold text-gray-900 text-sm">
                    {selectedSubmission.nik}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 flex items-center gap-1.5 mb-0.5">
                    <FileCheck size={13} /> Jenis Pengajuan
                  </span>
                  <span className="font-semibold text-blue-700">
                    {selectedSubmission.jenis}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 flex items-center gap-1.5 mb-0.5">
                    <Calendar size={13} /> Tanggal Masuk
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedSubmission.tanggal}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-500 flex items-center gap-1.5 mb-0.5">
                    <MapPin size={13} /> Alamat Kependudukan
                  </span>
                  <span className="font-medium text-gray-800">
                    {selectedSubmission.alamatLengkap}
                  </span>
                </div>
              </div>

              {/* Status Actions */}
              <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <span className="text-xs text-gray-500">
                  Status Saat Ini:{" "}
                  <strong className="text-amber-700">{selectedSubmission.status}</strong>
                </span>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedSubmission.id, "Mencetak KTP")}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Printer size={14} />
                    <span>Cetak KTP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedSubmission.id, "KTP Selesai")}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-[#1b3a6b] hover:bg-[#152e55] text-white flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <CheckCircle2 size={14} />
                    <span>Selesaikan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

