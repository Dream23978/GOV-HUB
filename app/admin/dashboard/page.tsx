import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminDesilDashboardContent } from "@/app/components/admin/AdminDesilDashboardContent";
import { getAdminDesilSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Dashboard Desil - Admin Petugas | GOV-HUB",
  description: "Dashboard pengelolaan dan verifikasi pengajuan peninjauan desil bantuan sosial.",
};

export default async function AdminDashboardPage() {
  const result = await getAdminDesilSubmissions();

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan & Kota"
      adminName="Petugas Dinsos Surabaya"
      basePath="/admin/dashboard"
    >
      <AdminDesilDashboardContent
        roleTitle="Admin Kecamatan & Kota"
        wilayah="Kota Surabaya"
        initialSubmissions={result.data}
        initialCounts={result.counts}
        canApprove={false}
      />
    </AdminDashboardLayout>
  );
}
