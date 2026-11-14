import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { DataWargaKtpContent } from "@/app/components/admin/dukcapil/DataWargaKtpContent";
import { mapWargaToKtpList } from "@/lib/admin-mappers";
import {
  getAdminDataWarga,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Data Warga - Dukcapil Kecamatan | GOV-HUB",
  description: "Akses data kependudukan dan status KTP warga tingkat kecamatan.",
};

export default async function DukcapilKecamatanDataWargaPage() {
  const session = await requireAdminPageSession("dukcapil", "kecamatan");
  const result = await getAdminDataWarga();

  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dukcapil/kecamatan/dashboard"
    >
      <DataWargaKtpContent initialWargaList={mapWargaToKtpList(result?.data || [])} />
    </AdminDashboardLayout>
  );
}
