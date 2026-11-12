"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Clock, Info, Home, ArrowRight, FileText, Check } from "lucide-react";

interface TrackingPickupCardProps {
  lokasi?: string;
  jamLayanan?: string;
  catatan?: string;
}

export function TrackingPickupCard({
  lokasi = "Kecamatan setempat",
  jamLayanan = "Sesuai jam operasional",
  catatan = "Bawa diri Anda; tidak perlu membawa fotokopi berkas.",
}: TrackingPickupCardProps) {
  const [showPetunjukModal, setShowPetunjukModal] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-5 md:p-6 mb-8 w-full">
        {/* Header with Green Checkmark Icon */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#107C41] flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm select-none">
            <Check size={18} strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-gray-900 dark:text-white leading-tight">
              KTP-el Anda sudah jadi!
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
              Silakan ambil KTP-el di lokasi layanan sesuai informasi berikut.
            </p>
          </div>
        </div>

        {/* 3 Information Boxes */}
        <div className="border border-gray-200 dark:border-slate-700/80 rounded-xl p-3 md:p-3.5 my-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50/50 dark:bg-slate-800/40">
          {/* Box 1: Lokasi Pengambilan */}
          <div className="flex items-start gap-2.5">
            <MapPin size={18} className="text-[#2563EB] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal block leading-tight">
                Lokasi Pengambilan
              </span>
              <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 leading-tight">
                {lokasi}
              </p>
            </div>
          </div>

          {/* Box 2: Jam Layanan */}
          <div className="flex items-start gap-2.5">
            <Clock size={18} className="text-[#2563EB] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal block leading-tight">
                Jam Layanan
              </span>
              <p className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 leading-tight">
                {jamLayanan}
              </p>
            </div>
          </div>

          {/* Box 3: Catatan */}
          <div className="flex items-start gap-2.5">
            <Info size={18} className="text-[#2563EB] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal block leading-tight">
                Catatan
              </span>
              <p className="text-[11px] text-gray-700 dark:text-gray-300 mt-0.5 leading-snug">
                {catatan}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          {/* Button 1: Lihat Petunjuk Pengambilan */}
          <button
            type="button"
            onClick={() => setShowPetunjukModal(true)}
            className="flex-1 w-full bg-[#0B57D0] hover:bg-[#0947A8] active:scale-[0.99] text-white font-semibold text-xs md:text-sm py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <FileText size={16} className="text-white/90" />
            <span>Lihat Petunjuk Pengambilan</span>
            <ArrowRight size={16} />
          </button>

          {/* Button 2: Kembali ke Beranda */}
          <Link
            href="/dashboard"
            className="w-full sm:w-auto border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 font-semibold text-xs md:text-sm py-2.5 px-5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home size={16} className="text-gray-600 dark:text-gray-300" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>

      {/* Petunjuk Pengambilan Modal */}
      {showPetunjukModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">
              Petunjuk Pengambilan KTP-el
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Harap perhatikan syarat dan tata cara pengambilan fisik KTP-el Anda di kantor kecamatan.
            </p>

            <div className="flex flex-col gap-2.5 text-xs text-gray-700 dark:text-gray-300 mb-5">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Bawa bukti pengajuan berupa tiket fisik atau screenshot nomor tiket (<strong>KTP-2026-00124</strong>).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Datang langsung ke loket Dukcapil di <strong>Kecamatan setempat</strong> pada jam operasional (Senin - Jumat, 08.00 - 15.00 WIB).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Tidak perlu membawa fotokopi berkas apa pun. Cukup verifikasi sidik jari pemohon di loket penyerahan.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPetunjukModal(false)}
              className="w-full bg-[#0B57D0] hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}

