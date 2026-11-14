import type { DesilAdminRow, KtpAdminRow, WargaDesilItem } from "@/lib/services/admin.service";
import type { PengajuanKtpRow } from "@/app/components/admin/dukcapil/PengajuanKtpContent";

export function mapKtpRowsToPengajuanKtp(rows: KtpAdminRow[]): PengajuanKtpRow[] {
  return rows.map((item) => {
    let status: PengajuanKtpRow["status"] = "Proses";
    if (item.statusRaw === "selesai") status = "KTP Selesai";
    else if (item.statusRaw === "menunggu_cetak") status = "Menunggu Cetak";
    else if (item.statusRaw === "diproses") status = "Perekaman Biometrik";
    else if (item.statusRaw === "ditolak") status = "Ditolak";
    else if (item.statusRaw === "pengajuan_ulang") status = "Pengajuan Ulang";

    return {
      id: item.id,
      noPengajuan: item.nomor,
      nomorRegistrasi: item.nomorRegistrasi || item.nomor.replace("KTP-", ""),
      pemohon: item.nama,
      lokasi: item.alamat,
      alamatLengkap: item.alamat,
      jenis: item.layanan,
      status,
      tanggal: item.tanggal || "-",
      nik: item.nik,
      tanggalLahir: item.tanggalLahir || "-",
      statusKtp: "KTP-el Terdaftar",
      noHp: item.noHp || "-",
      alasan: item.alasan || "-",
      verifikasiNik: "Terverifikasi",
      verifikasiKk: "Terverifikasi",
      statusPenduduk: "Aktif",
      usia: item.usia || "-",
      tahapan: {
        biometrik:
          item.statusRaw === "diproses" ||
          item.statusRaw === "menunggu_cetak" ||
          item.statusRaw === "selesai",
        cetak: item.statusRaw === "menunggu_cetak" || item.statusRaw === "selesai",
        selesai: item.statusRaw === "selesai",
      },
    };
  });
}

export function mapDesilRowsToSubmissionCards(rows: DesilAdminRow[]) {
  return rows.map((item) => {
    const [tanggal = "-", jam = "-"] = (item.tanggal || "").split("\n");
    return {
      id: item.id,
      nomor: item.nomor,
      nama: item.nama,
      nik: item.nik || undefined,
      desilSaatIni: item.desilSaatIni,
      desilDiajukan: item.desilDiajukan || 2,
      statusBadge: item.statusBadge,
      statusRaw: item.statusRaw,
      tanggal,
      jam,
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
}

export function mapWargaToKtpList(rows: WargaDesilItem[]) {
  return rows.map((w) => ({
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
}

export function buildKtpLaporanRekap(rows: KtpAdminRow[]) {
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
  return Array.from(regionMap.entries()).map(([nama, counts]) => ({
    nama,
    baru: counts.baru,
    total: counts.total,
  }));
}
