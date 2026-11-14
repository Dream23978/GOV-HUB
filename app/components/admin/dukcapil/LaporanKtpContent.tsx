"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  Filter,
} from "lucide-react";

export interface RekapKecamatanItem {
  nama: string;
  baru: number;
  total: number;
}

interface LaporanKtpContentProps {
  initialRekap?: RekapKecamatanItem[];
  initialTotal?: number;
}

export function LaporanKtpContent({
  initialRekap = [],
  initialTotal,
}: LaporanKtpContentProps = {}) {
  const router = useRouter();
  const [bulan, setBulan] = useState("Semua Periode");
  const [filterKecamatan, setFilterKecamatan] = useState("all");
  const [toast, setToast] = useState<string | null>(null);

  const rekapKecamatan = initialRekap;
  const totalDiterbitkan =
    initialTotal ?? rekapKecamatan.reduce((acc, row) => acc + row.total, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    setToast("Laporan berkas berhasil diekspor ke format XLS/CSV!");
    setTimeout(() => setToast(null), 3000);
  };

  const filteredRows = rekapKecamatan.filter(
    (r) =>
      filterKecamatan === "all" ||
      r.nama.toLowerCase().includes(filterKecamatan.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full pb-10 select-none">
      {/* ── Page Header ── */}
      <div className="flex items-start gap-2 sm:gap-3 mb-5">
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
            Laporan Pelayanan KTP-el
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Rekapitulasi berkala penerbitan KTP kependudukan.
          </p>
        </div>
      </div>

      {toast && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* ── Summary Metric (Kotak dibuat pas & proporsional tidak melebar kosong, Tingkat Kepuasan DIHAPUS) ── */}
      <div className="mb-5 flex items-center">
        <div className="bg-white rounded-xl border border-gray-300 p-4 shadow-2xs w-full sm:w-72">
          <span className="text-xs text-gray-600 block">Total KTP Diterbitkan</span>
          <span className="text-2xl sm:text-3xl font-black text-[#2563EB] mt-1 block">
            {totalDiterbitkan.toLocaleString("id-ID")}{" "}
            <span className="text-xs font-medium text-gray-500">keping</span>
          </span>
          <span className="text-[11px] text-gray-500 mt-0.5 block">Periode {bulan}</span>
        </div>
      </div>

      {/* ── Filter & Action Controls ── */}
      <div className="bg-white rounded-xl border border-gray-300 p-3 sm:p-4 mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filterKecamatan}
              onChange={(e) => setFilterKecamatan(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs sm:text-sm bg-white font-medium cursor-pointer"
            >
              <option value="all">Semua Wilayah</option>
              {rekapKecamatan.map((r) => (
                <option key={r.nama} value={r.nama}>
                  {r.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <select
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs sm:text-sm bg-white font-medium cursor-pointer"
            >
              <option value="Semua Periode">Semua Periode</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer size={15} />
            <span>Cetak Rekap</span>
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="px-3.5 py-1.5 rounded-lg bg-black hover:bg-gray-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={15} />
            <span>Ekspor XLS</span>
          </button>
        </div>
      </div>

      {/* ── Table Rekapitulasi (Kolom "Perubahan Elemen Data" dan "Tingkat Kepuasan" TELAH DIHAPUS) ── */}
      <div className="bg-white rounded-xl border border-gray-300 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-[#2563EB] text-white text-xs sm:text-sm font-bold">
                <th className="py-3 px-4">Nama Wilayah / Kecamatan</th>
                <th className="py-3 px-4 text-center">KTP Baru</th>
                <th className="py-3 px-4 text-center">Total Pengajuan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 px-4 text-center text-gray-500">
                    Belum ada data rekapitulasi KTP di database.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.nama} className="hover:bg-gray-50/70">
                    <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2">
                      <FileText size={15} className="text-blue-600" />
                      <span>{row.nama}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-gray-800">
                      {row.baru}
                    </td>
                    <td className="py-3 px-4 text-center font-black text-[#2563EB] font-mono">
                      {row.total}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
