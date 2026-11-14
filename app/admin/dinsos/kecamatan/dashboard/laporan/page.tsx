import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { LaporanDesilKecamatanContent } from "@/app/components/admin/dinsos/LaporanDesilKecamatanContent";
import { requireAdminPageSession } from "@/lib/services/admin.service";

export const metadata = {
  title: "Laporan Desil - Dinsos Kecamatan | GOV-HUB",
  description: "Upload data laporan hasil cek lapangan desil tingkat kecamatan.",
};

export default async function DinsosKecamatanLaporanPage() {
  const session = await requireAdminPageSession("dinsos", "kecamatan");

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dinsos/kecamatan/dashboard"
    >
      <LaporanDesilKecamatanContent />
    </AdminDashboardLayout>
  );
}
