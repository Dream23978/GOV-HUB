import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminDesilDashboardContent } from "@/app/components/admin/AdminDesilDashboardContent";
import { getAdminDesilSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Dashboard Desil - Dinsos Provinsi / Pusat | GOV-HUB",
  description: "Dashboard penetapan desil DTKS tingkat provinsi / nasional.",
};

export default async function DinsosProvinsiDashboardPage() {
  const result = await getAdminDesilSubmissions();

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Provinsi / Pusat"
      adminName="Petugas Dinsos Jatim"
      basePath="/admin/dinsos/provinsi/dashboard"
    >
      <AdminDesilDashboardContent
        roleTitle="Admin Provinsi / Pusat"
        wilayah="Provinsi Jawa Timur"
        initialSubmissions={result.data}
        initialCounts={result.counts}
        canApprove={true}
      />
    </AdminDashboardLayout>
  );
}

