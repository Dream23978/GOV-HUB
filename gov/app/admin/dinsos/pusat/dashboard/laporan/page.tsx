import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { LaporanDesilKecamatanContent } from "@/app/components/admin/dinsos/LaporanDesilKecamatanContent";

export const metadata = {
  title: "Laporan Desil - Dinsos Pusat | GOV-HUB",
  description: "Laporan rekapitulasi data hasil lapangan dan penetapan desil tingkat nasional.",
};

export default function DinsosPusatLaporanPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Kementerian Sosial"
      roleTitle="Admin Pusat"
      adminName="Administrator Kemensos Pusat"
      basePath="/admin/dinsos/pusat/dashboard"
    >
      <LaporanDesilKecamatanContent tingkat="Tingkat Pusat / Nasional" />
    </AdminDashboardLayout>
  );
}

