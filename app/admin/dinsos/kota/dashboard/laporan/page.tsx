import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { LaporanDesilKecamatanContent } from "@/app/components/admin/dinsos/LaporanDesilKecamatanContent";
import { requireAdminPageSession } from "@/lib/services/admin.service";

export const metadata = {
  title: "Laporan Desil - Dinsos Kota | GOV-HUB",
  description: "Upload data laporan hasil cek lapangan desil tingkat kota.",
};

export default async function DinsosKotaLaporanPage() {
  const session = await requireAdminPageSession("dinsos", "kota");

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kota"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dinsos/kota/dashboard"
    >
      <LaporanDesilKecamatanContent tingkat="Tingkat Kota" />
    </AdminDashboardLayout>
  );
}
