import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminSettingsContent } from "@/app/components/admin/AdminSettingsContent";
import { requireAdminPageSession } from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengaturan Profil - Dukcapil Kecamatan | GOV-HUB",
  description: "Kelola informasi akun dan data profil petugas Dukcapil Kecamatan.",
};

export default async function DukcapilKecamatanPengaturanPage() {
  const session = await requireAdminPageSession("dukcapil", "kecamatan");

  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dukcapil/kecamatan/dashboard"
    >
      <AdminSettingsContent session={session} roleTitle="Admin Kecamatan" />
    </AdminDashboardLayout>
  );
}
