import React from "react";
import { AdminHeroSection } from "@/app/components/petugas/AdminHeroSection";

export const metadata = {
  title: "Portal Administrator Dinas Sosial & DTKS | GOV-HUB",
  description: "Pusat Kendali Pengelolaan Layanan Terpadu Bansos dan Verifikasi Desil Kesejahteraan RI.",
};

export default function DinsosRootHomePage() {
  return (
    <main>
      <AdminHeroSection
        badgeTitle="GOV-HUB"
        badgeTag="Dinas Sosial"
        badgeSubtitle="Sistem Pusat Pengelolaan Bantuan Sosial & Data Kesejahteraan"
        headlineFirst="Lebih Mudah,"
        headlineSecond="Lebih Cepat, "
        headlineHighlight="Lebih Tepat"
        description="Portal Administrator Dinas Sosial & Petugas Verifikasi Lapangan untuk validasi geotagging live camera rumah dan penetapan desil DTKS."
        nipCardTitle="Login dengan NIP Dinsos"
        nipCardSubtitle="Petugas Verifikator & Administrator Wilayah"
        loginUrl="/petugas/dinsos/login"
      />
    </main>
  );
}

