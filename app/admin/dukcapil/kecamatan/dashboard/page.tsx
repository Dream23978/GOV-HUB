import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminDukcapilDashboardContent } from "@/app/components/admin/AdminDukcapilDashboardContent";
import {
  getAdminKtpSubmissions,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Dashboard Pelayanan KTP - Dukcapil Kecamatan | GOV-HUB",
  description: "Dashboard pelayanan KTP-el dan biometrik tingkat kecamatan.",
};

export default async function DukcapilKecamatanDashboardPage() {
  const session = await requireAdminPageSession("dukcapil", "kecamatan");
  const result = await getAdminKtpSubmissions();

  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dukcapil/kecamatan/dashboard"
    >
      <AdminDukcapilDashboardContent
        roleTitle="Admin Kecamatan (Dukcapil)"
        wilayah={session.wilayahLabel}
        initialSubmissions={result.data}
        initialCounts={result.counts}
        initialBiometricCount={result.biometricCount}
        canManageBlangko={false}
        canApprove={false}
      />
    </AdminDashboardLayout>
  );
}
