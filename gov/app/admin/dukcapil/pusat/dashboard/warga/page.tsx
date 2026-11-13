import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { DataWargaKtpContent } from "@/app/components/admin/dukcapil/DataWargaKtpContent";

export const metadata = {
  title: "Data Warga - Ditjen Dukcapil Pusat | GOV-HUB",
  description: "Akses data kependudukan dan status KTP warga seluruh wilayah nasional.",
};

export default function DukcapilPusatDataWargaPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Ditjen Dukcapil Kemendagri"
      roleTitle="Ditjen Dukcapil Pusat"
      adminName="Administrator Dukcapil Pusat"
      basePath="/admin/dukcapil/pusat/dashboard"
    >
      <DataWargaKtpContent />
    </AdminDashboardLayout>
  );
}

