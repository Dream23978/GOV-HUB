"use client";

import React, { useEffect, useState } from "react";
import { TrackingKtpHeader } from "./TrackingKtpHeader";
import { TrackingKtpCard, TrackingData } from "./TrackingKtpCard";
import { TrackingDetailCard } from "./TrackingDetailCard";
import { TrackingTimelineCard } from "./TrackingTimelineCard";
import { TrackingPickupCard } from "./TrackingPickupCard";

interface TrackingProfileData {
  nama: string;
  maskedNik: string;
}

interface TrackingKtpContentProps {
  initialData?: TrackingData;
  profileData?: TrackingProfileData;
  defaultOpen?: boolean;
}

export function TrackingKtpContent({
  initialData,
  profileData,
  defaultOpen = false,
}: TrackingKtpContentProps) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);

  const [trackingData, setTrackingData] = useState<TrackingData>(() => {
    return (
      initialData || {
        nomorPengajuan: "KTP-2026-00124",
        statusSaatIni: "Pembuatan KTP EL",
        tanggalPengajuan: "28 September 2026",
        statusBadge: "Terkonfirmasi",
      }
    );
  });

  const [citizenProfile] = useState<TrackingProfileData>(() => {
    return (
      profileData || {
        nama: "Hapis Khairullah",
        maskedNik: "NIK: ********1234",
      }
    );
  });

  // Sinkronkan data jika ada pengajuan baru dari form Ajukan KTP di localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("govhub_last_ktp_submission");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.nomorPengajuan) {
            setTrackingData({
              nomorPengajuan: parsed.nomorPengajuan,
              statusSaatIni: parsed.statusSaatIni || "Pembuatan KTP EL",
              tanggalPengajuan: parsed.tanggalPengajuan || "28 September 2026",
              statusBadge: parsed.statusBadge || "Terkonfirmasi",
            });
          }
        }
      } catch (err) {
        console.error("Error reading saved submission:", err);
      }
    }
  }, []);

  return (
    <div className="flex flex-col w-full max-w-2xl pb-10">
      {/* Header with Back Button */}
      <TrackingKtpHeader />

      {/* 1. Main Tracking Summary Card with Dropdown Trigger */}
      <TrackingKtpCard
        data={trackingData}
        isOpen={isExpanded}
        onToggle={() => setIsExpanded((prev) => !prev)}
      />

      {/* 2. Dropdown Accordion Section — Slides down when user clicks the card */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-4 ${
          isExpanded
            ? "max-h-[2500px] opacity-100 translate-y-0 mt-1"
            : "max-h-0 opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        {/* Detail Pemohon & Metadata */}
        <TrackingDetailCard
          nama={citizenProfile.nama}
          maskedNik={citizenProfile.maskedNik}
          nomorPengajuan={trackingData.nomorPengajuan}
          jenisLayanan="Pembuatan KTP-el"
          tanggalPengajuan={trackingData.tanggalPengajuan}
          lokasiLayanan="Kecamatan setempat"
        />

        {/* Vertical Timeline Status Proses */}
        <TrackingTimelineCard />

        {/* Pickup & Completion Banner with Action Buttons */}
        <TrackingPickupCard
          lokasi="Kecamatan setempat"
          jamLayanan="Sesuai jam operasional"
          catatan="Bawa diri Anda; tidak perlu membawa fotokopi berkas."
        />
      </div>
    </div>
  );
}
