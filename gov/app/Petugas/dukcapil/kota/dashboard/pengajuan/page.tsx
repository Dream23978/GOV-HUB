import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { PengajuanKtpContent } from "@/app/components/petugas/dukcapil/PengajuanKtpContent";

export const metadata = {
  title: "Pengajuan KTP - Disdukcapil Kota | GOV-HUB",
  description: "Kelola dan pantau pengajuan KTP warga tingkat kota.",
};

export default function DukcapilKotaPengajuanPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Disdukcapil Kota"
      adminName="Operator KTP 07"
      basePath="/petugas/dukcapil/kota/dashboard"
    >
      <PengajuanKtpContent wilayah="Kota Pontianak" />
    </AdminDashboardLayout>
  );
}
