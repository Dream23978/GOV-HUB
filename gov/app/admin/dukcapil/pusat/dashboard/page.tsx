import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminPusatDashboardContent } from "@/app/components/admin/AdminPusatDashboardContent";
import { getAdminDesilSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Dashboard Terpadu Administrator Pusat | GOV-HUB",
  description: "Dashboard penetapan desil DTKS Kementerian Sosial & Ditjen Dukcapil tingkat pusat / nasional.",
};

export default async function DukcapilPusatDashboardPage() {
  const result = await getAdminDesilSubmissions();

  return (
    <AdminDashboardLayout
      instansi="pusat"
      instansiName="Pemerintah Republik Indonesia"
      roleTitle="Administrator Terpadu Pusat"
      adminName="Administrator Pusat GOV-HUB"
      basePath="/admin/dashboard"
    >
      <AdminPusatDashboardContent
        initialDesilSubmissions={result.data}
        initialDesilCounts={result.counts}
      />
    </AdminDashboardLayout>
  );
}
