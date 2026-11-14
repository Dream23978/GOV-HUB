export type UserRole = "warga" | "petugas" | "admin";
export type KtpSubmissionStatus =
  | "menunggu_verifikasi"
  | "diproses"
  | "menunggu_cetak"
  | "selesai"
  | "ditolak"
  | "pengajuan_ulang";
export type DesilSubmissionStatus = "menunggu_verifikasi" | "diproses" | "disetujui" | "ditolak";

export interface Profile {
  id: string; // Foreign key to auth.users.id
  nik: string;
  nama_lengkap: string;
  no_kk: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  jenis_kelamin: string | null;
  alamat: string | null;
  rt: string | null;
  rw: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kota: string | null;
  provinsi: string | null;
  nomor_telepon: string | null;
  email?: string | null;
  password_hash?: string | null;
  role: UserRole;
  desil_saat_ini: number;
  created_at?: string;
  updated_at?: string;
}

export interface BiometricSchedule {
  id: string;
  lokasi: string;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  kuota_maksimal: number;
  kuota_terisi: number;
  is_active: boolean;
  created_at?: string;
}

export interface KtpSubmission {
  id: string;
  nomor_tiket: string;
  user_id: string;
  jenis_pengajuan: string;
  dokumen_kk_url: string | null;
  dokumen_akta_url: string | null;
  surat_kehilangan_url: string | null;
  schedule_id: string | null;
  waktu_kehadiran_biometrik: string | null;
  status: KtpSubmissionStatus;
  catatan_petugas: string | null;
  petugas_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DesilSubmission {
  id: string;
  nomor_tiket: string;
  user_id: string;
  desil_lama: number;
  desil_diajukan: number;
  jumlah_tanggungan: number;
  pekerjaan_kepala_keluarga: string | null;
  penghasilan_bulanan: number;
  pengeluaran_bulanan: number;
  daya_listrik_va: number | null;
  sumber_air: string | null;
  status_kepemilikan_rumah: string | null;
  luas_lantai_m2: number | null;
  jenis_lantai: string | null;
  jenis_dinding: string | null;
  foto_rumah_depan_url: string | null;
  foto_ruang_tengah_url: string | null;
  foto_dapur_url: string | null;
  bukti_slip_gaji_url: string | null;
  bukti_rekening_listrik_url: string | null;
  status: DesilSubmissionStatus;
  desil_hasil_peninjauan: number | null;
  catatan_verifikasi: string | null;
  petugas_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  judul: string;
  pesan: string;
  tipe: string;
  is_read: boolean;
  tautan_aksi: string | null;
  created_at?: string;
}
