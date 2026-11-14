"use client";

import React from "react";

const JENIS_KTP_OPTIONS = [
  {
    id: "KTP Baru / Pertama Kali",
    title: "KTP Baru / Pertama Kali",
    description: "Untuk Anda yang belum pernah memiliki KTP Elektronik.",
  },
  {
    id: "Pembaruan / Ubah Data KTP",
    title: "Pembaruan / Ubah Data KTP",
    description: "Perubahan elemen data (alamat, pekerjaan, status, atau foto).",
  },
  {
    id: "Penggantian KTP Rusak / Hilang",
    title: "Penggantian KTP Rusak / Hilang",
    description: "Cetak ulang karena KTP-el hilang atau kondisi fisik rusak.",
  },
];

interface JenisPengajuanSectionProps {
  selectedJenis?: string;
  onSelect?: (jenis: string) => void;
}

export function JenisPengajuanSection({
  selectedJenis = "KTP Baru / Pertama Kali",
  onSelect,
}: JenisPengajuanSectionProps) {
  return (
    <div className="mb-4">
      {/* Section Title */}
      <h2 className="text-sm md:text-[15px] font-bold text-gray-900 dark:text-white mb-2">
        2. Pilih Jenis Pengajuan
      </h2>

      <div role="radiogroup" aria-label="Jenis Pengajuan KTP" className="flex flex-col gap-2.5">
        {JENIS_KTP_OPTIONS.map((option) => {
          const isSelected = selectedJenis === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect?.(option.id)}
              className={`w-full text-left bg-white dark:bg-slate-800 rounded-2xl p-3.5 px-4 flex items-center gap-3.5 transition-all cursor-pointer ${
                isSelected
                  ? "border-2 border-blue-500 dark:border-blue-400 shadow-sm ring-1 ring-blue-500/20"
                  : "border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 shadow-sm opacity-90 hover:opacity-100"
              }`}
            >
              {/* Radio Indicator */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 bg-white dark:bg-slate-900 ${
                  isSelected ? "border-[#3B82F6]" : "border-gray-300 dark:border-slate-600"
                }`}
              >
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />}
              </div>

              {/* KTP Icon Badge */}
              <div className="w-11 h-11 rounded-xl bg-[#E8F0FE] dark:bg-blue-950/60 flex items-center justify-center flex-shrink-0 shadow-inner">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2.5" fill={isSelected ? "#1D4ED8" : "#64748B"} />
                  <rect x="4.5" y="8" width="5" height="6" rx="1" fill="white" />
                  <circle cx="7" cy="10" r="1.2" fill={isSelected ? "#1D4ED8" : "#64748B"} />
                  <path
                    d="M5 13.5C5 12.5 5.8 12 7 12C8.2 12 9 12.5 9 13.5H5Z"
                    fill={isSelected ? "#1D4ED8" : "#64748B"}
                  />
                  <rect x="11.5" y="8.5" width="8" height="1.5" rx="0.75" fill="white" />
                  <rect x="11.5" y="11.5" width="6.5" height="1.5" rx="0.75" fill="white" />
                  <rect x="11.5" y="14.5" width="5" height="1.5" rx="0.75" fill="white" />
                </svg>
              </div>

              {/* Text */}
              <div className="min-w-0">
                <h3 className="font-bold text-xs md:text-sm text-gray-900 dark:text-white leading-tight">
                  {option.title}
                </h3>
                <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

