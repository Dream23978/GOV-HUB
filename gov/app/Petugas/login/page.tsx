import React from "react";
import { AdminLoginView } from "@/app/components/petugas/AdminLoginView";

export const metadata = {
  title: "Login Administrator | GOV-HUB",
  description: "Masuk ke portal administrator GOV-HUB untuk verifikasi bansos, desil, dan data kependudukan.",
};

export default function AdminLoginPage() {
  return (
    <AdminLoginView
      backUrl="/petugas"
      backLabel="Halaman Depan Admin"
      heroTitle="PORTAL RESMI"
      heroHighlight="ADMINISTRATOR"
      heroDescription="Sistem verifikasi data kependudukan, validasi geotagging live camera rumah, dan penetapan desil DTKS."
      formProps={{
        initialInstansi: "dinsos",
        initialTingkat: "kecamatan",
      }}
    />
  );
}
