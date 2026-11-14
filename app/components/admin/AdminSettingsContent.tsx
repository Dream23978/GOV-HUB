"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  User,
  CreditCard,
  Building2,
  MapPin,
  Mail,
  Check,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { maskNik } from "@/lib/format";

export interface VerifiedAdminSession {
  id: string;
  nik: string;
  nama: string;
  email: string | null;
  role: string;
  instansi: "dinsos" | "dukcapil" | "pusat";
  tingkat: "kecamatan" | "kota" | "provinsi" | "pusat";
  wilayahLabel: string;
  canApproveFinal: boolean;
}

interface AdminSettingsContentProps {
  session: VerifiedAdminSession;
  roleTitle?: string;
}

function formatInstansiLabel(instansi: VerifiedAdminSession["instansi"]): string {
  switch (instansi) {
    case "dukcapil":
      return "Dinas Kependudukan & Pencatatan Sipil";
    case "dinsos":
      return "Dinas Sosial";
    default:
      return "Pemerintah Republik Indonesia (Pusat)";
  }
}

export function AdminSettingsContent({
  session,
  roleTitle,
}: AdminSettingsContentProps) {
  const router = useRouter();

  const displayRole = roleTitle || session.role;
  const maskedNik = maskNik(session.nik);
  const initials = session.nama
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Header */}
      <div className="flex items-start gap-2.5 sm:gap-3.5 mb-5 sm:mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1.5 -ml-1 text-gray-800 dark:text-slate-200 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer mt-0.5"
          aria-label="Kembali"
        >
          <ChevronLeft size={26} strokeWidth={2.2} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            Pengaturan &amp; Profil Petugas
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-0.5">
            Informasi akun terverifikasi berdasarkan sesi aktif kedinasan Anda.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-5 items-start">
        {/* Left Column: Avatar & Status Summary */}
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0E3F9A] to-[#0084FF] text-white flex items-center justify-center font-extrabold text-2xl shadow-md mb-3.5 select-none">
              {initials || "AD"}
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
              {session.nama}
            </h2>
            <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
              {displayRole}
            </span>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-mono mt-2">
              NIK: {maskedNik}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-slate-400">Status Sesi</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <Check size={13} strokeWidth={3} /> Aktif &amp; Terenkripsi
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-700 pt-2.5">
              <span className="text-gray-500 dark:text-slate-400">Tingkat Wewenang</span>
              <span className="font-bold text-gray-800 dark:text-slate-100 capitalize">
                {session.tingkat}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-700 pt-2.5">
              <span className="text-gray-500 dark:text-slate-400">Otoritas Penetapan</span>
              <span className="font-semibold text-gray-800 dark:text-slate-100">
                {session.canApproveFinal ? "Penuh (Final)" : "Verifikasi Wilayah"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Verified Data Grid */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
                <User size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block leading-tight">
                  Nama Lengkap
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white block truncate">
                  {session.nama}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
                <CreditCard size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block leading-tight">
                  NIK Kedinasan
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white font-mono block truncate">
                  {maskedNik}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
                <Building2 size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block leading-tight">
                  Instansi
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white block truncate">
                  {formatInstansiLabel(session.instansi)}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
                <Layers size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block leading-tight">
                  Peran / Role
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white block truncate capitalize">
                  {session.role} ({displayRole})
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block leading-tight">
                  Wilayah Kerja
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white block truncate">
                  {session.wilayahLabel}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block leading-tight">
                  Email Kedinasan
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white block truncate">
                  {session.email || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Account Verification Status Banner */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-emerald-200/90 dark:border-emerald-800/80 p-4 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck size={17} />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-[#10B981] dark:text-emerald-400 block leading-tight">
                Akun Petugas Telah Terverifikasi
              </span>
              <span className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 block mt-0.5">
                Perubahan data identitas, wilayah penugasan, atau reset kata sandi dikelola melalui menu Manajemen Akun Administrator Pusat.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
