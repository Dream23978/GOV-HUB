import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { LaporanKtpContent } from "@/app/components/admin/dukcapil/LaporanKtpContent";
import { buildKtpLaporanRekap } from "@/lib/admin-mappers";
import {
  getAdminKtpSubmissions,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Laporan Penduduk - Dukcapil Kecamatan | GOV-HUB",
  description: "Rekapitulasi penerbitan KTP-el dan pelayanan kependudukan tingkat kecamatan.",
};

export default async function DukcapilKecamatanLaporanPage() {
  const session = await requireAdminPageSession("dukcapil", "kecamatan");
  const ktpResult = await getAdminKtpSubmissions();
  const rows = ktpResult?.data || [];

  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dukcapil/kecamatan/dashboard"
    >
      <LaporanKtpContent initialRekap={buildKtpLaporanRekap(rows)} initialTotal={rows.length} />
    </AdminDashboardLayout>
  );
}
