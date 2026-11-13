import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengajuanKtpContent } from "@/app/components/admin/dukcapil/PengajuanKtpContent";

export const metadata = {
  title: "Pengajuan KTP - Admin Pusat | GOV-HUB",
  description: "Kelola dan verifikasi pengajuan pencetakan KTP-el warga tingkat nasional.",
};

export default function AdminDashboardPengajuanKtpPage() {
  return (
    <AdminDashboardLayout
      instansi="pusat"
      instansiName="Pemerintah Republik Indonesia"
      roleTitle="Administrator Terpadu Pusat"
      adminName="Administrator Pusat GOV-HUB"
      basePath="/admin/dashboard"
    >
      <PengajuanKtpContent wilayah="Nasional / Republik Indonesia" />
    </AdminDashboardLayout>
  );
}

