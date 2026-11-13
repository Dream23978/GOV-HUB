import React from "react";
import { AdminLoginView } from "@/app/components/petugas/AdminLoginView";

export const metadata = {
  title: "Login Petugas Dinas Sosial | GOV-HUB",
  description: "Masuk ke portal administrasi Dinas Sosial untuk verifikasi bansos dan penetapan desil DTKS.",
};

export default function DinsosRootLoginPage() {
  return (
    <AdminLoginView
      backUrl="/petugas/dinsos"
      backLabel="Beranda Portal Dinsos"
      heroTitle="PORTAL RESMI"
      heroHighlight="DINAS SOSIAL"
      heroDescription="Sistem validasi pengajuan desil DTKS warga, audit geotagging lokasi rumah, dan koordinasi penyaluran bansos tepat sasaran."
      formProps={{
        initialInstansi: "dinsos",
        initialTingkat: "kecamatan",
        lockInstansi: true,
        title: "Login Petugas Dinsos",
        subtitle: "Pilih tingkat wilayah kerja dan masukkan NIP untuk memulai peninjauan pengajuan.",
        badgeText: "Aparatur Dinas Sosial",
      }}
    />
  );
}

