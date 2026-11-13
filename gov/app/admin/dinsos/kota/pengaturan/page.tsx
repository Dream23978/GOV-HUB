import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengaturanDesilContent } from "@/app/components/admin/dinsos/PengaturanDesilContent";

export const metadata = {
  title: "Pengaturan Profil - Dinsos Kota | GOV-HUB",
  description: "Kelola informasi akun dan data profil petugas Dinsos Kota.",
};

export default function DinsosKotaDirectPengaturanPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kota"
      adminName="Petugas Dinsos Surabaya"
      basePath="/admin/dinsos/kota/dashboard"
    >
      <PengaturanDesilContent
        roleTitle="Admin Kota"
        wilayah="Kota Surabaya"
      />
    </AdminDashboardLayout>
  );
}

