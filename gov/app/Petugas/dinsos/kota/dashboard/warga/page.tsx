import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { DataWargaKtpContent } from "@/app/components/petugas/dukcapil/DataWargaKtpContent";

export const metadata = {
  title: "Data Warga DTKS - Dinsos Kota | GOV-HUB",
  description: "Data warga penerima bantuan sosial dan DTKS tingkat kota.",
};

export default function DinsosKotaWargaPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kota"
      adminName="Petugas Desil 14"
      basePath="/petugas/dinsos/kota/dashboard"
    >
      <DataWargaKtpContent />
    </AdminDashboardLayout>
  );
}

