import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { PengaturanDukcapilContent } from "@/app/components/petugas/dukcapil/PengaturanDukcapilContent";

export const metadata = {
  title: "Profil Saya - Dukcapil Kecamatan | GOV-HUB",
  description: "Kelola informasi akun dan data profil petugas Dukcapil Kecamatan.",
};

export default function DukcapilKecamatanPengaturanPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName="Operator KTP 07"
      basePath="/petugas/dukcapil/kecamatan/dashboard"
    >
      <PengaturanDukcapilContent />
    </AdminDashboardLayout>
  );
}

