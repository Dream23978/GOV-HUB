import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { LaporanDesilKecamatanContent } from "@/app/components/admin/dinsos/LaporanDesilKecamatanContent";

export const metadata = {
  title: "Laporan Desil - Dinsos Kota | GOV-HUB",
  description: "Upload data laporan hasil cek lapangan desil tingkat kota.",
};

export default function DinsosKotaDirectLaporanPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kota"
      adminName="Petugas Dinsos Surabaya"
      basePath="/admin/dinsos/kota/dashboard"
    >
      <LaporanDesilKecamatanContent tingkat="Tingkat Kota" />
    </AdminDashboardLayout>
  );
}

