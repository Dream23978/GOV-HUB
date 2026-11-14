import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { LaporanKtpContent } from "@/app/components/admin/dukcapil/LaporanKtpContent";
import { getAdminKtpSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Laporan Penduduk - Dukcapil Kota | GOV-HUB",
  description: "Rekapitulasi penerbitan KTP-el dan pelayanan kependudukan tingkat kota.",
};

export default async function DukcapilKotaLaporanPage() {
  const ktpResult = await getAdminKtpSubmissions();
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
      roleTitle="Admin Kota"
      adminName="Operator Dukcapil Kota"
      basePath="/admin/dukcapil/kota/dashboard"
    >
      <LaporanKtpContent initialRekap={initialRekap} initialTotal={rows.length} />
    </AdminDashboardLayout>
  );
}
