import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { LaporanPengajuanDesilContent } from "@/app/components/petugas/dinsos/LaporanPengajuanDesilContent";

export const metadata = {
  title: "Laporan Pengajuan Desil | GOV-HUB",
  description: "Kelola dan pantau pengajuan desil warga.",
};

export default function SharedLaporanDesilPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Verifikator Desil"
      adminName="Petugas Desil 14"
      basePath="/petugas/dashboard"
    >
      <LaporanPengajuanDesilContent />
    </AdminDashboardLayout>
  );
}

