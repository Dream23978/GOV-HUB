import React from "react";
import { AdminHeroSection } from "@/app/components/petugas/AdminHeroSection";

export const metadata = {
  title: "Portal Admin Dinsos Kota | GOV-HUB",
  description: "Pusat Otorisasi dan Rekapitulasi Data Kesejahteraan Sosial Tingkat Kota.",
};

export default function DinsosKotaHomePage() {
  return (
    <main>
      <AdminHeroSection
        badgeTitle="GOV-HUB"
        badgeTag="Dinsos Kota"
        badgeSubtitle="Sistem Pengawasan & Penetapan Desil Kesejahteraan Kota"
        headlineFirst="Lebih Mudah,"
        headlineSecond="Lebih Cepat, "
        headlineHighlight="Lebih Tepat"
        description="Portal Otorisasi Dinsos Kota untuk validasi final desil DTKS, rekapitulasi data kecamatan, dan sinkronisasi kuota bansos kota."
        nipCardTitle="Login NIP Dinsos Kota"
        nipCardSubtitle="Dinas Sosial Pemerintah Kota"
        loginUrl="/petugas/dinsos/kota/login"
      />
    </main>
  );
}

