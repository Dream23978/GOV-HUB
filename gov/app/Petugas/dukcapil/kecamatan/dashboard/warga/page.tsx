import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { DataWargaKtpContent } from "@/app/components/petugas/dukcapil/DataWargaKtpContent";

export const metadata = {
  title: "Data Warga - Dukcapil Kecamatan | GOV-HUB",
  description: "Pencarian data kependudukan tingkat kecamatan.",
};

export default function DukcapilKecamatanWargaPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName="Operator KTP 07"
      basePath="/petugas/dukcapil/kecamatan/dashboard"
    >
      <DataWargaKtpContent />
    </AdminDashboardLayout>
  );
}

