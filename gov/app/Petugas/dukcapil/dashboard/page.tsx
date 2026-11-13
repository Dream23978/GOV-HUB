import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { AdminDukcapilDashboardContent } from "@/app/components/petugas/AdminDukcapilDashboardContent";

export const metadata = {
  title: "Dashboard Kependudukan - Dukcapil | GOV-HUB",
  description: "Dashboard terpadu pelayanan KTP-el dan kependudukan Dinas Dukcapil.",
};

export default function DukcapilDashboardPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Dukcapil"
      adminName="Operator KTP 07"
      basePath="/petugas/dukcapil/dashboard"
    >
      <AdminDukcapilDashboardContent
        roleTitle="Admin Dukcapil"
        wilayah="Kota Pontianak"
      />
    </AdminDashboardLayout>
  );
}

