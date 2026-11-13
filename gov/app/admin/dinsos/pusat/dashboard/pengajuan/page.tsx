import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengajuanDesilKecamatanContent } from "@/app/components/admin/dinsos/PengajuanDesilKecamatanContent";
import { getAdminDesilSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengajuan Peninjauan Desil - Dinsos Pusat | GOV-HUB",
  description: "Kelola, pantau, dan verifikasi persetujuan peninjauan desil tingkat nasional.",
};

export default async function DinsosPusatPengajuanPage() {
  const result = await getAdminDesilSubmissions();

  const formattedSubmissions = (result?.data || []).map((item) => {
    const parts = (item.tanggal || "").split("\n");
    return {
      id: item.id,
      nomor: item.nomor,
      nama: item.nama,
      nik: item.userId ? `617101${item.userId.slice(0, 10)}` : undefined,
      desilSaatIni: item.desilSaatIni,
      desilDiajukan: item.desilDiajukan || 2,
      statusBadge: item.statusBadge,
      statusRaw: item.statusRaw,
      tanggal: parts[0] || "29 Mei 2026",
      jam: parts[1] || "10:23 WIB",
      initial: item.initial,
      bgInitial: item.bgInitial,
      textInitial: item.textInitial,
      pekerjaan: item.pekerjaan,
      pendapatan: item.pendapatan,
      alasan: item.alasan,
      housePhoto: item.housePhoto,
      lokasi: item.lokasi,
    };
  });

  return (
    <AdminDashboardLayout
      instansi="dinsos"
      instansiName="Kementerian Sosial"
      roleTitle="Admin Pusat"
      adminName="Administrator Kemensos Pusat"
      basePath="/admin/dinsos/pusat/dashboard"
    >
      <PengajuanDesilKecamatanContent
        initialSubmissions={formattedSubmissions.length > 0 ? formattedSubmissions : undefined}
        canApprove={true}
      />
    </AdminDashboardLayout>
  );
}

