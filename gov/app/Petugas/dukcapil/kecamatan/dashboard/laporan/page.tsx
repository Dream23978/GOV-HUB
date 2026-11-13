import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { LaporanKtpContent } from "@/app/components/petugas/dukcapil/LaporanKtpContent";

export const metadata = {
  title: "Laporan Pelayanan KTP - Dukcapil Kecamatan | GOV-HUB",
  description: "Laporan pelayanan KTP-el tingkat kecamatan.",
};

export default function DukcapilKecamatanLaporanPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName="Operator KTP 07"
      basePath="/petugas/dukcapil/kecamatan/dashboard"
    >
      <LaporanKtpContent />
    </AdminDashboardLayout>
  );
}

