import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminSettingsContent } from "@/app/components/admin/AdminSettingsContent";
import { requireAdminPageSession } from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengaturan Profil - Dinsos Kecamatan | GOV-HUB",
  description: "Kelola informasi akun dan data profil petugas Dinsos Kecamatan.",
};

export default async function DinsosKecamatanPengaturanPage() {
  const session = await requireAdminPageSession("dinsos", "kecamatan");

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kecamatan"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dinsos/kecamatan/dashboard"
    >
      <AdminSettingsContent session={session} roleTitle="Admin Kecamatan" />
    </AdminDashboardLayout>
  );
}
