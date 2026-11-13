import React from "react";
import { AdminLoginView } from "@/app/components/petugas/AdminLoginView";

export const metadata = {
  title: "Login Petugas Dukcapil | GOV-HUB",
  description: "Masuk ke portal administrasi Dinas Dukcapil untuk verifikasi dan penerbitan dokumen kependudukan.",
};

export default function DukcapilRootLoginPage() {
  return (
    <AdminLoginView
      backUrl="/petugas/dukcapil"
      backLabel="Beranda Portal Dukcapil"
      heroTitle="PORTAL RESMI"
      heroHighlight="DINAS DUKCAPIL"
      heroDescription="Pusat validasi biometrik, cetak KTP elektronik, pembaharuan Kartu Keluarga, dan manajemen kependudukan terpadu."
      formProps={{
        initialInstansi: "dukcapil",
        initialTingkat: "kota",
        lockInstansi: true,
        title: "Login Petugas Dukcapil",
        subtitle: "Pilih tingkat wilayah dan masukkan NIP untuk mengakses dashboard kerja Anda.",
        badgeText: "Akses Aparatur Dukcapil",
      }}
    />
  );
}

