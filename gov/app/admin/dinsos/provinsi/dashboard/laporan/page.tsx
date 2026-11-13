import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { LaporanDesilKecamatanContent } from "@/app/components/admin/dinsos/LaporanDesilKecamatanContent";

export const metadata = {
  title: "Laporan Desil - Dinsos Provinsi / Pusat | GOV-HUB",
  description: "Laporan rekapitulasi data hasil lapangan dan penetapan desil tingkat provinsi / nasional.",
};

export default function DinsosProvinsiLaporanPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Provinsi / Pusat"
      adminName="Petugas Dinsos Jatim"
      basePath="/admin/dinsos/provinsi/dashboard"
    >
      <LaporanDesilKecamatanContent tingkat="Tingkat Provinsi" />
    </AdminDashboardLayout>
  );
}

