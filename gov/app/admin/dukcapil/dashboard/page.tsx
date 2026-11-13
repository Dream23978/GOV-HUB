import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminDukcapilDashboardContent } from "@/app/components/admin/AdminDukcapilDashboardContent";
import { getAdminKtpSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Dashboard Pelayanan KTP - Dukcapil | GOV-HUB",
  description: "Dashboard pelayanan kependudukan dan pencetakan KTP-el Dinas Dukcapil.",
};

export default async function DukcapilDashboardPage() {
  const result = await getAdminKtpSubmissions();

  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Dukcapil"
      adminName="Operator KTP Surabaya"
      basePath="/admin/dukcapil/dashboard"
    >
      <AdminDukcapilDashboardContent
        roleTitle="Petugas Pelayanan Dukcapil"
        wilayah="Kota Surabaya"
        initialSubmissions={result.data}
        initialCounts={result.counts}
      />
    </AdminDashboardLayout>
  );
}

