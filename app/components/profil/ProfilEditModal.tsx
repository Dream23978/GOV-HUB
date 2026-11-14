"use client";

import React, { useEffect, useState } from "react";
import { ProfilDataValues } from "./ProfilDataGrid";
import { X, Check, AlertCircle } from "lucide-react";

export interface ProfilEditSavePayload {
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahirIso: string;
  jenisKelamin: string;
  noTelepon: string;
  alamat: string;
}

interface ProfilEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProfilDataValues;
  initialTempatLahir?: string;
  initialTanggalLahirIso?: string;
  onSave: (payload: ProfilEditSavePayload) => Promise<{ success: boolean; error?: string }>;
}

function normalizeGenderOption(raw?: string): string {
  if (!raw) return "Laki-laki";
  if (/perempuan/i.test(raw)) return "Perempuan";
  return "Laki-laki";
}

export function ProfilEditModal({
  isOpen,
  onClose,
  data,
  initialTempatLahir = "",
  initialTanggalLahirIso = "",
  onSave,
}: ProfilEditModalProps) {
  const [namaLengkap, setNamaLengkap] = useState(data.namaLengkap);
  const [tempatLahir, setTempatLahir] = useState(initialTempatLahir);
  const [tanggalLahirIso, setTanggalLahirIso] = useState(initialTanggalLahirIso);
  const [jenisKelamin, setJenisKelamin] = useState(normalizeGenderOption(data.jenisKelamin));
  const [noTelepon, setNoTelepon] = useState(data.noTelepon);
  const [alamat, setAlamat] = useState(data.alamat);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setNamaLengkap(data.namaLengkap === "-" ? "" : data.namaLengkap);
    setTempatLahir(
      initialTempatLahir ||
        (data.tempatTanggalLahir.includes(",")
          ? data.tempatTanggalLahir.split(",")[0].trim()
          : data.tempatTanggalLahir === "-"
          ? ""
          : data.tempatTanggalLahir)
    );
    setTanggalLahirIso(initialTanggalLahirIso || "");
    setJenisKelamin(normalizeGenderOption(data.jenisKelamin));
    setNoTelepon(data.noTelepon === "-" ? "" : data.noTelepon);
    setAlamat(data.alamat === "-" ? "" : data.alamat);
    setSaveError(null);
  }, [isOpen, data, initialTempatLahir, initialTanggalLahirIso]);

  if (!isOpen) return null;

  const todayIso = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setIsSaving(true);
    try {
      const result = await onSave({
        namaLengkap: namaLengkap.trim(),
        tempatLahir: tempatLahir.trim(),
        tanggalLahirIso: tanggalLahirIso.trim(),
        jenisKelamin,
        noTelepon: noTelepon.trim(),
        alamat: alamat.trim(),
      });
      if (!result.success) {
        setSaveError(result.error || "Gagal menyimpan perubahan.");
        return;
      }
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profil-edit-title"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
          <div>
            <h3 id="profil-edit-title" className="font-bold text-base text-gray-900 dark:text-white leading-tight">
              Ubah Data Profil
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Perbarui informasi pribadi dan kontak akun Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal edit profil"
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3.5">
          {saveError && (
            <div role="alert" className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {/* Nama Lengkap */}
          <div>
            <label htmlFor="edit-nama-lengkap" className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Nama Lengkap
            </label>
            <input
              id="edit-nama-lengkap"
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              required
              className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* NIK (Disabled / Info) */}
          <div>
            <label htmlFor="edit-nik-readonly" className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              NIK (Terkunci oleh Dukcapil)
            </label>
            <input
              id="edit-nik-readonly"
              type="text"
              value={data.nik}
              disabled
              className="w-full text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900/60 px-3 py-2 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Tempat Lahir + Tanggal Lahir + Jenis Kelamin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-tempat-lahir" className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Tempat Lahir
              </label>
              <input
                id="edit-tempat-lahir"
                type="text"
                value={tempatLahir}
                onChange={(e) => setTempatLahir(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="edit-tanggal-lahir" className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Tanggal Lahir
              </label>
              <input
                id="edit-tanggal-lahir"
                type="date"
                value={tanggalLahirIso}
                max={todayIso}
                onChange={(e) => setTanggalLahirIso(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-jenis-kelamin" className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Jenis Kelamin
              </label>
              <select
                id="edit-jenis-kelamin"
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label htmlFor="edit-no-telepon" className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                No. Telepon
              </label>
              <input
                id="edit-no-telepon"
                type="tel"
                value={noTelepon}
                onChange={(e) => setNoTelepon(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label htmlFor="edit-email-readonly" className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Email Akun (Terkunci)
            </label>
            <input
              id="edit-email-readonly"
              type="email"
              value={data.email}
              disabled
              className="w-full text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900/60 px-3 py-2 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Alamat */}
          <div>
            <label htmlFor="edit-alamat" className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Alamat
            </label>
            <textarea
              id="edit-alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              rows={2}
              required
              className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-slate-700 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0B57D0] hover:bg-blue-700 active:scale-95 disabled:opacity-60 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={14} />
              <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

