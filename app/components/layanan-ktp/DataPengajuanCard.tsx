"use client";

import React, { useRef, useState } from "react";

export interface DataPengajuanValues {
  nama: string;
  nik: string;
  tempatTglLahir: string;
  jenisKelamin: string;
  alamat: string;
  agama: string;
  statusPerkawinan: string;
  pekerjaan: string;
  kewarganegaraan: string;
}

interface DataPengajuanCardProps {
  initialData?: Partial<DataPengajuanValues>;
  onFileSelect?: (file: File | null) => void;
}

export function DataPengajuanCard({
  initialData,
  onFileSelect,
}: DataPengajuanCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const data: DataPengajuanValues = {
    nama: initialData?.nama || "Hapis Khairullah",
    nik: initialData?.nik || "6105438987667002",
    tempatTglLahir: initialData?.tempatTglLahir || "Singkawang, 12 Juni 2004",
    jenisKelamin: initialData?.jenisKelamin || "Laki-Laki",
    alamat:
      initialData?.alamat ||
      "Jl. Tj. Raya II Gg. Karya 1,\nSaigon, Kec. Pontianak\nTim., Kota Pontianak.",
    agama: initialData?.agama || "Islam",
    statusPerkawinan: initialData?.statusPerkawinan || "Belum Menikah",
    pekerjaan: initialData?.pekerjaan || "Wirasuasta",
    kewarganegaraan: initialData?.kewarganegaraan || "WNI",
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFileName(file ? file.name : null);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className="mb-3.5">
      {/* Section Title */}
      <h2 className="text-sm md:text-[15px] font-bold text-gray-900 dark:text-white mb-2">
        1. Data Pengajuan
      </h2>

      {/* Card Body */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-2.5">
            {/* Nama */}
            <div className="flex items-center">
              <span className="w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                Nama
              </span>
              <input
                type="text"
                readOnly
                defaultValue={data.nama}
                className="flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none"
              />
            </div>

            {/* NIK */}
            <div className="flex items-center">
              <span className="w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                NIK
              </span>
              <input
                type="text"
                readOnly
                defaultValue={data.nik}
                className="flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none"
              />
            </div>

            {/* Tempat / Tgl Lahir */}
            <div className="flex items-center">
              <span className="w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                Tempat / Tgl Lahir
              </span>
              <input
                type="text"
                readOnly
                defaultValue={data.tempatTglLahir}
                className="flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none"
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="flex items-center">
              <span className="w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                Jenis Kelamin
              </span>
              <input
                type="text"
                readOnly
                defaultValue={data.jenisKelamin}
                className="flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none"
              />
            </div>

            {/* Alamat */}
            <div className="flex items-start">
              <span className="w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0 pt-1.5">
                Alamat
              </span>
              <textarea
                readOnly
                rows={3}
                defaultValue={data.alamat}
                className="flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-2.5 justify-between">
            <div className="flex flex-col gap-2.5">
              {/* Agama */}
              <div className="flex items-center">
                <span className="w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                  Agama
                </span>
                <input
                  type="text"
                  readOnly
                  defaultValue={data.agama}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none"
                />
              </div>

              {/* Status Perkawinan */}
              <div className="flex items-center">
                <span className="w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                  Status Perkawinan
                </span>
                <input
                  type="text"
                  readOnly
                  defaultValue={data.statusPerkawinan}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none"
                />
              </div>

              {/* Pekerjaan */}
              <div className="flex items-center">
                <span className="w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                  Pekerjaan
                </span>
                <input
                  type="text"
                  readOnly
                  defaultValue={data.pekerjaan}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none"
                />
              </div>

              {/* Kewarga negara */}
              <div className="flex items-center">
                <span className="w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                  Kewarga negara
                </span>
                <input
                  type="text"
                  readOnly
                  defaultValue={data.kewarganegaraan}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Upload Button at bottom right */}
            <div className="flex flex-col items-end justify-end pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={handleUploadClick}
                className="bg-[#0B57D0] hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs px-6 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Upload
              </button>
              {selectedFileName && (
                <span className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 truncate max-w-[180px]">
                  ✓ {selectedFileName}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

