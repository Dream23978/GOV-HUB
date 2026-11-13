import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { DataWargaDesilContent } from "@/app/components/admin/dinsos/DataWargaDesilContent";
import { getAdminDataWarga } from "@/lib/services/admin.service";

export const metadata = {
  title: "Data Warga - Dinsos Provinsi | GOV-HUB",
  description: "Detail data warga beserta status desil ajuan tingkat provinsi.",
};

export default async function DinsosProvinsiDataWargaPage() {
  const result = await getAdminDataWarga();

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Provinsi / Pusat"
      adminName="Petugas Dinsos Jatim"
      basePath="/admin/dinsos/provinsi/dashboard"
    >
      <DataWargaDesilContent initialWargaData={result?.data?.length ? result.data : undefined} />
    </AdminDashboardLayout>
  );
}

