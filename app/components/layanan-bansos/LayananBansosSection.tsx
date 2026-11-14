"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function LayananBansosSection() {
  return (
    <div className="mt-6">
      {/* Section Title */}
      <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3">
        Layanan
      </h2>

      {/* Service Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-4 sm:p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Icon & Description */}
        <div className="flex items-start sm:items-center gap-4">
          {/* Green Document with Pen Icon Badge */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#E6F4EA] dark:bg-emerald-950/60 flex items-center justify-center flex-shrink-0 text-[#16A34A] dark:text-emerald-400 select-none shadow-xs">
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Document Sheet */}
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              {/* Folded Top */}
              <polyline points="14 2 14 8 20 8" />
              {/* Text Lines */}
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
              {/* Edit Pencil at Bottom Right */}
              <path
                d="M18.5 19.5 22 16l-3.5-3.5-3.5 3.5 3.5 3.5z"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </div>

          {/* Texts */}
          <div>
            <h3 className="text-sm sm:text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
              Ajukan Peninjauan Desil
            </h3>
            <p className="text-xs sm:text-[13px] text-gray-600 dark:text-gray-300 mt-1 leading-snug">
              Ajukan perubahan desil jika kondisi ekonomi keluarga mengalami perubahan.
            </p>
          </div>
        </div>

        {/* Right: Action Button */}
        <div className="flex justify-end pt-2 md:pt-0">
          <Link
            href="/dashboard/layanan-bansos/ajukan"
            className="w-full sm:w-auto bg-[#0B57D0] hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs md:text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap select-none"
          >
            <span>Ajukan Peninjauan Desil</span>
            <ChevronRight size={17} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}

