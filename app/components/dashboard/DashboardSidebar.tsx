"use client";

import Link from "next/link";
import Image from "next/image";
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
  { href: "/protected", label: "Beranda", icon: Home },
  { href: "/protected/layanan-ktp", label: "Layanan KTP & Dukcapil", icon: CreditCard },
  { href: "/protected/layanan-bansos", label: "Layanan Bansos & Desil", icon: Users },
  { href: "/protected/pengajuan", label: "Pengajuan Saya", icon: FileText },
  { href: "/protected/notifikasi", label: "Nontifikasi", icon: Bell },
  { href: "/protected/profil", label: "Profil", icon: User },
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
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[152px] bg-[#1a237e] flex flex-col z-30 shadow-2xl">
      {/* Logo */}
      <div className="flex items-center justify-center pt-6 pb-4 px-3">
        <div className="flex items-center gap-2">
          <Image
            src="/garuda.png"
            alt="Garuda"
            width={28}
            height={28}
            className="object-contain"
          />
          <div className="w-px h-6 bg-white/30" />
          <div className="flex items-center gap-1">
            <Image
              src="/logo.png"
              alt="Gov-Hub Logo"
              width={18}
              height={18}
              className="object-contain"
            />
            <span className="text-white font-bold text-xs leading-tight">
              GOV-<span className="text-[#FFD700]">HUB</span>
            </span>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2 pt-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}`}
              />
              <span className="text-[11px] font-medium leading-tight">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 pb-6 flex flex-col gap-1">
        {/* Dark mode toggle */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 w-full"
        >
          {isDark ? (
            <Sun size={18} className="flex-shrink-0" />
          ) : (
            <Moon size={18} className="flex-shrink-0" />
          )}
          <span className="text-[11px] font-medium">Dark Mode</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 w-full"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span className="text-[11px] font-medium">{loggingOut ? "Keluar..." : "Keluar"}</span>
        </button>
      </div>
    </aside>
  );
}
