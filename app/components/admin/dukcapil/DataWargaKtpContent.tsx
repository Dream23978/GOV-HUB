"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Search,
  ChevronDown,
  X,
  User,
  IdCard,
  MapPin,
  Calendar,
  Layers,
  FileCheck2,
} from "lucide-react";

export interface WargaItem {
  id: string;
  nikMasked: string;
  nikFull: string;
  nama: string;
  desil: string | number;
  status: "Aktif" | "Non-Aktif" | "Pindah Datang";
  kecamatan: string;
  alamat: string;
  ttl: string;
  jenisKelamin: string;
  pekerjaan: string;
  statusKtp: string;
}

interface DataWargaKtpContentProps {
  initialWargaList?: WargaItem[];
}

export function DataWargaKtpContent({
  initialWargaList,
}: DataWargaKtpContentProps = {}) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedKecamatan, setSelectedKecamatan] = useState("all");
  const [selectedWarga, setSelectedWarga] = useState<WargaItem | null>(null);

  const wargaList = useMemo(() => {
    return initialWargaList ?? [];
  }, [initialWargaList]);

  const kecamatanOptions = useMemo(() => {
    return Array.from(
      new Set(wargaList.map((w) => w.kecamatan).filter((k) => Boolean(k) && k !== "-"))
    ).sort();
  }, [wargaList]);

  // Filtering data
  const filteredList = useMemo(() => {
    return wargaList.filter((item) => {
      // Status Filter
      if (selectedStatus !== "all" && item.status !== selectedStatus) {
        return false;
      }

      // Kecamatan Filter
      if (
        selectedKecamatan !== "all" &&
        !item.kecamatan.toLowerCase().includes(selectedKecamatan.toLowerCase())
      ) {
        return false;
      }

      // Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = item.nama.toLowerCase().includes(q);
        const matchMasked = item.nikMasked.toLowerCase().includes(q);
        const matchFull = item.nikFull.includes(q);
        const matchKec = item.kecamatan.toLowerCase().includes(q);
        if (!matchName && !matchMasked && !matchFull && !matchKec) return false;
      }

      return true;
    });
  }, [wargaList, selectedStatus, selectedKecamatan, searchQuery]);

  return (
    <div className="flex flex-col w-full pb-10 select-none">
      {/* ── Page Header: Back Arrow, Title "Data Warga", Subtitle ── */}
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
            Data Warga
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Kelola dan pantau pengajuan KTP warga.
          </p>
        </div>
      </div>

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
          aria-label="Cari NIK atau Nama Warga"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-400 bg-white text-xs sm:text-sm text-gray-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 font-medium"
        />
      </div>

      {/* ── Filter Row (100% Mockup: "Semua Status" & "Status Kecamatan") ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mb-4">
        {/* Dropdown 1: Semua Status */}
        <div className="relative w-full sm:w-56">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2 pr-8 rounded-lg border border-gray-400 bg-white text-xs sm:text-sm text-gray-900 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Non-Aktif">Non-Aktif</option>
            <option value="Pindah Datang">Pindah Datang</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
          />
        </div>

        {/* Dropdown 2: Status Kecamatan */}
        <div className="relative w-full sm:w-60">
          <select
            value={selectedKecamatan}
            onChange={(e) => setSelectedKecamatan(e.target.value)}
            className="w-full px-3.5 py-2 pr-8 rounded-lg border border-gray-400 bg-white text-xs sm:text-sm text-gray-900 font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          >
            <option value="all">Semua Kecamatan</option>
            {kecamatanOptions.map((kec) => (
              <option key={kec} value={kec}>
                {kec}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
          />
        </div>

        {/* Reset Filter indicator */}
        {(selectedStatus !== "all" || selectedKecamatan !== "all" || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedStatus("all");
              setSelectedKecamatan("all");
              setSearchQuery("");
            }}
            className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer py-1"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* ── Table Container (100% Mockup: Blue Header #2563EB: NIK, Nama, Desil, Status, Aksi) ── */}
      <div className="rounded-xl border border-gray-300 shadow-xs bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            {/* Header: Solid Blue #2563EB */}
            <thead>
              <tr className="bg-[#2563EB] text-white text-xs sm:text-sm font-bold">
                <th className="py-3 px-4 font-bold tracking-tight">NIK</th>
                <th className="py-3 px-4 font-bold tracking-tight">Nama</th>
                <th className="py-3 px-4 font-bold tracking-tight text-center">Desil</th>
                <th className="py-3 px-4 font-bold tracking-tight text-center">Status</th>
                <th className="py-3 px-4 font-bold tracking-tight text-center">Aksi</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 font-medium">
                    Tidak ada data warga yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredList.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50/40 transition-colors bg-white"
                  >
                    {/* NIK (****0031) */}
                    <td className="py-3.5 px-4 align-middle font-bold text-gray-900 font-mono">
                      {row.nikMasked}
                    </td>

                    {/* Nama (Rudi Hartono) */}
                    <td className="py-3.5 px-4 align-middle font-semibold text-gray-900">
                      {row.nama}
                    </td>

                    {/* Desil (4) */}
                    <td className="py-3.5 px-4 align-middle text-center font-bold text-gray-800">
                      {row.desil}
                    </td>

                    {/* Status (Aktif) */}
                    <td className="py-3.5 px-4 align-middle text-center font-semibold text-gray-900">
                      {row.status}
                    </td>

                    {/* Aksi Button (Black "Lihat Detail") */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedWarga(row)}
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

      {/* ── Detail Modal Warga ── */}
      {selectedWarga && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 p-5 sm:p-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600">
                  {selectedWarga.nikMasked} • Kependudukan SIAK
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900">
                  Profil Data Kependudukan Warga
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWarga(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Warga Details Grid */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-gray-500 flex items-center gap-1.5 mb-0.5">
                    <User size={13} /> Nama Lengkap
                  </span>
                  <span className="font-bold text-gray-900 text-sm">
                    {selectedWarga.nama}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 flex items-center gap-1.5 mb-0.5">
                    <IdCard size={13} /> NIK Lengkap (SIAK)
                  </span>
                  <span className="font-mono font-bold text-gray-900 text-sm">
                    {selectedWarga.nikFull}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 flex items-center gap-1.5 mb-0.5">
                    <Layers size={13} /> Tingkat Desil Kesejahteraan
                  </span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 inline-block">
                    Desil {selectedWarga.desil}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 flex items-center gap-1.5 mb-0.5">
                    <FileCheck2 size={13} /> Status Kependudukan
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 inline-block">
                    {selectedWarga.status}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 flex items-center gap-1.5 mb-0.5">
                    <Calendar size={13} /> Tempat, Tanggal Lahir
                  </span>
                  <span className="font-medium text-gray-800">
                    {selectedWarga.ttl}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 flex items-center gap-1.5 mb-0.5">
                    <MapPin size={13} /> Wilayah Kecamatan
                  </span>
                  <span className="font-medium text-gray-800">
                    {selectedWarga.kecamatan}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-gray-500 flex items-center gap-1.5 mb-0.5">
                    <MapPin size={13} /> Alamat Domisili
                  </span>
                  <span className="font-medium text-gray-800">
                    {selectedWarga.alamat}
                  </span>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-500 block mb-0.5">Status Dokumen Fisik KTP</span>
                  <span className="font-bold text-emerald-700">
                    {selectedWarga.statusKtp}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedWarga(null)}
                  className="bg-black hover:bg-gray-800 text-white font-semibold px-5 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Tutup Profil Warga
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
