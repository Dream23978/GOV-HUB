import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { AdminDukcapilDashboardContent } from "@/app/components/petugas/AdminDukcapilDashboardContent";

export const metadata = {
  title: "Dashboard Pelayanan KTP - Dukcapil Kecamatan | GOV-HUB",
  description: "Dashboard pelayanan KTP-el dan biometrik tingkat kecamatan.",
};

export default function DukcapilKecamatanDashboardPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName="Operator KTP 07"
      basePath="/petugas/dukcapil/kecamatan/dashboard"
    >
      <AdminDukcapilDashboardContent
        roleTitle="Admin Kecamatan (Dukcapil)"
        wilayah="Kecamatan Pontianak Kota"
      />
    </AdminDashboardLayout>
  );
}

