"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Search,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { DetailPengajuanDesilView, DetailPengajuanData } from "./DetailPengajuanDesilView";

export interface PengajuanDesilItem {
  id: string;
  nomor: string;
  nama: string;
  nik: string;
  desilSaatIni: string;
  desilTujuan: string;
  statusBadge: "Perlu Diperbarui" | "Disetujui" | "Ditolak";
  tanggal: string;
  waktu: string;
  tanggalRaw: string;
  initial: string;
  bgInitial: string;
  textInitial: string;
  alamat?: string;
  pekerjaan: string;
  pendapatan: string;
  alasan: string;
  housePhoto: string;
  lokasi: string;
}

export function LaporanPengajuanDesilContent() {
  const router = useRouter();

  // State Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tanggalFilter, setTanggalFilter] = useState<string>("all");

  // State Selected Detail Item (Jika tidak null, tampilkan tampilan Detail 100% Mockup)
  const [selectedItem, setSelectedItem] = useState<PengajuanDesilItem | null>(null);

  // Data Pengajuan Awal 100% Sesuai Screenshot
  const [dataPengajuan, setDataPengajuan] = useState<PengajuanDesilItem[]>([
    {
      id: "1",
      nomor: "DESIL- 2026-000123",
      nama: "Hapis Khairullah",
      nik: "6105438987667002",
      desilSaatIni: "Desil 4",
      desilTujuan: "Desil 2",
      statusBadge: "Perlu Diperbarui",
      tanggal: "29 Mei 2026",
      waktu: "10:23 WIB",
      tanggalRaw: "2026-05-29",
      initial: "H",
      bgInitial: "bg-[#DCFCE7]",
      textInitial: "text-[#16A34A]",
      alamat: "JL.. Merdeka",
      pekerjaan: "Tidak Bekerja",
      pendapatan: "Rp.1.000.00",
      alasan: "Kondisi ekonomi menurun & tanggungan bertambah",
      housePhoto: "/sample-house.png",
      lokasi: "Jl. Reformasi No.15, Bansir Laut, Kec. Pontianak Tenggara, Kota Pontianak, Kalimantan Barat 78113",
    },
    {
      id: "2",
      nomor: "DESIL-2026-000124",
      nama: "Faras Fasalah",
      nik: "610*********889",
      desilSaatIni: "Desil 4",
      desilTujuan: "Desil 3",
      statusBadge: "Perlu Diperbarui",
      tanggal: "29 Mei 2026",
      waktu: "10:23 WIB",
      tanggalRaw: "2026-05-29",
      initial: "R",
      bgInitial: "bg-[#DBEAFE]",
      textInitial: "text-[#2563EB]",
      alamat: "Jl. Gajah Mada No. 44",
      pekerjaan: "Buruh Harian Lepas",
      pendapatan: "Rp.900.000",
      alasan: "Penurunan penghasilan akibat sakit menahun",
      housePhoto: "/sample-house.png",
      lokasi: "Pontianak Kota (Geotagging Valid)",
    },
    {
      id: "3",
      nomor: "DESIL-2026-000124",
      nama: "Anisa Ramadhani",
      nik: "610*********451",
      desilSaatIni: "Desil 4",
      desilTujuan: "Desil 2",
      statusBadge: "Perlu Diperbarui",
      tanggal: "29 Mei 2026",
      waktu: "10:23 WIB",
      tanggalRaw: "2026-05-29",
      initial: "M",
      bgInitial: "bg-[#FEF3C7]",
      textInitial: "text-[#D97706]",
      alamat: "Jl. Tanjung Pura No. 12",
      pekerjaan: "Ibu Rumah Tangga",
      pendapatan: "Rp.750.000",
      alasan: "Keluarga prasejahtera berpenghasilan tidak tetap",
      housePhoto: "/sample-house.png",
      lokasi: "Pontianak Kota (Geotagging Valid)",
    },
    {
      id: "4",
      nomor: "DESIL-2026-000124",
      nama: "Nanda Anggara",
      nik: "610*********733",
      desilSaatIni: "Desil 4",
      desilTujuan: "Desil 3",
      statusBadge: "Perlu Diperbarui",
      tanggal: "29 Mei 2026",
      waktu: "10:23 WIB",
      tanggalRaw: "2026-05-29",
      initial: "A",
      bgInitial: "bg-[#FEE2E2]",
      textInitial: "text-[#DC2626]",
      alamat: "Jl. Kom Yos Sudarso",
      pekerjaan: "Pedagang Keliling",
      pendapatan: "Rp.1.100.000",
      alasan: "Omset usaha mikro mengalami penurunan drastis",
      housePhoto: "/sample-house.png",
      lokasi: "Pontianak Kota (Geotagging Valid)",
    },
    {
      id: "5",
      nomor: "DESIL-2026-000124",
      nama: "Slamet Suito",
      nik: "610*********109",
      desilSaatIni: "Desil 4",
      desilTujuan: "Desil 2",
      statusBadge: "Perlu Diperbarui",
      tanggal: "29 Mei 2026",
      waktu: "10:23 WIB",
      tanggalRaw: "2026-05-29",
      initial: "B",
      bgInitial: "bg-[#F3E8FF]",
      textInitial: "text-[#9333EA]",
      alamat: "Jl. Komyos Sudarso Gg. Sukun",
      pekerjaan: "Lansia / Tidak Bekerja",
      pendapatan: "Rp.600.000",
      alasan: "Lansia tunggal tanpa penghasilan tetap",
      housePhoto: "/sample-house.png",
      lokasi: "Pontianak Kota (Geotagging Valid)",
    },
  ]);

  // Filter Logic Multi-Field (Search NIK / Nama + Filter Status + Filter Tanggal)
  const filteredList = useMemo(() => {
    return dataPengajuan.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        item.nama.toLowerCase().includes(q) ||
        item.nik.toLowerCase().includes(q) ||
        item.nomor.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all" || item.statusBadge === statusFilter;

      const matchTanggal =
        tanggalFilter === "all" || item.tanggalRaw === tanggalFilter;

      return matchSearch && matchStatus && matchTanggal;
    });
  }, [dataPengajuan, searchQuery, statusFilter, tanggalFilter]);

  // JIKA SEDANG MEMBUKA DETAIL PENGAJUAN (100% PERSIS SEPERTI SCREENSHOT MOCKUP BARU)
  if (selectedItem) {
    const detailData: DetailPengajuanData = {
      nomor: selectedItem.nomor,
      nama: selectedItem.nama,
      nik: selectedItem.nik,
      alamat: selectedItem.alamat || "JL.. Merdeka",
      tanggalPengajuan: "23 September 2026",
      statusText: selectedItem.statusBadge === "Disetujui" ? "Disetujui" : "Dalam Proses",
      housePhoto: selectedItem.housePhoto || "/sample-house.png",
      alamatLengkapRumah:
        selectedItem.lokasi ||
        "Jl. Reformasi No.15, Bansir Laut, Kec. Pontianak Tenggara, Kota Pontianak, Kalimantan Barat 78113",
      desilAwal: "Desil 4",
      desilSementara: "Desil 2",
      tanggalUpdateDesil: "02 Oktober 2026",
    };

    return (
      <DetailPengajuanDesilView
        data={detailData}
        onBack={() => setSelectedItem(null)}
        onApproveSuccess={() => {
          setDataPengajuan((prev) =>
            prev.map((it) =>
              it.id === selectedItem.id ? { ...it, statusBadge: "Disetujui" } : it
            )
          );
        }}
      />
    );
  }

  // TAMPILAN DAFTAR PENGAJUAN DENGAN SEARCH & FILTER
  return (
    <div className="flex flex-col w-full pb-10 animate-in fade-in duration-200">
      {/* ── Page Header ── */}
      <div className="flex items-start gap-3.5 mb-6 select-none">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-300 dark:border-slate-600 flex items-center justify-center text-gray-700 dark:text-gray-200 mt-0.5 cursor-pointer shadow-2xs transition-colors"
          aria-label="Kembali"
        >
          <ChevronLeft size={20} strokeWidth={2.4} />
        </button>

        <div>
          <h1 className="text-xl md:text-[24px] font-bold text-gray-900 dark:text-white leading-tight">
            Pengajuan Peninjauan Desil
          </h1>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
            Kelola dan pantau pengajuan desil warga.
          </p>
        </div>
      </div>

      {/* ── Search & Filter Controls (100% Sesuai Screenshot) ── */}
      <div className="space-y-3.5 mb-6">
        {/* 1. Search Bar */}
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari NIK / Nama"
            className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl py-3 pl-11 pr-4 text-xs md:text-sm text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs transition-all"
          />
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* 2. Filter Dropdown Buttons */}
        <div className="flex items-center gap-3">
          {/* Filter Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl py-2 pl-4 pr-9 text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="Perlu Diperbarui">Perlu Diperbarui</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 pointer-events-none"
            />
          </div>

          {/* Filter Tanggal */}
          <div className="relative">
            <select
              value={tanggalFilter}
              onChange={(e) => setTanggalFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl py-2 pl-4 pr-9 text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">Tanggal</option>
              <option value="2026-05-29">29 Mei 2026</option>
              <option value="2026-05-28">28 Mei 2026</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 pointer-events-none"
            />
          </div>

          {/* Active Filter Indicator */}
          {(searchQuery || statusFilter !== "all" || tanggalFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setTanggalFilter("all");
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              Hapus Filter
            </button>
          )}
        </div>
      </div>

      {/* ── List / Table Container ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700 shadow-2xs divide-y divide-gray-200/80 dark:divide-slate-700 overflow-hidden">
        {filteredList.length > 0 ? (
          filteredList.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/70 dark:hover:bg-slate-700/40 transition-colors"
            >
              {/* Left Column: Initial Avatar + Citizen Info */}
              <div className="flex items-center gap-3.5 min-w-0">
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
                    Desil saat ini : {item.desilSaatIni}
                  </span>
                </div>
              </div>

              {/* Middle & Right Column: Status Badge, Date/Time, and Action Button */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pl-13 sm:pl-0">
                <span
                  className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full border whitespace-nowrap ${
                    item.statusBadge === "Disetujui"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : item.statusBadge === "Ditolak"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-[#E0F2FE] text-[#0284C7] border-sky-200/70 dark:bg-sky-950/60 dark:text-sky-300"
                  }`}
                >
                  {item.statusBadge}
                </span>

                <div className="text-right text-[11px] text-gray-600 dark:text-gray-400 leading-tight whitespace-nowrap hidden md:block">
                  <div>{item.tanggal}</div>
                  <div className="text-gray-500">{item.waktu}</div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="border border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 active:scale-95 text-xs font-semibold px-4 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                >
                  Lihat
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <AlertCircle size={32} className="text-gray-400 mb-2" />
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Tidak ada data pengajuan yang cocok
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Coba periksa kembali kata kunci pencarian atau ganti filter status/tanggal Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
