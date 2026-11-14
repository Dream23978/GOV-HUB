import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminSettingsContent } from "@/app/components/admin/AdminSettingsContent";
import { requireAdminPageSession } from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengaturan Profil - Dinsos Kota | GOV-HUB",
  description: "Kelola informasi akun dan data profil petugas Dinsos Kota.",
};

export default async function DinsosKotaPengaturanPage() {
  const session = await requireAdminPageSession("dinsos", "kota");

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Dinas Sosial"
      roleTitle="Admin Kota"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dinsos/kota/dashboard"
    >
      <AdminSettingsContent session={session} roleTitle="Admin Kota" />
    </AdminDashboardLayout>
  );
}
