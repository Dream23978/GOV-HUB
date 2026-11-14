import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { DataWargaKtpContent } from "@/app/components/admin/dukcapil/DataWargaKtpContent";
import { getAdminDataWarga, type WargaDesilItem } from "@/lib/services/admin.service";

export const metadata = {
  title: "Data Warga - Dukcapil Kecamatan | GOV-HUB",
  description: "Akses data kependudukan dan status KTP warga tingkat kecamatan.",
};

export default async function DukcapilKecamatanDataWargaPage() {
  const result = await getAdminDataWarga({ kecamatan: "Pontianak Kota" });

  const formattedWarga = (result?.data || []).map((w: WargaDesilItem) => ({
    id: w.id,
    nikMasked: w.nikMasked,
    nikFull: w.nikFull,
    nama: w.nama,
    desil: w.desil,
    status: w.status,
    kecamatan: w.kecamatan,
    alamat: w.alamat,
    ttl: w.ttl,
    jenisKelamin: w.jenisKelamin,
    pekerjaan: w.pekerjaan,
    statusKtp: "KTP-el Aktif (Tercatat SIAK)",
  }));

  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName="Petugas Dukcapil Kecamatan Pontianak Kota"
      basePath="/admin/dukcapil/kecamatan/dashboard"
    >
      <DataWargaKtpContent initialWargaList={formattedWarga} />
    </AdminDashboardLayout>
  );
}
