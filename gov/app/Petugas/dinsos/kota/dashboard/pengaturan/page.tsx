import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { PengaturanDukcapilContent } from "@/app/components/petugas/dukcapil/PengaturanDukcapilContent";

export const metadata = {
  title: "Pengaturan Sistem - Dinsos Kota | GOV-HUB",
  description: "Pengaturan sistem Dinas Sosial tingkat kota.",
};

export default function DinsosKotaPengaturanPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kota"
      adminName="Petugas Desil 14"
      basePath="/petugas/dinsos/kota/dashboard"
    >
      <PengaturanDukcapilContent />
    </AdminDashboardLayout>
  );
}

