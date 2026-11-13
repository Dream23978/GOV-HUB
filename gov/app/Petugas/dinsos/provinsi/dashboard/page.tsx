import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { AdminDesilDashboardContent } from "@/app/components/petugas/AdminDesilDashboardContent";

export const metadata = {
  title: "Dashboard Desil - Dinsos Provinsi / Pusat | GOV-HUB",
  description: "Dashboard penetapan desil DTKS tingkat provinsi / nasional.",
};

export default function DinsosProvinsiDashboardPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Provinsi / Pusat"
      adminName="Petugas Dinsos Pusat 01"
      basePath="/petugas/dinsos/provinsi/dashboard"
    >
      <AdminDesilDashboardContent
        roleTitle="Admin Provinsi / Pusat"
        wilayah="Provinsi Kalimantan Barat"
      />
    </AdminDashboardLayout>
  );
}

