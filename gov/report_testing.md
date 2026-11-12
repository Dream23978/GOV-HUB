# 🛡️ Laporan Penetration Testing & Remediasi Keamanan GOV-HUB (Putaran 1 & 2)

**Tanggal Pengujian:** 4 November 2026  
**Target Aplikasi:** Portal Layanan Publik GOV-HUB (Next.js 16 + Supabase PostgreSQL)  
**Cakupan (Scope):**
1. Sistem Autentikasi (Login NIK, Registrasi, Lupa Password, OTP, Reset Password, Callback Auth)
2. Next.js Server Actions (`app/actions/*`)
3. REST API Endpoints (`/api/profile`, `/api/ktp/submissions`, `/api/ktp/schedules`)
4. Keamanan Database & Row-Level Security (RLS) Supabase (`public.profiles`, `public.password_resets`, `public.ktp_submissions`, `public.desil_submissions`, `public.notifications`, `public.biometric_schedules`)
5. Validasi Input, Sanitasi Data, & HTTP Security Headers

---

## 1. Ringkasan Eksekutif

Pengujian dilakukan dalam **2 Putaran (Round 1 & Round 2)** menggunakan metode *White-box Code Review* dan *Dynamic Application Security Testing (DAST)* / simulasi eksploitasi langsung terhadap server lokal dan database Supabase live menggunakan akun dummy (seluruh data uji telah dibersihkan kembali).

- **Putaran 1:** Menemukan **12 celah keamanan** (termasuk 3 celah Kritis pada alur reset password dan RLS database). Seluruhnya telah diperbaiki dan diverifikasi di database live.
- **Putaran 2 (Deep Audit):** Menguji ulang perbaikan Putaran 1 di Supabase live serta mengaudit mendalam seluruh endpoint, callback, dan validasi input. Ditemukan dan diperbaiki **5 temuan tambahan** (*Open Redirect*, *Orphan Auth User / NIK Collision*, *Password Hash Exposure di API*, *Bypass Validasi Server-Side*, dan *Stored XSS via Dangerous URI Scheme*).

### Tabel Rekapitulasi Seluruh Temuan (Putaran 1 & 2)

| ID | Putaran | Temuan Kerentanan | Severity | Status Akhir |
| :--- | :---: | :--- | :---: | :---: |
| **VULN-01** | R1 | Account Takeover via Direct Invocation `updateUserPasswordAction` tanpa OTP | 🔴 Kritis | ✅ **Fixed & Verified** |
| **VULN-02** | R1 | Bypass Verifikasi OTP (Fallback menerima sembarang 5 digit angka) | 🔴 Kritis | ✅ **Fixed & Verified** |
| **VULN-03** | R1 | Kebocoran Kode OTP pada JSON Response ke Browser | 🔴 Kritis | ✅ **Fixed & Verified** |
| **VULN-04** | R1 | Tabel `public.password_resets` belum ada di Database Live | 🟠 Tinggi | ✅ **Fixed & Verified Live** |
| **VULN-05** | R1 | Infinite Recursion pada RLS Policy Tabel `public.profiles` | 🟠 Tinggi | ✅ **Fixed & Verified Live** |
| **VULN-06** | R1 | Eskalasi Hak Akses (`role='admin'`, `desil_saat_ini=1`) pada Update Profil | 🟠 Tinggi | ✅ **Fixed & Verified Live** |
| **VULN-07** | R1 | RLS Policy `password_resets` Terbuka untuk Anon (`USING (true)`) | 🟠 Tinggi | ✅ **Fixed & Verified Live** |
| **VULN-08** | R1 | PostgREST Filter Injection pada Query `.or()` Verifikasi OTP | 🟡 Sedang | ✅ **Fixed & Verified** |
| **VULN-09** | R1 | Kebocoran Kode OTP Plaintext pada Server Log Terminal | 🟡 Sedang | ✅ **Fixed & Verified** |
| **VULN-10** | R1 | Tidak Ada Rate Limiting & Brute-Force Protection pada OTP | 🟡 Sedang | ✅ **Fixed (Max 5 Attempts + 60s Cooldown)** |
| **VULN-11** | R1 | Penyimpanan OTP Plaintext di Database & Penggunaan `Math.random()` | 🟡 Sedang | ✅ **Fixed (CSPRNG + SHA-256 Hash)** |
| **VULN-12** | R1 | Unhandled JSON Parse Error (HTTP 500) & Absennya Security Headers | 🟢 Rendah | ✅ **Fixed & Verified** |
| **VULN-13** | **R2** | **Open Redirect pada Endpoint `/auth/confirm?next=...`** | 🟡 Sedang | ✅ **Fixed & Verified** |
| **VULN-14** | **R2** | **Eksposur Kolom `password_hash` pada Respons `GET` & `PUT /api/profile`** | 🟡 Sedang | ✅ **Fixed & Verified** |
| **VULN-15** | **R2** | **Orphan Auth User & Duplikasi Pendaftaran NIK pada `signUpWithNik`** | 🟡 Sedang | ✅ **Fixed & Verified** |
| **VULN-16** | **R2** | **Bypass Validasi Kompleksitas Password & Format NIK di Server Action** | 🟡 Sedang | ✅ **Fixed & Verified** |
| **VULN-17** | **R2** | **Injeksi Skema Berbahaya (`javascript:` / `data:`) pada URL Dokumen KTP** | 🟢 Rendah | ✅ **Fixed & Verified** |

---

## 2. Verifikasi Live Database Putaran 1 (Retest Results)

Setelah skrip SQL remediasi dijalankan di Supabase, pengujian ulang menggunakan script DAST menghasilkan bukti bahwa seluruh tabel dan trigger keamanan sudah aktif:

```text
[1] ANON select password_resets                        -> BLOCKED (permission denied for table password_resets)
[2] ANON select profiles                               -> OK rows=0 (Bebas infinite recursion, data terlindungi RLS)
[3] AUTH user insert notification for OTHER user       -> BLOCKED (new row violates row-level security policy)
[4] AUTH warga insert biometric_schedules              -> BLOCKED (new row violates row-level security policy)
[5] AUTH user insert ktp_submission for OTHER user     -> BLOCKED (new row violates row-level security policy)
[6] Self-escalation attempt (update role='admin', desil=1, nik='0000...')
    -> Hasil di DB: { role: 'warga', desil_saat_ini: 5, nik: '7777666655554444' } (Berhasil ditahan oleh Trigger Guard)
```

---

## 3. Rincian Temuan & Perbaikan Putaran 1 (VULN-01 s/d VULN-12)

### VULN-01: Account Takeover via `updateUserPasswordAction` Tanpa Verifikasi OTP 🔴
* **Lokasi:** `app/actions/auth.ts`, `lib/services/auth.service.ts`
* **Masalah:** Fungsi `updateUserPassword(newPassword, emailFallback)` sebelumnya mempercayai parameter `email` dari client dan langsung memanggil `adminClient.auth.admin.updateUserById()`.
* **Perbaikan:**
  - Mengabaikan parameter `_emailFromClient`.
  - Saat OTP valid di `verifyPasswordResetOtp`, server menerbitkan token kriptografi 32-byte (`crypto.randomBytes(32)`), menyimpan hash SHA-256-nya di kolom `reset_token` pada tabel `password_resets`, dan menaruh token asli di cookie `httpOnly` (`gov_pw_reset`, `sameSite: strict`, `maxAge: 900`).
  - `updateUserPassword` wajib memvalidasi cookie `gov_pw_reset` terhadap database, memastikan `used_at IS NULL`, lalu langsung menghanguskan token setelah dipakai.
* **Bukti Uji Ulang:**
  ```text
  attacker action -> 200 {"success":false,"error":"Sesi reset password tidak valid atau kedaluwarsa. Silakan ulangi dari awal."}
  login with ATTACKER password -> FAIL (Invalid login credentials)
  ```

### VULN-02 & VULN-03: Bypass & Kebocoran OTP 🔴
* **Lokasi:** `lib/services/auth.service.ts`
* **Masalah:** Fallback di `verifyPasswordResetOtp` menerima sembarang 5 digit angka, dan `requestPasswordReset` mengembalikan `otp: otpCode` di JSON response ke client.
* **Perbaikan:** Menghapus fallback 5-digit, menghapus `otp` dari response JSON, menggunakan `crypto.timingSafeEqual` untuk perbandingan hash OTP, dan membatasi maksimal 5 kali percobaan salah (`MAX_OTP_ATTEMPTS = 5`).

### VULN-04 s/d VULN-07: RLS Database & Trigger Proteksi Kolom Sensitif 🟠
* **Lokasi:** `supabase_setup.sql`
* **Perbaikan:**
  - Menambahkan fungsi `public.is_staff()` (`SECURITY DEFINER`) untuk menghilangkan *infinite recursion* pada policy `profiles`.
  - Menambahkan trigger `trg_guard_profile_columns` (`BEFORE UPDATE ON public.profiles`) yang menolak perubahan kolom `role`, `desil_saat_ini`, dan `nik` oleh pengguna non-staff.
  - Mencabut akses `anon` dan `authenticated` ke tabel `public.password_resets` (`REVOKE ALL`).

### VULN-08 s/d VULN-12: Kriptografi OTP, Error Handling API, & Security Headers 🟡/🟢
* **Lokasi:** `lib/services/auth.service.ts`, `app/api/**`, `next.config.ts`
* **Perbaikan:**
  - Mengganti `Math.random()` dengan CSPRNG `crypto.randomInt(10000, 100000)` dan menyimpan hash SHA-256 OTP di database.
  - Menambahkan validasi JSON body pada `POST /api/ktp/submissions` dan `PUT /api/profile` agar mengembalikan `400 Format JSON tidak valid` (bukan `500`).
  - Menambahkan header `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, dan mematikan `X-Powered-By`.

---

## 4. Rincian Temuan & Perbaikan Putaran 2 (VULN-13 s/d VULN-17)

### VULN-13: Open Redirect pada Endpoint `/auth/confirm` 🟡
* **Lokasi:** `app/auth/confirm/route.ts`
* **Deskripsi:** Endpoint mengambil query parameter `next` (`searchParams.get("next") ?? "/"`) lalu memanggil `redirect(next)` tanpa memvalidasi apakah URL tujuan berada di domain internal. Penyerang dapat membuat tautan konfirmasi yang mengarahkan warga ke situs phishing eksternal setelah verifikasi berhasil (misal `/auth/confirm?token_hash=...&type=email&next=https://evil.example.com` atau `//evil.example.com`).
* **Perbaikan yang Diterapkan:**
  Memvalidasi agar `next` wajib berupa relative path internal yang diawali dengan `/` namun bukan protocol-relative `//` atau `/\`:
  ```ts
  const rawNext = searchParams.get("next") ?? "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.startsWith("/\\") ? rawNext : "/";
  ```

---

### VULN-14: Eksposur Kolom `password_hash` pada Respons `/api/profile` 🟡
* **Lokasi:** `app/api/profile/route.ts`
* **Deskripsi:** Endpoint `GET /api/profile` dan `PUT /api/profile` melakukan `.select("*")` pada tabel `public.profiles` dan mengembalikan seluruh objek ke browser, termasuk kolom `password_hash`. Jika terjadi pencurian respons API di sisi client/jaringan, hash password ikut terekspos.
* **Perbaikan yang Diterapkan:**
  - Menambahkan fungsi sanitasi (`sanitizeProfile` / `stripHash`) yang menghapus field `password_hash` sebelum dikirim dalam JSON response `GET` maupun `PUT /api/profile`.
  - Menambahkan validasi tipe data dan batas panjang karakter (`max 500 chars`) pada setiap field yang diizinkan di `PUT /api/profile` untuk mencegah *type confusion* dan *payload bloating*.

---

### VULN-15: Orphan Auth User & Duplikasi NIK saat Registrasi (`signUpWithNik`) 🟡
* **Lokasi:** `lib/services/auth.service.ts` (`signUpWithNik`)
* **Deskripsi:** Ketika seseorang mendaftar menggunakan NIK yang sudah terdaftar milik warga lain tetapi memasukkan alamat email baru, `adminClient.auth.admin.createUser()` terlebih dahulu membuat akun di `auth.users`, lalu gagal saat `upsertProfile` karena constraint `UNIQUE(nik)`. Akibatnya, tercipta akun *orphan* di `auth.users` dan user tetap ter-login tanpa profil yang sah.
* **Perbaikan yang Diterapkan:**
  - Melakukan pengecekan keunikan NIK di tabel `profiles` terlebih dahulu sebelum memanggil `createUser`:
    ```ts
    const { data: existingNik } = await adminClient
      .from("profiles")
      .select("id")
      .eq("nik", cleanNik)
      .maybeSingle();
    if (existingNik) {
      return {
        success: false,
        error: "NIK atau Email ini sudah terdaftar. Silakan gunakan menu Masuk.",
      };
    }
    ```

---

### VULN-16: Bypass Validasi Format NIK & Kekuatan Password di Server Action 🟡
* **Lokasi:** `lib/services/auth.service.ts` (`signUpWithNik`, `updateUserPassword`)
* **Deskripsi:** Validasi bahwa NIK harus 16 digit angka dan password harus minimal 8 karakter (dengan huruf besar, huruf kecil, dan angka) sebelumnya hanya ada di komponen UI (Zod client-side). Jika penyerang memanggil Server Action `signUpAction` atau `updateUserPasswordAction` secara langsung lewat HTTP request, mereka dapat mendaftarkan NIK tidak valid (misal `"abc"`) atau mengatur password pendek (`"1"`).
* **Perbaikan yang Diterapkan:**
  - Menambahkan validasi ketat di sisi server pada `signUpWithNik` (`!/^\d{16}$/.test(cleanNik)` dan `password.length < 8`).
  - Menambahkan validasi kekuatan password di sisi server pada `updateUserPassword` (minimal 8 karakter, wajib memuat huruf besar, huruf kecil, dan angka).

---

### VULN-17: Injeksi Skema URI Berbahaya pada URL Dokumen KTP (`ktp.service.ts`) 🟢
* **Lokasi:** `lib/services/ktp.service.ts` (`createKtpSubmission`)
* **Deskripsi:** Field `dokumenKkUrl`, `dokumenAktaUrl`, dan `suratKehilanganUrl` pada `POST /api/ktp/submissions` menerima string bebas tanpa validasi protokol URL. Penyerang dapat menyisipkan payload `javascript:alert(document.cookie)` sebagai URL dokumen. Ketika petugas/admin kelak mengklik tautan dokumen tersebut di dashboard verifikasi, skrip berbahaya akan dieksekusi di browser petugas (*Stored XSS*).
* **Perbaikan yang Diterapkan:**
  - Menambahkan fungsi `sanitizeOptionalUrl()` menggunakan parser `new URL()` yang hanya mengizinkan protokol `http:` atau `https:` serta membatasi panjang string input. Skema berbahaya seperti `javascript:` atau `data:` otomatis ditolak menjadi `null`.
  - Membatasi panjang `nomor_tiket` (maks 40 karakter) dan `jenis_pengajuan` (maks 100 karakter).

---

## 5. Kelengkapan Skema RLS di `supabase_setup.sql`

File `supabase_setup.sql` juga telah dilengkapi dengan definisi eksplisit kebijakan RLS untuk seluruh tabel pendukung (`desil_submissions`, `notifications`, dan `biometric_schedules`) agar dokumentasi DDL 100% sinkron dengan konfigurasi di database live.
