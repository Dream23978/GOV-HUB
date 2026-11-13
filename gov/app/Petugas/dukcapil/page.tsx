import React from "react";
import { AdminHeroSection } from "@/app/components/petugas/AdminHeroSection";

export const metadata = {
  title: "Portal Administrator Dukcapil | GOV-HUB",
  description: "Pusat Kendali Pengelolaan Layanan Terpadu Dinas Kependudukan dan Pencatatan Sipil.",
};

export default function DukcapilRootHomePage() {
  return (
    <main>
      <AdminHeroSection
        badgeTitle="GOV-HUB"
        badgeTag="Dinas Dukcapil"
        badgeSubtitle="Sistem Pelayanan Kependudukan dan Pencatatan Sipil RI"
        headlineFirst="Lebih Mudah,"
        headlineSecond="Lebih Cepat, "
        headlineHighlight="Lebih Tepat"
        description="Portal Terpadu Pengelolaan Layanan KTP-el, Kartu Keluarga, dan Administrasi Kependudukan Terintegrasi."
        nipCardTitle="Login dengan NIP Dukcapil"
        nipCardSubtitle="Petugas Kecamatan & Pengawas Kota"
        loginUrl="/petugas/dukcapil/login"
      />
    </main>
  );
}

