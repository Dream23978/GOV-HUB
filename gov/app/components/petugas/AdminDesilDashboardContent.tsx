"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Inbox,
} from "lucide-react";
import { DetailPengajuanDesilView, DetailPengajuanData } from "./dinsos/DetailPengajuanDesilView";

export interface SubmissionRow {
  id: string;
  nomor: string;
  nama: string;
  desilSaatIni: string;
  statusBadge: string;
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
}

export function AdminDesilDashboardContent({
  roleTitle = "Admin Kecamatan & Kota",
  wilayah = "Kecamatan Pontianak Kota",
}: AdminDesilDashboardContentProps) {
  const router = useRouter();

  // 5 Data Pengajuan Terbaru Persis di Screenshot Mockup
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([
    {
      id: "1",
      nomor: "DESIL-2026-000124",
      nama: "Hapis Khairullah",
      desilSaatIni: "Desil 4",
      statusBadge: "Perlu Diperbarui",
      tanggal: "29 Mei 2026\n10:23 WIB",
      initial: "H",
      bgInitial: "bg-[#DCFCE7]",
      textInitial: "text-[#16A34A]",
      pekerjaan: "Tidak Bekerja",
      pendapatan: "Rp.1.000.00",
      alasan: "Kondisi ekonomi menurun & pemutusan kerja",
      housePhoto: "/sample-house.png",
      lokasi: "Pontianak Kota (Geotag Valid Terdeteksi)",
    },
    {
      id: "2",
      nomor: "DESIL-2026-000124",
      nama: "Faras Fasalah",
      desilSaatIni: "Desil 4",
      statusBadge: "Perlu Diperbarui",
      tanggal: "29 Mei 2026\n10:23 WIB",
      initial: "R",
      bgInitial: "bg-[#DBEAFE]",
      textInitial: "text-[#2563EB]",
      pekerjaan: "Buruh Harian Lepas",
      pendapatan: "Rp.900.000",
      alasan: "Penurunan penghasilan bulanan",
      housePhoto: "/sample-house.png",
      lokasi: "Pontianak Kota (Geotag Valid)",
    },
    {
      id: "3",
      nomor: "DESIL-2026-000124",
      nama: "Anisa Ramadhani",
      desilSaatIni: "Desil 4",
      statusBadge: "Perlu Diperbarui",
      tanggal: "29 Mei 2026\n10:23 WIB",
      initial: "M",
      bgInitial: "bg-[#FEF3C7]",
      textInitial: "text-[#D97706]",
      pekerjaan: "Ibu Rumah Tangga",
      pendapatan: "Rp.750.000",
      alasan: "Tanggungan anak sekolah bertambah",
      housePhoto: "/sample-house.png",
      lokasi: "Pontianak Kota (Geotag Valid)",
    },
    {
      id: "4",
      nomor: "DESIL-2026-000124",
      nama: "Nanda Anggara",
      desilSaatIni: "Desil 4",
      statusBadge: "Perlu Diperbarui",
      tanggal: "29 Mei 2026\n10:23 WIB",
      initial: "A",
      bgInitial: "bg-[#FEE2E2]",
      textInitial: "text-[#DC2626]",
      pekerjaan: "Pedagang Keliling",
      pendapatan: "Rp.1.100.000",
      alasan: "Kondisi ekonomi tidak menentu",
      housePhoto: "/sample-house.png",
      lokasi: "Pontianak Kota (Geotag Valid)",
    },
    {
      id: "5",
      nomor: "DESIL-2026-000124",
      nama: "Slamet Suito",
      desilSaatIni: "Desil 4",
      statusBadge: "Perlu Diperbarui",
      tanggal: "29 Mei 2026\n10:23 WIB",
      initial: "B",
      bgInitial: "bg-[#F3E8FF]",
      textInitial: "text-[#9333EA]",
      pekerjaan: "Pekerja Serabutan",
      pendapatan: "Rp.800.000",
      alasan: "Kondisi fisik menurun karena lansia",
      housePhoto: "/sample-house.png",
      lokasi: "Pontianak Kota (Geotag Valid)",
    },
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRow | null>(null);

  const handleApprove = (id: string) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, statusBadge: "Disetujui (Desil 2)" } : item
      )
    );
  };

  // JIKA SEDANG MEMBUKA DETAIL PENGAJUAN (100% PERSIS SEPERTI SCREENSHOT MOCKUP BARU)
  if (selectedSubmission) {
    const detailData: DetailPengajuanData = {
      nomor: selectedSubmission.nomor || "DESIL- 2026-000123",
      nama: selectedSubmission.nama || "Hapis Khairullah",
      nik: "6105438987667002",
      alamat: "JL.. Merdeka",
      tanggalPengajuan: "23 September 2026",
      statusText: selectedSubmission.statusBadge.includes("Disetujui") ? "Disetujui" : "Dalam Proses",
      housePhoto: selectedSubmission.housePhoto || "/sample-house.png",
      alamatLengkapRumah:
        selectedSubmission.lokasi ||
        "Jl. Reformasi No.15, Bansir Laut, Kec. Pontianak Tenggara, Kota Pontianak, Kalimantan Barat 78113",
      desilAwal: "Desil 4",
      desilSementara: "Desil 2",
      tanggalUpdateDesil: "02 Oktober 2026",
    };

    return (
      <DetailPengajuanDesilView
        data={detailData}
        onBack={() => setSelectedSubmission(null)}
        onApproveSuccess={() => {
          handleApprove(selectedSubmission.id);
        }}
      />
    );
  }

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
            Selamat datang, Petugas. Berikut ringkasan pengajuan peninjauan desil wilayah {wilayah}
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
                  24
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

          {/* Right Card: Banner DESIL 1-10 & DATA KESEJAHTERAAN */}
          <div className="md:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700 shadow-2xs p-2 md:p-3 flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-[96px] sm:h-[105px] rounded-xl overflow-hidden">
              <Image
                src="/desil-banner.png"
                alt="Skala Desil 1-10 & Data Kesejahteraan"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain object-center"
                priority
              />
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
    </div>
  );
}

