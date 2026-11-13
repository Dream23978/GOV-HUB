import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { LaporanPengajuanDesilContent } from "@/app/components/petugas/dinsos/LaporanPengajuanDesilContent";

export const metadata = {
  title: "Laporan Pengajuan Desil - Admin Kecamatan | GOV-HUB",
  description: "Laporan peninjauan desil warga tingkat kecamatan.",
};

export default function KecamatanLaporanDesilPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan"
      adminName="Petugas Desil 14"
      basePath="/petugas/dinsos/kecamatan/dashboard"
    >
      <LaporanPengajuanDesilContent />
    </AdminDashboardLayout>
  );
}

