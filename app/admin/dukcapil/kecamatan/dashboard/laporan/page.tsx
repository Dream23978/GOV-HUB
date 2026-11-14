import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { LaporanKtpContent } from "@/app/components/admin/dukcapil/LaporanKtpContent";
import { getAdminKtpSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Laporan Penduduk - Dukcapil Kecamatan | GOV-HUB",
  description: "Rekapitulasi penerbitan KTP-el dan pelayanan kependudukan tingkat kecamatan.",
};

export default async function DukcapilKecamatanLaporanPage() {
  const ktpResult = await getAdminKtpSubmissions({ kecamatan: "Pontianak Kota" });
  const rows = ktpResult?.data || [];

  const regionMap = new Map<string, { baru: number; total: number }>();
  for (const item of rows) {
    const wilayah = item.alamat && item.alamat !== "-" ? item.alamat : "Wilayah Lainnya";
    const entry = regionMap.get(wilayah) || { baru: 0, total: 0 };
    entry.total += 1;
    if ((item.layanan || "").toLowerCase().includes("baru")) {
      entry.baru += 1;
    }
    regionMap.set(wilayah, entry);
  }

  const initialRekap = Array.from(regionMap.entries()).map(([nama, counts]) => ({
    nama,
    baru: counts.baru,
    total: counts.total,
  }));

  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName="Petugas Dukcapil Kecamatan Pontianak Kota"
      basePath="/admin/dukcapil/kecamatan/dashboard"
    >
      <LaporanKtpContent initialRekap={initialRekap} initialTotal={rows.length} />
    </AdminDashboardLayout>
  );
}
