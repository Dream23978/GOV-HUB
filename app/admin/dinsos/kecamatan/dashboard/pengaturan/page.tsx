import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengaturanDesilContent } from "@/app/components/admin/dinsos/PengaturanDesilContent";

export const metadata = {
  title: "Pengaturan Profil - Dinsos Kecamatan | GOV-HUB",
  description: "Kelola informasi akun dan data profil petugas Dinsos Kecamatan.",
};

export default function DinsosKecamatanPengaturanPage() {
  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan"
      adminName="Petugas Desil Genteng"
      basePath="/admin/dinsos/kecamatan/dashboard"
    >
      <PengaturanDesilContent
        roleTitle="Admin Kecamatan"
        wilayah="Kecamatan Genteng, Surabaya"
      />
    </AdminDashboardLayout>
  );
}

