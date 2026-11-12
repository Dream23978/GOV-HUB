"use client";

import React, { useState } from "react";
import { X, Check, Upload } from "lucide-react";
import { submitDesilAction } from "@/app/actions/bansos";

interface AjukanPeninjauanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export function AjukanPeninjauanModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: AjukanPeninjauanModalProps) {
  const [alasan, setAlasan] = useState("Penurunan Pendapatan");
  const [keterangan, setKeterangan] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // Simpan permohonan ke database via Server Action
      const res = await submitDesilAction({
        alasan,
        keterangan,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Gagal mengajukan peninjauan desil.");
        setIsSubmitting(false);
        return;
      }

      onSubmitSuccess();
      onClose();
    } catch {
      onSubmitSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white leading-tight">
              Ajukan Peninjauan Desil
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Mohon isi data permohonan perubahan desil keluarga Anda dengan benar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3.5">
          {/* Alasan Peninjauan */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Alasan Pengajuan Peninjauan
            </label>
            <select
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
            >
              <option value="Penurunan Pendapatan">Penurunan Pendapatan / Kehilangan Pekerjaan</option>
              <option value="Bertambahnya Jumlah Tanggungan">Bertambahnya Jumlah Tanggungan Keluarga</option>
              <option value="Anggota Keluarga Sakit Menahun">Anggota Keluarga Mengalami Sakit Menahun</option>
              <option value="Bencana Alam / Musibah">Terdampak Bencana Alam / Musibah</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Keterangan */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Penjelasan Kondisi Ekonomi Saat Ini
            </label>
            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              required
              rows={3}
              placeholder="Ceritakan secara singkat perubahan kondisi ekonomi keluarga..."
              className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
            />
          </div>

          {/* Upload Dokumen Pendukung */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Dokumen Pendukung (Opsional: SKTM / Foto Rumah / Slip Gaji)
            </label>
            <label className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 bg-gray-50/50 dark:bg-slate-900/40 transition-colors">
              <Upload size={18} className="text-gray-400 dark:text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {file ? file.name : "Klik untuk upload berkas (PDF / JPG / PNG)"}
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-slate-700 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0B57D0] hover:bg-blue-700 active:scale-95 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check size={14} />
              <span>{isSubmitting ? "Mengirim..." : "Kirim Permohonan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

