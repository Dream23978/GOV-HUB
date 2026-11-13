import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminDesilDashboardContent } from "@/app/components/admin/AdminDesilDashboardContent";
import { getAdminDesilSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Dashboard Desil - Dinsos | GOV-HUB",
  description: "Dashboard terpadu peninjauan desil Dinas Sosial.",
};

export default async function DinsosDashboardPage() {
  const result = await getAdminDesilSubmissions();

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Verifikator Desil"
      adminName="Petugas Dinsos Surabaya"
      basePath="/admin/dinsos/dashboard"
    >
      <AdminDesilDashboardContent
        roleTitle="Petugas Dinas Sosial"
        wilayah="Kota Surabaya"
        initialSubmissions={result.data}
        initialCounts={result.counts}
        canApprove={false}
      />
    </AdminDashboardLayout>
  );
}

