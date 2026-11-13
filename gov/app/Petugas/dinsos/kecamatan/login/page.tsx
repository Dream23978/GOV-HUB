import React from "react";
import { AdminLoginView } from "@/app/components/petugas/AdminLoginView";

export const metadata = {
  title: "Login Petugas Desil Kecamatan | GOV-HUB",
  description: "Masuk ke portal verifikasi peninjauan desil tingkat kecamatan.",
};

export default function DinsosKecamatanLoginPage() {
  return (
    <AdminLoginView
      backUrl="/petugas/dinsos/kecamatan"
      backLabel="Beranda Desil Kecamatan"
      heroTitle="PORTAL RESMI DINSOS"
      heroHighlight="PETUGAS DESIL KECAMATAN"
      heroDescription="Verifikasi berkas, validasi foto geotagging rumah warga pemohon, dan penyesuaian skor desil 1-10 DTKS tingkat kecamatan."
      formProps={{
        initialInstansi: "dinsos",
        initialTingkat: "kecamatan",
        lockInstansi: true,
        lockTingkat: true,
        targetRedirectUrl: "/petugas/dinsos/kecamatan/dashboard",
        title: "Login Petugas Desil",
        subtitle: "Masukkan NIP Petugas untuk meninjau antrean permohonan peninjauan desil warga.",
        badgeText: "Petugas Desil Kecamatan",
      }}
    />
  );
}

