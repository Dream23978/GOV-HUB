import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { LaporanPengajuanDesilContent } from "@/app/components/petugas/dinsos/LaporanPengajuanDesilContent";

export const metadata = {
  title: "Pengajuan Peninjauan Desil - Dinsos | GOV-HUB",
  description: "Kelola dan pantau pengajuan peninjauan desil warga.",
};

export default function PengajuanDesilPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Verifikator Desil"
      adminName="Petugas Desil 14"
      basePath="/petugas/dinsos/kecamatan/dashboard"
    >
      <LaporanPengajuanDesilContent />
    </AdminDashboardLayout>
  );
}

