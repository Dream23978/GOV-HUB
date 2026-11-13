import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { AdminDukcapilDashboardContent } from "@/app/components/petugas/AdminDukcapilDashboardContent";

export const metadata = {
  title: "Dashboard Pelayanan KTP - Disdukcapil Kota | GOV-HUB",
  description: "Dashboard pengelolaan kependudukan Disdukcapil tingkat kota.",
};

export default function DukcapilKotaDashboardPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Disdukcapil Kota"
      adminName="Operator KTP 07"
      basePath="/petugas/dukcapil/kota/dashboard"
    >
      <AdminDukcapilDashboardContent
        roleTitle="Disdukcapil Kota"
        wilayah="Kota Pontianak"
      />
    </AdminDashboardLayout>
  );
}

