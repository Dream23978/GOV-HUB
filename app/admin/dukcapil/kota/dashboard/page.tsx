import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminDukcapilDashboardContent } from "@/app/components/admin/AdminDukcapilDashboardContent";
import { getAdminKtpSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Dashboard Pelayanan KTP - Disdukcapil Kota | GOV-HUB",
  description: "Dashboard pengelolaan kependudukan Disdukcapil tingkat kota.",
};

export default async function DukcapilKotaDashboardPage() {
  const result = await getAdminKtpSubmissions();

  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Disdukcapil Kota"
      adminName="Operator Dukcapil Surabaya"
      basePath="/admin/dukcapil/kota/dashboard"
    >
      <AdminDukcapilDashboardContent
        roleTitle="Disdukcapil Kota"
        wilayah="Kota Surabaya"
        initialSubmissions={result.data}
        initialCounts={result.counts}
        initialBiometricCount={result.biometricCount}
      />
    </AdminDashboardLayout>
  );
}

