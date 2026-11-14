import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengajuanKtpContent } from "@/app/components/admin/dukcapil/PengajuanKtpContent";
import { mapKtpRowsToPengajuanKtp } from "@/lib/admin-mappers";
import {
  getAdminKtpSubmissions,
  requireAdminPageSession,
} from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengajuan KTP - Dukcapil Kecamatan | GOV-HUB",
  description: "Pantau dan kelola pengajuan pencetakan KTP-el khusus wilayah kecamatan.",
};

export default async function DukcapilKecamatanPengajuanPage() {
  const session = await requireAdminPageSession("dukcapil", "kecamatan");
  const result = await getAdminKtpSubmissions();

  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName={session.nama}
      wilayahLabel={session.wilayahLabel}
      basePath="/admin/dukcapil/kecamatan/dashboard"
    >
      <PengajuanKtpContent
        wilayah={session.wilayahLabel}
        initialSubmissions={mapKtpRowsToPengajuanKtp(result?.data || [])}
        canManageBlangko={false}
        canManageTracking={true}
        canApprove={false}
        adminLevel="kecamatan"
      />
    </AdminDashboardLayout>
  );
}
