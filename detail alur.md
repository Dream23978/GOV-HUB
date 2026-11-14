# 🛡️ PANDUAN DETAIL ALUR SISTEM GOV-HUB & ARSITEKTUR PENETRATION TESTING
**Dokumen Spesifikasi Teknis, Alur Bisnis End-to-End, Pemetaan Attack Surface, dan Metodologi Uji Penetrasi Sistem Terpadu Administrasi Kependudukan (Dukcapil) & Bantuan Sosial DTKS (Dinsos)**

---

## DAFTAR ISI
1. [Ringkasan Eksekutif & Arsitektur Sistem](#1-ringkasan-eksekutif--arsitektur-sistem)
2. [Matriks Aktor, Peran (RBAC), dan Hak Akses Wilayah](#2-matriks-aktor-peran-rbac-dan-hak-akses-wilayah)
3. [Alur Bisnis End-to-End & Siklus Hidup Data](#3-alur-bisnis-end-to-end--siklus-hidup-data)
   - [3.1 Alur Autentikasi & Akun Warga](#31-alur-autentikasi--akun-warga)
   - [3.2 Alur Reset Password & Verifikasi OTP](#32-alur-reset-password--verifikasi-otp)
   - [3.3 Alur Pengajuan & Pencetakan KTP-el (Dukcapil)](#33-alur-pengajuan--pencetakan-ktp-el-dukcapil)
   - [3.4 Alur Peninjauan & Penetapan Desil DTKS (Dinsos)](#34-alur-peninjauan--penetapan-desil-dtks-dinsos)
   - [3.5 Alur Autentikasi & Portal Terpadu Aparatur Sipil (Admin)](#35-alur-autentikasi--portal-terpadu-aparatur-sipil-admin)
4. [Pemetaan Attack Surface: Endpoint REST API & Server Actions](#4-pemetaan-attack-surface-endpoint-rest-api--server-actions)
5. [Skema Basis Data & Konfigurasi Row-Level Security (RLS)](#5-skema-basis-data--konfigurasi-row-level-security-rls)
6. [Katalog Skenario Uji Penetrasi (OWASP Top 10 & API Security)](#6-katalog-skenario-uji-penetrasi-owasp-top-10--api-security)
7. [Checklist Pengujian Praktis (Step-by-Step Test Cases)](#7-checklist-pengujian-praktis-step-by-step-test-cases)
8. [Matriks Risiko & Rekomendasi Mitigasi Keamanan](#8-matriks-risiko--rekomendasi-mitigasi-keamanan)

---

## 1. RINGKASAN EKSEKUTIF & ARSITEKTUR SISTEM

### 1.1 Deskripsi Platform
**GOV-HUB** adalah sistem web portal layanan publik terintegrasi tingkat nasional yang menggabungkan dua pilar pelayanan masyarakat Republik Indonesia:
1. **Layanan Administrasi Kependudukan (Ditjen Dukcapil Kemendagri):** Pengajuan KTP-el baru, penggantian KTP rusak/hilang, pembaruan elemen data, penjadwalan biometrik kecamatan, dan pemantauan stok blangko KTP nasional/daerah.
2. **Layanan Kesejahteraan Sosial & DTKS (Kementerian Sosial RI):** Pendaftaran mandiri peninjauan desil kemiskinan (Desil 1 s.d. 10), verifikasi lapangan geotagging hunian, dan penetapan kuota bantuan sosial (PKH, BPNT, PBI-JK).

### 1.2 Topologi & Arsitektur Teknologi
Sistem dibangun menggunakan arsitektur **Modern Fullstack Serverless**:
* **Frontend Framework:** Next.js 15 (React 19, TypeScript, Tailwind CSS, Lucide Icons, Next-Themes).
* **Routing Paradigm:** Next.js App Router (kombinasi Server Components, Client Components, dan Server Actions).
* **Backend Runtime:** Node.js Serverless Functions di Vercel / Docker Container.
* **Database & Identity Provider:** Supabase (PostgreSQL 15 dengan ekstensi `pgcrypto` dan `uuid-ossp`, Supabase Auth Engine).
* **Access Control Layer:**
  * **Edge Middleware (`proxy.ts`):** Mengatur perutean sesi, pengalihan unauthenticated pengguna, isolasi rute admin kedinasan.
  * **Database RLS:** Row-Level Security dan PostgreSQL Triggers (`public.is_staff()`, `guard_profile_sensitive_columns()`, `handle_user_sync()`).
  * **Dual Authentication Storage:** Supabase Auth Cookie (warga) + Custom Http Cookie & LocalStorage (`govhub_admin_session`) untuk aparatur.

```
                              [ BROWSER KLIEN ]
                               /              \
                   (Warga Portal)           (Admin Portal)
                         |                         |
           [/auth/*, /dashboard/*]           [/admin/*]
                         \                         /
                    [ NEXT.JS EDGE MIDDLEWARE (proxy.ts) ]
                                   |
         +-------------------------+-------------------------+
         |                                                   |
[ NEXT.JS SERVER ACTIONS ]                           [ NEXT.JS REST ROUTE HANDLERS ]
(actions/auth.ts, admin.ts, bansos.ts, ktp.ts)      (/api/profile, /api/ktp/*, /api/bansos/*)
         |                                                   |
         +-------------------------+-------------------------+
                                   |
                         [ SUPABASE CLIENT LAYER ]
               - Anon Key Client (Session Cookie)
               - Service Role Admin Client (Admin Privileges)
                                   |
                     [ POSTGRESQL DATABASE (Supabase) ]
                 - Row Level Security (RLS Policies)
                 - PostgreSQL Triggers & Stored Procedures
                 - Storage Bucket (Berkas KK, Akta, Geotag Rumah)
```

---

## 2. MATRIKS AKTOR, PERAN (RBAC), DAN HAK AKSES WILAYAH

Sistem mengimplementasikan **Multi-Tier Hierarchical Role-Based Access Control (RBAC)** dengan batas wewenang wilayah yurisdiksi:

| ID Role | Nama Aktor | Lingkup Wilayah | Instansi | Wewenang Sistem Utama |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE_WARGA` | Warga Negara Indonesia | Pribadi (Self) | Publik | Mengajukan KTP, memilih jadwal biometrik, mengajukan revisi desil, unggah foto rumah, lacak status. |
| `ROLE_DINSOS_KEC` | Petugas Dinsos Kecamatan | Kecamatan (e.g. Genteng) | Dinas Sosial | Memeriksa berkas permohonan desil lokal, verifikasi geotagging & survei lapangan. Tidak berhak menyetujui final. |
| `ROLE_DINSOS_KOTA` | Verifikator Dinsos Kota | Kota (e.g. Surabaya) | Dinas Sosial | Rekapitulasi ajuan desil se-kota, audit data kemiskinan kota, verifikasi berkas tingkat dua. |
| `ROLE_DINSOS_PROV` | Supervisor Dinsos Provinsi | Provinsi (e.g. Jawa Timur) | Dinas Sosial | Monitoring sebaran kemiskinan regional, evaluasi rekomendasi kabupaten/kota. |
| `ROLE_DINSOS_PUSAT` | Administrator Kemensos RI | Nasional / Pusat | Kemensos RI | **Hak Eksekutif:** Menyetujui final perubahan desil warga, penetapan desil hasil evaluasi, tolak pengajuan. |
| `ROLE_DUKCAPIL_KEC` | Petugas Dukcapil Kecamatan | Kecamatan | Dukcapil | Verifikasi berkas permohonan KTP, input data biometrik warga, update status tahap biometrik. |
| `ROLE_DUKCAPIL_KOTA` | Operator Dukcapil Kota | Kota (e.g. Pontianak) | Dukcapil | Menyetujui pencetakan KTP, cetak fisik KTP, manajemen stok blangko lokal, tolak pengajuan berkas cacat. |
| `ROLE_DUKCAPIL_PUSAT` | Ditjen Dukcapil Pusat | Nasional / Pusat | Dukcapil | Distribusi kuota blangko nasional, audit pencetakan KTP seluruh Indonesia. |
| `ROLE_ADMIN_PUSAT` | Admin Terpadu GOV-HUB | Nasional / Pusat | Terpadu (Kemensos + Dukcapil) | Akses portal super-admin: Manajemen pengajuan KTP sekaligus Desil, monitor stok blangko, approval lintas instansi. |

---

## 3. ALUR BISNIS END-TO-END & SIKLUS HIDUP DATA

### 3.1 Alur Autentikasi & Akun Warga

```
[ Warga ] -> (Input NIK 16 Digit & Password) -> [ /auth/login (Client) ]
                                                            |
                                            POST Action: signInAction()
                                                            |
                                      [ auth.service.ts -> signInWithNik() ]
                                                            |
             +----------------------------------------------+----------------------------------------------+
             |                                              |                                              |
     (Cek Email Asli via Profiles)            (Fallback Format {nik}@govhub.id)           (Fallback Format {nik}@local)
             |                                              |                                              |
             +----------------------------------------------+----------------------------------------------+
                                                            |
                                          [ Supabase Auth: signInWithPassword() ]
                                                            |
                                  [ Set Auth Session Cookies (sb-access-token, sb-refresh-token) ]
                                                            |
                                       [ Redirect ke /dashboard (Warga Terotentikasi) ]
```

1. **Registrasi Akun Baru (`/auth/sign-up`):**
   * Input: NIK (16 digit), Email aktif / No HP, Kata Sandi (min 8 karakter), Nama Lengkap.
   * Validasi client & server: Format NIK numerik 16 digit.
   * `auth.service.ts` memanggil `supabase.auth.signUp()`.
   * Trigger PostgreSQL `on_auth_user_created` otomatis meng-insert record ke tabel `public.profiles` dengan role default `'warga'`, desil awal `5`, serta hash kata sandi terenkripsi.
2. **Login Berbasis NIK (`/auth/login`):**
   * Warga memasukkan 16 digit NIK dan password (bukan email).
   * Backend mencari email relasi NIK pada tabel `public.profiles`.
   * Jika profil belum memiliki email terhubung, sistem menggunakan fallback email virtual `${nik}@govhub.id` atau `${nik}@local`.
   * Sesi otentikasi disimpan ke dalam HTTP cookies browser.

---

### 3.2 Alur Reset Password & Verifikasi OTP

```
[ Pengguna Lupa Sandi ] -> [ Input Email/NIK di /auth/forgot-password ]
                                       |
                   Action: requestPasswordResetAction(contact)
                                       |
                [ Generate Token OTP 6 Digit Acak (100000 - 999999) ]
                                       |
          [ Simpan ke public.password_resets (Expired: NOW() + 15 Menit, Attempts: 0) ]
                                       |
                 [ Kirim Email via email.service.ts (Resend / SMTP) ]
                                       |
                 [ Pengguna Memasukkan 6 Digit OTP di /verify ]
                                       |
                Action: verifyPasswordResetOtpAction(email, token)
                                       |
              (Validasi Token: MATCH & NOT EXPIRED & ATTEMPTS < 5)
                                       |
                         [ Generate UUID reset_token ]
                                       |
          [ Redirect ke /auth/forgot-password/reset?token={reset_token} ]
                                       |
             [ Input Password Baru -> Action: updateUserPasswordAction() ]
                                       |
         [ Update auth.users & password_hash di profiles -> Invalidate Token ]
```

**Poin Kritis Keamanan OTP:**
* Token memiliki waktu kedaluwarsa 15 menit (`expires_at`).
* Kolom `attempts` bertambah setiap kali terjadi kesalahan input. Jika `attempts >= 5`, token dibatalkan untuk mencegah *brute-force attack*.
* Token OTP sekali pakai (`used_at` terisi setelah verifikasi berhasil).

---

### 3.3 Alur Pengajuan & Pencetakan KTP-el (Dukcapil)

```
[ Warga di Dashboard ] -> [ /dashboard/layanan-ktp/ajukan ]
                               |
       (Pilih Jenis: KTP Baru / Rusak / Ubah Data)
                               |
    (Pilih Jadwal Biometrik Kecamatan di biometric_schedules)
                               |
               (Unggah Dokumen KK & Akta Lahir)
                               |
              POST /api/ktp/submissions (Atau submitKtpAction)
                               |
      [ DB Insert: ktp_submissions (Status: 'menunggu_verifikasi') ]
                               |
                               v
[ Petugas Dukcapil Kecamatan / Kota ] -> [ /admin/dashboard/pengajuan-ktp ]
                               |
                     (Klik "Lihat Detail")
                               |
               [ MODAL DETAIL KTP TERBUKA ]
               - Data Pemohon & Verifikasi Berkas
               - Pengecekan Ketersediaan Blangko KTP
                               |
              +----------------+----------------+
              |                                 |
      [ Tombol SETUJU ]                [ Tombol TOLAK PENGAJUAN ]
              |                                 |
  (Cek Stok Blangko KTP)               (Buka Form Alasan Penolakan)
  - Tersedia (Stok - 1)                         |
  - Habis (Antrean Cetak)             (Input Teks Wajib Alasan)
              |                                 |
  [ Status: 'Mencetak KTP' ]            [ Status: 'Ditolak' ]
  [ Tahap: Biometrik -> Selesai ]      [ Catatan: alasanPenolakan ]
```

1. **Warga mengajukan permohonan:** Sistem mengunci slot jadwal biometrik pada tabel `biometric_schedules` (menaikkan counter `kuota_terisi`).
2. **Pemeriksaan Petugas:** Petugas membuka modal pengajuan:
   * Menampilkan verifikasi NIK, status kependudukan, KK, dan usia.
   * **Komponen Ketersediaan Blangko KTP:** Menampilkan stok terkini (misal: `10.000` keping). Pilihan: `Tersedia` vs `Habis`.
3. **Keputusan Permohonan:**
   * **Setuju:** Status berubah menjadi `Mencetak KTP` atau `KTP Selesai`. Stok blangko otomatis terpotong 1 keping jika status `Tersedia`.
   * **Tolak:** Petugas wajib mengetikkan alasan penolakan (misal: "Foto biometrik buram, NIK tidak sinkron dengan database SIAK"). Alasan disimpan permanen pada atribut `catatan_petugas` / `alasanPenolakan`.

---

### 3.4 Alur Peninjauan & Penetapan Desil DTKS (Dinsos)

```
[ Warga Kurang Mampu ] -> [ /dashboard/layanan-bansos/ajukan ]
                                 |
          (Isi Data Ekonomi: Tanggungan, Gaji, Listrik, Rumah)
                                 |
          (Ambil Foto Hunian Rumah Depan + Geotagging Koordinat GPS)
                                 |
            POST /api/bansos/submissions (submitDesilAction)
                                 |
     [ DB Insert: desil_submissions (Status: 'menunggu_verifikasi') ]
                                 |
                                 v
        [ TAHAP 1: VERIFIKASI LAPANGAN DINSOS KECAMATAN ]
     - Pemeriksaan berkas & validasi lokasi GPS rumah warga
     - Input laporan survei kondisi lapangan (/admin/dinsos/kecamatan/laporan)
     - Rekomendasi diajukan ke tingkat Kota
                                 |
                                 v
         [ TAHAP 2: KONSOLIDASI & SUPERVISI DINSOS KOTA ]
     - Dinsos Kota memeriksa kuota DTKS daerah
     - Menyiapkan berkas pengesahan penetapan desil
                                 |
                                 v
        [ TAHAP 3: HAK PENETAPAN FINAL OLEH DINSOS PUSAT ]
             [ /admin/dashboard / /admin/dashboard/pengajuan-desil ]
                                 |
                        (Klik "Lihat Detail")
                                 |
               +-----------------+-----------------+
               |                                   |
    [ SETUJUI PENINJAUAN DESIL ]          [ TOLAK PENGAJUAN ]
               |                                   |
  - Update desil_submissions:             - Update desil_submissions:
    status = 'disetujui'                    status = 'ditolak'
    desil_hasil_peninjauan = 2            - Catatan alasan penolakan
  - Update profiles warga:
    desil_saat_ini = desil_hasil
```

**Panduan Klasifikasi Desil 1–10 Resmi:**
* **Desil 1:** 10% keluarga tingkat kesejahteraan terendah (Sangat Miskin / Miskin Ekstrem) &mdash; Prioritas Tertinggi PKH/Bansos.
* **Desil 2:** 11–20% terbawah (Kategori Miskin).
* **Desil 3:** 21–30% terbawah (Kategori Hampir Miskin).
* **Desil 4:** 31–40% terbawah (Kategori Rentan Miskin).
* **Desil 5:** 41–50% terbawah (Menengah Transisi / Penyangga).
* **Desil 6–7:** 51–70% (Kategori Menengah).
* **Desil 8:** 71–80% (Kategori Menengah Atas).
* **Desil 9:** 81–90% (Kategori Mampu / Sejahtera).
* **Desil 10:** 10% keluarga tingkat kesejahteraan paling tinggi.

---

### 3.5 Alur Autentikasi & Portal Terpadu Aparatur Sipil (Admin)

```
[ Aparatur Masuk ke /admin/login ]
               |
    (Ketik NIP 18 Digit di Form)
               |
  [ Client Event: debounce 350ms ] -> Action: lookupAdminByNipAction(nip)
               |
       (Cek Database Profiles / Mock KNOWN_ADMINS)
               |
   [ Ditemukan: Instansi (Dinsos/Dukcapil), Tingkat (Kec/Kota/Prov/Pusat), Wilayah ]
   [ Form otomatis mengunci dropdown Instansi & Wilayah ]
               |
       (Input Kata Sandi & Submit)
               |
      POST Action: adminLoginAction({ nip, password })
               |
          (Verifikasi Kredensial Berhasil)
               |
   [ Set HTTP Cookie: govhub_admin_session = "{instansi}_{tingkat}" ]
   [ Set LocalStorage: govhub_admin_session = JSON { id, nip, role, ... } ]
               |
  [ Redirect ke Target URL Sesuai Tingkatan / Portal Terpadu /admin/dashboard ]
```

---

## 4. PEMETAAN ATTACK SURFACE: ENDPOINT REST API & SERVER ACTIONS

### 4.1 Route Handlers REST API (`/app/api/...`)

| Method | Endpoint | Autentikasi Diperlukan | Parameter Kunci (Payload) | Deskripsi Operasi |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/profile` | Supabase Session Cookie | Header Cookie | Mengambil data pribadi warga yang sedang aktif login. |
| `PUT` | `/api/profile` | Supabase Session Cookie | `{ nama_lengkap, nomor_telepon, alamat, rt, rw }` | Memperbarui atribut profil pengguna aktif. |
| `GET` | `/api/ktp/submissions` | Supabase Session Cookie | Header Cookie | Menampilkan daftar riwayat permohonan KTP milik user. |
| `POST` | `/api/ktp/submissions` | Supabase Session Cookie | `{ jenisPengajuan, waktuKehadiranBiometrik, dokumenKkUrl, dokumenAktaUrl }` | Membuat draf permohonan KTP baru. |
| `GET` | `/api/ktp/schedules` | Publik / Anonim | Query params | Menampilkan slot jadwal dan ketersediaan kuota biometrik. |
| `GET` | `/api/bansos/submissions` | Supabase Session Cookie | Header Cookie | Mengambil riwayat pengajuan peninjauan desil warga. |
| `POST` | `/api/bansos/submissions` | Supabase Session Cookie | `{ alasan, keterangan, jumlahTanggungan, penghasilanBulanan, pengeluaranBulanan, desilDiajukan, fotoRumahDepanUrl }` | Membuat permohonan penyesuaian desil DTKS. |
| `POST` | `/api/admin/logout` | Admin Session Cookie | Header Cookie | Menghapus cookie `govhub_admin_session`. |

### 4.2 Next.js Server Actions (`/app/actions/...`)

| Action Function | File Sumber | Role Minimum | Parameter Input | Dampak Keamanan Sistem |
| :--- | :--- | :--- | :--- | :--- |
| `signInAction()` | `auth.ts` | Publik | `{ nik, password }` | Otentikasi identitas dan pembuatan sesi. |
| `signUpAction()` | `auth.ts` | Publik | `{ nik, emailPhone, password, namaLengkap }` | Pendaftaran user baru ke auth & profiles. |
| `requestPasswordResetAction()` | `auth.ts` | Publik | `contact` (email atau NIK) | Pembuatan dan pengiriman OTP reset kata sandi. |
| `verifyPasswordResetOtpAction()`| `auth.ts` | Publik | `{ email, token }` | Validasi kode 6 digit OTP. |
| `updateUserPasswordAction()` | `auth.ts` | Token Reset Valid | `newPassword`, `email` | Mengubah kredensial kata sandi akun warga. |
| `lookupAdminByNipAction()` | `admin.ts` | Publik | `nip` (string) | **Information Disclosure Vector:** Deteksi instansi & data aparatur via NIP. |
| `adminLoginAction()` | `admin.ts` | Publik | `{ nip, password }` | Otentikasi aparatur pemerintah. |
| `getAdminDesilSubmissionsAction()`| `admin.ts` | Admin / Petugas | - | Mengambil seluruh rekaman ajuan desil nasional/daerah. |
| `updateDesilSubmissionStatusAction()`| `admin.ts` | Admin Dinsos | `{ id, status, desilHasil, catatan }` | **Critical Function:** Approval/rejection penetapan status desil warga. |
| `getAdminKtpSubmissionsAction()` | `admin.ts` | Admin Dukcapil | - | Mengambil seluruh rekaman pengajuan KTP. |
| `updateKtpSubmissionStatusAction()` | `admin.ts` | Admin Dukcapil | `{ id, status, catatan }` | **Critical Function:** Approval/rejection cetak KTP-el. |
| `getAdminDataWargaAction()` | `admin.ts` | Admin / Petugas | `{ kecamatan, kota }` | **PII Vector:** Mengambil database kependudukan warga. |
| `getAdminAccountsListAction()` | `admin.ts` | Admin Pusat | - | **PII Vector:** Mengambil seluruh daftar akun aparatur & warga se-Indonesia. |
| `adminUpdateAccountPasswordAction()`| `admin.ts` | Admin Pusat | `{ accountId, newPassword }` | **Critical Function:** Override kata sandi akun pengguna/petugas. |
| `adminDeleteAccountAction()` | `admin.ts` | Admin Pusat | `{ accountId }` | **Critical Function (Destructive):** Menghapus akun pengguna dari sistem secara permanen. |

---

## 5. SKEMA BASIS DATA & KONFIGURASI ROW-LEVEL SECURITY (RLS)

### 5.1 Diagram Entitas Relasi (ERD)

```
       +-----------------------+
       |      auth.users       |
       +-----------------------+
                   | 1:1
                   v
       +-----------------------+              1:N     +---------------------------+
       |    public.profiles    |--------------------->|  public.ktp_submissions   |
       |  (id, nik, role, ...) |                      +---------------------------+
       +-----------------------+                                    | N:1
         | 1:N          | 1:N                                       v
         |              |                             +---------------------------+
         |              +---------------------------->| public.biometric_schedules|
         v                                            +---------------------------+
+---------------------------+
| public.desil_submissions  |
+---------------------------+
```

### 5.2 Evaluasi Kebijakan Row-Level Security (RLS)

1. **Tabel `public.profiles`:**
   * `SELECT`: Warga hanya boleh membaca record miliknya sendiri (`auth.uid() = id`).
   * `UPDATE`: Warga hanya boleh mengubah record miliknya sendiri (`auth.uid() = id`).
   * `STAFF ACCESS`: Aparatur dengan role `admin` atau `petugas` dapat membaca seluruh profil via fungsi `is_staff()`.
   * **Trigger Keamanan (`guard_profile_sensitive_columns`):**
     ```sql
     IF auth.uid() IS NOT NULL AND NOT public.is_staff() THEN
       NEW.role := OLD.role;
       NEW.desil_saat_ini := OLD.desil_saat_ini;
       NEW.nik := OLD.nik;
     END IF;
     ```
     *Mencegah eskalasi hak akses di mana warga mencoba mengubah role menjadi `admin` atau mendongkrak desil mandiri melalui payload UPDATE.*
2. **Tabel `public.password_resets`:**
   * RLS diaktifkan tanpa kebijakan publik (*No anon/authenticated policy*). Hanya dapat diakses melalui `service_role` di backend untuk mencegah pembacaan token OTP oleh pihak luar.
3. **Tabel `public.ktp_submissions` & `public.desil_submissions`:**
   * Warga dibatasi `SELECT` dan `INSERT` hanya jika `auth.uid() = user_id`.
   * Staf kedinasan (`public.is_staff()`) memiliki izin `ALL` untuk verifikasi dan pembaruan status permohonan.

---

## 6. KATALOG SKENARIO UJI PENETRASI (OWASP TOP 10 & API SECURITY)

Panduan pengujian keamanan komprehensif bagi penetration tester:

### 6.1 A01: Broken Object Level Authorization (BOLA / IDOR)
* **Vektor 1 (IDOR pada Riwayat KTP):**
  * *Target:* `GET /api/ktp/submissions` atau manipulasi parameter `id` pengajuan.
  * *Skenario:* Penyerang login sebagai Akun Warga A (`UUID-A`), mengirimkan request modifikasi atau pembacaan berkas pengajuan milik Warga B (`UUID-B`).
  * *Ekspektasi Uji:* Endpoint wajib menolak dengan HTTP `403 Forbidden` atau query PostgreSQL memfilter ketat klausul `WHERE user_id = auth.uid()`.
* **Vektor 2 (IDOR pada Modifikasi Profil):**
  * *Target:* `PUT /api/profile`
  * *Skenario:* Mengirimkan body payload `{ id: "target-user-uuid", nama_lengkap: "Hacked" }`.
  * *Ekspektasi Uji:* Backend tidak boleh mempercayai ID dari request body, melainkan wajib mengekstrak ID secara eksklusif dari sesi token JWT `auth.uid()`.

### 6.2 A02: Broken Function Level Authorization (BFLA & Privilege Escalation)
* **Vektor 1 (Bypass Cookie Sesi Admin):**
  * *Target:* Akses rute `/admin/dashboard`, `/admin/dashboard/pengajuan-desil`, `/admin/dashboard/pengajuan-ktp`.
  * *Skenario:* Penyerang belum melakukan login admin resmi, namun membuat cookie lokal di peramban:
    `document.cookie = "govhub_admin_session=dinsos_pusat; path=/";`
  * *Kerentanan Potensial:* Jika middleware Next.js (`proxy.ts`) hanya memeriksa keberadaan string cookie `govhub_admin_session` tanpa memverifikasi signature kriptografis JWT atau sesi sesi di server, penyerang dapat melewati gerbang middleware.
  * *Remediasi:* Cookie sesi admin wajib berupa signed HTTP-only cookie atau JWT bertanda tangan rahasia (*HMAC-SHA256*), bukan plain-text value.
* **Vektor 2 (Eksekusi Langsung Server Action Admin oleh Warga):**
  * *Target:* Server Action `updateDesilSubmissionStatusAction` di `gov/app/actions/admin.ts`.
  * *Skenario:* Warga biasa yang memiliki sesi token Supabase memanggil RPC Server Action admin secara langsung melalui POST request Next.js Action ID:
    ```json
    { "id": "submission-uuid", "status": "disetujui", "desilHasil": 1 }
    ```
  * *Ekspektasi Uji:* Server action wajib memvalidasi sesi aparatur dan mengonfirmasi role pengguna di database sebelum mengeksekusi mutasi data, bukan mengandalkan proteksi UI halaman semata.

### 6.3 A03: Identity Mismanagement, Fuzzing & Rate Limiting
* **Vektor 1 (Enumerasi Identitas Aparatur via NIP Lookup):**
  * *Target:* Server Action `lookupAdminByNipAction(nip)` pada form `/admin/login`.
  * *Skenario:* Melakukan *fuzzing* deret NIP (format standar NIP PNS: `YYYYMMDDYYYYMMXNNN`) secara otomatis menggunakan Burp Suite Intruder.
  * *Dampak:* Mengembalikan nama lengkap, instansi, dan yurisdiksi aparatur yang valid jika NIP terdaftar. Menjadi sarana *intelligence gathering* bagi penyerang untuk merancang serangan *targeted spear-phishing*.
  * *Remediasi:* Pasang rate limiter ketat (maksimal 5 request per menit per IP) dan *CAPTCHA* pada pencarian NIP.
* **Vektor 2 (Brute-Force Kredensial Mock Aparatur):**
  * *Target:* NIP aparatur pada daftar `KNOWN_ADMINS` (misal: `198905142014021001` s.d. `198905142014021007`).
  * *Skenario:* Menguji login dengan kata sandi default/fallback `admin123`.
  * *Remediasi:* Nonaktifkan kamus kredensial mock di lingkungan *production* (*staging/prod environment flags*).

### 6.4 A04: OTP Manipulation & Session Hijacking
* **Vektor 1 (Brute-Force OTP 6-Digit):**
  * *Target:* `verifyPasswordResetOtpAction(email, token)`
  * *Skenario:* Mengirimkan 1.000.000 kombinasi angka OTP (000000 s.d. 999999).
  * *Ekspektasi Uji:* Sistem harus mengunci token saat counter `attempts` mencapai angka 5, dan menolak semua request lanjutan untuk email bersangkutan selama jendela waktu tertentu (cooldown 15 menit).
* **Vektor 2 (Token Replay Attack):**
  * *Target:* Menggunakan kode OTP atau `reset_token` yang sama lebih dari satu kali setelah password berhasil diubah.
  * *Ekspektasi Uji:* Nilai `used_at` yang terisi harus langsung menganulir validitas token berikutnya.

### 6.5 A05: Insecure File Upload & SSRF (Geotagging & Dokumen)
* **Vektor 1 (Bypass Ekstensi & MIME Type Upload):**
  * *Target:* Unggah Foto Hunian Rumah di `/dashboard/layanan-bansos/ajukan` dan Unggah Dokumen KK di `/dashboard/layanan-ktp/ajukan`.
  * *Skenario:* Mengunggah file payload `exploit.php`, `xss.html`, atau `shell.svg` yang menyematkan script `<script>alert(document.cookie)</script>`.
  * *Remediasi:* Validasi *Magic Bytes* / header file di sisi server, batasi ekstensi hanya ke `.jpg`, `.jpeg`, `.png`, `.pdf`, serta simpan di storage bucket terisolasi tanpa eksekusi script (*Content-Disposition: attachment*).
* **Vektor 2 (SSRF via Parameter URL Foto Rumah / Berkas):**
  * *Target:* Parameter `fotoRumahDepanUrl` pada API `POST /api/bansos/submissions`.
  * *Skenario:* Mengirimkan URL internal:
    `http://169.254.169.254/latest/meta-data/` atau `http://localhost:5432/`
  * *Ekspektasi Uji:* Server tidak boleh melakukan *fetching* langsung ke URL eksternal yang diinputkan pengguna tanpa whitelist domain terpercaya.

### 6.6 A06: Race Condition & Concurrency Vulnerabilities
* **Vektor 1 (Race Condition Kuota Biometrik):**
  * *Target:* Pemilihan slot jadwal biometrik saat sisa kuota tinggal 1 (`kuota_maksimal: 50`, `kuota_terisi: 49`).
  * *Skenario:* Dua pengguna mengirimkan request `POST /api/ktp/submissions` dengan `schedule_id` yang sama pada milidetik yang sama (*Turbo Intruder / concurrent threading*).
  * *Ekspektasi Uji:* Basis data harus menggunakan transaksi atomik (`SELECT FOR UPDATE` atau pengecekan constraint `kuota_terisi <= kuota_maksimal`) agar kuota tidak *oversold*.
* **Vektor 2 (Race Condition Alokasi Stok Blangko KTP):**
  * *Target:* Verifikasi persetujuan KTP saat stok blangko tinggal 1 keping.
  * *Skenario:* Dua petugas menyetujui dua pengajuan berbeda secara bersamaan.
  * *Ekspektasi Uji:* Stok tidak boleh berkurang menjadi angka negatif (`-1`).

---

## 7. CHECKLIST PENGUJIAN PRAKTIS (STEP-BY-STEP TEST CASES)

| Kode Test | Kategori OWASP | Endpoint / Komponen Sasaran | Langkah Pengujian | Expected Secure Output | Vulnerability Indicator |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-SEC-01** | BOLA / IDOR | `PUT /api/profile` | Login sebagai User A, kirim body JSON dengan `id` milik User B. | Profil User B tidak berubah; HTTP 403 / 401. | Profil User B berhasil diubah oleh User A. |
| **TC-SEC-02** | BFLA | `/app/actions/admin.ts: updateDesilSubmissionStatusAction` | Panggil Server Action langsung menggunakan sesi cookie Warga. | Error: "Akses ditolak: Anda bukan aparatur berwenang." | Status pengajuan berubah disetujui tanpa login admin. |
| **TC-SEC-03** | Auth Bypass | Cookie `govhub_admin_session` | Suntikkan cookie `govhub_admin_session=dukcapil_pusat` di browser anonim, buka `/admin/dashboard`. | Di-redirect paksa kembali ke `/admin/login`. | Halaman Admin Dashboard Pusat terbuka tanpa autentikasi NIP. |
| **TC-SEC-04** | Info Leak | `lookupAdminByNipAction(nip)` | Kirimkan iterasi 100 request NIP acak dalam 10 detik. | Request diblokir oleh Rate Limiter (HTTP 429). | Sistem merespons seluruh data nama & jabatan aparatur. |
| **TC-SEC-05** | Brute Force | `verifyPasswordResetOtpAction` | Fuzzing parameter `token` 6-digit sebanyak 50 kali salah berturut-turut. | Token di-invalidate otomatis pada percobaan ke-5. | Pengujian terus berjalan hingga token yang tepat ditemukan. |
| **TC-SEC-06** | File Upload | Form Unggah Hunian Desil | Kirim file bernama `payload.svg` berisi XSS payload di dalam tag XML. | File ditolak: "Tipe file tidak didukung." | File tersimpan dan script berjalan saat petugas membuka modal. |
| **TC-SEC-07** | Parameter Tamper | `PUT /api/profile` | Kirim payload JSON menyertakan atribut `{ "role": "admin", "desil_saat_ini": 1 }`. | Kolom role & desil diabaikan oleh trigger `guard_profile_sensitive_columns`. | Role pengguna di database berubah menjadi admin. |
| **TC-SEC-08** | Concurrency | `POST /api/ktp/submissions` | Tembak 10 request bersamaan untuk 1 slot kuota biometrik yang tersisa. | Tepat 1 request berhasil (201), 9 lainnya gagal (400 Kuota Penuh). | `kuota_terisi` menjadi 51/50 (melebihi batas maksimal). |
| **TC-SEC-09** | XSS Stored | Form Alasan Tolak KTP Admin | Petugas menolak KTP dengan catatan `<script>alert('pwned')</script>`. | Karakter di-escape secara aman sebagai teks literal di dashboard warga. | Dialog pop-up alert XSS muncul di browser warga. |
| **TC-SEC-10** | Session Replay | `/api/admin/logout` | Lakukan logout admin, salin cookie lama, coba akses kembali endpoint `/admin/*`. | Sesi ditolak karena server telah menganulir cookie / redirect login. | Halaman admin masih dapat diakses dengan cookie lama. |

---

## 8. MATRIKS RISIKO & REKOMENDASI MITIGASI KEAMANAN

Berdasarkan arsitektur yang berjalan, berikut prioritas rekomendasi hardening teknis untuk pengembang:

```
[ TINGKAT RISIKO ]
    CRITICAL : Mekanisme Cookie Admin govhub_admin_session berupa Plain Text
    HIGH     : Server Actions Kurang Validasi Sesi Kriptografis Independen
    MEDIUM   : Tidak Adanya Rate Limiter pada Server Action lookupAdminByNip
    MEDIUM   : Pengecekan Ekstensi File Upload Belum Melibatkan Magic Bytes
    LOW      : Masking NIK pada Frontend (nikMasked) Masih Membawa nikFull di Objek JSON
```

### Rekomendasi Hardening Segera:
1. **Migrasi Cookie Sesi Admin ke Signed Session Token:**
   * Ubah mekanisme cookie `govhub_admin_session` yang saat ini bernilai format string biasa (`{instansi}_{tingkat}`) menjadi token JWT yang ditandatangani secara kriptografis menggunakan *Secret Key* server (`jose` atau `iron-session`), atau validasi langsung ke tabel database `public.profiles` pada setiap request rute admin.
2. **Double-Check Otorisasi di Dalam Server Actions:**
   * Jangan hanya mengandalkan pengecekan middleware rute (`proxy.ts`). Setiap fungsi Server Action di `app/actions/admin.ts` (`updateDesilSubmissionStatusAction`, `updateKtpSubmissionStatusAction`, `getAdminDataWargaAction`) wajib memanggil `createClient()`, mengecek `auth.getUser()`, dan memvalidasi `profile.role IN ('admin', 'petugas')` sebelum menjalankan operasi basis data.
3. **Penerapan Masking PII di Sisi Server (Backend Redaction):**
   * Pada `getAdminDataWarga`, jangan kirimkan `nikFull` ke klien jika tidak diperlukan dalam konteks operasional petugas, guna mencegah kebocoran data identitas kependudukan (PII Leakage) melalui *Inspect Element / Network Tab*.
4. **Proteksi Anti-Brute Force:**
   * Pasang rate limiting berbasis IP dan identifier menggunakan Upstash Redis / Cloudflare WAF pada endpoint autentikasi (`/admin/login`, `/auth/login`, dan endpoint reset password OTP).

---
*Dokumen ini disusun sebagai panduan teknis resmi pengujian penetrasi keamanan (Security Assessment & Penetration Testing Guide) sistem GOV-HUB.*

