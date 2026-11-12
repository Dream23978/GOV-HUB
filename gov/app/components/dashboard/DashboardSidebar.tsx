"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Home,
  CreditCard,
  Users,
  FileText,
  Bell,
  User,
  Moon,
  LogOut,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

const navItems = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/dashboard/layanan-ktp", label: "Layanan KTP &\nDukcapil", icon: CreditCard },
  { href: "/dashboard/layanan-bansos", label: "Layanan Bansos &\nDesil", icon: Users },
  { href: "/dashboard/pengajuan", label: "Pengajuan Saya", icon: FileText },
  { href: "/dashboard/notifikasi", label: "Nontifikasi", icon: Bell },
  { href: "/dashboard/profil", label: "Profil", icon: User },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);

  const isDark = theme === "dark";

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[152px] bg-[#0E3F9A] dark:bg-[#091E45] flex-col justify-between z-30 shadow-2xl overflow-hidden select-none">
      {/* Nav items */}
      <nav className="flex flex-col mt-4 gap-1 px-2 pt-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-white/20 text-white font-semibold shadow-inner"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 ${
                  isActive ? "text-white" : "text-white/80 group-hover:text-white"
                }`}
              />
              <span className="text-[11px] leading-tight whitespace-pre-line font-medium">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions container with floating translucent card & Map watermark */}
      <div className="relative px-2 pb-3 flex flex-col gap-2 z-10">
        {/* Floating rounded card */}
        <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 flex flex-col gap-0.5 shadow-md">
          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 text-left w-full cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={17} className="flex-shrink-0 text-amber-300" />
            ) : (
              <Moon size={17} className="flex-shrink-0 text-amber-300 fill-amber-300" />
            )}
            <span className="text-[11px] font-medium leading-tight">Dark Mode</span>
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 transition-all duration-200 text-left w-full cursor-pointer disabled:opacity-50"
            aria-label="Keluar"
          >
            <LogOut size={17} className="flex-shrink-0 text-[#FF6B6B]" />
            <span className="text-[11px] font-medium leading-tight">
              {loggingOut ? "Keluar..." : "Keluar"}
            </span>
          </button>
        </div>

        {/* Indonesia map outline watermark at the bottom of sidebar */}
        <div className="opacity-30 px-1 pt-1 pointer-events-none select-none">
          <svg
            viewBox="0 0 140 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full text-white"
          >
            {/* Sumatra */}
            <path
              d="M5 28C10 20 18 16 26 23C22 28 14 34 5 28Z"
              fill="currentColor"
              opacity="0.7"
            />
            {/* Java */}
            <path
              d="M26 36C34 34 46 33 55 35C45 38 34 38 26 36Z"
              fill="currentColor"
              opacity="0.8"
            />
            {/* Kalimantan */}
            <path
              d="M40 18C42 12 52 10 56 16C58 24 50 26 44 24C40 22 39 20 40 18Z"
              fill="currentColor"
              opacity="0.75"
            />
            {/* Sulawesi */}
            <path
              d="M66 16C70 14 74 18 72 23C70 26 73 30 76 31C74 33 71 31 69 27C67 25 65 20 66 16Z"
              fill="currentColor"
              opacity="0.8"
            />
            {/* Papua */}
            <path
              d="M98 22C104 16 114 15 125 21C122 27 114 30 106 28C100 27 96 24 98 22Z"
              fill="currentColor"
              opacity="0.75"
            />
          </svg>
        </div>
      </div>
    </aside>

    {/* Mobile Bottom Navigation Bar (visible below md screens) */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E3F9A]/95 dark:bg-[#091E45]/95 backdrop-blur-md border-t border-white/20 px-2 py-1 flex items-center justify-around shadow-2xl select-none">
      {navItems.slice(0, 5).map(({ href, label, icon: Icon }) => {
        const isActive =
          pathname === href ||
          (href !== "/dashboard" && pathname.startsWith(href));
        const shortLabel =
          href === "/dashboard"
            ? "Beranda"
            : href.includes("ktp")
            ? "KTP"
            : href.includes("bansos")
            ? "Bansos"
            : href.includes("pengajuan")
            ? "Pengajuan"
            : "Notif";

        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive
                ? "text-white font-bold bg-white/20 scale-105"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Icon size={18} />
            <span className="text-[9px] mt-0.5 leading-tight font-medium">
              {shortLabel}
            </span>
          </Link>
        );
      })}

      {/* Quick mobile theme toggle */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex flex-col items-center justify-center py-1 px-2 text-amber-300 hover:text-amber-200 transition-all cursor-pointer"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} className="fill-amber-300" />}
        <span className="text-[9px] mt-0.5 leading-tight text-white/70 font-medium">
          Tema
        </span>
      </button>
    </nav>
    </>
  );
}
