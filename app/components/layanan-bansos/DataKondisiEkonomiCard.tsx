"use client";

import React, { useState } from "react";

export interface DataKondisiEkonomiValues {
  statusPekerja: string;
  pendapatan: string;
  jumlahAnggotaKeluarga: string;
  orangTua: string;
  asetKendaraan: string;
  sumberData: string;
}

interface DataKondisiEkonomiCardProps {
  initialValues?: Partial<DataKondisiEkonomiValues>;
  onChange?: (values: DataKondisiEkonomiValues) => void;
}

export function DataKondisiEkonomiCard({
  initialValues,
  onChange,
}: DataKondisiEkonomiCardProps) {
  const [values, setValues] = useState<DataKondisiEkonomiValues>({
    statusPekerja: initialValues?.statusPekerja || "",
    pendapatan: initialValues?.pendapatan || "",
    jumlahAnggotaKeluarga: initialValues?.jumlahAnggotaKeluarga || "",
    orangTua: initialValues?.orangTua || "",
    asetKendaraan: initialValues?.asetKendaraan || "",
    sumberData: initialValues?.sumberData || "-",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(true);

  const handleFieldChange = (field: keyof DataKondisiEkonomiValues, val: string) => {
    const updated = { ...values, [field]: val };
    setValues(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  const handleSesuai = () => {
    setIsEditing(false);
    setIsConfirmed(true);
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    if (!isEditing) {
      setIsConfirmed(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-5 md:p-7 mb-4 w-full">
      {/* Title */}
      <h2 className="text-base md:text-[17px] font-bold text-gray-900 dark:text-white mb-4">
        Data Kondisi Ekonomi & Pekerjaan
      </h2>

      {/* Form Fields */}
      <div className="flex flex-col gap-3">
        {/* Status Pekerja */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 sm:w-48 flex-shrink-0">
            Status Pekerja
          </label>
          <input
            type="text"
            value={values.statusPekerja}
            readOnly={!isEditing}
            onChange={(e) => handleFieldChange("statusPekerja", e.target.value)}
            className={`w-full sm:max-w-xs md:max-w-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs text-gray-900 dark:text-gray-100 shadow-2xs focus:outline-none ${
              isEditing ? "focus:border-blue-500 ring-1 ring-blue-500/20" : ""
            }`}
          />
        </div>

        {/* Pendapatan */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 sm:w-48 flex-shrink-0">
            Pendapatan
          </label>
          <input
            type="text"
            value={values.pendapatan}
            readOnly={!isEditing}
            onChange={(e) => handleFieldChange("pendapatan", e.target.value)}
            className={`w-full sm:max-w-xs md:max-w-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs text-gray-900 dark:text-gray-100 shadow-2xs focus:outline-none ${
              isEditing ? "focus:border-blue-500 ring-1 ring-blue-500/20" : ""
            }`}
          />
        </div>

        {/* Jumlah anggota keluarga */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 sm:w-48 flex-shrink-0">
            Jumlah anggota keluarga
          </label>
          <input
            type="text"
            value={values.jumlahAnggotaKeluarga}
            readOnly={!isEditing}
            onChange={(e) => handleFieldChange("jumlahAnggotaKeluarga", e.target.value)}
            className={`w-full sm:max-w-xs md:max-w-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs text-gray-900 dark:text-gray-100 shadow-2xs focus:outline-none ${
              isEditing ? "focus:border-blue-500 ring-1 ring-blue-500/20" : ""
            }`}
          />
        </div>

        {/* Orang tua */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 sm:w-48 flex-shrink-0">
            Orang tua
          </label>
          <input
            type="text"
            value={values.orangTua}
            readOnly={!isEditing}
            onChange={(e) => handleFieldChange("orangTua", e.target.value)}
            className={`w-full sm:max-w-xs md:max-w-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs text-gray-900 dark:text-gray-100 shadow-2xs focus:outline-none ${
              isEditing ? "focus:border-blue-500 ring-1 ring-blue-500/20" : ""
            }`}
          />
        </div>

        {/* Aset Kendaran */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 sm:w-48 flex-shrink-0">
            Aset Kendaran
          </label>
          <input
            type="text"
            value={values.asetKendaraan}
            readOnly={!isEditing}
            onChange={(e) => handleFieldChange("asetKendaraan", e.target.value)}
            className={`w-full sm:max-w-xs md:max-w-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs text-gray-900 dark:text-gray-100 shadow-2xs focus:outline-none ${
              isEditing ? "focus:border-blue-500 ring-1 ring-blue-500/20" : ""
            }`}
          />
        </div>

        {/* Sumber data */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 sm:w-48 flex-shrink-0">
            Sumber data
          </label>
          <input
            type="text"
            value={values.sumberData}
            readOnly={!isEditing}
            onChange={(e) => handleFieldChange("sumberData", e.target.value)}
            className={`w-full sm:max-w-xs md:max-w-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs text-gray-900 dark:text-gray-100 shadow-2xs focus:outline-none ${
              isEditing ? "focus:border-blue-500 ring-1 ring-blue-500/20" : ""
            }`}
          />
        </div>
      </div>

      {/* Buttons at Bottom Right of Card */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700/60 mt-4">
        {/* Sesuai Button */}
        <button
          type="button"
          onClick={handleSesuai}
          className={`border rounded-lg text-xs font-medium px-6 py-1.5 shadow-2xs transition-all cursor-pointer ${
            isConfirmed && !isEditing
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-400 font-semibold"
              : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
          }`}
        >
          Sesuai
        </button>

        {/* edit Button */}
        <button
          type="button"
          onClick={handleEditToggle}
          className={`border rounded-lg text-xs font-medium px-6 py-1.5 shadow-2xs transition-all cursor-pointer ${
            isEditing
              ? "bg-blue-50 dark:bg-blue-950/40 text-[#0B57D0] dark:text-blue-400 border-blue-400 font-semibold"
              : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
          }`}
        >
          {isEditing ? "Simpan" : "edit"}
        </button>
      </div>
    </div>
  );
}

