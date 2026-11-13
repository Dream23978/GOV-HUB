import React from "react";
import { AdminHeroSection } from "@/app/components/petugas/AdminHeroSection";

export const metadata = {
  title: "Portal Admin Dukcapil Kecamatan | GOV-HUB",
  description: "Pusat Kendali Pengelolaan Layanan KTP-el dan Kependudukan Tingkat Kecamatan.",
};

export default function DukcapilKecamatanHomePage() {
  return (
    <main>
      <AdminHeroSection
        badgeTitle="GOV-HUB"
        badgeTag="Dukcapil Kecamatan"
        badgeSubtitle="Sistem Pelayanan Kependudukan & Pencatatan Sipil Kecamatan"
        headlineFirst="Lebih Mudah,"
        headlineSecond="Lebih Cepat, "
        headlineHighlight="Lebih Tepat"
        description="Portal Administrator Dukcapil Kecamatan untuk perekaman biometrik, pencetakan KTP-el, dan verifikasi KK warga."
        nipCardTitle="Login NIP Petugas Kecamatan"
        nipCardSubtitle="Pelayanan Kependudukan Kecamatan"
        loginUrl="/petugas/dukcapil/kecamatan/login"
      />
    </main>
  );
}

