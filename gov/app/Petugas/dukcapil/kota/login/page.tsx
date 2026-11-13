import React from "react";
import { AdminLoginView } from "@/app/components/petugas/AdminLoginView";

export const metadata = {
  title: "Login Admin Dukcapil Kota | GOV-HUB",
  description: "Masuk ke portal administrasi Dinas Dukcapil tingkat kota untuk otorisasi dan monitoring kependudukan.",
};

export default function DukcapilKotaLoginPage() {
  return (
    <AdminLoginView
      backUrl="/petugas/dukcapil/kota"
      backLabel="Beranda Dukcapil Kota"
      heroTitle="PORTAL RESMI DUKCAPIL"
      heroHighlight="ADMIN KOTA"
      heroDescription="Otorisasi penerbitan dokumen resmi kependudukan, pengawasan ketersediaan blangko KTP, dan integrasi data SIAK kota."
      formProps={{
        initialInstansi: "dukcapil",
        initialTingkat: "kota",
        lockInstansi: true,
        lockTingkat: true,
        targetRedirectUrl: "/petugas/dukcapil/kota/dashboard",
        title: "Login Administrator Kota",
        subtitle: "Masukkan NIP dan kredensial kedinasan Disdukcapil Kota untuk mengelola antrean penerbitan KTP-el.",
        badgeText: "Aparatur Disdukcapil Kota",
      }}
    />
  );
}

