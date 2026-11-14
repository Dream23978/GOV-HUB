import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { DataWargaDesilContent } from "@/app/components/admin/dinsos/DataWargaDesilContent";
import { getAdminDataWarga } from "@/lib/services/admin.service";

export const metadata = {
  title: "Data Warga - Dinsos Kecamatan | GOV-HUB",
  description: "Detail data warga beserta status desil ajuan tingkat kecamatan.",
};

export default async function DinsosKecamatanDirectWargaPage() {
  const result = await getAdminDataWarga({ kecamatan: "Genteng" });

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan"
      adminName="Petugas Desil Genteng"
      basePath="/admin/dinsos/kecamatan/dashboard"
    >
      <DataWargaDesilContent initialWargaData={result?.data || []} />
    </AdminDashboardLayout>
  );
}

