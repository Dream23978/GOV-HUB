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
  Sun,
  LogOut,
  Building2,
  CreditCard,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";

interface AdminSidebarProps {
  instansi?: "dinsos" | "dukcapil";
  roleTitle?: string;
  basePath?: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  instansi = "dinsos",
  roleTitle = "Admin Kecamatan",
  basePath = "/admin/dinsos/kecamatan/dashboard",
  isMobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // Menu navigasi disesuaikan dengan Instansi (Dinsos vs Dukcapil)
  const navItems =
    instansi === "dinsos"
      ? [
          { href: basePath, label: "Beranda", icon: Home },
          { href: `${basePath}/pengajuan`, label: "Pengajuan Desil", icon: UserCheck },
          { href: `${basePath}/laporan`, label: "Laporan Desil", icon: FileText },
          { href: `${basePath}/warga`, label: "Data Warga", icon: Users },
          { href: `${basePath}/pengaturan`, label: "Pengaturan", icon: Settings },
        ]
      : [
          { href: basePath, label: "Beranda", icon: Home },
          { href: `${basePath}/pengajuan`, label: "Pengajuan KTP", icon: CreditCard },
          { href: `${basePath}/laporan`, label: "Laporan Penduduk", icon: FileText },
          { href: `${basePath}/warga`, label: "Data Warga", icon: Users },
          { href: `${basePath}/pengaturan`, label: "Pengaturan", icon: Settings },
        ];

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Tutup Menu"
          onClick={onCloseMobile}
          onKeyDown={(e) => {
            if (e.key === "Escape") onCloseMobile?.();
          }}
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xs md:hidden cursor-pointer"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-20 w-[220px] md:w-[210px] bg-[#0E3F9A] dark:bg-[#091E45] text-white flex flex-col justify-between p-4 shadow-xl select-none flex-shrink-0 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
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

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              aria-label="Tutup Menu"
            >
              <X size={18} />
            </button>
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
                  onClick={() => onCloseMobile?.()}
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
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white/90 transition-colors cursor-pointer"
          >
            {isDark ? (
              <Sun size={16} className="text-amber-300" />
            ) : (
              <Moon size={16} className="text-amber-300 fill-amber-300" />
            )}
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/login")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
