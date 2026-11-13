import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengaturanDukcapilContent } from "@/app/components/admin/dukcapil/PengaturanDukcapilContent";

export const metadata = {
  title: "Pengaturan Profil - Ditjen Dukcapil Pusat | GOV-HUB",
  description: "Kelola informasi akun dan data profil administrator Ditjen Dukcapil Pusat.",
};

export default function DukcapilPusatPengaturanPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Ditjen Dukcapil Kemendagri"
      roleTitle="Ditjen Dukcapil Pusat"
      adminName="Administrator Dukcapil Pusat"
      basePath="/admin/dukcapil/pusat/dashboard"
    >
      <PengaturanDukcapilContent />
    </AdminDashboardLayout>
  );
}

