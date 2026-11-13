import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { DataWargaKtpContent } from "@/app/components/petugas/dukcapil/DataWargaKtpContent";

export const metadata = {
  title: "Data Warga - Disdukcapil Kota | GOV-HUB",
  description: "Pencarian data kependudukan SIAK Disdukcapil Kota.",
};

export default function DukcapilKotaWargaPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Disdukcapil Kota"
      adminName="Operator KTP 07"
      basePath="/petugas/dukcapil/kota/dashboard"
    >
      <DataWargaKtpContent />
    </AdminDashboardLayout>
  );
}

