import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengajuanDesilKecamatanContent } from "@/app/components/admin/dinsos/PengajuanDesilKecamatanContent";
import { mapDesilRowsToSubmissionCards } from "@/lib/admin-mappers";
import {
  getAdminDesilSubmissions,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengajuan Peninjauan Desil - Dinsos Kecamatan | GOV-HUB",
  description: "Kelola dan pantau pengajuan desil warga tingkat kecamatan.",
};

export default async function DinsosKecamatanPengajuanPage() {
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
      <PengajuanDesilKecamatanContent
        initialSubmissions={mapDesilRowsToSubmissionCards(result?.data || [])}
      />
    </AdminDashboardLayout>
  );
}
