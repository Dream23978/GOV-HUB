import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { AdminDesilDashboardContent } from "@/app/components/petugas/AdminDesilDashboardContent";

export const metadata = {
  title: "Dashboard Desil - Dinsos | GOV-HUB",
  description: "Dashboard terpadu peninjauan desil Dinas Sosial.",
};

export default function DinsosDashboardPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Verifikator Desil"
      adminName="Petugas Desil 14"
      basePath="/petugas/dinsos/dashboard"
    >
      <AdminDesilDashboardContent
        roleTitle="Petugas Dinas Sosial"
        wilayah="Kota Pontianak"
      />
    </AdminDashboardLayout>
  );
}

