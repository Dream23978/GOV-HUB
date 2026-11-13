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
  IdCard,
  Handshake,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";

interface AdminSidebarProps {
  instansi?: "dinsos" | "dukcapil" | "pusat";
  roleTitle?: string;
  basePath?: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  showRoleSubtitle?: boolean;
}

export function AdminSidebar({
  instansi = "pusat",
  roleTitle = "Admin Pusat",
  basePath = "/admin/dashboard",
  isMobileOpen = false,
  onCloseMobile,
  showRoleSubtitle = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // Menu navigasi: Pusat menggabungkan KTP dan Desil sesuai spesifikasi mockup
  const navItems =
    instansi === "pusat"
      ? [
          { href: basePath, label: "Beranda", icon: Home },
          { href: `${basePath}/pengajuan-ktp`, label: "Pengajuan KTP", icon: IdCard },
          { href: `${basePath}/pengajuan-desil`, label: "Pengajuan Desil", icon: IdCard },
          { href: `${basePath}/warga`, label: "Data Warga", icon: Handshake },
          { href: `${basePath}/pengaturan`, label: "Pengaturan", icon: FileText },
        ]
      : instansi === "dinsos"
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
        className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-20 w-[240px] md:w-[225px] bg-gradient-to-b from-[#0F2245] via-[#0B1A35] to-[#071326] text-white flex flex-col justify-between p-4 shadow-2xl select-none flex-shrink-0 transition-transform duration-300 ease-in-out border-r border-white/5 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Top Brand Logo - 100% Sesuai Screenshot */}
          <div className="flex items-center justify-between px-2 py-3 mb-5">
            <div className="flex items-center gap-3">
              {/* Emblem icon */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0066CC] via-[#0088FF] to-[#38BDF8] p-[2.5px] shadow-lg shadow-blue-500/30 flex items-center justify-center flex-shrink-0">
                <div className="w-full h-full rounded-full bg-[#081832] flex items-center justify-center">
                  <Building2 size={20} className="text-[#38BDF8]" strokeWidth={2.4} />
                </div>
              </div>
              {/* Brand Text */}
              <div className="flex flex-col">
                <div className="flex items-center text-xl font-black tracking-tight leading-none">
                  <span className="text-white">GOV-</span>
                  <span className="text-[#0084FF]">HUB</span>
                </div>
                {showRoleSubtitle && roleTitle && (
                  <span className="text-[10px] text-blue-200/80 font-medium tracking-wide mt-1">
                    {roleTitle}
                  </span>
                )}
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
          <nav className="flex flex-col gap-2">
            {navItems.map(({ href, label, icon: Icon }, idx) => {
              const isHome = idx === 0;
              const isActive = isHome
                ? pathname === href || pathname === `${href}/` || pathname.endsWith("/dashboard")
                : pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => onCloseMobile?.()}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? "bg-[#0084FF]/25 text-white shadow-sm border border-[#0084FF]/40 font-bold"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`flex-shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? "text-[#38BDF8]" : "text-white/90"
                    }`}
                  />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Menu: Dark Mode & Keluar (Card Translucent) */}
        <div className="rounded-2xl bg-white/10 border border-white/15 p-2 backdrop-blur-md flex flex-col gap-1.5 shadow-lg">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-white/90 hover:bg-white/10 transition-colors cursor-pointer text-left"
          >
            {isDark ? (
              <Sun size={16} className="text-amber-300 flex-shrink-0" />
            ) : (
              <Moon size={16} className="text-amber-300 fill-amber-300 flex-shrink-0" />
            )}
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/login")}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-300 hover:text-red-200 hover:bg-red-500/15 transition-colors cursor-pointer text-left"
          >
            <LogOut size={16} className="text-red-400 flex-shrink-0" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
