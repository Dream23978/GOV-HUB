import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { PengaturanDukcapilContent } from "@/app/components/petugas/dukcapil/PengaturanDukcapilContent";

export const metadata = {
  title: "Profil Saya - Disdukcapil Kota | GOV-HUB",
  description: "Kelola informasi akun dan data profil petugas Disdukcapil Kota.",
};

export default function DukcapilKotaPengaturanPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Disdukcapil Kota"
      adminName="Operator KTP 07"
      basePath="/petugas/dukcapil/kota/dashboard"
    >
      <PengaturanDukcapilContent />
    </AdminDashboardLayout>
  );
}

