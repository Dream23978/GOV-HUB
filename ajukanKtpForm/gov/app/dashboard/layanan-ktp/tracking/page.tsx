import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Tracking Pengajuan KTP | GOV-HUB",
  description: "Pantau status pengajuan KTP Elektronik Anda secara real-time.",
};

export default function TrackingKtpPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-6">
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
        <div>
          <h1 className="text-xl md:text-[22px] font-bold text-gray-900 dark:text-white leading-tight">
            Tracking Pengajuan KTP
          </h1>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
            Pantau status dan proses pengajuan KTP Anda secara real-time.
          </p>
        </div>
      </div>

      {/* Placeholder tracking card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-6">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Belum ada riwayat pengajuan KTP yang sedang berjalan.
        </p>
      </div>
    </div>
  );
}

