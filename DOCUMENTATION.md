# DOKUMENTASI TEKNIS BACKEND & DATABASE GOV-HUB

Dokumentasi ini mencakup seluruh implementasi arsitektur Backend, integrasi Layanan Autentikasi Supabase, sinkronisasi data kependudukan (NIK), pengiriman kode OTP melalui Resend API, serta pemulihan kata sandi (Forgot & Reset Password) pada portal layanan publik **GOV-HUB**.

---

## 1. Arsitektur Autentikasi & Database

Sistem autentikasi GOV-HUB memadukan **Supabase Auth** (`auth.users`) dengan data profil kependudukan daerah (`public.profiles`).

### A. Alur Pemetaan NIK ke Akun Supabase
1. **Input Pengguna:** Warga melakukan login menggunakan **16-digit NIK** dan kata sandi.
2. **Resolusi Identitas:**
   - Server memeriksa tabel `public.profiles` untuk mencocokkan `nik` dengan `email` asli warga.
   - Apabila tabel profiles belum dapat dibaca (kendala permission/RLS), server menggunakan **Admin Client** (`SUPABASE_SERVICE_ROLE_KEY`) untuk mencari metadata user (`user_metadata.nik`).
   - Terdapat fallback otomatis untuk akun legacy dengan format `{nik}@govhub.id` dan `{nik}@local`.
3. **Penyimpanan Kredensial:**
   - `auth.users`: Menyimpan kredensial auth resmi Supabase (`id`, `email`, password terenkripsi bcrypt).
   - `public.profiles`: Menyimpan metadata warga (`nik`, `nama_lengkap`, `role`, `desil_saat_ini`, `email`, `password_hash` berformat SHA-256).

---

## 2. Struktur Schema Database (`supabase_setup.sql`)

Tabel dan relasi utama yang dikonfigurasi:

```sql
-- 1. Tabel Profil Kependudukan
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nik VARCHAR(16) UNIQUE NOT NULL,
  nama_lengkap VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  password_hash TEXT,
  role public.user_role DEFAULT 'warga',
  desil_saat_ini INTEGER CHECK (desil_saat_ini BETWEEN 1 AND 10),
  pekerjaan VARCHAR(100),
  penghasilan_bulanan NUMERIC,
  jumlah_tanggungan INTEGER DEFAULT 0,
  alamat_ktp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel OTP Reset Password
CREATE TABLE IF NOT EXISTS public.password_resets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(10) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Izin Akses Schema (Grant Privileges)
Untuk mencegah error `permission denied for schema public` saat query di Next.js:
```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
```

---

## 3. Alur Layanan (Services & Actions)

### A. Registrasi Akun Warga (`signUpWithNik`)
- **File:** `lib/services/auth.service.ts` & `app/actions/auth.ts`
- Menerima NIK, Email/No. HP, Password, dan Nama Lengkap.
- Mendaftarkan user ke `supabase.auth.signUp()` menggunakan email asli dan metadata NIK.
- Menyimpan entri profil ke `public.profiles` dengan hashing SHA-256 (`hashPassword`).

### B. Login Warga (`signInWithNik`)
- **File:** `lib/services/auth.service.ts` & `app/actions/auth.ts`
- Menerima NIK (16 digit) dan Password.
- Mencari email resmi yang terdaftar via `profiles` atau fallback metadata admin.
- Menjalankan `supabase.auth.signInWithPassword()` dengan email yang ditemukan.

### C. Lupa Password & Verifikasi OTP (`requestPasswordResetAction` & `verifyPasswordResetOtpAction`)
- **File:** `lib/services/email.service.ts` & `lib/services/auth.service.ts`
- Menerima email atau NIK warga.
- Menghasilkan **kode OTP 5 digit acak** dengan masa berlaku **15 menit**.
- Menyimpan record OTP di tabel `public.password_resets`.
- Mengirimkan email OTP resmi ke inbox user menggunakan **Resend API** (`POST https://api.resend.com/emails`).
- Verifikasi kode dilakukan di server via `verifyPasswordResetOtpAction`.

### D. Penetapan Kata Sandi Baru (`updateUserPasswordAction`)
- **File:** `lib/services/auth.service.ts` & `app/actions/auth.ts`
- Memperbarui kata sandi di `auth.users` menggunakan **Supabase Admin Client** (`auth.admin.updateUserById`).
- Memperbarui kolom `password_hash` di tabel `public.profiles`.

---

## 4. Konfigurasi Lingkungan (`.env.local`)

Variabel environment yang wajib dikonfigurasi:

```env
# Supabase Project URL & Anon/Publishable Key
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Supabase Service Role Key (Wajib format JWT Legacy: eyJhbGciOiJIUzI1NiIsIn...)
# Diambil dari: Dashboard > Project Settings > API > Legacy anon, service_role API keys
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend API Key untuk pengiriman email OTP sungguhan
RESEND_API_KEY=re_...
```

> **Catatan Penting `SUPABASE_SERVICE_ROLE_KEY`:**  
> Jangan gunakan format `sb_secret_...` atau `sb_service_role_...` jika library `@supabase/supabase-js` belum mendukungnya. Gunakan kunci dari tab **Legacy anon, service_role API keys** yang diawali dengan `eyJhbGci...`.

---

## 5. Ringkasan Masalah & Solusi yang Dipecahkan

| Kendala / Error | Penyebab | Solusi yang Diterapkan |
| :--- | :--- | :--- |
| `over_email_send_rate_limit` (429) | Supabase Auth membatasi kuota pengiriman email default (3 email/jam). | Mengalihkan pengiriman OTP menggunakan **Resend API** dengan HTML email resmi. |
| `permission denied for schema public` | Schema PostgreSQL `public` belum memiliki grant akses untuk role Supabase. | Menambahkan perintah `GRANT USAGE ON SCHEMA public` dan `GRANT ALL ON ALL TABLES`. |
| `@supabase/supabase-js: Unrecognized Supabase API key format` | Menggunakan format API key baru yang bukan JWT di `SUPABASE_SERVICE_ROLE_KEY`. | Mengambil JWT secret key asli dari tab **Legacy anon, service_role API keys**. |
| `Akun pengguna tidak ditemukan untuk memperbarui kata sandi` | Admin API Supabase gagal memanggil `listUsers` karena Service Role Key 401 Unauthorized. | Memperbaiki Service Role Key dan menambahkan fallback pencocokan ID user. |
| POST `.../auth/v1/verify` 403 Forbidden | Browser memanggil langsung verifikasi OTP ke Supabase Auth padahal OTP dikelola sistem lokal. | Menghapus pemanggilan client-side redundant; verifikasi sepenuhnya di Server Action. |
| Login NIK gagal setelah reset password | Sistem gagal mencocokkan email asli dari NIK akibat query schema terhambat. | Menambahkan fallback otomatis pencarian NIK via metadata Supabase Admin API. |

---

## 6. Struktur File yang Terkait

```text
├── app/
│   ├── actions/
│   │   └── auth.ts                      # Server Actions Next.js (Login, Register, Reset, Verify)
│   ├── auth/
│   │   ├── login/page.tsx               # Halaman Login NIK & Password
│   │   ├── sign-up/page.tsx             # Halaman Registrasi Warga
│   │   └── forgot-password/
│   │       ├── page.tsx                 # Input Email/NIK Lupa Password
│   │       ├── verify/page.tsx          # Input OTP 5 Digit
│   │       └── reset/page.tsx           # Input Kata Sandi Baru
│   └── components/
│       ├── login/LoginFormPanel.tsx     # Form Login (Slicing frontend utuh)
│       └── sign-up/SignUpFormPanel.tsx  # Form SignUp (Slicing frontend utuh)
├── lib/
│   ├── services/
│   │   ├── auth.service.ts              # Logika autentikasi & NIK mapping
│   │   ├── profile.service.ts           # CRUD tabel public.profiles
│   │   └── email.service.ts             # Integrasi pengiriman email via Resend
│   └── supabase/
│       ├── client.ts                    # Supabase Browser Client
│       ├── server.ts                    # Supabase Server Client (Cookies)
│       ├── admin.ts                     # Supabase Admin Client (Service Role)
│       └── proxy.ts                     # Middleware autentikasi & proteksi route
├── supabase_setup.sql                   # Skrip DDL schema PostgreSQL & RLS
└── DOCUMENTATION.md                     # Dokumen arsitektur backend
```
