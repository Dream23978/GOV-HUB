import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminDukcapilDashboardContent } from "@/app/components/admin/AdminDukcapilDashboardContent";
import { getAdminKtpSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Dashboard Pelayanan KTP - Dukcapil Kecamatan | GOV-HUB",
  description: "Dashboard pelayanan KTP-el dan biometrik tingkat kecamatan.",
};

export default async function DukcapilKecamatanDashboardPage() {
  const result = await getAdminKtpSubmissions();

  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName="Operator KTP Genteng"
      basePath="/admin/dukcapil/kecamatan/dashboard"
    >
      <AdminDukcapilDashboardContent
        roleTitle="Admin Kecamatan (Dukcapil)"
        wilayah="Kecamatan Genteng, Surabaya"
        initialSubmissions={result.data}
        initialCounts={result.counts}
      />
    </AdminDashboardLayout>
  );
}

