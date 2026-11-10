# 🏛️ GOV-HUB — Portal Layanan Publik Terpadu

> **"Satu NIK, Satu Akses untuk Berbagai Layanan Publik."**  
> GOV-HUB adalah portal terpadu untuk integrasi layanan administrasi kependudukan (Dukcapil/KTP-el) dan verifikasi kondisi sosial-ekonomi (Bansos & Desil) berbasis identitas NIK.

---

## 📌 Gambaran Proyek

GOV-HUB dirancang untuk memudahkan warga negara dalam mengakses berbagai layanan publik pemerintahan secara efisien tanpa proses pengisian data atau dokumen secara berulang. Proyek ini dibangun menggunakan **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, dan diintegrasikan dengan **Supabase Auth & Database**.

### 🌟 Fitur Utama
- **Autentikasi Berbasis NIK & Kata Sandi**: Alur masuk yang aman menggunakan integrasi Supabase Auth & SSR.
- **Layanan Administrasi Kependudukan (KTP-el)**:
  - Pengajuan pembuatan/pembaruan KTP baru.
  - Penjadwalan sesi perekaman biometrik di kelurahan/kantor dinas terkait.
  - Pelacakan (*tracking*) status pengajuan KTP secara transparan.
- **Layanan Sosial-Ekonomi & Bansos (Desil)**:
  - Verifikasi identitas dan data keluarga.
  - Peninjauan kondisi ekonomi & kelayakan tempat tinggal.
  - Pelacakan status verifikasi desil bantuan sosial.
- **Portal Khusus Petugas & Administrator**:
  - Dashboard analitik dan pemantauan permohonan.
  - Manajemen verifikasi data warga, ketersediaan blangko, serta konfirmasi biometrik.
- **Desain Modern & Responsif**: Dibangun dengan antarmuka bertema instansi publik yang bersih, ramah pengguna, dan responsif di berbagai perangkat.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI & Icons**: [shadcn/ui](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Backend & Auth**: [Supabase](https://supabase.com/) (`@supabase/ssr`, `@supabase/supabase-js`)
- **Theme Support**: `next-themes`

---

## 📁 Struktur Direktori

```text
├── app/
│   ├── auth/                 # Rute autentikasi (login, sign-up, forgot-password, confirm)
│   ├── components/           # Komponen UI spesifik fitur
│   │   ├── home/             # Komponen landing page (HeroSection, GovHubLogo, NikLoginForm, dll.)
│   │   └── login/            # Komponen halaman autentikasi (LoginFormPanel, LoginHero, dll.)
│   ├── protected/            # Halaman khusus setelah login / terautentikasi
│   ├── layout.tsx            # Root layout aplikasi
│   └── page.tsx              # Halaman utama (Landing Page)
├── components/               # Komponen UI reusable (shadcn/ui primitif)
├── lib/                      # Helper & konfigurasi Supabase (client, server, middleware)
├── public/                   # Asset statis & gambar
└── design.md                 # Dokumentasi detail spesifikasi desain sistem & alur aplikasi
```

---

## 🚀 Memulai Pengembangan Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek di lingkungan lokal:

### 1. Prasyarat
- [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru)
- Paket manajer: `npm`, `pnpm`, atau `yarn`
- Proyek [Supabase](https://supabase.com/) aktif

### 2. Kloning Repositori & Instal Dependensi

```bash
git clone <url-repositori-anda>
cd gov
npm install
```

### 3. Konfigurasi Environment Variables

Salin file `.env.example` menjadi `.env.local` (atau `.env`):

```bash
cp .env.example .env.local
```

Buka file `.env.local` dan lengkapi konfigurasi Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-or-publishable-key>
# atau:
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

> Nilai ini dapat ditemukan di dashboard Supabase pada menu **Project Settings** > **API**.

### 4. Jalankan Server Pengembangan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di peramban Anda untuk melihat aplikasi GOV-HUB.

---

## 📜 Skrip yang Tersedia

- `npm run dev`: Menjalankan server pengembangan Next.js.
- `npm run build`: Melakukan build aplikasi untuk lingkungan produksi.
- `npm run start`: Menjalankan aplikasi hasil build produksi.
- `npm run lint`: Memeriksa format dan kesalahan kode dengan ESLint.

---

## 📖 Dokumentasi Lengkap

Untuk rincian lengkap mengenai rancangan arsitektur antarmuka, daftar peran pengguna (*Warga, Admin, Petugas*), struktur formulir, dan aturan sistem, silakan baca [design.md](file:///home/agung/AKU/lomba-to-surabaya-sementara-loginpage/gov2/lomba-to-surabaya-sementara/gov/design.md).
