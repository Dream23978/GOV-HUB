"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, UserCheck } from "lucide-react";
import { motion } from "motion/react";
import ScrollAnimate from "@/app/components/ScrollAnimate";

export function AdminHeroSection() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#051530] text-white">
      {/* ── Background Illustration (Foto Megah Malam Hari /admin-hero.jpg) ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/admin-hero.jpg"
          alt="Portal Administrator GOV-HUB - Skyline Ibu Kota & Gugusan Kepulauan Indonesia"
          fill
          priority
          className="object-cover object-center scale-[1.02]"
        />
        {/* Soft dynamic gradient overlay for maximum readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#041026]/90 via-[#071c3d]/70 to-[#041026]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041026] via-transparent to-[#041026]/60" />
      </div>

      {/* ── Top Navigation Bar ── */}
      <header className="relative z-10 w-full px-6 md:px-12 py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-xs">
        {/* Logo & Admin Badge */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#081836] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight">
                GOV<span className="text-blue-400">-HUB</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-md">
                Admin Portal
              </span>
            </div>
            <span className="text-xs text-blue-200/70">
              Sistem Pusat Pengelolaan &amp; Verifikasi Layanan Publik
            </span>
          </div>
        </div>
      </header>

      {/* ── Main Hero Section (Mirip layout homepage user) ── */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-14 lg:px-20 py-12 max-w-4xl">
        <ScrollAnimate direction="up" duration={0.6}>
          <h1 className="text-[2.2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[3.6rem] font-black text-white leading-[1.15] tracking-tight">
            Lebih Mudah,
            <br />
            Lebih Cepat,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
              Lebih Tepat
            </span>
          </h1>

          <p className="mt-4 text-[0.95rem] md:text-base text-slate-300 font-medium max-w-lg">
            GOV-HUB Portal Terpadu Administrator &amp; Verifikator Layanan Publik Pemerintahan RI.
          </p>
        </ScrollAnimate>

        {/* ── CTA Card Login Admin (Sama polanya seperti NikLoginForm di Homepage User) ── */}
        <ScrollAnimate direction="up" duration={0.6} delay={0.25}>
          <div className="mt-8">
            <Link href="/admin/login">
              <motion.div
                className="flex items-stretch bg-white rounded-2xl shadow-2xl overflow-hidden max-w-[440px] border border-white/60 cursor-pointer"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 20px 40px rgba(37, 99, 235, 0.25)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Left: icon + text content */}
                <div className="flex items-center gap-3.5 flex-1 px-4 py-3.5 bg-white">
                  {/* Shield / Officer icon */}
                  <motion.div
                    className="flex-shrink-0 text-[#1b3a6b]"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <UserCheck className="w-7 h-7 text-[#1b3a6b]" />
                  </motion.div>

                  {/* Text block */}
                  <div className="flex flex-col">
                    <span className="text-[#1b3a6b] font-bold text-sm md:text-base">
                      Login dengan NIP
                    </span>
                    <span className="text-[11px] text-gray-500 leading-none mt-0.5 whitespace-nowrap">
                      Login Petugas &amp; Administrator Layanan
                    </span>
                  </div>
                </div>

                {/* Right: Masuk button */}
                <motion.div
                  className="bg-[#1b3a6b] text-white font-bold text-sm md:text-base px-6 py-3.5 flex-shrink-0 flex items-center justify-center select-none"
                  whileHover={{ backgroundColor: "#152e55" }}
                  transition={{ duration: 0.2 }}
                >
                  Masuk
                </motion.div>
              </motion.div>
            </Link>
          </div>
        </ScrollAnimate>
      </main>

      {/* ── Bottom Footer ── */}
      <footer className="relative z-10 w-full px-6 md:px-12 py-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
        <p>© 2026 GOV-HUB • Portal Administrator Terpadu Kementerian &amp; Pemerintah Daerah RI</p>
        <div className="flex items-center gap-2 mt-2 sm:mt-0 text-blue-300 font-medium">
          <span>Kerahasiaan data aparatur dilindungi undang-undang</span>
        </div>
      </footer>
    </div>
  );
}
