import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { DataWargaKtpContent } from "@/app/components/admin/dukcapil/DataWargaKtpContent";
import { mapWargaToKtpList } from "@/lib/admin-mappers";
import {
  getAdminDataWarga,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Data Warga - Dukcapil Kota | GOV-HUB",
  description: "Akses data kependudukan dan status KTP warga tingkat kota.",
};

export default async function DukcapilKotaDataWargaPage() {
  const session = await requireAdminPageSession("dukcapil", "kota");
  const result = await getAdminDataWarga();

  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kota"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dukcapil/kota/dashboard"
    >
      <DataWargaKtpContent initialWargaList={mapWargaToKtpList(result?.data || [])} />
    </AdminDashboardLayout>
  );
}
