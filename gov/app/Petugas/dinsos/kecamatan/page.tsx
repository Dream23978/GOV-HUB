import React from "react";
import { AdminHeroSection } from "@/app/components/petugas/AdminHeroSection";

export const metadata = {
  title: "Portal Petugas Desil Kecamatan | GOV-HUB",
  description: "Pusat Kendali Pengelolaan Layanan Peninjauan Desil Tingkat Kecamatan.",
};

export default function DinsosKecamatanHomePage() {
  return (
    <main>
      <AdminHeroSection
        badgeTitle="GOV-HUB"
        badgeTag="Dinsos Kecamatan"
        badgeSubtitle="Sistem Verifikasi Lapangan & Peninjauan Desil Kecamatan"
        headlineFirst="Lebih Mudah,"
        headlineSecond="Lebih Cepat, "
        headlineHighlight="Lebih Tepat"
        description="Portal Petugas Verifikator Desil Kecamatan untuk meninjau data permohonan warga, verifikasi geotagging rumah, dan pembaharuan skor desil."
        nipCardTitle="Login Petugas Desil Kecamatan"
        nipCardSubtitle="Peninjauan & Verifikasi Lapangan"
        loginUrl="/petugas/dinsos/kecamatan/login"
      />
    </main>
  );
}

