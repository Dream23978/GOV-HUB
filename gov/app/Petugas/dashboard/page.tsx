import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { AdminDesilDashboardContent } from "@/app/components/petugas/AdminDesilDashboardContent";

export const metadata = {
  title: "Dashboard Desil - Admin Petugas | GOV-HUB",
  description: "Dashboard pengelolaan dan verifikasi pengajuan peninjauan desil bantuan sosial.",
};

export default function AdminDashboardPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan & Kota"
      adminName="Petugas Desil 14"
      basePath="/petugas/dashboard"
    >
      <AdminDesilDashboardContent
        roleTitle="Admin Kecamatan & Kota"
        wilayah="Kota Pontianak"
      />
    </AdminDashboardLayout>
  );
}
