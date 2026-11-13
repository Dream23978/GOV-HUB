import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { DataWargaDesilContent } from "@/app/components/admin/dinsos/DataWargaDesilContent";

export const metadata = {
  title: "Data Warga - Admin Pusat | GOV-HUB",
  description: "Detail data warga beserta status desil ajuan tingkat nasional.",
};

export default function AdminDashboardDataWargaPage() {
  return (
    <AdminDashboardLayout
      instansi="pusat"
      instansiName="Pemerintah Republik Indonesia"
      roleTitle="Administrator Terpadu Pusat"
      adminName="Administrator Pusat GOV-HUB"
      basePath="/admin/dashboard"
    >
      <DataWargaDesilContent />
    </AdminDashboardLayout>
  );
}
