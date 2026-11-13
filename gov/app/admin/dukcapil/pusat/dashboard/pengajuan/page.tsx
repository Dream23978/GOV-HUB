import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengajuanKtpContent } from "@/app/components/admin/dukcapil/PengajuanKtpContent";

export const metadata = {
  title: "Pengajuan KTP - Ditjen Dukcapil Pusat | GOV-HUB",
  description: "Pantau dan kelola pengajuan pencetakan KTP-el seluruh wilayah nasional.",
};

export default function DukcapilPusatPengajuanPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Ditjen Dukcapil Kemendagri"
      roleTitle="Ditjen Dukcapil Pusat"
      adminName="Administrator Dukcapil Pusat"
      basePath="/admin/dukcapil/pusat/dashboard"
    >
      <PengajuanKtpContent wilayah="Nasional / Seluruh Indonesia" />
    </AdminDashboardLayout>
  );
}

