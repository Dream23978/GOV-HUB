import React from "react";
import { ChevronDown } from "lucide-react";

export interface TrackingData {
  nomorPengajuan: string;
  statusSaatIni: string;
  tanggalPengajuan: string;
  statusBadge: string;
  statusRaw?: string;
}

interface TrackingKtpCardProps {
  data?: TrackingData;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function TrackingKtpCard({
  data,
  isOpen = false,
  onToggle,
  className = "",
}: TrackingKtpCardProps) {
  const nomorPengajuan = data?.nomorPengajuan || "-";
  const statusSaatIni = data?.statusSaatIni || "-";
  const tanggalPengajuan = data?.tanggalPengajuan || "-";
  const statusBadge = data?.statusBadge || "Belum Ada";

  const isConfirmed =
    statusBadge.toLowerCase() === "terkonfirmasi" ||
    statusBadge.toLowerCase() === "selesai";

  return (
    <div
      onClick={onToggle}
      className={`bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-5 md:p-6 w-full transition-all group ${
        onToggle ? "cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md" : ""
      } ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-3 md:pb-4">
        {/* Left: Blue Icon Badge & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white flex-shrink-0 shadow-sm select-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Document sheet with folded corner */}
              <path
                d="M6 3.5C6 2.67157 6.67157 2 7.5 2H14.5L19 6.5V20.5C19 21.3284 18.3284 22 17.5 22H7.5C6.67157 22 6 21.3284 6 20.5V3.5Z"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Folded edge */}
              <path
                d="M14 2V7H19"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Text lines */}
              <line
                x1="9"
                y1="11"
                x2="15"
                y2="11"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <line
                x1="9"
                y1="15"
                x2="16"
                y2="15"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <line
                x1="9"
                y1="18.5"
                x2="13"
                y2="18.5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className="text-sm md:text-base font-bold text-gray-900 dark:text-white leading-tight">
            Informasi Pengajuan
          </h2>
        </div>

        {/* Right: Status Pill Badge & Chevron */}
        <div className="flex items-center gap-2.5">
          <div
            className={`font-semibold text-xs md:text-[13px] px-4 py-1.5 rounded-full select-none shadow-xs ${
              isConfirmed
                ? "bg-[#E8F8EE] dark:bg-green-950/60 text-[#16A34A] dark:text-green-400"
                : "bg-[#FDEEDB] dark:bg-amber-950/60 text-[#D97706] dark:text-amber-400"
            }`}
          >
            {statusBadge}
          </div>
          {onToggle && (
            <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-slate-700/60 flex items-center justify-center text-gray-500 group-hover:text-blue-600 transition-colors">
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom 3-Column Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Column 1: Nomor Pengajuan */}
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal block">
            Nomor Pengajuan
          </span>
          <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white mt-1.5 tracking-tight">
            {nomorPengajuan}
          </p>
        </div>

        {/* Column 2: Status Saat Ini */}
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal block">
            Status Saat Ini
          </span>
          <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white mt-1.5 tracking-tight">
            {statusSaatIni}
          </p>
        </div>

        {/* Column 3: Tanggal Pengajuan */}
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal block">
            Tanggal Pengajuan
          </span>
          <p className="text-xs md:text-sm font-bold text-gray-900 dark:text-white mt-1.5 tracking-tight">
            {tanggalPengajuan}
          </p>
        </div>
      </div>

      {/* Bottom Subtle Dropdown Hint */}
      {onToggle && (
        <div className="border-t border-gray-100 dark:border-slate-700/60 mt-4 pt-3 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium">
          <span>{isOpen ? "Sembunyikan Rincian Pelacakan" : "Klik untuk Lihat Rincian Status Pelacakan"}</span>
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-normal">
            {isOpen ? "Tutup" : "Buka Detail"}
          </span>
        </div>
      )}
    </div>
  );
}
