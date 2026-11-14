import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengaturanDukcapilContent } from "@/app/components/admin/dukcapil/PengaturanDukcapilContent";

export const metadata = {
  title: "Pengaturan Profil - Dukcapil Kecamatan | GOV-HUB",
  description: "Kelola informasi akun dan data profil petugas Dukcapil Kecamatan.",
};

export default function DukcapilKecamatanPengaturanPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName="Petugas Dukcapil Kecamatan Pontianak Kota"
      basePath="/admin/dukcapil/kecamatan/dashboard"
    >
      <PengaturanDukcapilContent />
    </AdminDashboardLayout>
  );
}
