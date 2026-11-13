"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  UserCheck,
  FileText,
  Users,
  Settings,
  Moon,
  LogOut,
  Building2,
  CreditCard,
  FileUp,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  instansi?: "dinsos" | "dukcapil";
  roleTitle?: string;
  basePath?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({
  instansi = "dinsos",
  roleTitle = "Admin Kecamatan",
  basePath = "/petugas/dinsos/kecamatan/dashboard",
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Menu navigasi disesuaikan dengan Instansi (Dinsos vs Dukcapil) dan Tingkat (Kota vs Kecamatan)
  const isKecamatan = basePath.includes("/kecamatan");

  const navItems =
    instansi === "dinsos"
      ? [
          { href: basePath, label: "Beranda", icon: Home },
          { href: `${basePath}/pengajuan`, label: "Pengajuan Desil", icon: UserCheck },
          { href: `${basePath}/laporan`, label: "Laporan Desil", icon: FileText },
          { href: `${basePath}/warga`, label: "Data Warga", icon: Users },
          { href: `${basePath}/pengaturan`, label: "Pengaturan", icon: Settings },
        ]
      : isKecamatan
      ? [
          // Dukcapil Kecamatan: Fitur Upload Blangko Dihilangkan sesuai instruksi user
          { href: basePath, label: "Beranda", icon: Home },
          { href: `${basePath}/pengajuan`, label: "Pengajuan KTP", icon: CreditCard },
          { href: `${basePath}/laporan`, label: "Laporan KTP", icon: FileText },
          { href: `${basePath}/warga`, label: "Data Warga", icon: Users },
          { href: `${basePath}/pengaturan`, label: "Pengaturan", icon: Settings },
        ]
      : [
          // Dukcapil Kota: Memiliki fitur Upload Blangko
          { href: basePath, label: "Beranda", icon: Home },
          { href: `${basePath}/pengajuan`, label: "Pengajuan KTP", icon: CreditCard },
          { href: `${basePath}/upload-blangko`, label: "Upload Blangko", icon: FileUp },
          { href: `${basePath}/laporan`, label: "Laporan KTP", icon: FileText },
          { href: `${basePath}/warga`, label: "Data Warga", icon: Users },
          { href: `${basePath}/pengaturan`, label: "Pengaturan", icon: Settings },
        ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 select-none">
      <div>
        {/* Top Brand Logo */}
        <div className="flex items-center justify-between px-2 py-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0E3F9A] shadow">
              <Building2 size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight leading-none text-white">
                GOV-HUB
              </span>
              <span className="text-[10px] text-blue-200 tracking-wide font-medium mt-0.5">
                {roleTitle}
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              aria-label="Tutup Menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map(({ href, label, icon: Icon }, idx) => {
            const isActive =
              idx === 0
                ? pathname === href || pathname.endsWith("/dashboard")
                : pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={() => onClose?.()}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white/20 text-white font-bold shadow-inner"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu: Dark Mode & Keluar */}
      <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => {}}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white/90 transition-colors cursor-pointer"
        >
          <Moon size={16} className="text-amber-300" />
          <span>Dark Mode</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (basePath.includes("/dukcapil/kecamatan")) {
              router.push("/petugas/dukcapil/kecamatan/login");
            } else if (basePath.includes("/dukcapil/kota")) {
              router.push("/petugas/dukcapil/kota/login");
            } else if (basePath.includes("/dukcapil")) {
              router.push("/petugas/dukcapil/login");
            } else if (basePath.includes("/dinsos/kecamatan")) {
              router.push("/petugas/dinsos/kecamatan/login");
            } else if (basePath.includes("/dinsos/kota")) {
              router.push("/petugas/dinsos/kota/login");
            } else if (basePath.includes("/dinsos")) {
              router.push("/petugas/dinsos/login");
            } else {
              router.push("/petugas/login");
            }
          }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Docked Sidebar */}
      <aside className="hidden md:flex w-[190px] md:w-[210px] bg-[#0E3F9A] dark:bg-[#091E45] min-h-screen text-white flex-col justify-between shadow-xl select-none flex-shrink-0 z-20 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in"
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-[#0E3F9A] text-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
