import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { PengajuanKtpContent } from "@/app/components/petugas/dukcapil/PengajuanKtpContent";

export const metadata = {
  title: "Pengajuan KTP - Dukcapil Kecamatan | GOV-HUB",
  description: "Kelola dan pantau pengajuan KTP warga tingkat kecamatan.",
};

export default function DukcapilKecamatanPengajuanPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName="Operator KTP 07"
      basePath="/petugas/dukcapil/kecamatan/dashboard"
    >
      <PengajuanKtpContent wilayah="Kecamatan Pontianak Kota" />
    </AdminDashboardLayout>
  );
}
