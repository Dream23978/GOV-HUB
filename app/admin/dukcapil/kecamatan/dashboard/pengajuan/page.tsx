import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { PengajuanKtpContent, PengajuanKtpRow } from "@/app/components/admin/dukcapil/PengajuanKtpContent";
import { getAdminKtpSubmissions } from "@/lib/services/admin.service";

export const metadata = {
  title: "Pengajuan KTP - Dukcapil Kecamatan | GOV-HUB",
  description: "Pantau dan kelola pengajuan pencetakan KTP-el khusus wilayah kecamatan.",
};

export default async function DukcapilKecamatanPengajuanPage() {
  const result = await getAdminKtpSubmissions({ kecamatan: "Pontianak Kota" });

  const formattedSubmissions: PengajuanKtpRow[] = (result?.data || []).map((item) => {
    let statusFormatted: "Proses" | "Perekaman Biometrik" | "Menunggu Cetak" | "KTP Selesai" | "Ditolak" | "Pengajuan Ulang" = "Proses";
    if (item.statusRaw === "selesai") statusFormatted = "KTP Selesai";
    else if (item.statusRaw === "menunggu_cetak") statusFormatted = "Menunggu Cetak";
    else if (item.statusRaw === "diproses") statusFormatted = "Perekaman Biometrik";
    else if (item.statusRaw === "ditolak") statusFormatted = "Ditolak";
    else if (item.statusRaw === "pengajuan_ulang") statusFormatted = "Pengajuan Ulang";

    return {
      id: item.id,
      noPengajuan: item.nomor,
      nomorRegistrasi: item.nomorRegistrasi || item.nomor.replace("KTP-", ""),
      pemohon: item.nama,
      lokasi: item.alamat,
      alamatLengkap: item.alamat,
      jenis: item.layanan,
      status: statusFormatted,
      tanggal: item.tanggal || "-",
      nik: item.nikFull || item.nik,
      tanggalLahir: item.tanggalLahir || "-",
      statusKtp: "KTP-el Terdaftar",
      noHp: item.noHp || "-",
      alasan: item.alasan || "-",
      verifikasiNik: "Terverifikasi",
      verifikasiKk: "Terverifikasi",
      statusPenduduk: "Aktif",
      usia: item.usia || "-",
      tahapan: {
        biometrik: true,
        cetak: item.statusRaw === "diproses" || item.statusRaw === "selesai",
        selesai: item.statusRaw === "selesai",
      },
    };
  });

  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Admin Kecamatan"
      adminName="Petugas Dukcapil Kecamatan Pontianak Kota"
      basePath="/admin/dukcapil/kecamatan/dashboard"
    >
      <PengajuanKtpContent
        initialSubmissions={formattedSubmissions}
        canManageBlangko={false}
        canApprove={false}
        adminLevel="kecamatan"
      />
    </AdminDashboardLayout>
  );
}
