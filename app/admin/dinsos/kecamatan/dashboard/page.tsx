import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminDesilDashboardContent } from "@/app/components/admin/AdminDesilDashboardContent";
import { getAdminDesilSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Dashboard Desil - Dinsos Kecamatan | GOV-HUB",
  description: "Dashboard verifikasi peninjauan desil tingkat kecamatan.",
};

export default async function DinsosKecamatanDashboardPage() {
  const result = await getAdminDesilSubmissions();

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan"
      adminName="Petugas Desil Genteng"
      basePath="/admin/dinsos/kecamatan/dashboard"
    >
      <AdminDesilDashboardContent
        roleTitle="Admin Kecamatan"
        wilayah="Kecamatan Genteng, Surabaya"
        initialSubmissions={result.data}
        initialCounts={result.counts}
        canApprove={false}
      />
    </AdminDashboardLayout>
  );
}

