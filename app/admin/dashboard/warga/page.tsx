import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { DataWargaDesilContent } from "@/app/components/admin/dinsos/DataWargaDesilContent";
import { getAdminDataWarga } from "@/lib/services/admin.service";

export const metadata = {
  title: "Data Warga - Admin | GOV-HUB",
  description: "Detail data warga beserta status desil ajuan.",
};

export default async function AdminDashboardDataWargaPage() {
  const result = await getAdminDataWarga();

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan & Kota"
      adminName="Petugas Dinsos Surabaya"
      basePath="/admin/dashboard"
    >
      <DataWargaDesilContent initialWargaData={result?.data?.length ? result.data : undefined} />
    </AdminDashboardLayout>
  );
}

