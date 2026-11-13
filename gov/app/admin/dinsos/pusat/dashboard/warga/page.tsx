import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { DataWargaDesilContent } from "@/app/components/admin/dinsos/DataWargaDesilContent";

export const metadata = {
  title: "Data Warga - Dinsos Pusat | GOV-HUB",
  description: "Detail data warga DTKS dan status desil ajuan tingkat nasional.",
};

export default function DinsosPusatDataWargaPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Kementerian Sosial"
      roleTitle="Admin Pusat"
      adminName="Administrator Kemensos Pusat"
      basePath="/admin/dinsos/pusat/dashboard"
    >
      <DataWargaDesilContent />
    </AdminDashboardLayout>
  );
}

