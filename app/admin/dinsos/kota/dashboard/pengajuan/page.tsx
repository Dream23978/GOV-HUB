import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengajuanDesilKecamatanContent } from "@/app/components/admin/dinsos/PengajuanDesilKecamatanContent";
import { mapDesilRowsToSubmissionCards } from "@/lib/admin-mappers";
import {
  getAdminDesilSubmissions,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengajuan Peninjauan Desil - Dinsos Kota | GOV-HUB",
  description: "Kelola dan pantau pengajuan desil warga tingkat kota.",
};

export default async function DinsosKotaPengajuanPage() {
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
      <PengajuanDesilKecamatanContent
        initialSubmissions={mapDesilRowsToSubmissionCards(result?.data || [])}
      />
    </AdminDashboardLayout>
  );
}
