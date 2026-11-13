import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { LaporanPengajuanDesilContent } from "@/app/components/petugas/dinsos/LaporanPengajuanDesilContent";

export const metadata = {
  title: "Laporan Pengajuan Desil - Dinsos Kota | GOV-HUB",
  description: "Laporan peninjauan desil warga tingkat kota.",
};

export default function KotaLaporanDesilPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kota"
      adminName="Petugas Desil 14"
      basePath="/petugas/dinsos/kota/dashboard"
    >
      <LaporanPengajuanDesilContent />
    </AdminDashboardLayout>
  );
}

