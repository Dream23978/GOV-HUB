import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { ManajemenAkunContent } from "@/app/components/admin/ManajemenAkunContent";
import { getAdminAccountsList } from "@/lib/services/admin.service";

export const metadata = {
  title: "Manajemen Akun - Admin Pusat | GOV-HUB",
  description: "Kelola akun pengguna, reset kata sandi, dan hapus akun di sistem GOV-HUB.",
};

export default async function AdminDashboardManajemenAkunPage() {
  const result = await getAdminAccountsList();

  return (
    <AdminDashboardLayout
      instansi="pusat"
      instansiName="Pemerintah Republik Indonesia"
      roleTitle="Administrator Terpadu Pusat"
      adminName="Administrator Pusat GOV-HUB"
      basePath="/admin/dashboard"
    >
      <ManajemenAkunContent initialAccounts={result?.data || []} />
    </AdminDashboardLayout>
  );
}
