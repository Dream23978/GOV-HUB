import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminDesilDashboardContent } from "@/app/components/admin/AdminDesilDashboardContent";
import {
  getAdminDesilSubmissions,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Dashboard Desil - Dinsos Kecamatan | GOV-HUB",
  description: "Dashboard verifikasi peninjauan desil tingkat kecamatan.",
};

export default async function DinsosKecamatanDashboardPage() {
  const session = await requireAdminPageSession("dinsos", "kecamatan");
  const result = await getAdminDesilSubmissions();

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dinsos/kecamatan/dashboard"
    >
      <AdminDesilDashboardContent
        roleTitle="Admin Kecamatan"
        wilayah={session.wilayahLabel}
        initialSubmissions={result.data}
        initialCounts={result.counts}
        canApprove={false}
      />
    </AdminDashboardLayout>
  );
}
