# 📖 Dokumentasi REST API GOV-HUB

Dokumentasi resmi arsitektur REST API GOV-HUB untuk mempermudah integrasi Frontend dengan Backend.  
Semua endpoint berada di bawah prefix `/api/...`.

> **Catatan Autentikasi & Keamanan:**  
> - **Sisi Warga (`/api/profile`, `/api/ktp/*`, `/api/bansos/*`)**: Menggunakan **Cookie Sesi Supabase** di browser. Permintaan `fetch('/api/...')` otomatis membawa cookie otentikasi tanpa perlu menyematkan header Authorization manual.
> - **Sisi Admin (`/api/admin/*`)**: Terproteksi oleh cookie sesi `govhub_admin_session` yang divalidasi dengan whitelist instansi dan tingkat wilayah.

---

## 1. Profil Warga (`/api/profile`)

### A. Ambil Profil Warga Login
* **Method:** `GET`
* **URL:** `/api/profile`
* **Deskripsi:** Mengambil detail data profil kependudukan warga yang sedang login (NIK, nama lengkap, alamat, status perkawinan, desil, dsb).
* **Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "7d196223-e46d-48f2-8d70-e60ad33bdb81",
    "nik": "3578012304950002",
    "nama_lengkap": "Hapis Khairullah",
    "email": "warga@example.com",
    "no_kk": "3578012304950001",
    "tempat_lahir": "Surabaya",
    "tanggal_lahir": "1995-04-23",
    "jenis_kelamin": "Laki-Laki",
    "alamat": "Jl. Basuki Rahmat No. 10",
    "rt": "001",
    "rw": "002",
    "kelurahan": "Embong Kaliasin",
    "kecamatan": "Genteng",
    "kota": "Surabaya",
    "provinsi": "Jawa Timur",
    "nomor_telepon": "08123456789",
    "role": "warga",
    "desil_saat_ini": 4
  }
}
```

### B. Perbarui Profil Warga
* **Method:** `PUT`
* **URL:** `/api/profile`
* **Headers:** `Content-Type: application/json`
* **Request Body (Kirim kolom yang ingin diubah saja):**
```json
{
  "nama_lengkap": "Hapis Khairullah",
  "nomor_telepon": "081234567890",
  "alamat": "Jl. Pemuda No. 45"
}
```
* **Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "7d196223-e46d-48f2-8d70-e60ad33bdb81",
    "nama_lengkap": "Hapis Khairullah",
    "nomor_telepon": "081234567890",
    "alamat": "Jl. Pemuda No. 45"
  }
}
```

---

## 2. Layanan Administrasi Kependudukan (`/api/ktp`)

### A. Ambil Riwayat & Tracking KTP
* **Method:** `GET`
* **URL:** `/api/ktp/submissions`
* **Deskripsi:** Mengambil semua riwayat pengajuan KTP milik warga yang sedang login.
* **Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "93f190d2-4ea9-410d-879b-b786f3798a67",
      "nomor_tiket": "KTP-2026-27460",
      "user_id": "7d196223-e46d-48f2-8d70-e60ad33bdb81",
      "jenis_pengajuan": "KTP Baru / Pertama Kali",
      "waktu_kehadiran_biometrik": "2026-11-12T08:30:00.000Z",
      "status": "menunggu_verifikasi",
      "catatan_petugas": null,
      "created_at": "2026-11-09T14:20:00.000Z"
    }
  ]
}
```
> **Status Alur Pengajuan KTP:**  
> - `menunggu_verifikasi`: Permohonan baru diajukan oleh warga.  
> - `diproses`: Berkas valid dan warga terjadwal/menunggu perekaman biometrik.  
> - `selesai`: KTP-el telah disetujui dan selesai dicetak oleh Dukcapil.  
> - `ditolak`: Permohonan ditolak petugas dengan catatan koreksi.

### B. Buat Permohonan KTP Baru
* **Method:** `POST`
* **URL:** `/api/ktp/submissions`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "jenisPengajuan": "KTP Baru / Pertama Kali",
  "waktuKehadiranBiometrik": "November 12th, 2026 08:30 - 10:00 WIB",
  "dokumenKkUrl": "https://storage.govhub.go.id/kk-sample.pdf",
  "dokumenAktaUrl": "https://storage.govhub.go.id/akta-sample.pdf"
}
```
* **Response Sukses (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "93f190d2-4ea9-410d-879b-b786f3798a67",
    "nomor_tiket": "KTP-2026-27460",
    "status": "menunggu_verifikasi"
  }
}
```

### C. Daftar Jadwal & Kuota Biometrik
* **Method:** `GET`
* **URL:** `/api/ktp/schedules`
* **Deskripsi:** Mengambil slot jadwal dan sisa kuota perekaman biometrik di kecamatan.
* **Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "c3937171-8bc6-464a-939e-e3748259d57a",
      "lokasi": "Kantor Kecamatan Genteng, Surabaya",
      "tanggal": "2026-11-12",
      "jam_mulai": "08:00",
      "jam_selesai": "12:00",
      "kuota_maksimal": 50,
      "kuota_terisi": 14,
      "is_active": true
    }
  ]
}
```

---

## 3. Layanan Sosial-Ekonomi & Bansos (`/api/bansos`)

### A. Ambil Riwayat Pengajuan Desil DTKS
* **Method:** `GET`
* **URL:** `/api/bansos/submissions`
* **Deskripsi:** Mengambil seluruh riwayat permohonan peninjauan/penyesuaian desil ekonomi milik warga yang sedang login.
* **Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "80b18671-43a4-4103-b437-1906e1a7c07d",
      "nomor_tiket": "DSL-2026-80B186",
      "user_id": "7d196223-e46d-48f2-8d70-e60ad33bdb81",
      "desil_lama": 4,
      "desil_diajukan": 1,
      "desil_hasil_peninjauan": 1,
      "status": "disetujui",
      "alasan": "Penurunan pendapatan drastis akibat PHK",
      "penghasilan_bulanan": 850000,
      "jumlah_tanggungan": 4,
      "created_at": "2026-11-08T09:15:00.000Z"
    }
  ]
}
```
> **Status Alur Pengajuan Desil:**  
> - `menunggu_verifikasi`: Menunggu pemeriksaan berkas dan verifikasi lapangan.  
> - `diproses`: Petugas Dinas Sosial sedang memvalidasi kondisi hunian/ekonomi.  
> - `disetujui`: Desil resmi diubah ke angka desil hasil peninjauan.  
> - `ditolak`: Kondisi ekonomi belum memenuhi kriteria penurunan desil.

### B. Ajukan Permohonan Peninjauan Desil Baru
* **Method:** `POST`
* **URL:** `/api/bansos/submissions`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "alasan": "Kehilangan mata pencaharian utama dan penambahan tanggungan lansia",
  "keterangan": "Rumah semi-permanen di Kecamatan Genteng",
  "jumlahTanggungan": 4,
  "pekerjaanKepalaKeluarga": "Buruh Harian Lepas",
  "penghasilanBulanan": 850000,
  "pengeluaranBulanan": 900000,
  "desilDiajukan": 1
}
```
* **Response Sukses (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "80b18671-43a4-4103-b437-1906e1a7c07d",
    "nomor_tiket": "DSL-2026-80B186",
    "status": "menunggu_verifikasi"
  }
}
```

---

## 4. Keamanan & Sesi Admin (`/api/admin`)

### Logout Sesi Aparatur Kedinasan
* **Method:** `POST` atau `GET`
* **URL:** `/api/admin/logout`
* **Deskripsi:** Menghanguskan cookie sesi aparatur (`govhub_admin_session`) di sisi server (`maxAge: 0` dan `expires: 1970`). Menjamin proteksi anti-session replay saat logout dari portal kedinasan.
* **Response Sukses (POST):**
```json
{
  "success": true
}
```
* **Response Sukses (GET):** Redirect HTTP `307` kembali ke `/admin/login` dengan header `Set-Cookie` penghapusan sesi.

---

## 5. Format Standar Error Response

Setiap kegagalan validasi atau otorisasi mengembalikan payload JSON seragam:
```json
{
  "success": false,
  "error": "Pesan deskripsi kendala / alasan penolakan"
}
```

| HTTP Status | Arti / Penyebab |
| :--- | :--- |
| **`400 Bad Request`** | Parameter tidak lengkap, format data keliru, atau payload JSON cacat. |
| **`401 Unauthorized`** | Pengguna belum login atau token sesi telah berakhir. |
| **`403 Forbidden`** | Pengguna tidak memiliki hak akses pada entitas yang diminta. |
| **`500 Internal Server Error`** | Kesalahan tak terduga pada server/database. |
