"use client";

import React from "react";
import { User, CreditCard, Calendar, MapPin, Phone, Mail } from "lucide-react";

export interface ProfilDataValues {
  namaLengkap: string;
  nik: string;
  tempatTanggalLahir: string;
  jenisKelamin: string;
  alamat: string;
  noTelepon: string;
  email: string;
}

interface ProfilDataGridProps {
  data: ProfilDataValues;
}

export function ProfilDataGrid({ data }: ProfilDataGridProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* 2-Column Grid for the 6 primary items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1. Nama Lengkap */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700/80 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-700/70 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0">
            <User size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-normal block leading-tight">
              Nama Lengkap
            </span>
            <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 leading-tight truncate">
              {data.namaLengkap}
            </p>
          </div>
        </div>

        {/* 2. NIK */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700/80 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-700/70 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0">
            <CreditCard size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-normal block leading-tight">
              NIK
            </span>
            <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 leading-tight truncate">
              {data.nik}
            </p>
          </div>
        </div>

        {/* 3. Tempat & Tanggal */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700/80 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-700/70 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0">
            <Calendar size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-normal block leading-tight">
              Tempat & Tanggal
            </span>
            <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 leading-tight truncate">
              {data.tempatTanggalLahir}
            </p>
          </div>
        </div>

        {/* 4. Jenis Kelamin */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700/80 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-700/70 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0">
            {/* Male Symbol SVG */}
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="10" cy="14" r="5" />
              <path d="M19 5L13.5 10.5" />
              <path d="M14 5h5v5" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-normal block leading-tight">
              Jenis Kelamin
            </span>
            <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 leading-tight truncate">
              {data.jenisKelamin}
            </p>
          </div>
        </div>

        {/* 5. Aalamat */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700/80 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-700/70 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0">
            <MapPin size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-normal block leading-tight">
              Aalamat
            </span>
            <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 leading-tight truncate">
              {data.alamat}
            </p>
          </div>
        </div>

        {/* 6. No. Telepon */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700/80 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-700/70 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0">
            <Phone size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-normal block leading-tight">
              No. Telepon
            </span>
            <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 leading-tight truncate">
              {data.noTelepon}
            </p>
          </div>
        </div>
      </div>

      {/* 7. Email (Full-width card below) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700/80 p-3.5 flex items-center gap-3 shadow-xs">
        <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-700/70 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0">
          <Mail size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-normal block leading-tight">
            Email
          </span>
          <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 leading-tight truncate">
            {data.email}
          </p>
        </div>
      </div>
    </div>
  );
}

