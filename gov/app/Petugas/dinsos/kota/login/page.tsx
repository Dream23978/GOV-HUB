import React from "react";
import { AdminLoginView } from "@/app/components/petugas/AdminLoginView";

export const metadata = {
  title: "Login Admin Dinsos Kota | GOV-HUB",
  description: "Masuk ke portal otorisasi data kesejahteraan sosial tingkat kota.",
};

export default function DinsosKotaLoginPage() {
  return (
    <AdminLoginView
      backUrl="/petugas/dinsos/kota"
      backLabel="Beranda Dinsos Kota"
      heroTitle="PORTAL RESMI DINSOS"
      heroHighlight="ADMIN KOTA"
      heroDescription="Otorisasi penetapan desil 1-10 DTKS, pemantauan performa verifikasi kecamatan, dan koordinasi penyaluran bansos se-kota."
      formProps={{
        initialInstansi: "dinsos",
        initialTingkat: "kota",
        lockInstansi: true,
        lockTingkat: true,
        targetRedirectUrl: "/petugas/dinsos/kota/dashboard",
        title: "Login Administrator Kota",
        subtitle: "Masukkan NIP dan kata sandi kedinasan Dinsos Kota untuk mengakses dashboard otorisasi.",
        badgeText: "Aparatur Dinsos Kota",
      }}
    />
  );
}

