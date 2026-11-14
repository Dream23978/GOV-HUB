import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminDesilDashboardContent } from "@/app/components/admin/AdminDesilDashboardContent";
import { getAdminDesilSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Dashboard Desil - Dinsos Kota | GOV-HUB",
  description: "Dashboard penetapan desil DTKS Dinas Sosial tingkat kota/kabupaten.",
};

export default async function DinsosKotaDashboardPage() {
  const result = await getAdminDesilSubmissions();

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kota"
      adminName="Petugas Dinsos Surabaya"
      basePath="/admin/dinsos/kota/dashboard"
    >
      <AdminDesilDashboardContent
        roleTitle="Admin Kota (Dinsos)"
        wilayah="Kota Surabaya"
        initialSubmissions={result.data}
        initialCounts={result.counts}
        canApprove={false}
      />
    </AdminDashboardLayout>
  );
}

