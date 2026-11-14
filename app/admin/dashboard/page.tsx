import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { AdminPusatDashboardContent } from "@/app/components/admin/AdminPusatDashboardContent";
import { getAdminDesilSubmissions, getAdminKtpSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Dashboard Terpadu Administrator Pusat | GOV-HUB",
  description: "Pusat Kendali Pengelolaan Terpadu Bansos DTKS & Kependudukan Dukcapil Republik Indonesia.",
};

export default async function AdminDashboardPage() {
  const [desilResult, ktpResult] = await Promise.all([
    getAdminDesilSubmissions(),
    getAdminKtpSubmissions(),
  ]);

  const formattedKtp = (ktpResult?.data || []).map((k) => ({
    id: k.id,
    nomor: k.nomor,
    nama: k.nama,
    nik: k.nikFull || k.nik,
    layanan: k.layanan,
    statusBadge: k.statusBadge,
    tanggal: k.tanggal,
    initial: k.initial,
    bgInitial: k.bgInitial,
    textInitial: k.textInitial,
    tanggalLahir: k.tanggalLahir,
    alamat: k.alamat,
    statusKtp: "KTP-el Terdaftar",
    noHp: k.noHp,
    alasan: k.alasan,
    verifikasiNik: "Terverifikasi",
    verifikasiKk: "Terverifikasi",
    statusPenduduk: "Aktif",
    usia: k.usia,
  }));

  return (
    <AdminDashboardLayout
      instansi="pusat"
      instansiName="Pemerintah Republik Indonesia"
      roleTitle="Administrator Terpadu Pusat"
      adminName="Administrator Pusat GOV-HUB"
      basePath="/admin/dashboard"
    >
      <AdminPusatDashboardContent
        initialDesilSubmissions={desilResult.data}
        initialDesilCounts={desilResult.counts}
        initialKtpSubmissions={formattedKtp}
      />
    </AdminDashboardLayout>
  );
}
