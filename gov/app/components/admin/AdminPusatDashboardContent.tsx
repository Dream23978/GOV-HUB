"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Inbox,
  UserCheck,
  CreditCard,
  IdCard,
  FileText,
  Search,
  ChevronDown,
  X,
  MapPin,
  Camera,
  Calendar,
  Check,
  Loader2,
  XCircle,
  Building,
  CheckCircle2,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { updateDesilSubmissionStatusAction } from "@/app/actions/admin";

export interface DesilRow {
  id: string;
  nomor: string;
  nama: string;
  nik?: string;
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

export interface KtpRow {
  id: string;
  nomor: string;
  nama: string;
  nik: string;
  layanan: string;
  statusBadge: string;
  tanggal: string;
  initial: string;
  bgInitial: string;
  textInitial: string;
  tanggalLahir?: string;
  alamat?: string;
  statusKtp?: string;
  noHp?: string;
  alasan?: string;
  verifikasiNik?: string;
  verifikasiKk?: string;
  statusPenduduk?: string;
  usia?: string;
  alasanPenolakan?: string;
}

interface AdminPusatDashboardContentProps {
  initialDesilSubmissions?: DesilRow[];
  initialDesilCounts?: {
    total: number;
    perluVerifikasi: number;
    disetujui: number;
    ditolak: number;
  };
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

export function AdminPusatDashboardContent({
  initialDesilSubmissions,
  initialDesilCounts,
}: AdminPusatDashboardContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "desil" | "ktp">("all");

  // State Submissions Desil
  const [desilList, setDesilList] = useState<DesilRow[]>(() => {
    if (initialDesilSubmissions && initialDesilSubmissions.length > 0) {
      return initialDesilSubmissions;
    }
    return [
      {
        id: "d-1",
        nomor: "DESIL-2026-000124",
        nama: "Hapis Khairullah",
        nik: "6171012305980002",
        desilSaatIni: "Desil 4",
        desilDiajukan: 2,
        statusBadge: "Perlu Diperbarui",
        statusRaw: "menunggu_verifikasi",
        tanggal: "29 Mei 2026\n10:23 WIB",
        initial: "H",
        bgInitial: "bg-[#D1FADF]",
        textInitial: "text-[#12B76A]",
        pekerjaan: "Tidak Bekerja / Buruh Lepas",
        pendapatan: "Rp 1.000.000",
        alasan: "Kondisi ekonomi menurun & pemutusan kerja",
        housePhoto: "/sample-house.png",
        lokasi: "Kecamatan Genteng, Surabaya (Geotag Valid Terdeteksi)",
      },
      {
        id: "d-2",
        nomor: "DESIL-2026-000125",
        nama: "Faras Fasalah",
        nik: "6171012305980003",
        desilSaatIni: "Desil 4",
        desilDiajukan: 2,
        statusBadge: "Perlu Diperbarui",
        statusRaw: "menunggu_verifikasi",
        tanggal: "29 Mei 2026\n10:23 WIB",
        initial: "F",
        bgInitial: "bg-[#D1E9FF]",
        textInitial: "text-[#1570EF]",
        pekerjaan: "Pedagang Kecil",
        pendapatan: "Rp 950.000",
        alasan: "Penurunan omzet usaha dan sakit berkepanjangan",
        housePhoto: "/sample-house.png",
        lokasi: "Kecamatan Pontianak Kota (Geotag Valid Terdeteksi)",
      },
      {
        id: "d-3",
        nomor: "DESIL-2026-000126",
        nama: "Anisa Ramadhani",
        nik: "6171012305980004",
        desilSaatIni: "Desil 4",
        desilDiajukan: 3,
        statusBadge: "Perlu Diperbarui",
        statusRaw: "menunggu_verifikasi",
        tanggal: "29 Mei 2026\n10:23 WIB",
        initial: "A",
        bgInitial: "bg-[#FEF0C7]",
        textInitial: "text-[#DC6803]",
        pekerjaan: "Ibu Rumah Tangga",
        pendapatan: "Rp 800.000",
        alasan: "Kepala keluarga wafat, tanggungan 3 anak sekolah",
        housePhoto: "/sample-house.png",
        lokasi: "Kecamatan Gubeng, Surabaya (Geotag Valid Terdeteksi)",
      },
      {
        id: "d-4",
        nomor: "DESIL-2026-000127",
        nama: "Nanda Anggara",
        nik: "6171012305980005",
        desilSaatIni: "Desil 4",
        desilDiajukan: 2,
        statusBadge: "Perlu Diperbarui",
        statusRaw: "menunggu_verifikasi",
        tanggal: "29 Mei 2026\n10:23 WIB",
        initial: "N",
        bgInitial: "bg-[#FCE7F6]",
        textInitial: "text-[#C11574]",
        pekerjaan: "Pekerja Bangunan Harian",
        pendapatan: "Rp 1.100.000",
        alasan: "Ketiadaan pekerjaan tetap dan rumah sewa",
        housePhoto: "/sample-house.png",
        lokasi: "Kecamatan Pontianak Selatan (Geotag Valid Terdeteksi)",
      },
      {
        id: "d-5",
        nomor: "DESIL-2026-000128",
        nama: "Slamet Suito",
        nik: "6171012305980006",
        desilSaatIni: "Desil 4",
        desilDiajukan: 1,
        statusBadge: "Perlu Diperbarui",
        statusRaw: "menunggu_verifikasi",
        tanggal: "29 Mei 2026\n10:23 WIB",
        initial: "S",
        bgInitial: "bg-[#F3E8FF]",
        textInitial: "text-[#9333EA]",
        pekerjaan: "Lansia / Petani Penggarap",
        pendapatan: "Rp 600.000",
        alasan: "Kondisi fisik menurun drastis, butuh bansos PKH",
        housePhoto: "/sample-house.png",
        lokasi: "Kecamatan Tegalsari, Surabaya (Geotag Valid Terdeteksi)",
      },
    ];
  });

  // State Submissions KTP (100% Sesuai Mockup)
  const [ktpList, setKtpList] = useState<KtpRow[]>([
    {
      id: "ktp-1",
      nomor: "KTP – 2026 – 001",
      nama: "Ahmed Slamed",
      nik: "012412412124",
      layanan: "KTP Baru",
      statusBadge: "Menunggu Verifikasi",
      tanggal: "02 okt 2026",
      initial: "A",
      bgInitial: "bg-[#DCFCE7]",
      textInitial: "text-[#16A34A]",
      tanggalLahir: "02/09/2026",
      alamat: "Pontinak Kota",
      statusKtp: "Belum memiliki KTP",
      noHp: "083423423423",
      alasan: "Baru berusia 17 tahun",
      verifikasiNik: "Terverifikasi",
      verifikasiKk: "Terverifikasi",
      statusPenduduk: "Aktif",
      usia: "17 Tahun",
    },
    {
      id: "ktp-2",
      nomor: "KTP – 2026 – 002",
      nama: "Hapis Khairullah",
      nik: "6104342342342301",
      layanan: "KTP Baru",
      statusBadge: "Menunggu Verifikasi",
      tanggal: "02/09/2026",
      initial: "H",
      bgInitial: "bg-[#DBEAFE]",
      textInitial: "text-[#2563EB]",
      tanggalLahir: "06/05/2009",
      alamat: "Jl. Merdeka Barat No. 12, Pontianak Kota",
      statusKtp: "Belum memiliki KTP",
      noHp: "0812334561579",
      alasan: "Baru berusia 17 tahun",
      verifikasiNik: "Terverifikasi",
      verifikasiKk: "Terverifikasi",
      statusPenduduk: "Aktif",
      usia: "17 Tahun",
    },
    {
      id: "ktp-3",
      nomor: "KTP – 2026 – 003",
      nama: "Rudi Hartono",
      nik: "6171015409890031",
      layanan: "KTP Hilang/Rusak",
      statusBadge: "Siap Dicetak",
      tanggal: "15/09/2026",
      initial: "R",
      bgInitial: "bg-[#FEF3C7]",
      textInitial: "text-[#D97706]",
      tanggalLahir: "24/05/1988",
      alamat: "Jl. Tanjungpura No. 5, Pontianak",
      statusKtp: "KTP Rusak",
      noHp: "081344556677",
      alasan: "KTP fisik patah dan chip tidak terbaca",
      verifikasiNik: "Terverifikasi",
      verifikasiKk: "Terverifikasi",
      statusPenduduk: "Aktif",
      usia: "38 Tahun",
    },
  ]);

  // Counts
  const desilCounts = useMemo(() => {
    if (initialDesilCounts) return initialDesilCounts;
    const total = desilList.length;
    const perluVerifikasi = desilList.filter(
      (d) => d.statusRaw === "menunggu_verifikasi" || d.statusBadge.includes("Perlu")
    ).length;
    const disetujui = desilList.filter((d) => d.statusRaw === "disetujui").length;
    const ditolak = desilList.filter((d) => d.statusRaw === "ditolak").length;
    return { total: total || 1248, perluVerifikasi: perluVerifikasi || 342, disetujui: disetujui || 786, ditolak: ditolak || 120 };
  }, [desilList, initialDesilCounts]);

  // Filter & Search Desil
  const [searchDesil, setSearchDesil] = useState("");
  const [filterStatusDesil, setFilterStatusDesil] = useState("all");

  const filteredDesil = useMemo(() => {
    return desilList.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchDesil.toLowerCase()) ||
        item.nomor.toLowerCase().includes(searchDesil.toLowerCase()) ||
        (item.nik && item.nik.includes(searchDesil));

      const matchStatus =
        filterStatusDesil === "all" ||
        (filterStatusDesil === "menunggu" &&
          (item.statusRaw === "menunggu_verifikasi" || item.statusBadge.includes("Perlu"))) ||
        (filterStatusDesil === "disetujui" && item.statusRaw === "disetujui") ||
        (filterStatusDesil === "ditolak" && item.statusRaw === "ditolak");

      return matchSearch && matchStatus;
    });
  }, [desilList, searchDesil, filterStatusDesil]);

  // Modal Detail Desil
  const [selectedDesil, setSelectedDesil] = useState<DesilRow | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  // Modal Detail KTP & Blangko
  const [selectedKtp, setSelectedKtp] = useState<KtpRow | null>(null);
  const [blangkoStatusKtp, setBlangkoStatusKtp] = useState<"tersedia" | "habis">("tersedia");
  const [blangkoStockKtp, setBlangkoStockKtp] = useState<number>(10000);
  const [showBlangkoDropdownKtp, setShowBlangkoDropdownKtp] = useState<boolean>(true);
  const [showKtpRejectInput, setShowKtpRejectInput] = useState<boolean>(false);
  const [ktpRejectReason, setKtpRejectReason] = useState<string>("");
  const [ktpFeedback, setKtpFeedback] = useState<string | null>(null);

  const handleUpdateDesilStatus = async (status: "disetujui" | "ditolak") => {
    if (!selectedDesil) return;
    setIsProcessing(true);
    setModalFeedback(null);

    try {
      if (!selectedDesil.id.startsWith("d-")) {
        await updateDesilSubmissionStatusAction({
          id: selectedDesil.id,
          status,
          desilHasil: status === "disetujui" ? selectedDesil.desilDiajukan || 2 : undefined,
          catatan:
            status === "disetujui"
              ? "Disetujui oleh Administrator Pusat GOV-HUB setelah evaluasi komprehensif."
              : "Ditolak oleh Administrator Pusat GOV-HUB karena data belum memenuhi indikator kemiskinan ekstrem.",
        });
      }

      setDesilList((prev) =>
        prev.map((item) => {
          if (item.id === selectedDesil.id) {
            const badge =
              status === "disetujui"
                ? `Disetujui (Desil ${item.desilDiajukan || 2})`
                : "Ditolak";
            return {
              ...item,
              statusRaw: status,
              statusBadge: badge,
            };
          }
          return item;
        })
      );

      setModalFeedback(
        status === "disetujui"
          ? `Pengajuan berhasil disetujui menjadi Desil ${selectedDesil.desilDiajukan || 2}!`
          : "Pengajuan telah ditolak."
      );
      setTimeout(() => {
        setSelectedDesil(null);
        setModalFeedback(null);
      }, 1100);
    } catch {
      setModalFeedback("Gagal memperbarui status pengajuan.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveKtp = (id: string) => {
    if (blangkoStatusKtp === "tersedia") {
      setBlangkoStockKtp((prev) => Math.max(0, prev - 1));
    }
    setKtpList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, statusBadge: "Disetujui & Dicetak" } : item
      )
    );
    setKtpFeedback(
      blangkoStatusKtp === "tersedia"
        ? `Pengajuan KTP disetujui! 1 blangko KTP dialokasikan (Sisa stok: ${(blangkoStockKtp - 1).toLocaleString("id-ID")}).`
        : "Pengajuan KTP disetujui dan masuk antrean cetak (Stok blangko sedang habis)."
    );
    setTimeout(() => {
      setSelectedKtp(null);
      setKtpFeedback(null);
      setShowKtpRejectInput(false);
      setKtpRejectReason("");
    }, 1100);
  };

  const handleRejectKtp = (id: string) => {
    if (!ktpRejectReason.trim()) return;
    setKtpList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, statusBadge: "Ditolak", alasanPenolakan: ktpRejectReason.trim() }
          : item
      )
    );
    setKtpFeedback(`Pengajuan KTP ditolak: "${ktpRejectReason.trim()}".`);
    setTimeout(() => {
      setSelectedKtp(null);
      setKtpFeedback(null);
      setShowKtpRejectInput(false);
      setKtpRejectReason("");
    }, 1100);
  };

  return (
    <div className="space-y-7 pb-16">
      {/* Top Banner / Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B254E] via-[#0E3A78] to-[#124B99] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-blue-200">
              <ShieldCheck size={14} className="text-[#38BDF8]" />
              <span>Portal Terpadu Admin Pusat • Republik Indonesia</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Dashboard Terpadu GOV-HUB
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl leading-relaxed">
              Integrasi verifikasi dan penetapan klasifikasi desil bantuan sosial (DTKS Kemensos) serta manajemen pelayanan kependudukan (Ditjen Dukcapil) secara nasional.
            </p>
          </div>

          {/* Quick tab switcher */}
          <div className="flex bg-[#071935]/80 p-1.5 rounded-2xl border border-white/15 self-start md:self-auto backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-[#0084FF] text-white shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Semua Layanan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("desil")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "desil"
                  ? "bg-[#0084FF] text-white shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Layanan Desil (DTKS)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ktp")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "ktp"
                  ? "bg-[#0084FF] text-white shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Layanan KTP-el
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 1. RINGKASAN PENGAJUAN DESIL (DTKS NASIONAL) */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "desil") && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0084FF]" />
                Ringkasan Pengajuan Desil (DTKS Nasional)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Statistik status peninjauan dan penetapan desil kesejahteraan keluarga warga.
              </p>
            </div>
            <Link
              href="/admin/dashboard/pengajuan-desil"
              className="text-xs font-bold text-[#0084FF] hover:underline flex items-center gap-1"
            >
              Buka Semua Desil <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-[#122240] rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-white/10 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Pengajuan</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#0084FF] flex items-center justify-center">
                  <Inbox size={16} />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {desilCounts.total.toLocaleString("id-ID")}
                </span>
                <span className="text-[11px] text-slate-400 ml-1.5">ajuan</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#122240] rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-white/10 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Perlu Verifikasi</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                  Perlu Cek Lapangan
                </span>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-500">
                  {desilCounts.perluVerifikasi.toLocaleString("id-ID")}
                </span>
                <span className="text-[11px] text-slate-400 ml-1.5">berkas</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#122240] rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-white/10 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Disetujui</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                  Penetapan Desil
                </span>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500">
                  {desilCounts.disetujui.toLocaleString("id-ID")}
                </span>
                <span className="text-[11px] text-slate-400 ml-1.5">ditetapkan</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#122240] rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-white/10 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Ditolak</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
                  Tidak Memenuhi Syarat
                </span>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-500">
                  {desilCounts.ditolak.toLocaleString("id-ID")}
                </span>
                <span className="text-[11px] text-slate-400 ml-1.5">berkas</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. STATISTIK KTP DUKCAPIL */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "ktp") && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                Ringkasan Pelayanan KTP-el (Ditjen Dukcapil Pusat)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Perekaman biometrik, pencetakan blangko KTP, dan penerbitan identitas kependudukan.
              </p>
            </div>
            <Link
              href="/admin/dashboard/pengajuan-ktp"
              className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
            >
              Buka Semua KTP <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-[#122240] rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-white/10 shadow-sm">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Pengajuan KTP</span>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                1.850 <span className="text-xs font-normal text-slate-400">berkas</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#122240] rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-white/10 shadow-sm">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Menunggu Verifikasi</span>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-500">
                412 <span className="text-xs font-normal text-slate-400">antrean</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#122240] rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-white/10 shadow-sm">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">KTP Dicetak & Selesai</span>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-500">
                1.398 <span className="text-xs font-normal text-slate-400">keping</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#122240] rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-white/10 shadow-sm">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Stok Blangko Nasional</span>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-sky-500">
                {blangkoStockKtp.toLocaleString("id-ID")} <span className="text-xs font-normal text-slate-400">blangko</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. KLASIFIKASI DESIL 1–10 */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "desil") && (
        <section className="bg-white dark:bg-[#122240] rounded-3xl p-5 sm:p-7 border border-slate-100 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-white/10">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={18} className="text-[#0084FF]" />
                Klasifikasi Desil 1–10 (Tingkat Kesejahteraan DTKS)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pedoman resmi pengelompokan 10 kategori tingkat kesejahteraan ekonomi keluarga Republik Indonesia.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {DESIL_CRITERIA.map((d) => (
              <div
                key={d.level}
                className="rounded-2xl p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/5 flex flex-col justify-between hover:border-blue-400/50 transition-all hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-md shadow-xs ${d.badgeColor}`}>
                      DESIL {d.level}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {d.persen}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    {d.kategori}
                  </h3>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Prioritas Bansos</span>
                  <span className="font-bold text-slate-600 dark:text-slate-300">
                    {d.level <= 3 ? "Tinggi" : d.level <= 5 ? "Sedang" : "Mandiri"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. DAFTAR PENGAJUAN DESIL MASUK */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "desil") && (
        <section className="bg-white dark:bg-[#122240] rounded-3xl p-5 sm:p-7 border border-slate-100 dark:border-white/10 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Pengajuan Peninjauan Desil Masuk
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola, evaluasi, dan lakukan penetapan desil langsung pada level pusat.
              </p>
            </div>
            <Link
              href="/admin/dashboard/pengajuan-desil"
              className="text-xs font-bold text-[#0084FF] hover:underline"
            >
              Lihat di Halaman Penuh →
            </Link>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchDesil}
                onChange={(e) => setSearchDesil(e.target.value)}
                placeholder="Cari NIK / Nama pemohon desil..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40 text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0084FF]"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatusDesil}
                onChange={(e) => setFilterStatusDesil(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-hidden"
              >
                <option value="all">Semua Status</option>
                <option value="menunggu">Perlu Verifikasi</option>
                <option value="disetujui">Disetujui</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
          </div>

          {/* Submissions List Desil */}
          <div className="divide-y divide-slate-100 dark:divide-white/5 border border-slate-100 dark:border-white/10 rounded-2xl overflow-hidden">
            {filteredDesil.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Tidak ada data pengajuan desil yang cocok dengan pencarian.
              </div>
            ) : (
              filteredDesil.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-full ${item.bgInitial} ${item.textInitial} flex items-center justify-center font-bold text-base flex-shrink-0`}
                    >
                      {item.initial}
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400">
                        {item.nomor}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.nama}
                      </h4>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.desilSaatIni}
                        {item.desilDiajukan && (
                          <span className="text-[#0084FF] font-semibold ml-1">
                            → Ajuan: Desil {item.desilDiajukan}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-14 sm:pl-0">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        item.statusRaw === "disetujui"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                          : item.statusRaw === "ditolak"
                          ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                          : "bg-[#E0F2FE] text-[#0284C7] dark:bg-sky-950/50 dark:text-sky-300"
                      }`}
                    >
                      {item.statusBadge}
                    </span>

                    <span className="hidden md:block text-[11px] text-slate-400 text-right whitespace-pre-line leading-tight">
                      {item.tanggal}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedDesil(item)}
                      className="px-4 py-1.5 rounded-xl border border-slate-300 dark:border-white/20 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-[#0084FF] hover:text-white hover:border-[#0084FF] transition-all cursor-pointer shadow-xs"
                    >
                      Lihat
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. DAFTAR PENGAJUAN KTP MASUK */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "ktp") && (
        <section className="bg-white dark:bg-[#122240] rounded-3xl p-5 sm:p-7 border border-slate-100 dark:border-white/10 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                Pengajuan KTP-el Masuk (Ditjen Dukcapil Pusat)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pemeriksaan berkas kependudukan, validasi stok blangko KTP, dan persetujuan / penolakan penerbitan.
              </p>
            </div>
            <Link
              href="/admin/dashboard/pengajuan-ktp"
              className="text-xs font-bold text-sky-600 hover:underline"
            >
              Buka Manajemen Lengkap KTP →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5 border border-slate-100 dark:border-white/10 rounded-2xl overflow-hidden">
            {ktpList.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-full ${item.bgInitial} ${item.textInitial} flex items-center justify-center font-bold text-base flex-shrink-0`}
                  >
                    {item.initial}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      {item.nomor}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.nama}
                    </h4>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.layanan} • <span className="font-mono">{item.nik}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-14 sm:pl-0">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      item.statusBadge === "Ditolak"
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                        : item.statusBadge.includes("Disetujui") || item.statusBadge.includes("Selesai")
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                    }`}
                  >
                    {item.statusBadge}
                  </span>

                  <span className="hidden md:block text-[11px] text-slate-400 text-right whitespace-pre-line leading-tight">
                    {item.tanggal}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedKtp(item);
                      setShowKtpRejectInput(false);
                      setKtpRejectReason("");
                    }}
                    className="px-4 py-1.5 rounded-xl border border-slate-300 dark:border-white/20 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all cursor-pointer shadow-xs"
                  >
                    Lihat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL DETAIL DESIL */}
      {/* ========================================================================= */}
      {selectedDesil && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-[#122240] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 dark:border-white/10 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${selectedDesil.bgInitial} ${selectedDesil.textInitial} font-bold text-base flex items-center justify-center`}
                >
                  {selectedDesil.initial}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedDesil.nama}
                  </h3>
                  <div className="text-xs text-slate-400">
                    Tiket: {selectedDesil.nomor}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDesil(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {modalFeedback && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#0084FF] text-xs font-semibold text-center">
                {modalFeedback}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <span className="text-slate-400 block text-[10px]">Pekerjaan Kepala Keluarga</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {selectedDesil.pekerjaan || "Buruh Lepas / Tidak Tetap"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <span className="text-slate-400 block text-[10px]">Penghasilan Bulanan</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {selectedDesil.pendapatan || "Rp 900.000"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <span className="text-slate-400 block text-[10px]">Desil Saat Ini</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {selectedDesil.desilSaatIni}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50">
                <span className="text-blue-500 block text-[10px] font-semibold">Desil Diajukan</span>
                <span className="font-extrabold text-[#0084FF] mt-0.5 block">
                  Desil {selectedDesil.desilDiajukan || 2}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                Alasan Peninjauan Desil
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedDesil.alasan || "Kondisi ekonomi keluarga mengalami penurunan signifikan akibat ketiadaan mata pencaharian tetap."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Camera size={14} className="text-[#0084FF]" />
                  Dokumentasi Lapangan & Geotagging
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Check size={12} /> Geotag Valid
                </span>
              </div>

              <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10">
                <Image
                  src={selectedDesil.housePhoto || "/sample-house.png"}
                  alt="Foto Rumah Warga"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-[11px] flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#38BDF8] flex-shrink-0" />
                  <span className="truncate">{selectedDesil.lokasi || "Lokasi Rumah Terverifikasi GPS"}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedDesil(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                Tutup
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleUpdateDesilStatus("ditolak")}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <XCircle size={14} />
                <span>Tolak Pengajuan</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleUpdateDesilStatus("disetujui")}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#0084FF] hover:bg-[#0070D6] text-white text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <FileText size={14} />
                )}
                <span>Setujui Peninjauan Desil (Ubah ke Desil {selectedDesil.desilDiajukan || 2})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL DETAIL KTP (100% SESUAI MOCKUP PENGGUNA) */}
      {/* ========================================================================= */}
      {selectedKtp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in"
        >
          <div className="bg-white dark:bg-[#101F3C] rounded-2xl w-full max-w-xl shadow-2xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-2 mb-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base">
                <span className="font-extrabold text-slate-900 dark:text-white">
                  Detail Pengajuan KTP
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-300">
                  {selectedKtp.nomor}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedKtp(null);
                  setShowKtpRejectInput(false);
                  setKtpRejectReason("");
                }}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-black dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <hr className="border-t border-gray-300 dark:border-white/10 mb-4" />

            {ktpFeedback && (
              <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#0084FF] text-xs font-semibold text-center">
                {ktpFeedback}
              </div>
            )}

            {/* 1. DATA PEMOHON */}
            <div className="space-y-1.5 mb-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Data Pemohon
              </h4>
              <div className="border border-slate-300 dark:border-white/15 rounded-xl p-3.5 space-y-1.5 text-xs sm:text-sm bg-white dark:bg-slate-900/40">
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Nama</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedKtp.nama}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">NIK</span>
                  <span className="text-slate-900 dark:text-white font-mono">{selectedKtp.nik}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Tanggal Lahir</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedKtp.tanggalLahir || "02/09/2026"}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Alamat</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedKtp.alamat || "Pontianak Kota"}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Status KTP</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedKtp.statusKtp || "Belum memiliki KTP"}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">No HP</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedKtp.noHp || "083423423423"}</span>
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
                  <span className="text-slate-900 dark:text-white font-normal">{selectedKtp.layanan}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Tanggal Pengajuan</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedKtp.tanggal}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Alasan</span>
                  <span className="text-slate-900 dark:text-white font-normal">{selectedKtp.alasan || "Baru berusia 17 tahun"}</span>
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
                  <span className="text-slate-900 dark:text-white font-medium">{selectedKtp.verifikasiNik || "Terverifikasi"}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Data KK</span>
                  <span className="text-slate-900 dark:text-white font-medium">{selectedKtp.verifikasiKk || "Terverifikasi"}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Status Penduduk</span>
                  <span className="text-slate-900 dark:text-white font-medium">{selectedKtp.statusPenduduk || "Aktif"}</span>
                </div>
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[160px_1fr] py-0.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Usia</span>
                  <span className="text-slate-900 dark:text-white font-medium">{selectedKtp.usia || "17 Tahun"}</span>
                </div>
              </div>
            </div>

            {/* 4. KETERSEDIAAN BLANGKO KTP */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowBlangkoDropdownKtp((prev) => !prev)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>Ketersedian Blangko</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    blangkoStatusKtp === "tersedia" ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <ChevronDown size={14} className="text-slate-600 dark:text-slate-400" />
              </button>

              {showBlangkoDropdownKtp && (
                <div className="mt-2.5 p-3.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900/90 shadow-sm space-y-3 max-w-sm animate-in fade-in">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    Status Blangko KTP
                  </h5>

                  <label
                    onClick={() => setBlangkoStatusKtp("tersedia")}
                    className="flex items-start gap-2.5 cursor-pointer group"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center transition-colors ${
                        blangkoStatusKtp === "tersedia"
                          ? "border-emerald-600 bg-white dark:bg-slate-800"
                          : "border-slate-300 dark:border-slate-600 group-hover:border-slate-400"
                      }`}
                    >
                      {blangkoStatusKtp === "tersedia" && (
                        <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Tersedia
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Blangko KTP Tersedia siap di gunakan ({blangkoStockKtp.toLocaleString("id-ID")})
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => setBlangkoStatusKtp("habis")}
                    className="flex items-start gap-2.5 cursor-pointer group"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center transition-colors ${
                        blangkoStatusKtp === "habis"
                          ? "border-amber-600 bg-white dark:bg-slate-800"
                          : "border-slate-300 dark:border-slate-600 group-hover:border-slate-400"
                      }`}
                    >
                      {blangkoStatusKtp === "habis" && (
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

            {/* Catatan Alasan Penolakan */}
            {selectedKtp.statusBadge === "Ditolak" && selectedKtp.alasanPenolakan && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs">
                <span className="font-bold text-rose-700 dark:text-rose-400 block mb-0.5">
                  Pengajuan Ini Telah Ditolak:
                </span>
                <p className="text-rose-600 dark:text-rose-300">
                  Alasan: {selectedKtp.alasanPenolakan}
                </p>
              </div>
            )}

            {/* 5. FORM INPUT ALASAN PENOLAKAN */}
            {showKtpRejectInput && (
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
                  value={ktpRejectReason}
                  onChange={(e) => setKtpRejectReason(e.target.value)}
                  placeholder="Ketik alasan penolakan pengajuan KTP (contoh: Foto dokumen biometrik buram, NIK tidak sesuai data KK, domisili tidak terverifikasi)..."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-slate-400"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowKtpRejectInput(false);
                      setKtpRejectReason("");
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={!ktpRejectReason.trim()}
                    onClick={() => handleRejectKtp(selectedKtp.id)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 cursor-pointer shadow-xs transition-colors"
                  >
                    Konfirmasi Tolak Pengajuan
                  </button>
                </div>
              </div>
            )}

            {/* 6. ACTION BUTTONS */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedKtp(null);
                  setShowKtpRejectInput(false);
                  setKtpRejectReason("");
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Tutup
              </button>

              {!showKtpRejectInput && selectedKtp.statusBadge !== "Ditolak" && (
                <button
                  type="button"
                  onClick={() => setShowKtpRejectInput(true)}
                  className="px-4 py-2 rounded-lg text-xs font-bold border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle size={14} />
                  <span>Tolak Pengajuan</span>
                </button>
              )}

              {selectedKtp.statusBadge !== "Ditolak" && (
                <button
                  type="button"
                  onClick={() => handleApproveKtp(selectedKtp.id)}
                  className="px-6 py-2 rounded-lg text-xs font-bold bg-[#15803D] hover:bg-[#166534] text-white transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={15} />
                  <span>Setuju</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
