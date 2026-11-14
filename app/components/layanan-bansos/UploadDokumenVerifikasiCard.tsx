"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, CheckCircle2, Trash2 } from "lucide-react";

interface UploadDokumenVerifikasiCardProps {
  onFileSelect?: (file: File | null) => void;
}

export function UploadDokumenVerifikasiCard({
  onFileSelect,
}: UploadDokumenVerifikasiCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const acceptValidatedFile = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setFileError(null);
      if (onFileSelect) onFileSelect(null);
      return;
    }
    if (!/^(application\/pdf|image\/(jpeg|jpg|png|webp))$/i.test(file.type)) {
      setFileError("Format berkas harus PDF, JPG, PNG, atau WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("Ukuran berkas melebihi batas 5MB.");
      return;
    }
    setFileError(null);
    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    acceptValidatedFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    acceptValidatedFile(file);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-5 md:p-6 mb-5 w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col gap-1 mb-3">
        <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
          Upload Dokumen Pendukung Verifikasi
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
          Unggah dokumen bukti kondisi ekonomi (contoh: SKTM, Slip Gaji / Surat Keterangan RT, Foto Tempat Tinggal, atau Kartu Keluarga).
        </p>
      </div>

      {/* Upload Zone */}
      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-5 md:p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
              : "border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50/60 dark:bg-slate-900/40 hover:bg-blue-50/20"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B57D0] dark:text-blue-400 flex items-center justify-center">
            <UploadCloud size={20} />
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
              Klik untuk pilih dokumen <span className="font-normal text-gray-500">atau seret file ke sini</span>
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              Format yang didukung: PDF, JPG, PNG (Maks. 5MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#0B57D0] dark:text-blue-300 flex items-center justify-center flex-shrink-0">
              <FileText size={18} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                  {selectedFile.name}
                </span>
                <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
              </div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block">
                {(selectedFile.size / 1024).toFixed(1)} KB • Siap diverifikasi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline px-2 py-1 cursor-pointer"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40"
              aria-label="Hapus file"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      )}
      {fileError && (
        <p className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">
          {fileError}
        </p>
      )}
    </div>
  );
}

