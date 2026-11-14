"use client";

import React, { useState } from "react";
import { ProfilDataValues } from "./ProfilDataGrid";
import { X, Check } from "lucide-react";

interface ProfilEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProfilDataValues;
  onSave: (newData: ProfilDataValues) => void;
}

export function ProfilEditModal({
  isOpen,
  onClose,
  data,
  onSave,
}: ProfilEditModalProps) {
  const [formData, setFormData] = useState<ProfilDataValues>(data);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white leading-tight">
              Ubah Data Profil
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Perbarui informasi pribadi dan kontak akun Anda.
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
          {/* Nama Lengkap */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="namaLengkap"
              value={formData.namaLengkap}
              onChange={handleChange}
              required
              className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* NIK (Disabled / Info) */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              NIK (Terkunci oleh Dukcapil)
            </label>
            <input
              type="text"
              value={formData.nik}
              disabled
              className="w-full text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900/60 px-3 py-2 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* 2-Column: Tempat & Tanggal + Jenis Kelamin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Tempat & Tanggal
              </label>
              <input
                type="text"
                name="tempatTanggalLahir"
                value={formData.tempatTanggalLahir}
                onChange={handleChange}
                required
                className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Jenis Kelamin
              </label>
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              >
                <option value="Laki - Laki">Laki - Laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          {/* No. Telepon */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              No. Telepon
            </label>
            <input
              type="tel"
              name="noTelepon"
              value={formData.noTelepon}
              onChange={handleChange}
              required
              className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full text-xs rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Alamat */}
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Alamat
            </label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
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
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0B57D0] hover:bg-blue-700 active:scale-95 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={14} />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

