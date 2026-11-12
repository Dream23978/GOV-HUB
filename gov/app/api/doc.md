# 📖 Dokumentasi REST API GOV-HUB

Dokumentasi ini dibuat untuk mempermudah integrasi Frontend dengan Backend GOV-HUB.  
Semua endpoint berada di bawah prefix `/api/...`.

> **Catatan Autentikasi:**  
> Seluruh request yang membutuhkan login akan otomatis membaca **Cookie Sesi (Supabase)** di browser. Anda cukup melakukan `fetch('/api/...')` langsung dari client component tanpa perlu menyertakan header Authorization manual.

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
    "nama_lengkap": "Warga 0002",
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
    "desil_saat_ini": 5
  }
}
```

### B. Update Profil Warga
* **Method:** `PUT`
* **URL:** `/api/profile`
* **Headers:** `Content-Type: application/json`
* **Request Body (Kirim kolom yang ingin diubah saja):**
```json
{
  "nama_lengkap": "Warga Update",
  "nomor_telepon": "08987654321",
  "alamat": "Jl. Pemuda No. 45"
}
```
* **Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": { ...profil_terupdate }
}
```

---

## 2. Layanan KTP (`/api/ktp`)

### A. Ambil Riwayat & Status Tracking KTP
* **Method:** `GET`
* **URL:** `/api/ktp/submissions`
* **Deskripsi:** Mengambil semua riwayat pengajuan KTP milik warga yang sedang login (sangat cocok untuk halaman tracking).
* **Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "891ffd7e-0dce-4eb3-8b74-32f4d48db29a",
      "nomor_tiket": "KTP-12345678",
      "user_id": "7d196223-e46d-48f2-8d70-e60ad33bdb81",
      "jenis_pengajuan": "KTP Baru / Pertama Kali",
      "waktu_kehadiran_biometrik": "2026-11-04T01:00:00.000Z",
      "status": "menunggu_verifikasi",
      "catatan_petugas": null,
      "created_at": "2026-11-04T00:37:54.026Z"
    }
  ]
}
```
> **Status yang mungkin muncul:**  
> - `menunggu_verifikasi` (Warga baru mengajukan)  
> - `diproses` (Sedang diverifikasi / jadwal biometrik)  
> - `selesai` (KTP sudah dicetak / selesai)  
> - `ditolak` (Pengajuan ditolak petugas)

### B. Buat Pengajuan KTP Baru
* **Method:** `POST`
* **URL:** `/api/ktp/submissions`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "jenisPengajuan": "KTP Baru / Pertama Kali",
  "waktuKehadiranBiometrik": "November 4th, 2026 08:00 - 09:30 WIB",
  "dokumenKkUrl": "https://...",
  "dokumenAktaUrl": "https://..."
}
```
* **Response Sukses (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-pengajuan",
    "nomor_tiket": "KTP-87654321",
    "status": "menunggu_verifikasi"
  }
}
```

### C. Daftar Jadwal Biometrik & Kuota
* **Method:** `GET`
* **URL:** `/api/ktp/schedules`
* **Deskripsi:** Mengambil daftar slot waktu dan ketersediaan kuota perekaman biometrik.
* **Response Sukses (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-jadwal",
      "lokasi": "Kantor Kecamatan Genteng",
      "tanggal": "2026-11-05",
      "jam_mulai": "08:00",
      "jam_selesai": "12:00",
      "kuota_maksimal": 50,
      "kuota_terisi": 12,
      "is_active": true
    }
  ]
}
```

---

## 3. Contoh Penggunaan di Frontend (React Component)

```tsx
"use client";

import { useEffect, useState } from "react";

export function KtpTrackingList() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/ktp/submissions");
        const json = await res.json();
        if (json.success) {
          setSubmissions(json.data);
        }
      } catch (err) {
        console.error("Gagal load tracking:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <div>Memuat status pengajuan...</div>;

  return (
    <div>
      {submissions.map((sub: any) => (
        <div key={sub.id}>
          <p>Tiket: {sub.nomor_tiket}</p>
          <p>Status: {sub.status}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 4. Format Error Response

Apabila terjadi kendala (misal belum login atau validasi salah):
```json
{
  "success": false,
  "error": "Unauthorized: Belum login"
}
```
- Status Code `401`: Pengguna belum login atau sesi berakhir.
- Status Code `400`: Format data yang dikirim tidak sesuai.
- Status Code `500`: Kesalahan server internal.
