import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengaturanDesilContent } from "@/app/components/admin/dinsos/PengaturanDesilContent";

export const metadata = {
  title: "Pengaturan Profil - Dinsos Provinsi | GOV-HUB",
  description: "Kelola informasi akun dan data profil petugas Dinsos Provinsi.",
};

export default function DinsosProvinsiPengaturanPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Provinsi / Pusat"
      adminName="Petugas Dinsos Jatim"
      basePath="/admin/dinsos/provinsi/dashboard"
    >
      <PengaturanDesilContent
        roleTitle="Admin Provinsi / Pusat"
        wilayah="Provinsi Jawa Timur"
      />
    </AdminDashboardLayout>
  );
}

