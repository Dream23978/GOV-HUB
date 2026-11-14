import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminDesilDashboardContent } from "@/app/components/admin/AdminDesilDashboardContent";
import {
  getAdminDesilSubmissions,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Dashboard Desil - Dinsos Kota | GOV-HUB",
  description: "Dashboard penetapan desil DTKS Dinas Sosial tingkat kota/kabupaten.",
};

export default async function DinsosKotaDashboardPage() {
  const session = await requireAdminPageSession("dinsos", "kota");
  const result = await getAdminDesilSubmissions();

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kota"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dinsos/kota/dashboard"
    >
      <AdminDesilDashboardContent
        roleTitle="Admin Kota (Dinsos)"
        wilayah={session.wilayahLabel}
        initialSubmissions={result.data}
        initialCounts={result.counts}
        canApprove={false}
      />
    </AdminDashboardLayout>
  );
}
