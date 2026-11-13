import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { DataWargaDesilContent } from "@/app/components/admin/dinsos/DataWargaDesilContent";

export const metadata = {
  title: "Data Warga - Dinsos Kecamatan | GOV-HUB",
  description: "Detail data warga beserta status desil ajuan tingkat kecamatan.",
};

export default function DinsosKecamatanDirectWargaPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan"
      adminName="Petugas Desil Genteng"
      basePath="/admin/dinsos/kecamatan/dashboard"
    >
      <DataWargaDesilContent />
    </AdminDashboardLayout>
  );
}

