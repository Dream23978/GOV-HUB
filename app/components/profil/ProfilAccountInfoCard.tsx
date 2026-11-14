"use client";

import React from "react";
import { Calendar, ShieldCheck, Smartphone } from "lucide-react";

interface ProfilAccountInfoCardProps {
  terdaftarSejak?: string;
  statusVerifikasi?: string;
  terakhirLogin?: string;
}

export function ProfilAccountInfoCard({
  terdaftarSejak = "-",
  statusVerifikasi = "Terverifikasi",
  terakhirLogin = "-",
}: ProfilAccountInfoCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700/80 shadow-xs p-5 flex flex-col gap-3.5">
      <h3 className="text-xs font-bold text-gray-900 dark:text-white">
        Informasi Akun
      </h3>

      {/* Item 1: Terdaftar Sejak */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700/70 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0 mt-0.5">
          <Calendar size={16} />
        </div>
        <div>
          <span className="text-[10.5px] text-gray-500 dark:text-gray-400 font-normal block leading-tight">
            Terdaftar Sejak
          </span>
          <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 leading-tight">
            {terdaftarSejak}
          </p>
        </div>
      </div>

      {/* Item 2: Status Verifikasi */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700/70 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0 mt-0.5">
          <ShieldCheck size={16} />
        </div>
        <div>
          <span className="text-[10.5px] text-gray-500 dark:text-gray-400 font-normal block leading-tight">
            Status Verifikasi
          </span>
          <div className="mt-1">
            <span className="bg-[#E8F8EE] dark:bg-green-950/60 text-[#16A34A] dark:text-green-400 text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full inline-block border border-green-200/60 dark:border-green-800/40">
              {statusVerifikasi}
            </span>
          </div>
        </div>
      </div>

      {/* Item 3: Terakhir Login */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700/70 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0 mt-0.5">
          <Smartphone size={16} />
        </div>
        <div>
          <span className="text-[10.5px] text-gray-500 dark:text-gray-400 font-normal block leading-tight">
            Terakhir Login
          </span>
          <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 leading-tight">
            {terakhirLogin}
          </p>
        </div>
      </div>
    </div>
  );
}

