import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengajuanKtpContent } from "@/app/components/admin/dukcapil/PengajuanKtpContent";
import { mapKtpRowsToPengajuanKtp } from "@/lib/admin-mappers";
import {
  getAdminKtpSubmissions,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengajuan KTP - Admin Pusat | GOV-HUB",
  description: "Kelola dan verifikasi pengajuan pencetakan KTP-el warga tingkat nasional.",
};

export default async function AdminDashboardPengajuanKtpPage() {
  const session = await requireAdminPageSession("pusat");
  const result = await getAdminKtpSubmissions();

  return (
    <AdminDashboardLayout
      instansi="pusat"
      instansiName="Pemerintah Republik Indonesia"
      roleTitle="Administrator Terpadu Pusat"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dashboard"
    >
      <PengajuanKtpContent
        wilayah={session.wilayahLabel}
        initialSubmissions={mapKtpRowsToPengajuanKtp(result?.data || [])}
        canManageTracking={true}
      />
    </AdminDashboardLayout>
  );
}
