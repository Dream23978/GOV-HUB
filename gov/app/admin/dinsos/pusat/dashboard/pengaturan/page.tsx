import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengaturanDesilContent } from "@/app/components/admin/dinsos/PengaturanDesilContent";

export const metadata = {
  title: "Pengaturan Profil - Dinsos Pusat | GOV-HUB",
  description: "Kelola informasi akun dan data profil administrator Dinsos Pusat.",
};

export default function DinsosPusatPengaturanPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Kementerian Sosial"
      roleTitle="Admin Pusat"
      adminName="Administrator Kemensos Pusat"
      basePath="/admin/dinsos/pusat/dashboard"
    >
      <PengaturanDesilContent
        roleTitle="Admin Pusat (Kemensos)"
        wilayah="Kementerian Sosial RI (Pusat)"
      />
    </AdminDashboardLayout>
  );
}

