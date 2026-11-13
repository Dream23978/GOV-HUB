import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengaturanDesilContent } from "@/app/components/admin/dinsos/PengaturanDesilContent";

export const metadata = {
  title: "Pengaturan Profil - Admin | GOV-HUB",
  description: "Kelola informasi akun dan data profil petugas.",
};

export default function AdminDashboardPengaturanPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan & Kota"
      adminName="Petugas Dinsos Surabaya"
      basePath="/admin/dashboard"
    >
      <PengaturanDesilContent
        roleTitle="Admin Kecamatan & Kota"
        wilayah="Kota Surabaya"
      />
    </AdminDashboardLayout>
  );
}

