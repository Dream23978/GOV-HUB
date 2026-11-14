import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengaturanDesilContent } from "@/app/components/admin/dinsos/PengaturanDesilContent";

export const metadata = {
  title: "Pengaturan Profil - Admin Pusat | GOV-HUB",
  description: "Kelola informasi akun dan data profil administrator pusat.",
};

export default function AdminDashboardPengaturanPage() {
  return (
    <AdminDashboardLayout
      instansi="pusat"
      instansiName="Pemerintah Republik Indonesia"
      roleTitle="Administrator Terpadu Pusat"
      adminName="Administrator Pusat GOV-HUB"
      basePath="/admin/dashboard"
    >
      <PengaturanDesilContent
        roleTitle="Administrator Terpadu Pusat"
        wilayah="Tingkat Nasional / Republik Indonesia"
      />
    </AdminDashboardLayout>
  );
}
