import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminSettingsContent } from "@/app/components/admin/AdminSettingsContent";
import { requireAdminPageSession } from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengaturan Profil - Admin Pusat | GOV-HUB",
  description: "Kelola informasi akun dan data profil administrator pusat.",
};

export default async function AdminDashboardPengaturanPage() {
  const session = await requireAdminPageSession("pusat");

  return (
    <AdminDashboardLayout
      instansi="pusat"
      instansiName="Pemerintah Republik Indonesia"
      roleTitle="Administrator Terpadu Pusat"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dashboard"
    >
      <AdminSettingsContent
        session={session}
        roleTitle="Administrator Terpadu Pusat"
      />
    </AdminDashboardLayout>
  );
}
