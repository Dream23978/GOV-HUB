import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { DataWargaKtpContent } from "@/app/components/petugas/dukcapil/DataWargaKtpContent";

export const metadata = {
  title: "Data Warga DTKS - Dinsos Kecamatan | GOV-HUB",
  description: "Data warga DTKS dan verifikasi lapangan tingkat kecamatan.",
};

export default function DinsosKecamatanWargaPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Verifikator Desil"
      adminName="Petugas Desil 14"
      basePath="/petugas/dinsos/kecamatan/dashboard"
    >
      <DataWargaKtpContent />
    </AdminDashboardLayout>
  );
}

