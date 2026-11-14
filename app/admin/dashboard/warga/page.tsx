import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { DataWargaDesilContent } from "@/app/components/admin/dinsos/DataWargaDesilContent";
import { getAdminDataWarga } from "@/lib/services/admin.service";

export const metadata = {
  title: "Data Warga - Admin Pusat | GOV-HUB",
  description: "Detail data warga beserta status desil ajuan tingkat nasional.",
};

export default async function AdminDashboardDataWargaPage() {
  const result = await getAdminDataWarga();

  return (
    <AdminDashboardLayout
      instansi="pusat"
      instansiName="Pemerintah Republik Indonesia"
      roleTitle="Administrator Terpadu Pusat"
      adminName="Administrator Pusat GOV-HUB"
      basePath="/admin/dashboard"
    >
      <DataWargaDesilContent initialWargaData={result?.data || []} />
    </AdminDashboardLayout>
  );
}
