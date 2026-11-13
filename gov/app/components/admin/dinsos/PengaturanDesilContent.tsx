"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Camera,
  User,
  CreditCard,
  Calendar,
  UserCheck,
  MapPin,
  Phone,
  Mail,
  Check,
  CheckCircle2,
  X,
  Monitor,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

interface PengaturanDesilContentProps {
  roleTitle?: string;
  wilayah?: string;
}

export function PengaturanDesilContent({
  roleTitle = "Admin Kecamatan",
  wilayah = "Kecamatan Genteng, Surabaya",
}: PengaturanDesilContentProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile data matching 100% with the uploaded screenshot
  const [profile, setProfile] = useState({
    nama: "Hapis Khairullah",
    nikMasked: "610*********002",
    nikFull: "6105438987667002",
    tempatTanggal: "Pontianak, 06 Mei 2026",
    jenisKelamin: "Laki – Laki",
    alamat: "J. Merdeka No. 12, Pontianak",
    telepon: "0812334561579",
    email: "hapisramatullah@gmail.com",
    terdaftarSejak: "10 Mei 2026",
    statusVerifikasi: "Terverifikasi",
    terakhirLogin: "16 Oktober 2026, 15:42",
    avatarUrl: "/admin-avatar.png",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync with localStorage if admin session exists
  useEffect(() => {
    try {
      const stored = localStorage.getItem("govhub_admin_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.nama) {
          setProfile((prev) => ({
            ...prev,
            nama: parsed.nama,
            email: parsed.email || prev.email,
            alamat: parsed.wilayah ? `${prev.alamat} (${parsed.wilayah})` : prev.alamat,
          }));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Handle avatar upload preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, avatarUrl: previewUrl }));
      setToastMsg("Foto profil berhasil diperbarui!");
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...editForm });
    setIsEditModalOpen(false);
    setToastMsg("Perubahan data profil berhasil disimpan!");
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="flex flex-col w-full pb-10 select-none">
      {/* ── Page Header (100% Mockup: Dark Blue Circular Back Button + "Profil Saya") ── */}
      <div className="flex items-center gap-3 mb-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-8 h-8 rounded-full bg-[#103E7E] hover:bg-[#0d3368] active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
          aria-label="Kembali"
        >
          <ChevronLeft size={20} strokeWidth={2.8} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
            Profil Saya
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
            Kelola informasi akun dan data dari Anda.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Hidden File Input for Ganti Foto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />

      {/* ── Main Profile Grid (Left Column: Avatar & Info Akun | Right Column: Data Cards) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ── LEFT COLUMN (Avatar Box + Informasi Akun) ── */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card: Avatar & Ganti Foto */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700 p-6 shadow-2xs flex flex-col items-center text-center">
            {/* Avatar with Camera badge */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#E11D48] bg-gray-100 shadow-sm relative">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.nama}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Blue Camera Badge on Bottom-Right */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Ganti Foto"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0091FF] hover:bg-blue-600 text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-slate-800 cursor-pointer transition-transform hover:scale-105"
              >
                <Camera size={13} strokeWidth={2.5} />
              </button>
            </div>

            {/* Nama & NIK */}
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-3.5">
              {profile.nama}
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
              NIK : {profile.nikMasked}
            </span>

            {/* Button: Ganti Foto */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border border-[#0091FF] text-[#0091FF] hover:bg-blue-50/70 dark:hover:bg-blue-950/40 active:scale-95 rounded-lg py-1.5 px-4 text-xs font-semibold flex items-center gap-1.5 mt-3.5 transition-all cursor-pointer shadow-2xs"
            >
              <Camera size={14} />
              <span>Ganti Foto</span>
            </button>
          </div>

          {/* Section: Informasi Akun */}
          <div className="px-1">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-2.5">
              Informasi Akun
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Terdaftar Sejak */}
              <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                <Monitor size={16} className="text-gray-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-[11px]">Terdaftar Sejak</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{profile.terdaftarSejak}</span>
                </div>
              </div>

              {/* Status Verifikasi */}
              <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                <ShieldCheck size={16} className="text-gray-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-[11px]">Status Verifikasi</span>
                  <div className="mt-0.5">
                    <span className="inline-block bg-[#E8F8EE] text-[#16A34A] dark:bg-emerald-950/70 dark:text-emerald-300 border border-[#BBF7D0] dark:border-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {profile.statusVerifikasi}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terakhir Login */}
              <div className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300">
                <Smartphone size={16} className="text-gray-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-[11px]">Terakhir Login</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{profile.terakhirLogin}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (Data Cards Grid, Email, Status Akun & Ubah Data) ── */}
        <div className="lg:col-span-7 space-y-3">
          {/* 6 Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Card 1: Nama Lengkap */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700 p-3.5 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
                <User size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block leading-tight">Nama Lengkap</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white block truncate">
                  {profile.nama}
                </span>
              </div>
            </div>

            {/* Card 2: NIK */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700 p-3.5 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
                <CreditCard size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block leading-tight">NIK</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white font-mono block truncate">
                  {profile.nikMasked}
                </span>
              </div>
            </div>

            {/* Card 3: Tempat & Tanggal */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700 p-3.5 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block leading-tight">Tempat &amp; Tanggal</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white block truncate">
                  {profile.tempatTanggal}
                </span>
              </div>
            </div>

            {/* Card 4: Jenis Kelamin */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700 p-3.5 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
                <UserCheck size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block leading-tight">Jenis Kelamin</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white block truncate">
                  {profile.jenisKelamin}
                </span>
              </div>
            </div>

            {/* Card 5: Aalamat */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700 p-3.5 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block leading-tight">Aalamat</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white block truncate">
                  {profile.alamat}
                </span>
              </div>
            </div>

            {/* Card 6: No. Telepon */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700 p-3.5 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block leading-tight">No. Telepon</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white font-mono block truncate">
                  {profile.telepon}
                </span>
              </div>
            </div>
          </div>

          {/* Email Card (Full Width) */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200/90 dark:border-slate-700 p-3.5 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center shrink-0">
              <Mail size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 block leading-tight">Email</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white block truncate">
                {profile.email}
              </span>
            </div>
          </div>

          {/* Section: Status Akun */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-2">
              Status Akun
            </h3>

            {/* Box: Akun Anda Telah diferivikasi */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-emerald-200/90 dark:border-emerald-800/80 p-3.5 shadow-2xs flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Check size={16} strokeWidth={3} />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-[#10B981] dark:text-emerald-400 block leading-tight">
                  Akun Anda Telah diferivikasi
                </span>
                <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                  Data anda telah terverivikasi oleh dinas Dukcapil.
                </span>
              </div>
            </div>
          </div>

          {/* Button: [ Ubah Data ] */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                setEditForm({ ...profile });
                setIsEditModalOpen(true);
              }}
              className="bg-[#0070F3] hover:bg-blue-600 active:scale-95 text-white font-bold text-xs sm:text-sm px-7 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Ubah Data
            </button>
          </div>
        </div>
      </div>

      {/* ── Modal Ubah Data Profil ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-slate-700 p-5 sm:p-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-3 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Ubah Data Profil Petugas
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Perbarui informasi kontak dan data domisili kedinasan
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 hover:text-black dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={editForm.nama}
                  onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Tempat &amp; Tanggal Lahir
                </label>
                <input
                  type="text"
                  value={editForm.tempatTanggal}
                  onChange={(e) => setEditForm({ ...editForm, tempatTanggal: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Alamat Lengkap
                </label>
                <input
                  type="text"
                  value={editForm.alamat}
                  onChange={(e) => setEditForm({ ...editForm, alamat: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editForm.telepon}
                    onChange={(e) => setEditForm({ ...editForm, telepon: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0070F3] hover:bg-blue-600 text-white shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

