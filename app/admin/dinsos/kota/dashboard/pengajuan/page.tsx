import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengajuanDesilKecamatanContent } from "@/app/components/admin/dinsos/PengajuanDesilKecamatanContent";
import { getAdminDesilSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengajuan Peninjauan Desil - Dinsos Kota | GOV-HUB",
  description: "Kelola dan pantau pengajuan desil warga tingkat kota.",
};

export default async function DinsosKotaPengajuanPage() {
  const result = await getAdminDesilSubmissions();

  const formattedSubmissions = (result?.data || []).map((item) => {
    const parts = (item.tanggal || "").split("\n");
    return {
      id: item.id,
      nomor: item.nomor,
      nama: item.nama,
      nik: item.nik || undefined,
      desilSaatIni: item.desilSaatIni,
      desilDiajukan: item.desilDiajukan || 2,
      statusBadge: item.statusBadge,
      statusRaw: item.statusRaw,
      tanggal: parts[0] || "-",
      jam: parts[1] || "-",
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
      instansiName="Dinas Sosial"
      roleTitle="Admin Kota"
      adminName="Petugas Dinsos Surabaya"
      basePath="/admin/dinsos/kota/dashboard"
    >
      <PengajuanDesilKecamatanContent initialSubmissions={formattedSubmissions} />
    </AdminDashboardLayout>
  );
}

