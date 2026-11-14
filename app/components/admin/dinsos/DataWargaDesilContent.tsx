"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Search,
  ChevronDown,
  X,
  User,
} from "lucide-react";

export interface WargaDesilItem {
  id: string;
  nikMasked: string;
  nikFull: string;
  nama: string;
  desil: number | string;
  status: "Aktif" | "Non-Aktif" | "Pindah Datang";
  kecamatan: string;
  kelurahan: string;
  alamat: string;
  ttl: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  pekerjaan: string;
  pendapatan: string;
  noTelepon: string;
  statusAjuanDesil?: string;
}

export function DataWargaDesilContent({
  initialWargaData,
}: {
  initialWargaData?: WargaDesilItem[];
} = {}) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedKecamatan, setSelectedKecamatan] = useState("all");

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isKecamatanDropdownOpen, setIsKecamatanDropdownOpen] = useState(false);

  const [selectedWarga, setSelectedWarga] = useState<WargaDesilItem | null>(null);

  const dataList = useMemo(() => {
    return initialWargaData ?? [];
  }, [initialWargaData]);

  // Filter Data Warga
  const filteredWarga = useMemo(() => {
    return dataList.filter((item) => {
      // 1. Search Query (Nama, NIK Masked, NIK Full)
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.nikMasked.toLowerCase().includes(q) ||
        item.nikFull.toLowerCase().includes(q) ||
        item.desil.toString().includes(q);

      // 2. Status Filter
      const matchStatus =
        selectedStatus === "all" ||
        item.status.toLowerCase() === selectedStatus.toLowerCase();

      // 3. Kecamatan Filter
      const matchKecamatan =
        selectedKecamatan === "all" ||
        item.kecamatan.toLowerCase().includes(selectedKecamatan.toLowerCase());

      return matchSearch && matchStatus && matchKecamatan;
    });
  }, [dataList, searchQuery, selectedStatus, selectedKecamatan]);

  return (
    <div className="flex flex-col w-full pb-10">
      {/* ── Page Header: "< Data Warga / Detail data warga beserta status desil ajuan" ── */}
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
            Data Warga
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
            Detail data warga beserta status desil ajuan
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
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-300/90 dark:border-slate-700 shadow-sm text-xs sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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

      {/* ── Filters: "Semua Status [v]" & "Status Kecamatan [v]" (100% Sesuai Screenshot) ── */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Dropdown Status */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsStatusDropdownOpen(!isStatusDropdownOpen);
              setIsKecamatanDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-300/90 dark:border-slate-700 shadow-sm text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-all cursor-pointer"
          >
            <span>
              {selectedStatus === "all"
                ? "Semua Status"
                : selectedStatus === "Aktif"
                ? "Aktif"
                : "Non-Aktif"}
            </span>
            <ChevronDown size={17} strokeWidth={2.4} className="text-gray-700 dark:text-gray-300" />
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg py-1.5 z-30 animate-in fade-in zoom-in-95">
              {[
                { key: "all", label: "Semua Status" },
                { key: "Aktif", label: "Aktif" },
                { key: "Non-Aktif", label: "Non-Aktif" },
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

        {/* Dropdown Status Kecamatan */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsKecamatanDropdownOpen(!isKecamatanDropdownOpen);
              setIsStatusDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-300/90 dark:border-slate-700 shadow-sm text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-all cursor-pointer"
          >
            <span>
              {selectedKecamatan === "all" ? "Status Kecamatan" : selectedKecamatan}
            </span>
            <ChevronDown size={17} strokeWidth={2.4} className="text-gray-700 dark:text-gray-300" />
          </button>

          {isKecamatanDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-52 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg py-1.5 z-30 animate-in fade-in zoom-in-95">
              {[
                { key: "all", label: "Semua Kecamatan" },
                ...Array.from(
                  new Set(
                    dataList
                      .map((w) => w.kecamatan.replace(/^Kecamatan\s+/i, "").trim())
                      .filter((k) => Boolean(k) && k !== "-")
                  )
                ).map((k) => ({ key: k, label: `Kecamatan ${k}` })),
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setSelectedKecamatan(opt.key);
                    setIsKecamatanDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium cursor-pointer transition-colors ${
                    selectedKecamatan === opt.key
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

      {/* ── Tabel Data Warga (100% Sesuai Screenshot Mockup) ── */}
      <div className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[580px] sm:min-w-[640px]">
            {/* Table Header: Biru Royal Sesuai Screenshot */}
            <thead>
              <tr className="bg-[#2563EB] text-white text-xs sm:text-sm font-bold">
                <th className="py-3.5 px-4 sm:px-6 w-[20%]">NIK</th>
                <th className="py-3.5 px-4 sm:px-6 w-[30%]">Nama</th>
                <th className="py-3.5 px-4 sm:px-6 w-[15%] text-center sm:text-left">Desil</th>
                <th className="py-3.5 px-4 sm:px-6 w-[15%] text-center sm:text-left">Status</th>
                <th className="py-3.5 px-4 sm:px-6 w-[20%] text-right"></th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700 text-xs sm:text-sm">
              {filteredWarga.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500 dark:text-gray-400">
                    Tidak ada data warga yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredWarga.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/70 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    {/* NIK (Masked ****0031) */}
                    <td className="py-4 px-4 sm:px-6 font-mono font-medium text-gray-900 dark:text-white">
                      {item.nikMasked}
                    </td>

                    {/* Nama Lengkap */}
                    <td className="py-4 px-4 sm:px-6 font-bold text-gray-900 dark:text-white">
                      {item.nama}
                    </td>

                    {/* Desil */}
                    <td className="py-4 px-4 sm:px-6 font-bold text-gray-900 dark:text-white text-center sm:text-left">
                      {item.desil}
                    </td>

                    {/* Status ("Aktif") */}
                    <td className="py-4 px-4 sm:px-6 font-semibold text-gray-900 dark:text-white text-center sm:text-left">
                      {item.status}
                    </td>

                    {/* Tombol Aksi: [ Lihat Detail ] Hitam Pekat Sesuai Screenshot */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedWarga(item)}
                        className="bg-black hover:bg-gray-800 active:scale-95 text-white font-semibold text-xs px-4 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-sm"
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

      {/* ── Modal Detail Data Warga ── */}
      {selectedWarga && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-slate-700 p-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                    {selectedWarga.nama}
                  </h3>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    NIK: {selectedWarga.nikFull}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWarga(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 flex items-center justify-center cursor-pointer"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Info Cards */}
            <div className="space-y-3.5 text-xs">
              {/* Desil & Status Box */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block">
                    Tingkat Kesejahteraan
                  </span>
                  <span className="text-lg font-black text-blue-700 dark:text-blue-400">
                    Desil {selectedWarga.desil}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block">
                    Status Kependudukan
                  </span>
                  <span className="inline-block bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                    {selectedWarga.status}
                  </span>
                </div>
              </div>

              {/* Data Detail Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700">
                <div>
                  <span className="text-gray-500 block text-[11px]">Tempat, Tanggal Lahir</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedWarga.ttl}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Jenis Kelamin</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedWarga.jenisKelamin}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Pekerjaan</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedWarga.pekerjaan}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Estimasi Penghasilan</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedWarga.pendapatan}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-500 block text-[11px]">No. Telepon / WhatsApp</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedWarga.noTelepon}
                  </span>
                </div>
              </div>

              {/* Alamat Domisili */}
              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-slate-700">
                <span className="font-bold text-gray-900 dark:text-white block mb-1">
                  Alamat Domisili:
                </span>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedWarga.alamat}, Kelurahan {selectedWarga.kelurahan}, {selectedWarga.kecamatan}
                </p>
              </div>

              {/* Status Ajuan Desil */}
              {selectedWarga.statusAjuanDesil && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-300 text-[11px] font-medium flex items-center justify-between">
                  <span>Status Ajuan Desil Terbaru:</span>
                  <span className="font-bold">{selectedWarga.statusAjuanDesil}</span>
                </div>
              )}

              {/* Action Buttons: Tutup */}
              <div className="flex items-center justify-end pt-3 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSelectedWarga(null)}
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

