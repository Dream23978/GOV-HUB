import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminPusatDashboardContent } from "@/app/components/admin/AdminPusatDashboardContent";
import {
  getAdminDesilSubmissions,
  getAdminKtpSubmissions,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Dashboard Terpadu Administrator Pusat | GOV-HUB",
  description: "Pusat Kendali Pengelolaan Terpadu Bansos DTKS & Kependudukan Dukcapil Republik Indonesia.",
};

export default async function AdminDashboardPage() {
  const session = await requireAdminPageSession("pusat");
  const [desilResult, ktpResult] = await Promise.all([
    getAdminDesilSubmissions(),
    getAdminKtpSubmissions(),
  ]);

  return (
    <AdminDashboardLayout
      instansi="pusat"
      instansiName="Pemerintah Republik Indonesia"
      roleTitle="Administrator Terpadu Pusat"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dashboard"
    >
      <AdminPusatDashboardContent
        initialDesilSubmissions={desilResult.data}
        initialDesilCounts={desilResult.counts}
        initialKtpSubmissions={ktpResult?.data || []}
      />
    </AdminDashboardLayout>
  );
}
