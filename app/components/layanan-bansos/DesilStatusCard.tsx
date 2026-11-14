"use client";

import React from "react";
import { Check } from "lucide-react";

interface DesilStatusCardProps {
  desil?: number | string;
  penetapanTerakhir?: string;
  sumberData?: string[];
  statusText?: string;
}

export function DesilStatusCard({
  desil = "-",
  penetapanTerakhir = "-",
  sumberData = ["DTKS", "BPS", "Dukcapil"],
  statusText = "Terdaftar dalam Data Kesejahteraan",
}: DesilStatusCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-5 md:p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-8">
        {/* Left Side: Icon, Label, Desil, and Badge */}
        <div className="flex items-start sm:items-center gap-4 flex-1">
          {/* Blue Family / Users Icon Badge */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#E8F0FE] dark:bg-blue-950/60 flex items-center justify-center flex-shrink-0 text-[#2563EB] dark:text-blue-400 select-none shadow-xs">
            <svg
              className="w-8 h-8 sm:w-9 sm:h-9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Center User */}
              <circle cx="12" cy="7" r="3" />
              <path d="M6 19v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" />
              {/* Left User */}
              <circle cx="6" cy="9" r="2.2" />
              <path d="M2 19v-1a3 3 0 0 1 3-3h1" />
              {/* Right User */}
              <circle cx="18" cy="9" r="2.2" />
              <path d="M18 15h1a3 3 0 0 1 3 3v1" />
            </svg>
          </div>

          {/* Texts */}
          <div className="flex flex-col">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-tight uppercase">
              DESIL SAAT INI
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight mt-0.5">
              Desil {desil}
            </span>

            {/* Status Pill Badge */}
            <div className="mt-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#CBE9D2] dark:bg-emerald-950/70 text-[#14532D] dark:text-emerald-300 text-xs font-semibold select-none border border-emerald-300/40 dark:border-emerald-800/40">
                <span className="w-4 h-4 rounded-full bg-[#14532D] dark:bg-emerald-500 text-white dark:text-emerald-950 flex items-center justify-center flex-shrink-0">
                  <Check size={11} strokeWidth={3.5} />
                </span>
                <span>{statusText}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Vertical Divider (Desktop) */}
        <div className="hidden md:block w-px self-stretch bg-gray-200 dark:bg-slate-700" />

        {/* Right Side: Penetapan & Sumber Data */}
        <div className="flex flex-col justify-center gap-3.5 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-slate-700 md:min-w-[220px]">
          {/* Penetapan Terakhir */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white">
              Penetapan Terakhir
            </h4>
            <p className="text-xs sm:text-[13px] text-gray-700 dark:text-gray-300 mt-0.5 font-medium">
              {penetapanTerakhir}
            </p>
          </div>

          {/* Sumber Data */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white">
              Sumber Data
            </h4>
            <div className="text-xs sm:text-[13px] text-gray-700 dark:text-gray-300 mt-0.5 flex items-center gap-3 font-medium">
              {sumberData.map((sumber) => (
                <span key={sumber}>{sumber}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

