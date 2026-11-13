"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AdminLoginFormPanel, AdminLoginFormPanelProps } from "./AdminLoginFormPanel";

export interface AdminLoginViewProps {
  backUrl?: string;
  backLabel?: string;
  heroTitle?: string;
  heroHighlight?: string;
  heroDescription?: string;
  formProps?: AdminLoginFormPanelProps;
}

export function AdminLoginView({
  backUrl = "/petugas",
  backLabel = "Halaman Depan Admin",
  heroTitle = "PORTAL RESMI",
  heroHighlight = "ADMINISTRATOR",
  heroDescription = "Sistem verifikasi data kependudukan, validasi geotagging live camera rumah, dan penetapan desil DTKS.",
  formProps,
}: AdminLoginViewProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#E5ECF6] p-4 md:p-8">
      {/* Card container */}
      <div className="w-full max-w-[840px] min-h-[520px] flex rounded-3xl overflow-hidden shadow-2xl bg-[#EEF3F9] border border-white/60">
        {/* Left — Admin Hero Image with Elegant Overlay (~42% width) */}
        <div className="hidden md:flex w-[42%] flex-shrink-0 relative bg-[#061530] flex-col justify-between p-7 text-white overflow-hidden">
          {/* Background image */}
          <Image
            src="/admin-hero.jpg"
            alt="Skyline Ibu Kota Indonesia & Peta Kepulauan Nusantara"
            fill
            sizes="(max-width: 768px) 100vw, 42vw"
            className="object-cover object-center"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#041026] via-[#071c3d]/70 to-[#041026]/80" />

          {/* Top content on hero */}
          <div className="relative z-10">
            <Link
              href={backUrl}
              className="inline-flex items-center gap-1.5 text-xs text-blue-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-xs"
            >
              <ArrowLeft size={13} />
              <span>{backLabel}</span>
            </Link>
          </div>

          {/* Bottom branding on hero */}
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center mb-3 backdrop-blur-md">
              <ShieldCheck className="w-6 h-6 text-blue-300" />
            </div>
            <h2 className="text-xl font-black leading-tight text-white">
              {heroTitle} <br />
              <span className="text-blue-300">{heroHighlight}</span>
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {heroDescription}
            </p>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden md:block w-px bg-gray-200 flex-shrink-0" />

        {/* Right — Login form (~58% width) */}
        <div className="flex-1 flex flex-col bg-white">
          <AdminLoginFormPanel {...formProps} />
        </div>
      </div>
    </main>
  );
}

