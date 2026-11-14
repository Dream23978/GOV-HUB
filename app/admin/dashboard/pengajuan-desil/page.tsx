import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengajuanDesilKecamatanContent } from "@/app/components/admin/dinsos/PengajuanDesilKecamatanContent";
import { mapDesilRowsToSubmissionCards } from "@/lib/admin-mappers";
import {
  getAdminDesilSubmissions,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengajuan Peninjauan Desil - Admin Pusat | GOV-HUB",
  description: "Kelola dan verifikasi pengajuan peninjauan desil bantuan sosial tingkat nasional.",
};

export default async function AdminDashboardPengajuanDesilPage() {
  const session = await requireAdminPageSession("pusat");
  const result = await getAdminDesilSubmissions();

  return (
    <AdminDashboardLayout
      instansi="pusat"
      instansiName="Pemerintah Republik Indonesia"
      roleTitle="Administrator Terpadu Pusat"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dashboard"
    >
      <PengajuanDesilKecamatanContent
        initialSubmissions={mapDesilRowsToSubmissionCards(result?.data || [])}
        canApprove={true}
      />
    </AdminDashboardLayout>
  );
}
