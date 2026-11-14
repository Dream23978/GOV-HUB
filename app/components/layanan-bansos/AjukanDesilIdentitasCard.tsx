"use client";

import React from "react";

interface AjukanDesilIdentitasCardProps {
  nama?: string;
  nik?: string;
  jumlahKeluarga?: string;
  alamat?: string;
}

export function AjukanDesilIdentitasCard({
  nama = "Warga Terdaftar",
  nik = "••••••••••••••••",
  jumlahKeluarga = "-",
  alamat = "Kota Surabaya",
}: AjukanDesilIdentitasCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-5 md:p-6 mb-4">
      <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3.5">
        DATA IDENTITAS TERVERIFIKASI
      </h2>

      <div className="flex flex-col gap-2.5">
        {/* Nama */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Nama
          </span>
          <span className="font-semibold text-gray-900 dark:text-white text-right">
            {nama}
          </span>
        </div>

        {/* NIK */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            NIK
          </span>
          <span className="font-semibold text-gray-900 dark:text-white text-right">
            {nik}
          </span>
        </div>

        {/* Jumlah Keluarga */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Jumlah Keluarga
          </span>
          <span className="font-semibold text-gray-900 dark:text-white text-right">
            {jumlahKeluarga}
          </span>
        </div>

        {/* Alamat */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Alamat
          </span>
          <span className="font-semibold text-gray-900 dark:text-white text-right">
            {alamat}
          </span>
        </div>
      </div>
    </div>
  );
}

