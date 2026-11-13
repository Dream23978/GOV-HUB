"use client";

import React, { useState } from "react";
import { Edit2, Check } from "lucide-react";

interface AjukanDesilKeluargaCardProps {
  anggotaKeluarga?: string;
  orangDewasa?: string;
  anakSekolah?: string;
  onSave?: (data: { anggotaKeluarga: string; orangDewasa: string; anakSekolah: string }) => void;
}

export function AjukanDesilKeluargaCard({
  anggotaKeluarga = "4 orang",
  orangDewasa = "2 orang",
  anakSekolah = "2 orang",
  onSave,
}: AjukanDesilKeluargaCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    anggotaKeluarga,
    orangDewasa,
    anakSekolah,
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
          DATA KELUARGA
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
        {/* Anggota Keluarga */}
        <div className="flex items-center justify-between text-xs gap-3">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Anggota Keluarga
          </span>
          {isEditing ? (
            <input
              type="text"
              value={data.anggotaKeluarga}
              onChange={(e) => setData({ ...data, anggotaKeluarga: e.target.value })}
              className="text-right text-xs font-semibold text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-slate-600 px-2 py-0.5 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:border-blue-500 max-w-[130px]"
            />
          ) : (
            <span className="font-semibold text-gray-900 dark:text-white text-right">
              {data.anggotaKeluarga}
            </span>
          )}
        </div>

        {/* Orang Dewasa */}
        <div className="flex items-center justify-between text-xs gap-3">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Orang Dewasa
          </span>
          {isEditing ? (
            <input
              type="text"
              value={data.orangDewasa}
              onChange={(e) => setData({ ...data, orangDewasa: e.target.value })}
              className="text-right text-xs font-semibold text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-slate-600 px-2 py-0.5 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:border-blue-500 max-w-[130px]"
            />
          ) : (
            <span className="font-semibold text-gray-900 dark:text-white text-right">
              {data.orangDewasa}
            </span>
          )}
        </div>

        {/* Anak Sekolah */}
        <div className="flex items-center justify-between text-xs gap-3">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Anak Sekolah
          </span>
          {isEditing ? (
            <input
              type="text"
              value={data.anakSekolah}
              onChange={(e) => setData({ ...data, anakSekolah: e.target.value })}
              className="text-right text-xs font-semibold text-gray-900 dark:text-white rounded-md border border-gray-300 dark:border-slate-600 px-2 py-0.5 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:border-blue-500 max-w-[130px]"
            />
          ) : (
            <span className="font-semibold text-gray-900 dark:text-white text-right">
              {data.anakSekolah}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
