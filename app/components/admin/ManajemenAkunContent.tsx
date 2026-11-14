"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Search,
  Filter,
  Users,
  ShieldCheck,
  UserCheck,
  Eye,
  KeyRound,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  EyeOff,
  RefreshCw,
  Building2,
  Phone,
  Mail,
  MapPin,
  UserCog,
} from "lucide-react";
import type { AdminAccountItem } from "@/lib/services/admin.service";
import {
  adminUpdateAccountPasswordAction,
  adminDeleteAccountAction,
} from "@/app/actions/admin";

interface ManajemenAkunContentProps {
  initialAccounts: AdminAccountItem[];
}

export function ManajemenAkunContent({ initialAccounts }: ManajemenAkunContentProps) {
  const [accounts, setAccounts] = useState<AdminAccountItem[]>(initialAccounts);

  useEffect(() => {
    setAccounts(initialAccounts);
  }, [initialAccounts]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("semua");
  const [instansiFilter, setInstansiFilter] = useState<string>("semua");

  // Modal States
  const [selectedDetailAccount, setSelectedDetailAccount] = useState<AdminAccountItem | null>(null);
  const [passwordModalAccount, setPasswordModalAccount] = useState<AdminAccountItem | null>(null);
  const [deleteModalAccount, setDeleteModalAccount] = useState<AdminAccountItem | null>(null);

  // Password Form States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Toast / Notification
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isPending, startTransition] = useTransition();

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Filter logic
  const filteredAccounts = accounts.filter((acc) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      acc.nama.toLowerCase().includes(q) ||
      acc.nik.toLowerCase().includes(q) ||
      acc.email.toLowerCase().includes(q) ||
      acc.wilayah.toLowerCase().includes(q);

    const matchRole =
      roleFilter === "semua" ||
      acc.role.toLowerCase() === roleFilter.toLowerCase();

    const matchInstansi =
      instansiFilter === "semua" ||
      acc.instansi.toLowerCase() === instansiFilter.toLowerCase();

    return matchQuery && matchRole && matchInstansi;
  });

  // Counters
  const totalCount = accounts.length;
  const adminCount = accounts.filter((a) => a.role === "admin").length;
  const petugasCount = accounts.filter((a) => a.role === "petugas").length;
  const wargaCount = accounts.filter((a) => a.role === "warga").length;

  // Handle Update Password
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalAccount) return;

    if (!newPassword || newPassword.length < 6) {
      setPasswordError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setPasswordError(null);
    startTransition(async () => {
      const res = await adminUpdateAccountPasswordAction({
        accountId: passwordModalAccount.id,
        newPassword: newPassword.trim(),
      });

      if (res.success) {
        showToast(
          `Kata sandi untuk ${passwordModalAccount.nama} (${passwordModalAccount.nik}) berhasil diubah!`
        );
        setPasswordModalAccount(null);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(res.error || "Gagal mengubah kata sandi.");
      }
    });
  };

  // Handle Delete Account
  const handleConfirmDelete = () => {
    if (!deleteModalAccount) return;

    startTransition(async () => {
      const res = await adminDeleteAccountAction({
        accountId: deleteModalAccount.id,
      });

      if (res.success) {
        setAccounts((prev) => prev.filter((a) => a.id !== deleteModalAccount.id));
        if (selectedDetailAccount?.id === deleteModalAccount.id) {
          setSelectedDetailAccount(null);
        }
        showToast(
          `Akun ${deleteModalAccount.nama} (${deleteModalAccount.nik}) berhasil dihapus dari sistem.`
        );
        setDeleteModalAccount(null);
      } else {
        showToast(res.error || "Gagal menghapus akun.", "error");
      }
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <ShieldCheck size={12} />
            Admin
          </span>
        );
      case "petugas":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <UserCheck size={12} />
            Petugas
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Users size={12} />
            Warga
          </span>
        );
    }
  };

  const getInstansiBadge = (instansi: string) => {
    switch (instansi) {
      case "pusat":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60">
            Pusat / Kemendagri
          </span>
        );
      case "dinsos":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800/60">
            Dinas Sosial
          </span>
        );
      case "dukcapil":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-200 dark:border-cyan-800/60">
            Dukcapil
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            Warga Umum
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium animate-in fade-in slide-in-from-bottom-5 duration-300 ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/30"
              : "bg-red-600 text-white border-red-500 shadow-red-600/30"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 size={18} className="flex-shrink-0" />
          ) : (
            <AlertTriangle size={18} className="flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:opacity-75 cursor-pointer text-white/90"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Header & Stats Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#1b3a6b] dark:text-blue-400 flex items-center justify-center font-bold">
                <UserCog className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Manajemen Akun Terpadu GOV-HUB
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                  Kelola, tinjau detail, ganti password, dan atur akun aparatur serta warga se-Indonesia.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 text-center min-w-[70px]">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total</div>
              <div className="text-base font-bold text-slate-900 dark:text-white">{totalCount}</div>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-800/60 text-center min-w-[70px]">
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Admin</div>
              <div className="text-base font-bold text-purple-700 dark:text-purple-300">{adminCount}</div>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 text-center min-w-[70px]">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Petugas</div>
              <div className="text-base font-bold text-blue-700 dark:text-blue-300">{petugasCount}</div>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 text-center min-w-[70px]">
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Warga</div>
              <div className="text-base font-bold text-emerald-700 dark:text-emerald-300">{wargaCount}</div>
            </div>
          </div>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan NIK / NIP, Nama Pengguna, Email, atau Wilayah..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b3a6b] dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter Role */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[140px]">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1b3a6b] dark:focus:ring-blue-500 cursor-pointer font-medium"
              >
                <option value="semua">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="petugas">Petugas</option>
                <option value="warga">Warga</option>
              </select>
              <Filter
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* Filter Instansi */}
            <div className="relative min-w-[160px]">
              <select
                value={instansiFilter}
                onChange={(e) => setInstansiFilter(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1b3a6b] dark:focus:ring-blue-500 cursor-pointer font-medium"
              >
                <option value="semua">Semua Instansi</option>
                <option value="pusat">Kemendagri / Pusat</option>
                <option value="dinsos">Dinas Sosial</option>
                <option value="dukcapil">Dukcapil</option>
                <option value="umum">Warga Umum</option>
              </select>
              <Building2
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Account List: Responsive Desktop Table & Mobile Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {filteredAccounts.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Tidak ada akun yang ditemukan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian atau reset filter role dan instansi di atas.
            </p>
            {(searchQuery || roleFilter !== "semua" || instansiFilter !== "semua") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("semua");
                  setInstansiFilter("semua");
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View (md and up) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-[#1b3a6b]/5 dark:bg-slate-800/80 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-6">Pengguna & NIK / NIP</th>
                    <th className="py-3.5 px-4">Role & Instansi</th>
                    <th className="py-3.5 px-4">Wilayah Tugas / Domisili</th>
                    <th className="py-3.5 px-4">Kontak</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-normal">
                  {filteredAccounts.map((account) => {
                    const initials = account.nama
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase();

                    return (
                      <tr
                        key={account.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* Profile & NIK */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                                {account.nama}
                              </div>
                              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                {account.nik}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role & Instansi */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1 items-start">
                            {getRoleBadge(account.role)}
                            {getInstansiBadge(account.instansi)}
                          </div>
                        </td>

                        {/* Wilayah */}
                        <td className="py-4 px-4 text-xs">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {account.wilayah}
                          </div>
                          {account.role === "warga" && account.desil && (
                            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                              Desil {account.desil}
                            </span>
                          )}
                        </td>

                        {/* Kontak */}
                        <td className="py-4 px-4 text-xs">
                          <div className="text-slate-700 dark:text-slate-300 truncate max-w-[160px]">
                            {account.email}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            {account.nomorTelepon}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {account.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Lihat Detail */}
                            <button
                              onClick={() => setSelectedDetailAccount(account)}
                              title="Lihat Detail Akun"
                              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                            >
                              <Eye size={16} />
                            </button>

                            {/* Ganti Password */}
                            <button
                              onClick={() => {
                                setPasswordModalAccount(account);
                                setNewPassword("");
                                setConfirmPassword("");
                                setPasswordError(null);
                              }}
                              title="Ganti Password"
                              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors cursor-pointer border border-transparent hover:border-amber-200 dark:hover:border-amber-800"
                            >
                              <KeyRound size={16} />
                            </button>

                            {/* Hapus Akun */}
                            <button
                              onClick={() => setDeleteModalAccount(account)}
                              title="Hapus Akun"
                              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (< md) */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAccounts.map((account) => {
                const initials = account.nama
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div key={account.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white text-sm">
                            {account.nama}
                          </div>
                          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                            {account.nik}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getRoleBadge(account.role)}
                        {getInstansiBadge(account.instansi)}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate">{account.wilayah}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate">{account.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} className="text-slate-400 flex-shrink-0" />
                        <span>{account.nomorTelepon}</span>
                      </div>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setSelectedDetailAccount(account)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye size={14} />
                        Detail
                      </button>

                      <button
                        onClick={() => {
                          setPasswordModalAccount(account);
                          setNewPassword("");
                          setConfirmPassword("");
                          setPasswordError(null);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 cursor-pointer"
                      >
                        <KeyRound size={14} />
                        Ganti Sandi
                      </button>

                      <button
                        onClick={() => setDeleteModalAccount(account)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 size={14} />
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: DETAIL AKUN                                     */}
      {/* ======================================================== */}
      {selectedDetailAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedDetailAccount(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                {selectedDetailAccount.nama
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedDetailAccount.nama}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {getRoleBadge(selectedDetailAccount.role)}
                  {getInstansiBadge(selectedDetailAccount.instansi)}
                </div>
              </div>
            </div>

            {/* Profile Detail Grid */}
            <div className="mt-5 space-y-4 text-xs md:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px] font-medium">
                    {selectedDetailAccount.role === "warga" ? "NIK (Nomor Induk Kependudukan)" : "NIP / NIK Petugas"}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-sm mt-0.5 block">
                    {selectedDetailAccount.nik}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px] font-medium">
                    Nomor Kartu Keluarga (KK)
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-sm mt-0.5 block">
                    {selectedDetailAccount.noKk || "-"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px] font-medium">
                    Alamat Email Terdaftar
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
                    {selectedDetailAccount.email}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px] font-medium">
                    Nomor Handphone / WhatsApp
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {selectedDetailAccount.nomorTelepon}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px] font-medium">
                    Tempat & Tanggal Lahir
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {selectedDetailAccount.tempatTanggalLahir || "-"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px] font-medium">
                    Jenis Kelamin
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {selectedDetailAccount.jenisKelamin || "-"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px] font-medium">
                  Alamat Domisili Lengkap
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {selectedDetailAccount.alamat || selectedDetailAccount.wilayah}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Tingkat Wilayah</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs">
                    {selectedDetailAccount.tingkat}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Terdaftar Sejak</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {selectedDetailAccount.createdAt}
                  </span>
                </div>
                {selectedDetailAccount.desil ? (
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                    <span className="text-amber-700 dark:text-amber-400 block text-[11px]">Desil DTKS</span>
                    <span className="font-bold text-amber-900 dark:text-amber-200 text-xs">
                      Desil {selectedDetailAccount.desil}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                    <span className="text-emerald-700 dark:text-emerald-400 block text-[11px]">Status Akun</span>
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                      {selectedDetailAccount.status}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setDeleteModalAccount(selectedDetailAccount);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Trash2 size={15} />
                Hapus Akun Ini
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPasswordModalAccount(selectedDetailAccount);
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <KeyRound size={15} />
                  Ganti Password
                </button>
                <button
                  onClick={() => setSelectedDetailAccount(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: GANTI PASSWORD                                  */}
      {/* ======================================================== */}
      {passwordModalAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 relative">
            <button
              onClick={() => {
                setPasswordModalAccount(null);
                setPasswordError(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <KeyRound size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ganti Kata Sandi Akun
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Perbarui kata sandi untuk {passwordModalAccount.nama}
                </p>
              </div>
            </div>

            <div className="mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
              <div className="text-slate-500">Target Akun:</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {passwordModalAccount.nama} ({passwordModalAccount.nik})
              </div>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              {passwordError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertTriangle size={15} className="flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    required
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1b3a6b]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    required
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1b3a6b]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordModalAccount(null);
                    setPasswordError(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1b3a6b] hover:bg-[#152e55] shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Password Baru"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: KONFIRMASI HAPUS AKUN                           */}
      {/* ======================================================== */}
      {deleteModalAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 relative">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hapus Akun Pengguna Secara Permanen?
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Anda akan menghapus akun milik{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                {deleteModalAccount.nama}
              </strong>{" "}
              (NIK/NIP: <span className="font-mono">{deleteModalAccount.nik}</span>). Tindakan ini tidak dapat dibatalkan dan pengguna tidak akan bisa login kembali.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteModalAccount(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  "Ya, Hapus Akun Ini"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
