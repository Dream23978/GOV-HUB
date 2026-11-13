import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { LaporanKtpContent } from "@/app/components/petugas/dukcapil/LaporanKtpContent";

export const metadata = {
  title: "Laporan Pelayanan KTP - Disdukcapil Kota | GOV-HUB",
  description: "Laporan dan statistik kependudukan Disdukcapil Kota.",
};

export default function DukcapilKotaLaporanPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Disdukcapil Kota"
      adminName="Operator KTP 07"
      basePath="/petugas/dukcapil/kota/dashboard"
    >
      <LaporanKtpContent />
    </AdminDashboardLayout>
  );
}

