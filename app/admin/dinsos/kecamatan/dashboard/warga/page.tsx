import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { DataWargaDesilContent } from "@/app/components/admin/dinsos/DataWargaDesilContent";
import {
  getAdminDataWarga,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Data Warga - Dinsos Kecamatan | GOV-HUB",
  description: "Detail data warga beserta status desil ajuan tingkat kecamatan.",
};

export default async function DinsosKecamatanDataWargaPage() {
  const session = await requireAdminPageSession("dinsos", "kecamatan");
  const result = await getAdminDataWarga();

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dinsos/kecamatan/dashboard"
    >
      <DataWargaDesilContent initialWargaData={result?.data || []} />
    </AdminDashboardLayout>
  );
}
