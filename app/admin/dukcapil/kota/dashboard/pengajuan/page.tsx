import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengajuanKtpContent } from "@/app/components/admin/dukcapil/PengajuanKtpContent";
import { mapKtpRowsToPengajuanKtp } from "@/lib/admin-mappers";
import {
  getAdminKtpSubmissions,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengajuan KTP - Dukcapil Kota | GOV-HUB",
  description: "Pantau dan kelola pengajuan pencetakan KTP-el tingkat kota.",
};

export default async function DukcapilKotaPengajuanPage() {
  const session = await requireAdminPageSession("dukcapil", "kota");
  const result = await getAdminKtpSubmissions();

  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kota"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dukcapil/kota/dashboard"
    >
      <PengajuanKtpContent
        wilayah={session.wilayahLabel}
        initialSubmissions={mapKtpRowsToPengajuanKtp(result?.data || [])}
        canManageBlangko={false}
        canManageTracking={true}
        adminLevel="kota"
      />
    </AdminDashboardLayout>
  );
}
