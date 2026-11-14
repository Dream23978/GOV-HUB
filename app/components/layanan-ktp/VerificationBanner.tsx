import React from "react";

export function VerificationBanner() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm px-4 py-3.5 mb-5 flex items-center gap-3.5">
      {/* Green Shield Icon */}
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 select-none">
        <svg
          width="38"
          height="38"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield path */}
          <path
            d="M20 5C20 5 29 8 32 10.5C32 23.5 25 31.5 20 34.5C15 31.5 8 23.5 8 10.5C11 8 20 5 20 5Z"
            fill="#16A34A"
          />
          {/* Checkmark */}
          <path
            d="M15 20L18.5 23.5L25 17"
            stroke="white"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Verification Text */}
      <div>
        <p className="text-[#15803D] dark:text-green-400 font-bold text-sm leading-tight">
          Data Anda Terverifikasi
        </p>
        <p className="text-xs text-gray-800 dark:text-gray-200 font-medium mt-0.5 flex items-center gap-1.5">
          <span>NIK aktif</span>
          <span className="text-[8px] opacity-75">●</span>
          <span>Data KK Tersinkronisasi</span>
        </p>
      </div>
    </div>
  );
}

