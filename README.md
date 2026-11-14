# 🏛️ GOV-HUB — Portal Layanan Publik Terpadu

> **"Satu NIK, Satu Akses untuk Berbagai Layanan Publik."**  
> Portal terpadu integrasi administrasi kependudukan (Ditjen Dukcapil) dan verifikasi bantuan sosial ekonomi (Kemensos DTKS & Desil 1–10) berbasis Single Identity Number (NIK).

---

## 👥 Informasi Tim & Pengembang

* **Nama Tim**: *Tim Pengembang GOV-HUB*
* **Daftar Anggota Tim**:
  1. **Agung Saputra** (231230003@unmuhpnk.ac.id) — Backend & Security Engineering
  2. **Ferdian Iswara** (231230043@unmuhpnk.ac.id) — Frontend Engineering
  3. **Ade Tio Denari** (231230031@unmuhpnk.ac.id) — Data Analyst & UI Designer
  4. **Muhammad Borneo Satria Prawira Putra** (231230011@unmuhpnk.ac.id) — Data Analyst & UI Designer

---

## 📌 Deskripsi Produk & Analisis Masalah

### 1. Kategori Aplikasi
**Web Application** (Responsive Desktop & Mobile-first Web)

### 2. Masalah yang Diangkat
* **Fragmentasi Layanan Publik**: Warga harus mengakses portal dan loket fisik yang terpisah antara dinas kependudukan (Dukcapil) dan dinas sosial (Dinsos).
* **Redundansi Berkas & Data**: Masyarakat berulang kali mengunggah fotokopi KTP, KK, dan surat keterangan yang sama untuk setiap layanan publik yang berbeda.
* **Ketidaktepatan Penyaluran Bansos**: Penentuan tingkat desil ekonomi seringkali tidak transparan dan lambat terbarui ketika kondisi ekonomi warga berubah.
* **Kurangnya Transparansi Status Permohonan**: Proses validasi berkas fisik sering kali memakan waktu lama tanpa ada kejelasan status pelacakan berkas secara real-time.

### 3. Solusi yang Diberikan
**GOV-HUB** mengintegrasikan verifikasi identitas berbasis Single Identity Number (**NIK**) dengan session handling dan perlindungan privasi data:
* **Single Sign-On (SSO) Kependudukan**: Warga cukup masuk sekali menggunakan 16-digit NIK dan kata sandi untuk mengakses seluruh modul dinas.
* **Klasifikasi Desil Kesejahteraan Resmi (Desil 1 s.d. 10)**: Transparansi data tingkat kesejahteraan ekonomi keluarga lengkap dengan pengajuan peninjauan mandiri disertai geotagging hunian dan bukti lapangan.
* **Portal Administrasi Terisolasi (RBAC)**: Portal aparatur sipil dinas Dukcapil dan Dinsos dari tingkat kecamatan, kabupaten/kota, hingga provinsi/pusat dengan isolasi wewenang dan validasi token kriptografis.
* **Pencatatan & Pelacakan Real-Time**: Status pengajuan KTP-el, kuota jadwal biometrik kecamatan, dan peninjauan desil dapat dipantau langsung oleh warga.

---

## 🌟 Fitur Utama Sistem

### A. Portal Warga (Citizen Portal)
- [x] **Autentikasi Terpadu Berbasis NIK**:
  - Login menggunakan 16-digit NIK dan kata sandi dengan verifikasi Supabase Auth SSR.
  - Registrasi mandiri warga dengan validasi Zod ketat (NIK, Nama, No Telepon, Password kuat).
  - Alur Pemulihan Akun (*Forgot Password*): Verifikasi OTP email 5-digit, reset kata sandi, dan konfirmasi keamanan.
- [x] **Dashboard Kependudukan & Privasi**:
  - Masking privasi NIK otomatis di sisi server (`3578********0002`).
  - Indikator status kependudukan (NIK aktif, KK terdaftar, status sinkronisasi keluarga).
  - Kartu Kesejahteraan Desil Dinamis menampilkan status penetapan, kategori, dan deskripsi desil.
- [x] **Layanan Administrasi Kependudukan (Dukcapil)**:
  - Pengajuan cetak baru KTP-el, penggantian rusak/hilang, dan pembaruan data.
  - Pemilihan jadwal biometrik terintegrasi kalender operasional kecamatan (dengan kuota real-time).
  - Tracking status pengajuan bertahap (Menunggu Berkas &rarr; Jadwal Biometrik &rarr; Pencetakan &rarr; KTP Selesai).
- [x] **Layanan Bantuan Sosial & DTKS (Dinsos)**:
  - Form pengajuan peninjauan desil mandiri dengan data ekonomi, jumlah tanggungan, dan pendapatan.
  - Verifikasi geotagging hunian dengan koordinat GPS dan bukti foto rumah.
  - Tracking status verifikasi desil langsung hingga pengesahan dinas.

### B. Portal Aparatur Sipil & Administrator (Admin Portal)
- [x] **Login Aparatur Berbasis NIP**:
  - Otomatisasi deteksi instansi dan tingkat wilayah (Dinsos/Dukcapil, Kecamatan/Kota/Provinsi).
  - Sesi aman menggunakan **Signed Session Token (HMAC-SHA256)** dengan masa berlaku 12 jam.
- [x] **Panel Super Admin Pusat / Provinsi**:
  - Monitoring gabungan pengajuan KTP dan peninjauan Desil se-provinsi.
  - Tabel master klasifikasi Desil 1 s.d. 10 resmi Republik Indonesia.
  - Eksekusi persetujuan dan penolakan berwenang lintas instansi.
- [x] **Panel Dinas Sosial (Dinsos Kota & Kecamatan)**:
  - Verifikasi berkas kelayakan, geotagging rumah, dan laporan hasil survei lapangan.
  - Penetapan desil hasil evaluasi ke basis data DTKS profil warga.
- [x] **Panel Dukcapil (Dukcapil Kota & Kecamatan)**:
  - Verifikasi berkas pemohon KTP dan input status biometrik warga di kecamatan.
  - Persetujuan cetak fisik KTP dan pemantauan stok blangko di tingkat kota.

---

## 📊 Matriks Klasifikasi Desil DTKS Resmi (1–10)

Aplikasi GOV-HUB mengacu pada standar klasifikasi desil nasional yang tersentralisasi pada [`lib/desil.ts`](file:///home/agung/AKU/LOMBA/lomba-to-surabaya-sementara/gov/lib/desil.ts):

| Tingkatan | Kategori Kesejahteraan | Deskripsi Singkat | Rentang Persentil | Prioritas Bansos |
| :---: | :--- | :--- | :---: | :---: |
| **Desil 1** | **Miskin Ekstrem / Sangat Miskin** | Kelompok 10% keluarga dengan kesejahteraan terendah dan kesulitan memenuhi kebutuhan dasar. | 10% terendah | Sangat Tinggi |
| **Desil 2** | **Miskin** | Kelompok peringkat 11–20% terbawah dengan kondisi ekonomi sangat terbatas dan tidak stabil. | 11–20% terbawah | Tinggi |
| **Desil 3** | **Hampir Miskin** | Kelompok peringkat 21–30% terbawah yang hidup pas-pasan dan berisiko jatuh miskin jika ada guncangan ekonomi. | 21–30% terbawah | Tinggi |
| **Desil 4** | **Rentan Miskin** | Kelompok peringkat 31–40% terbawah dengan kondisi ekonomi sedikit lebih baik namun masih tergolong rentan. | 31–40% terbawah | Sedang |
| **Desil 5** | **Menengah Bawah / Transisi** | Kelompok peringkat 41–50% terbawah yang mampu memenuhi kebutuhan dasar secara mandiri namun belum mapan. | 41–50% terbawah | Sedang |
| **Desil 6** | **Menengah** | Kelompok peringkat 51–60% dengan kondisi ekonomi stabil dan sudah memiliki aset dasar yang memadai. | 51–60% | Mandiri |
| **Desil 7** | **Menengah Ke Atas** | Kelompok peringkat 61–70% dengan tingkat kesejahteraan yang baik serta akses pendidikan dan kesehatan terjamin. | 61–70% | Mandiri |
| **Desil 8** | **Sejahtera / Mapan** | Kelompok peringkat 71–80% dengan penghasilan tetap yang kuat dan kepemilikan aset yang cukup tinggi. | 71–80% | Mandiri |
| **Desil 9** | **Sangat Sejahtera** | Kelompok peringkat 81–90% dengan kondisi finansial sangat mapan dan jauh di atas garis kemiskinan. | 81–90% | Mandiri |
| **Desil 10** | **Paling Sejahtera / Kaya** | Kelompok 10% keluarga teratas dengan tingkat kesejahteraan dan kepemilikan aset paling tinggi secara nasional. | 10% teratas | Mandiri |

---

## 🛠️ Arsitektur Teknologi (Tech Stack)

| Kategori | Teknologi | Keterangan / Penggunaan |
| :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (v16 App Router, Turbopack, React 19) | Server-Side Rendering (SSR), Server Components, dan Route Handlers |
| **Bahasa Pemrograman** | [TypeScript](https://www.typescriptlang.org/) (v5) | Full strict type-safety di seluruh klien, API, dan server actions |
| **Styling & UI Kit** | [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) | Desain antarmuka responsif mobile-to-desktop, Radix UI Primitives |
| **Animasi & Interaksi** | [Motion](https://motion.dev/) & [Lucide React](https://lucide.dev/) | Transisi visual halus, accordion, dialog modal, dan icon library |
| **Validasi Skema** | [Zod](https://zod.dev/) | Validasi ketat format NIK (16 digit), NIP (18 digit), formulir pengajuan, dan payload API |
| **Backend & Basis Data** | [Supabase](https://supabase.com/) | PostgreSQL 15, Row-Level Security (RLS), Supabase SSR Client, Storage Bucket |
| **Keamanan & Kriptografi** | Node.js `crypto` (`scrypt`, `createHmac`) | HMAC-SHA256 signed admin session token, password hashing dengan dynamic salt |
| **State & Theme** | `next-themes` | Dukungan Dark Mode dan Light Mode terintegrasi |

---

## 🔐 Arsitektur Keamanan & Proteksi Siber

GOV-HUB dibangun dengan standar pengamanan aplikasi publik dan lolos uji audit penetrasi (OWASP Top 10):
1. **Signed Session Token Kriptografis**: Sesi admin disimpan dalam cookie HttpOnly `govhub_admin_session` yang ditandatangani HMAC-SHA256 dengan secret server. Manipulasi isi cookie otomatis ditolak dan diarahkan ke login.
2. **Cross-Agency Isolation (RBAC)**: Edge Proxy (`proxy.ts`) dan Server Actions (`app/actions/admin.ts`) mengisolasi jalur akses antarinstansi (petugas Dukcapil dilarang mengakses modul Dinsos, dan sebaliknya).
3. **Pemberantasan IDOR & BOLA**: Seluruh mutasi profil dan riwayat pengajuan memvalidasi kepemilikan data melalui sesi pengguna aktif (`auth.getUser()`).
4. **Pencegahan Data Exfiltration (PII Masking)**: NIK warga dimasking pada level server (`3578********0002`) sebelum dikirimkan ke antarmuka pengguna.
5. **Proteksi File Upload & Storage**: Whitelist tipe file dokumen/foto (`image/jpeg`, `image/png`, `application/pdf`) dan isolasi path bucket Supabase Storage pribadi.
6. **Proteksi CSRF**: Larangan mutasi status melalui HTTP GET, endpoint logout mewajibkan HTTP POST.

---

## ⚙️ Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat Sistem
* [Node.js](https://nodejs.org/) versi 20 LTS atau lebih baru.
* Manajer paket: `npm`, `pnpm`, atau `yarn`.
* Proyek aktif di [Supabase](https://supabase.com/).

### 2. Langkah Instalasi

```bash
# 1. Kloning repositori proyek
git clone https://github.com/Dream23978/GOV-HUB.git
cd gov

# 2. Instal seluruh dependensi proyek
npm install
```

### 3. Konfigurasi Variabel Lingkungan (.env)

Buat berkas `.env` atau salin dari `.env.example`:

```bash
cp .env.example .env
```

Lengkapi kredensial Supabase dan Secret Key:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Admin Session Signing Key
ADMIN_SESSION_SECRET=kunci-rahasia-minimal-32-karakter-acak-untuk-gov-hub
```

### 4. Eksekusi Skema Basis Data

Jalankan script SQL [`supabase_setup.sql`](file:///home/agung/AKU/LOMBA/lomba-to-surabaya-sementara/gov/supabase_setup.sql) pada menu **SQL Editor** di dashboard Supabase Anda untuk membuat seluruh tabel, trigger keamanan, RLS policies, dan akun dummy awal.

### 5. Menjalankan Server Pengembangan

```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

### 6. Verifikasi & Build Produksi

```bash
# Menjalankan rangkaian unit test otomatis
npm test

# Build production Next.js
npm run build
npm start
```

---

## 🔑 Akun Demonstrasi & Pengujian (Demo Accounts)

### 1. Akun Aparatur & Administrator (Login di [`/admin/login`](file:///home/agung/AKU/LOMBA/lomba-to-surabaya-sementara/gov/app/admin/login/page.tsx))
> **Password Default Seluruh Akun Admin/Petugas:** `admin123`

| Peran Aparatur | NIP (18 Digit) | Password | Nama & Email | Instansi & Wilayah | Akses Portal |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **Admin Pusat / Provinsi** | `198905142014021005` | `admin123` | Admin Pusat Provinsi Kalimantan Barat<br>`admin.pusat.kalbar@kalbarprov.go.id` | **Terpadu** (Prov. Kalimantan Barat) | `/admin/dashboard` |
| **Admin Dinsos Kota** | `198905142014021001` | `admin123` | Petugas Dinsos Kota Pontianak<br>`admin.dinsos@surabaya.go.id` | **Dinsos Kota** (Kota Pontianak, Kalbar) | `/admin/dinsos/kota/dashboard` |
| **Admin Dinsos Kecamatan** | `198905142014021003` | `admin123` | Admin Dinsos Kecamatan Pontianak Kota<br>`admin.genteng@surabaya.go.id` | **Dinsos Kecamatan** (Kec. Pontianak Kota) | `/admin/dinsos/kecamatan/dashboard` |
| **Petugas Dukcapil Kota** | `198905142014021002` | `admin123` | Operator Dukcapil Kota Singkawang<br>`petugas.dukcapil@surabaya.go.id` | **Dukcapil Kota** (Kota Singkawang, Kalbar) | `/admin/dukcapil/kota/dashboard` |
| **Petugas Dukcapil Kecamatan** | `198905142014021004` | `admin123` | Petugas Dukcapil Kecamatan Pontianak Kota<br>`petugas.dukcapil.kecamatan@surabaya.go.id` | **Dukcapil Kecamatan** (Kec. Pontianak Kota) | `/admin/dukcapil/kecamatan/dashboard` |

---

### 2. Akun Warga Terdaftar (Login di [`/auth/login`](file:///home/agung/AKU/LOMBA/lomba-to-surabaya-sementara/gov/app/auth/login/page.tsx))
> **Rekomendasi Akun Uji Utama (Full Auto-Fill):** Gunakan akun **Rizky Pratama Putra** (`6171011708940001` / `Warga12345`) yang seluruh kolom profil kependudukan & DTKS-nya sudah terisi lengkap di database.

| Nama Lengkap | NIK (16 Digit) | Password | Email / Kontak | Desil Saat Ini | Wilayah & Keterangan |
| :--- | :---: | :---: | :--- | :---: | :--- |
| **Rizky Pratama Putra** *(Utama)* | `6171011708940001` | `Warga12345` | `rizky.pratama@warga.pontianak.go.id`<br>`081256789012` | **Desil 3** *(Hampir Miskin)* | Kec. Pontianak Kota, Kota Pontianak<br>*(Data KK, TTL, Agama, Pekerjaan & Tanggungan Lengkap)* |
| **Hapis Khairullah** | `3578012305980002` | *(Sesuai registrasi / reset via Admin)* | `231230003@unmuhpnk.ac.id`<br>`0813-8822-1002` | **Desil 10** *(Paling Sejahtera)* | Kec. Pontianak Kota, Kota Pontianak |
| **Dewi Lestari** | `3578014502950041` | *(Sesuai registrasi / reset via Admin)* | `dewi.lestari@warga.surabaya.go.id`<br>`0878-5544-3322` | **Desil 5** *(Menengah Bawah)* | Kec. Pontianak Kota, Kota Pontianak |
| **Bambang Triyono** | `3578011210850022` | *(Sesuai registrasi / reset via Admin)* | `bambang.genteng@warga.surabaya.go.id`<br>`0812-9988-7766` | **Desil 2** *(Miskin)* | Kec. Pontianak Kota, Kota Pontianak |
| **Rudi Hartono** | `3578012405880031` | *(Sesuai registrasi / reset via Admin)* | `0812-3456-7890` | **Desil 4** *(Rentan Miskin)* | Kec. Pontianak Kota, Kota Pontianak |
| **Siti Rahmawati** | `3578016508920015` | *(Sesuai registrasi / reset via Admin)* | `0857-1122-3344` | **Desil 1** *(Miskin Ekstrem)* | Kec. Pontianak Kota, Kota Pontianak |
| **Ahmad Subarjo** | `3578010807790018` | *(Sesuai registrasi / reset via Admin)* | `ahmad.subarjo@warga.surabaya.go.id` | **Desil 5** *(Menengah Bawah)* | Kec. Pontianak Kota, Kota Pontianak |

> **Tips Pengujian Cepat:**  
> - Anda juga dapat membuat akun warga baru kapan saja melalui halaman **[`/auth/sign-up`](file:///home/agung/AKU/LOMBA/lomba-to-surabaya-sementara/gov/app/auth/sign-up/page.tsx)**.  
> - Admin Pusat (`198905142014021005`) dapat mereset kata sandi akun warga atau petugas mana pun secara langsung melalui menu **Manajemen Akun** (`/admin/dashboard/manajemen-akun`).

---

## 🤖 Dokumentasi Penggunaan AI

* **Model & Alat AI**: Google Gemini 2.5 Pro & Claude 3.7 Sonnet melalui asisten pengembang Antigravity AI.
* **Cakupan Pemanfaatan AI**:
  - Audit keamanan sistem berbasis OWASP Top 10 dan identifikasi kerentanan IDOR/RBAC.
  - Refactoring penanganan otorisasi kriptografis (`lib/security.ts`) dan masking PII.
  - Pembuatan automated unit testing suite (`lib/security.test.ts` & `lib/schedule-parser.test.ts`).
  - Sinkronisasi master klasifikasi Desil 1–10 dan penyusunan dokumentasi teknis komprehensif.

---

## 📄 Lisensi & Atribusi

Proyek ini dikembangkan untuk keperluan kompetisi inovasi layanan publik berbasis teknologi informasi.
- Framework: [Next.js](https://nextjs.org/) (MIT License).
- Database & Auth: [Supabase](https://supabase.com/) (Apache 2.0 License).
- Komponen UI: [shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/) (MIT License).
- Ikonografi: [Lucide React](https://lucide.dev/) (ISC License).
