import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { DataWargaKtpContent } from "@/app/components/admin/dukcapil/DataWargaKtpContent";
import { getAdminDataWarga, type WargaDesilItem } from "@/lib/services/admin.service";

export const metadata = {
  title: "Data Warga - Dukcapil Kota | GOV-HUB",
  description: "Akses data kependudukan dan status KTP warga tingkat kota.",
};

export default async function DukcapilKotaDataWargaPage() {
  const result = await getAdminDataWarga();

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
      roleTitle="Admin Kota"
      adminName="Operator Dukcapil Kota"
      basePath="/admin/dukcapil/kota/dashboard"
    >
      <DataWargaKtpContent initialWargaList={formattedWarga} />
    </AdminDashboardLayout>
  );
}
