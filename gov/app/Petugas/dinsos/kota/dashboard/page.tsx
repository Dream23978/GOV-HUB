import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { AdminDesilDashboardContent } from "@/app/components/petugas/AdminDesilDashboardContent";

export const metadata = {
  title: "Dashboard Desil - Dinsos Kota | GOV-HUB",
  description: "Dashboard penetapan desil DTKS Dinas Sosial tingkat kota/kabupaten.",
};

export default function DinsosKotaDashboardPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kota"
      adminName="Petugas Desil 14"
      basePath="/petugas/dinsos/kota/dashboard"
    >
      <AdminDesilDashboardContent
        roleTitle="Admin Kota (Dinsos)"
        wilayah="Kota Pontianak"
      />
    </AdminDashboardLayout>
  );
}

