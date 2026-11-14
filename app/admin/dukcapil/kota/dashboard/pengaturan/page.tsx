import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminSettingsContent } from "@/app/components/admin/AdminSettingsContent";
import { requireAdminPageSession } from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengaturan Profil - Dukcapil Kota | GOV-HUB",
  description: "Kelola informasi akun dan data profil administrator Dukcapil Kota.",
};

export default async function DukcapilKotaPengaturanPage() {
  const session = await requireAdminPageSession("dukcapil", "kota");

  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kota"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dukcapil/kota/dashboard"
    >
      <AdminSettingsContent session={session} roleTitle="Admin Kota" />
    </AdminDashboardLayout>
  );
}
