import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { LaporanDesilKecamatanContent } from "@/app/components/admin/dinsos/LaporanDesilKecamatanContent";

export const metadata = {
  title: "Laporan Desil - Dinsos Kecamatan | GOV-HUB",
  description: "Upload data laporan hasil cek lapangan desil tingkat kecamatan.",
};

export default function DinsosKecamatanDirectLaporanPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan"
      adminName="Petugas Desil Genteng"
      basePath="/admin/dinsos/kecamatan/dashboard"
    >
      <LaporanDesilKecamatanContent />
    </AdminDashboardLayout>
  );
}

