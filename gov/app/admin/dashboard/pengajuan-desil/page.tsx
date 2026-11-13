import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengajuanDesilKecamatanContent } from "@/app/components/admin/dinsos/PengajuanDesilKecamatanContent";
import { getAdminDesilSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengajuan Peninjauan Desil - Admin Pusat | GOV-HUB",
  description: "Kelola dan verifikasi pengajuan peninjauan desil bantuan sosial tingkat nasional.",
};

export default async function AdminDashboardPengajuanDesilPage() {
  const result = await getAdminDesilSubmissions();

  const formatted = result.data?.map((item) => ({
    id: item.id,
    nomor: item.nomor,
    nama: item.nama,
    desilSaatIni: item.desilSaatIni,
    desilDiajukan: item.desilDiajukan || 2,
    statusBadge: item.statusBadge,
    statusRaw: item.statusRaw,
    tanggal: item.tanggal.split("\n")[0] || "29 Mei 2026",
    jam: item.tanggal.split("\n")[1] || "10:23 WIB",
    initial: item.initial,
    bgInitial: item.bgInitial,
    textInitial: item.textInitial,
    pekerjaan: item.pekerjaan,
    pendapatan: item.pendapatan,
    alasan: item.alasan,
    housePhoto: item.housePhoto,
    lokasi: item.lokasi,
  }));

  return (
    <AdminDashboardLayout
      instansi="pusat"
      instansiName="Pemerintah Republik Indonesia"
      roleTitle="Administrator Terpadu Pusat"
      adminName="Administrator Pusat GOV-HUB"
      basePath="/admin/dashboard"
    >
      <PengajuanDesilKecamatanContent
        initialSubmissions={formatted}
        canApprove={true}
      />
    </AdminDashboardLayout>
  );
}

