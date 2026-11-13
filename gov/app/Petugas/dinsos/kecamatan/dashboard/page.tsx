import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { AdminDesilDashboardContent } from "@/app/components/petugas/AdminDesilDashboardContent";

export const metadata = {
  title: "Dashboard Desil - Dinsos Kecamatan | GOV-HUB",
  description: "Dashboard verifikasi peninjauan desil tingkat kecamatan.",
};

export default function DinsosKecamatanDashboardPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan"
      adminName="Petugas Desil 14"
      basePath="/petugas/dinsos/kecamatan/dashboard"
    >
      <AdminDesilDashboardContent
        roleTitle="Admin Kecamatan"
        wilayah="Kecamatan Pontianak Kota"
      />
    </AdminDashboardLayout>
  );
}

