import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { PengaturanDukcapilContent } from "@/app/components/petugas/dukcapil/PengaturanDukcapilContent";

export const metadata = {
  title: "Pengaturan Sistem - Dinsos Kecamatan | GOV-HUB",
  description: "Pengaturan operasional verifikasi desil tingkat kecamatan.",
};

export default function DinsosKecamatanPengaturanPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Verifikator Desil"
      adminName="Petugas Desil 14"
      basePath="/petugas/dinsos/kecamatan/dashboard"
    >
      <PengaturanDukcapilContent />
    </AdminDashboardLayout>
  );
}

