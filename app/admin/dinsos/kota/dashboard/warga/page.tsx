import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { DataWargaDesilContent } from "@/app/components/admin/dinsos/DataWargaDesilContent";
import {
  getAdminDataWarga,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Data Warga - Dinsos Kota | GOV-HUB",
  description: "Detail data warga beserta status desil ajuan tingkat kota.",
};

export default async function DinsosKotaDataWargaPage() {
  const session = await requireAdminPageSession("dinsos", "kota");
  const result = await getAdminDataWarga();

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kota"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dinsos/kota/dashboard"
    >
      <DataWargaDesilContent initialWargaData={result?.data || []} />
    </AdminDashboardLayout>
  );
}
