"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Search,
  ChevronDown,
  X,
  MapPin,
  Camera,
  Calendar,
} from "lucide-react";

export interface PengajuanDesilRow {
  id: string;
  nomor: string;
  nama: string;
  nik?: string;
  desilSaatIni: string;
  desilDiajukan?: number;
  statusBadge: string;
  statusRaw?: string;
  tanggal: string;
  jam: string;
  initial: string;
  bgInitial: string;
  textInitial: string;
  pekerjaan?: string;
  pendapatan?: string;
  alasan?: string;
  housePhoto?: string;
  lokasi?: string;
}

interface PengajuanDesilKecamatanContentProps {
  initialSubmissions?: PengajuanDesilRow[];
}

// 100% Sesuai Screenshot Mockup Pengguna
const DEFAULT_SUBMISSIONS: PengajuanDesilRow[] = [
  {
    id: "sub-1",
    nomor: "DESIL-2026-000124",
    nama: "Hapis Khairullah",
    nik: "6171012305980002",
    desilSaatIni: "Desil 4",
    desilDiajukan: 2,
    statusBadge: "Perlu Diperbarui",
    statusRaw: "perlu_diperbarui",
    tanggal: "29 Mei 2026",
    jam: "10:23 WIB",
    initial: "H",
    bgInitial: "bg-[#D1FADF]",
    textInitial: "text-[#039855]",
    pekerjaan: "Buruh Harian Lepas",
    pendapatan: "Rp 950.000 / bulan",
    alasan: "Penghasilan menurun drastis pasca pemutusan kontrak kerja dan menjadi tulang punggung tunggal untuk 4 orang anggota keluarga.",
    housePhoto: "/sample-house.png",
    lokasi: "Jl. Merdeka No. 12, Kel. Embong Kaliasin, Kec. Genteng, Surabaya",
  },
  {
    id: "sub-2",
    nomor: "DESIL-2026-000124",
    nama: "Faras Fasalah",
    nik: "6171021406950004",
    desilSaatIni: "Desil 4",
    desilDiajukan: 2,
    statusBadge: "Perlu Diperbarui",
    statusRaw: "perlu_diperbarui",
    tanggal: "29 Mei 2026",
    jam: "10:23 WIB",
    initial: "R",
    bgInitial: "bg-[#D1E9FF]",
    textInitial: "text-[#175CD3]",
    pekerjaan: "Pedagang Keliling",
    pendapatan: "Rp 1.100.000 / bulan",
    alasan: "Kondisi ekonomi keluarga menurun drastis, tanggungan 3 anak usia sekolah membutuhkan akses bantuan sosial desil 2.",
    housePhoto: "/sample-house.png",
    lokasi: "Jl. Pemuda No. 45, Kel. Ketabang, Kec. Genteng, Surabaya",
  },
  {
    id: "sub-3",
    nomor: "DESIL-2026-000124",
    nama: "Anisa Ramadhani",
    nik: "6171035208990001",
    desilSaatIni: "Desil 4",
    desilDiajukan: 2,
    statusBadge: "Perlu Diperbarui",
    statusRaw: "perlu_diperbarui",
    tanggal: "29 Mei 2026",
    jam: "10:23 WIB",
    initial: "M",
    bgInitial: "bg-[#FEF0C7]",
    textInitial: "text-[#B54708]",
    pekerjaan: "Ibu Rumah Tangga / Pekerja Serabutan",
    pendapatan: "Rp 800.000 / bulan",
    alasan: "Kepala keluarga sakit menahun dan kehilangan pekerjaan utama, membutuhkan pemutakhiran data DTKS untuk bantuan pengobatan.",
    housePhoto: "/sample-house.png",
    lokasi: "Jl. Genteng Kali No. 8, Kel. Genteng, Kec. Genteng, Surabaya",
  },
  {
    id: "sub-4",
    nomor: "DESIL-2026-000124",
    nama: "Nanda Anggara",
    nik: "6171011802920005",
    desilSaatIni: "Desil 4",
    desilDiajukan: 2,
    statusBadge: "Perlu Diperbarui",
    statusRaw: "perlu_diperbarui",
    tanggal: "29 Mei 2026",
    jam: "10:23 WIB",
    initial: "A",
    bgInitial: "bg-[#FEE4E2]",
    textInitial: "text-[#D92D20]",
    pekerjaan: "Karyawan Tidak Tetap",
    pendapatan: "Rp 1.200.000 / bulan",
    alasan: "Keluarga mengalami beban pengeluaran mendadak untuk lansia yang memerlukan perawatan rutin di rumah.",
    housePhoto: "/sample-house.png",
    lokasi: "Jl. Simpang Dukuh No. 22, Kel. Embong Kaliasin, Kec. Genteng, Surabaya",
  },
  {
    id: "sub-5",
    nomor: "DESIL-2026-000124",
    nama: "Slamet Suito",
    nik: "6171040510880003",
    desilSaatIni: "Desil 4",
    desilDiajukan: 2,
    statusBadge: "Perlu Diperbarui",
    statusRaw: "perlu_diperbarui",
    tanggal: "29 Mei 2026",
    jam: "10:23 WIB",
    initial: "B",
    bgInitial: "bg-[#F4EBFF]",
    textInitial: "text-[#7F56D9]",
    pekerjaan: "Penjaga Lingkungan",
    pendapatan: "Rp 1.050.000 / bulan",
    alasan: "Kondisi fisik rumah semi permanen lantai tanah dan atap lapuk, mengajukan peninjauan desil untuk program bedah rumah.",
    housePhoto: "/sample-house.png",
    lokasi: "Jl. Taman Apsari No. 15, Kel. Ketabang, Kec. Genteng, Surabaya",
  },
];

export function PengajuanDesilKecamatanContent({
  initialSubmissions,
}: PengajuanDesilKecamatanContentProps) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const [selectedSubmission, setSelectedSubmission] = useState<PengajuanDesilRow | null>(null);

  const listData = useMemo(() => {
    if (initialSubmissions && initialSubmissions.length > 0) {
      return initialSubmissions;
    }
    return DEFAULT_SUBMISSIONS;
  }, [initialSubmissions]);

  // Filtering berdasarkan search query & dropdown
  const filteredSubmissions = useMemo(() => {
    return listData.filter((item) => {
      // 1. Search Query (Nama, NIK, Nomor)
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.nomor.toLowerCase().includes(q) ||
        (item.nik && item.nik.toLowerCase().includes(q)) ||
        item.desilSaatIni.toLowerCase().includes(q);

      // 2. Status Filter
      const matchStatus =
        selectedStatus === "all" ||
        item.statusBadge.toLowerCase().includes(selectedStatus.toLowerCase());

      // 3. Date Filter
      const matchDate =
        selectedDate === "all" ||
        item.tanggal.toLowerCase().includes(selectedDate.toLowerCase());

      return matchSearch && matchStatus && matchDate;
    });
  }, [listData, searchQuery, selectedStatus, selectedDate]);

  return (
    <div className="flex flex-col w-full pb-10 select-none">
      {/* ── Page Header: "< Pengajuan Peninjauan Desil / Kelola dan pantau pengajuan desil warga." ── */}
      <div className="flex items-start gap-2.5 sm:gap-3 mb-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1 -ml-1 text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-slate-700/60 rounded-xl transition-colors cursor-pointer mt-0.5"
          aria-label="Kembali"
        >
          <ChevronLeft size={28} strokeWidth={2.4} />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            Pengajuan Peninjauan Desil
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
            Kelola dan pantau pengajuan desil warga.
          </p>
        </div>
      </div>

      {/* ── Search Input: "Q Cari NIK / Nama" (100% Sesuai Screenshot) ── */}
      <div className="relative w-full mb-3.5">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
          <Search size={18} strokeWidth={2.2} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari NIK / Nama"
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-300/90 dark:border-slate-700 shadow-2xs text-xs sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Filters: "Semua Status [v]" & "Tanggal [v]" (100% Sesuai Screenshot) ── */}
      <div className="flex items-center gap-3 mb-5">
        {/* Dropdown Status */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsStatusDropdownOpen(!isStatusDropdownOpen);
              setIsDateDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-300/90 dark:border-slate-700 shadow-2xs text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-all cursor-pointer"
          >
            <span>
              {selectedStatus === "all"
                ? "Semua Status"
                : selectedStatus === "perlu"
                ? "Perlu Diperbarui"
                : selectedStatus === "disetujui"
                ? "Disetujui"
                : "Ditolak"}
            </span>
            <ChevronDown size={17} strokeWidth={2.4} className="text-gray-700 dark:text-gray-300" />
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg py-1.5 z-30 animate-in fade-in zoom-in-95">
              {[
                { key: "all", label: "Semua Status" },
                { key: "perlu", label: "Perlu Diperbarui" },
                { key: "disetujui", label: "Disetujui" },
                { key: "ditolak", label: "Ditolak" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setSelectedStatus(opt.key);
                    setIsStatusDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium cursor-pointer transition-colors ${
                    selectedStatus === opt.key
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/60"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown Tanggal */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsDateDropdownOpen(!isDateDropdownOpen);
              setIsStatusDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-300/90 dark:border-slate-700 shadow-2xs text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-all cursor-pointer"
          >
            <span>
              {selectedDate === "all" ? "Tanggal" : selectedDate}
            </span>
            <ChevronDown size={17} strokeWidth={2.4} className="text-gray-700 dark:text-gray-300" />
          </button>

          {isDateDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg py-1.5 z-30 animate-in fade-in zoom-in-95">
              {[
                { key: "all", label: "Semua Tanggal" },
                { key: "29 Mei 2026", label: "29 Mei 2026" },
                { key: "Mei 2026", label: "Bulan Ini (Mei 2026)" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setSelectedDate(opt.key);
                    setIsDateDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium cursor-pointer transition-colors ${
                    selectedDate === opt.key
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/60"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Table / List Container: 5 Baris 100% Sesuai Screenshot ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700 shadow-2xs divide-y divide-gray-200/80 dark:divide-slate-700 overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="p-10 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Tidak ada pengajuan desil yang sesuai dengan pencarian atau filter.
          </div>
        ) : (
          filteredSubmissions.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/70 dark:hover:bg-slate-700/40 transition-colors"
            >
              {/* Kolom Kiri: Avatar Initial + Detail Warga */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Circular Initial Avatar */}
                <div
                  className={`w-11 h-11 rounded-full ${item.bgInitial} ${item.textInitial} flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0 shadow-2xs select-none`}
                >
                  {item.initial}
                </div>

                {/* Identitas Pengajuan */}
                <div className="min-w-0">
                  <span className="text-[11px] font-mono font-medium text-gray-500 dark:text-gray-400 block leading-tight">
                    {item.nomor}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-snug truncate mt-0.5">
                    {item.nama}
                  </h3>
                  <span className="text-[11px] text-gray-600 dark:text-gray-300 leading-none block mt-0.5">
                    Desil saat ini : {item.desilSaatIni}
                  </span>
                </div>
              </div>

              {/* Kolom Tengah & Kanan: Status Badge, Tanggal, dan Tombol Lihat */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-8 pl-14 sm:pl-0">
                {/* Status Badge: "Perlu Diperbarui" */}
                <span className="inline-block bg-[#E0F2FE] text-[#0284C7] dark:bg-sky-950/60 dark:text-sky-300 text-[11px] font-semibold px-3 py-1 rounded-full border border-sky-200/70 whitespace-nowrap">
                  {item.statusBadge}
                </span>

                {/* Tanggal & Waktu: "29 Mei 2026 / 10:23 WIB" */}
                <div className="text-right text-[11px] text-gray-600 dark:text-gray-400 leading-tight whitespace-nowrap hidden md:block">
                  <div>{item.tanggal}</div>
                  <div className="text-gray-500 dark:text-gray-400">{item.jam}</div>
                </div>

                {/* Tombol Aksi: "[ Lihat ]" */}
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(item)}
                  className="border border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 active:scale-95 text-xs font-semibold px-4 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                >
                  Lihat
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Modal Detail Verifikasi Pengajuan Warga (Khusus Kecamatan: Hanya Tombol Tutup) ── */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-xl shadow-2xl border border-gray-200 dark:border-slate-700 p-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            {/* Modal Header */}
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
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Foto Rumah Live Camera & Geotagging */}
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
                    {selectedSubmission.pekerjaan || "Buruh Harian Lepas"}
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
                    Desil {selectedSubmission.desilDiajukan || 2}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Penghasilan</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {selectedSubmission.pendapatan || "Rp 1.000.000 / bln"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Status Pengajuan</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {selectedSubmission.statusBadge}
                  </span>
                </div>
              </div>

              {/* Alasan Peninjauan */}
              <div className="p-3 rounded-xl border border-gray-200 dark:border-slate-700">
                <span className="font-bold text-gray-900 dark:text-white block mb-1">
                  Alasan Peninjauan:
                </span>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedSubmission.alasan}
                </p>
              </div>

              {/* Action Buttons: Khusus Kecamatan HANYA ADA TOMBOL TUTUP */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

