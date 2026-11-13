import React from "react";
import { AdminHeroSection } from "@/app/components/petugas/AdminHeroSection";

export const metadata = {
  title: "Portal Admin Dukcapil Kota | GOV-HUB",
  description: "Pusat Kendali Pengelolaan Layanan Kependudukan dan Pencatatan Sipil Tingkat Kota.",
};

export default function DukcapilKotaHomePage() {
  return (
    <main>
      <AdminHeroSection
        badgeTitle="GOV-HUB"
        badgeTag="Dukcapil Kota"
        badgeSubtitle="Sistem Pusat Pengelolaan Kependudukan & Pencatatan Sipil Kota"
        headlineFirst="Lebih Mudah,"
        headlineSecond="Lebih Cepat, "
        headlineHighlight="Lebih Tepat"
        description="Portal Administrator Dukcapil Kota untuk otorisasi pencetakan blangko KTP-el, mutasi penduduk, dan pengawasan layanan terpadu."
        nipCardTitle="Login NIP Petugas Kota"
        nipCardSubtitle="Dinas Kependudukan & Pencatatan Sipil Kota"
        loginUrl="/petugas/dukcapil/kota/login"
      />
    </main>
  );
}

