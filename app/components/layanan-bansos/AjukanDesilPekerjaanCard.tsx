"use client";

import React, { useState } from "react";
import { Edit2, Check } from "lucide-react";

interface AjukanDesilPekerjaanCardProps {
  statusPekerjaan?: string;
  perubahanTerakhir?: string;
  verifikasiText?: string;
  onSave?: (data: { statusPekerjaan: string; perubahanTerakhir: string }) => void;
}

export function AjukanDesilPekerjaanCard({
  statusPekerjaan = "Tidak Bekerja",
  perubahanTerakhir = "Agustus 2026",
  verifikasiText = "Data berhasil diverifikasi",
  onSave,
}: AjukanDesilPekerjaanCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    statusPekerjaan,
    perubahanTerakhir,
  });

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(data);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-5 md:p-6 mb-4 transition-all">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
          DATA PEKERJAAN
        </h2>
        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors cursor-pointer"
        >
          {isEditing ? (
            <>
              <Check size={12} strokeWidth={2.5} />
              <span>Selesai</span>
            </>
          ) : (
            <>
              <Edit2 size={11} />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {/* Status Pekerjaan */}
        <div className="flex items-center justify-between text-xs gap-3">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Status Pekerjaan
          </span>
          {isEditing ? (
            <input
              type="text"
              value={data.statusPekerjaan}
              onChange={(e) => setData({ ...data, statusPekerjaan: e.target.value })}
              className="text-right text-xs font-semibold text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-slate-600 px-2 py-0.5 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:border-blue-500 max-w-[150px]"
            />
          ) : (
            <span className="font-semibold text-gray-900 dark:text-white text-right">
              {data.statusPekerjaan}
            </span>
          )}
        </div>

        {/* Perubahan terakhir */}
        <div className="flex items-center justify-between text-xs gap-3">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Perubahan terakhir
          </span>
          {isEditing ? (
            <input
              type="text"
              value={data.perubahanTerakhir}
              onChange={(e) => setData({ ...data, perubahanTerakhir: e.target.value })}
              className="text-right text-xs font-semibold text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-slate-600 px-2 py-0.5 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:border-blue-500 max-w-[150px]"
            />
          ) : (
            <span className="font-semibold text-gray-900 dark:text-white text-right">
              {data.perubahanTerakhir}
            </span>
          )}
        </div>

        {/* Data berhasil diverifikasi */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {verifikasiText}
          </span>
          <span />
        </div>
      </div>
    </div>
  );
}
