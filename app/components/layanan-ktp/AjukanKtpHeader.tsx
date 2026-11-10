"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function AjukanKtpHeader() {
  return (
    <div className="flex items-center gap-3.5 mb-5">
      {/* Circular back button */}
      <Link
        href="/dashboard/layanan-ktp"
        className="w-10 h-10 rounded-full bg-[#1b2b54] hover:bg-[#142040] flex items-center justify-center transition-all duration-200 shadow-sm flex-shrink-0 group"
        aria-label="Kembali ke Layanan KTP"
      >
        <ChevronLeft
          size={22}
          className="text-white ml-[-1px] group-hover:-translate-x-0.5 transition-transform"
          strokeWidth={2.4}
        />
      </Link>

      {/* Header title & subtitle */}
      <div>
        <h1 className="text-xl md:text-[22px] font-bold text-gray-900 dark:text-white leading-tight">
          Ajukan KTP Baru
        </h1>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">
          Pengajuan KTP Elektronil tanpa fotokopi berkas.
        </p>
      </div>
    </div>
  );
}

