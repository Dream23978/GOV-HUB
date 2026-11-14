"use client";

import React from "react";
import { Check } from "lucide-react";

export function ProfilStatusBanner() {
  return (
    <div className="flex flex-col gap-1.5 mt-1">
      <h3 className="text-xs font-bold text-gray-900 dark:text-white">
        Status Akun
      </h3>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700/80 p-3.5 flex items-center gap-3 shadow-xs">
        {/* Green Circular Checkmark Badge */}
        <div className="w-6 h-6 rounded-full bg-[#16A34A] flex items-center justify-center text-white flex-shrink-0 shadow-2xs select-none">
          <Check size={14} strokeWidth={3} />
        </div>

        <div>
          <h4 className="text-xs font-bold text-[#16A34A] dark:text-green-400 leading-tight">
            Akun Anda Telah diferivikasi
          </h4>
          <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">
            Data anda telah terverifikasi oleh dinas Dukcapil.
          </p>
        </div>
      </div>
    </div>
  );
}

