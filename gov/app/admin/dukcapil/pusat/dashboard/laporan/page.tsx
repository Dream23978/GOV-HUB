import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { LaporanKtpContent } from "@/app/components/admin/dukcapil/LaporanKtpContent";

export const metadata = {
  title: "Laporan Penduduk - Ditjen Dukcapil Pusat | GOV-HUB",
  description: "Rekapitulasi nasional penerbitan KTP-el dan pelayanan kependudukan.",
};

export default function DukcapilPusatLaporanPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Ditjen Dukcapil Kemendagri"
      roleTitle="Ditjen Dukcapil Pusat"
      adminName="Administrator Dukcapil Pusat"
      basePath="/admin/dukcapil/pusat/dashboard"
    >
      <LaporanKtpContent />
    </AdminDashboardLayout>
  );
}

