"use client";

import React, { useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  formData?: DataPengajuanValues;
  onChange?: (data: DataPengajuanValues) => void;
  onFileSelect?: (file: File | null) => void;
}

export function DataPengajuanCard({
  initialData,
  formData: externalFormData,
  onChange,
  onFileSelect,
}: DataPengajuanCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const [internalData, setInternalData] = useState<DataPengajuanValues>(() => ({
    nama: initialData?.nama || "Warga",
    nik: initialData?.nik || "3578012304950002",
    tempatTglLahir: initialData?.tempatTglLahir || "Surabaya, 12 Juni 2000",
    jenisKelamin: initialData?.jenisKelamin || "Laki-Laki",
    alamat:
      initialData?.alamat ||
      "Jl. Basuki Rahmat No. 10, Surabaya, Jawa Timur",
    agama: initialData?.agama || "Islam",
    statusPerkawinan: initialData?.statusPerkawinan || "Belum Menikah",
    pekerjaan: initialData?.pekerjaan || "Wiraswasta",
    kewarganegaraan: initialData?.kewarganegaraan || "WNI",
  }));

  const data = externalFormData || internalData;

  const handleFieldChange = (field: keyof DataPengajuanValues, val: string) => {
    const updated = { ...data, [field]: val };
    if (!externalFormData) {
      setInternalData(updated);
    }
    if (onChange) {
      onChange(updated);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
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
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 sm:gap-y-2.5">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-3 sm:gap-2.5">
            {/* Nama */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <label className="sm:w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                Nama
              </label>
              <input
                type="text"
                value={data.nama}
                onChange={(e) => handleFieldChange("nama", e.target.value)}
                className="w-full flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0E4FA8] focus:border-[#0E4FA8]"
              />
            </div>

            {/* NIK */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <label className="sm:w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                NIK
              </label>
              <input
                type="text"
                value={data.nik}
                onChange={(e) => handleFieldChange("nik", e.target.value)}
                className="w-full flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0E4FA8] focus:border-[#0E4FA8]"
              />
            </div>

            {/* Tempat / Tgl Lahir */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <label className="sm:w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                Tempat / Tgl Lahir
              </label>
              <input
                type="text"
                value={data.tempatTglLahir}
                onChange={(e) => handleFieldChange("tempatTglLahir", e.target.value)}
                className="w-full flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0E4FA8] focus:border-[#0E4FA8]"
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <label className="sm:w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                Jenis Kelamin
              </label>
              <input
                type="text"
                value={data.jenisKelamin}
                onChange={(e) => handleFieldChange("jenisKelamin", e.target.value)}
                className="w-full flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0E4FA8] focus:border-[#0E4FA8]"
              />
            </div>

            {/* Alamat */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
              <label className="sm:w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0 sm:pt-1.5">
                Alamat
              </label>
              <textarea
                rows={3}
                value={data.alamat}
                onChange={(e) => handleFieldChange("alamat", e.target.value)}
                className="w-full flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0E4FA8] focus:border-[#0E4FA8] resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-3 sm:gap-2.5 justify-between">
            <div className="flex flex-col gap-3 sm:gap-2.5">
              {/* Agama */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <label className="sm:w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                  Agama
                </label>
                <input
                  type="text"
                  value={data.agama}
                  onChange={(e) => handleFieldChange("agama", e.target.value)}
                  className="w-full flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0E4FA8] focus:border-[#0E4FA8]"
                />
              </div>

              {/* Status Perkawinan */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <label className="sm:w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                  Status Perkawinan
                </label>
                <input
                  type="text"
                  value={data.statusPerkawinan}
                  onChange={(e) => handleFieldChange("statusPerkawinan", e.target.value)}
                  className="w-full flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0E4FA8] focus:border-[#0E4FA8]"
                />
              </div>

              {/* Pekerjaan */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <label className="sm:w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                  Pekerjaan
                </label>
                <input
                  type="text"
                  value={data.pekerjaan}
                  onChange={(e) => handleFieldChange("pekerjaan", e.target.value)}
                  className="w-full flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0E4FA8] focus:border-[#0E4FA8]"
                />
              </div>

              {/* Kewarga negara */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <label className="sm:w-28 md:w-32 text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                  Kewarga negara
                </label>
                <input
                  type="text"
                  value={data.kewarganegaraan}
                  onChange={(e) => handleFieldChange("kewarganegaraan", e.target.value)}
                  className="w-full flex-1 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0E4FA8] focus:border-[#0E4FA8]"
                />
              </div>
            </div>

            {/* Upload Button with Guidance Popover at bottom right */}
            <div className="flex flex-col items-stretch sm:items-end justify-end pt-3 sm:pt-2 border-t sm:border-t-0 border-gray-100 dark:border-slate-700/60 mt-1 sm:mt-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              <Popover>
                <div className="flex flex-col sm:items-end gap-1.5">
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="group flex items-center justify-start sm:justify-end gap-1.5 text-left sm:text-right text-[11px] text-gray-500 dark:text-gray-400 hover:text-[#0B57D0] dark:hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-[#0B57D0] dark:text-blue-400 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        Ada data yang salah?{" "}
                        <span className="font-semibold underline decoration-dotted text-[#0B57D0] dark:text-blue-400">
                          Petunjuk upload
                        </span>
                      </span>
                    </button>
                  </PopoverTrigger>

                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full sm:w-auto bg-[#0B57D0] hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs px-5 py-2 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <span>Upload</span>
                    </button>
                  </PopoverTrigger>
                </div>

                <PopoverContent
                  align="end"
                  sideOffset={8}
                  className="w-[calc(100vw-2.5rem)] sm:w-[370px] max-w-[370px] max-h-[85vh] overflow-y-auto p-4 text-left shadow-2xl rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  {/* Popover Header */}
                  <div className="flex items-start gap-2.5 pb-2.5 border-b border-gray-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B57D0] dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.5L19 7.5V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                        Panduan Perbaikan Data
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                        Jika ada data kependudukan yang keliru, unggah dokumen sah sebagai bukti verifikasi:
                      </p>
                    </div>
                  </div>

                  {/* Instruction List */}
                  <div className="py-2.5 space-y-2 text-[11px]">
                    <div className="flex items-start gap-2 bg-gray-50 dark:bg-slate-800/60 p-2 rounded-lg border border-gray-100 dark:border-slate-800">
                      <span className="text-sm leading-none flex-shrink-0">📅</span>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Salah Nama / Tgl Lahir:
                        </span>
                        <p className="text-gray-600 dark:text-gray-300 text-[10.5px]">
                          Upload scan/foto <strong>Akta Kelahiran</strong> atau <strong>Ijazah Terakhir</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-gray-50 dark:bg-slate-800/60 p-2 rounded-lg border border-gray-100 dark:border-slate-800">
                      <span className="text-sm leading-none flex-shrink-0">💍</span>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Salah Status Kawin:
                        </span>
                        <p className="text-gray-600 dark:text-gray-300 text-[10.5px]">
                          Upload <strong>Buku Nikah</strong>, <strong>Akta Perkawinan</strong>, atau <strong>Akta Perceraian</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-gray-50 dark:bg-slate-800/60 p-2 rounded-lg border border-gray-100 dark:border-slate-800">
                      <span className="text-sm leading-none flex-shrink-0">🏡</span>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Salah Alamat / Hubungan:
                        </span>
                        <p className="text-gray-600 dark:text-gray-300 text-[10.5px]">
                          Upload <strong>Kartu Keluarga (KK) Terbaru</strong> atau Surat Pindah (SKPWNI).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-gray-50 dark:bg-slate-800/60 p-2 rounded-lg border border-gray-100 dark:border-slate-800">
                      <span className="text-sm leading-none flex-shrink-0">💼</span>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Salah Pekerjaan / Agama:
                        </span>
                        <p className="text-gray-600 dark:text-gray-300 text-[10.5px]">
                          Upload surat keterangan kerja resmi dari instansi / dokumen pendukung.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Action Area */}
                  <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="w-full bg-[#0B57D0] hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span>
                        {selectedFileName ? "Ganti File Dokumen" : "Pilih & Upload Dokumen"}
                      </span>
                    </button>

                    <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-1.5">
                      Format: PDF, JPG, PNG (Maks. 5MB)
                    </p>

                    {selectedFileName && (
                      <div className="mt-2 flex items-center justify-between text-[11px] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-md px-2.5 py-1.5 text-blue-700 dark:text-blue-300">
                        <span className="truncate flex-1 font-medium">✓ {selectedFileName}</span>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="text-red-500 hover:text-red-700 text-[10px] font-semibold ml-2 cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {selectedFileName && (
                <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate max-w-[200px] font-medium">{selectedFileName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

