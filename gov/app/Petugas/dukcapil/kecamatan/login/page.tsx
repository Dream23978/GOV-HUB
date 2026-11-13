import React from "react";
import { AdminLoginView } from "@/app/components/petugas/AdminLoginView";

export const metadata = {
  title: "Login Admin Dukcapil Kecamatan | GOV-HUB",
  description: "Masuk ke portal administrasi Dukcapil tingkat kecamatan untuk verifikasi KTP-el dan dokumen kependudukan.",
};

export default function DukcapilKecamatanLoginPage() {
  return (
    <AdminLoginView
      backUrl="/petugas/dukcapil/kecamatan"
      backLabel="Beranda Dukcapil Kecamatan"
      heroTitle="PORTAL RESMI DUKCAPIL"
      heroHighlight="ADMIN KECAMATAN"
      heroDescription="Perekaman biometrik, validasi iris & sidik jari, serta pencetakan KTP-el dan Kartu Keluarga tingkat kecamatan."
      formProps={{
        initialInstansi: "dukcapil",
        initialTingkat: "kecamatan",
        lockInstansi: true,
        lockTingkat: true,
        targetRedirectUrl: "/petugas/dukcapil/kecamatan/dashboard",
        title: "Login Petugas Kecamatan",
        subtitle: "Masukkan NIP dan kata sandi kedinasan untuk mengakses antrean verifikasi KTP-el kecamatan.",
        badgeText: "Aparatur Dukcapil Kecamatan",
      }}
    />
  );
}

