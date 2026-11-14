"use client";

import React from "react";
import Link from "next/link";
import { Building2, Menu, User } from "lucide-react";

interface AdminHeaderProps {
  instansiName?: string;
  roleBadge?: string;
  adminName?: string;
  profileHref?: string;
  onToggleSidebar?: () => void;
}

export function AdminHeader({
  instansiName = "Dinas Sosial",
  roleBadge = "Admin Kecamatan & Kota",
  adminName = "Petugas",
  profileHref = "/admin/dashboard/pengaturan",
  onToggleSidebar,
}: AdminHeaderProps) {
  return (
    <header className="w-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-700/80 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
      {/* Brand Logo in Header */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 -ml-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="w-8 h-8 rounded-full bg-[#1b3a6b] text-white flex items-center justify-center shadow-sm">
          <Building2 size={16} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-lg md:text-xl text-[#1b3a6b] dark:text-blue-400 tracking-tight">
            GOV-HUB
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
            {instansiName}
          </span>
        </div>
      </div>

      {/* Right: Officer Profile Info & Avatar */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
            {adminName}
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">
            {roleBadge}
          </span>
        </div>

        <Link
          href={profileHref}
          className="w-9 h-9 rounded-full border-2 border-red-500 shadow-sm flex-shrink-0 bg-[#1b3a6b] hover:bg-[#152e55] text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Profil Admin"
          title="Buka Profil & Pengaturan"
        >
          <User size={18} />
        </Link>
      </div>
    </header>
  );
}
