import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengaturanDukcapilContent } from "@/app/components/admin/dukcapil/PengaturanDukcapilContent";

export const metadata = {
  title: "Pengaturan Profil - Dukcapil Kota | GOV-HUB",
  description: "Kelola informasi akun dan data profil administrator Dukcapil Kota.",
};

export default function DukcapilKotaPengaturanPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kota"
      adminName="Operator Dukcapil Kota"
      basePath="/admin/dukcapil/kota/dashboard"
    >
      <PengaturanDukcapilContent />
    </AdminDashboardLayout>
  );
}
