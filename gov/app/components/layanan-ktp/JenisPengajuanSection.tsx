"use client";

import React from "react";

export function JenisPengajuanSection() {
  return (
    <div className="mb-4">
      {/* Section Title */}
      <h2 className="text-sm md:text-[15px] font-bold text-gray-900 dark:text-white mb-2">
        2. Pilih Jenis Pengajuan
      </h2>

      {/* Selected Option Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-blue-400 dark:border-blue-500 shadow-sm p-3.5 px-4 flex items-center gap-3.5 select-none">
        {/* Radio Indicator */}
        <div className="w-5 h-5 rounded-full border-2 border-[#3B82F6] flex items-center justify-center flex-shrink-0 bg-white dark:bg-slate-900">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
        </div>

        {/* KTP Icon Badge */}
        <div className="w-11 h-11 rounded-xl bg-[#E8F0FE] dark:bg-blue-950/60 flex items-center justify-center flex-shrink-0 shadow-inner">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Card outline */}
            <rect
              x="2"
              y="5"
              width="20"
              height="14"
              rx="2.5"
              fill="#1D4ED8"
            />
            {/* Photo placeholder on left */}
            <rect x="4.5" y="8" width="5" height="6" rx="1" fill="white" />
            <circle cx="7" cy="10" r="1.2" fill="#1D4ED8" />
            <path
              d="M5 13.5C5 12.5 5.8 12 7 12C8.2 12 9 12.5 9 13.5H5Z"
              fill="#1D4ED8"
            />
            {/* Lines on right */}
            <rect x="11.5" y="8.5" width="8" height="1.5" rx="0.75" fill="white" />
            <rect x="11.5" y="11.5" width="6.5" height="1.5" rx="0.75" fill="white" />
            <rect x="11.5" y="14.5" width="5" height="1.5" rx="0.75" fill="white" />
          </svg>
        </div>

        {/* Text */}
        <div>
          <h3 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white leading-tight">
            KTP Baru / Pertama Kali
          </h3>
          <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
            Untuk anda yang belum pernah memiliki KTP Eletronik
          </p>
        </div>
      </div>
    </div>
  );
}

