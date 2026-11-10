-- ========================================================
-- GOV-HUB FULL DATABASE INITIALIZATION
-- ========================================================

-- 1. Pastikan ekstensi UUID aktif
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM Tipe Data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('warga', 'petugas', 'admin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ktp_submission_status') THEN
    CREATE TYPE public.ktp_submission_status AS ENUM ('menunggu_verifikasi', 'diproses', 'selesai', 'ditolak');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'desil_submission_status') THEN
    CREATE TYPE public.desil_submission_status AS ENUM ('menunggu_verifikasi', 'diproses', 'disetujui', 'ditolak');
  END IF;
END$$;

-- 3. TABEL PROFILES (Dibuat terlebih dahulu)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  nik character varying NOT NULL UNIQUE,
  nama_lengkap character varying NOT NULL,
  no_kk character varying,
  tempat_lahir character varying,
  tanggal_lahir date,
  jenis_kelamin character varying,
  alamat text,
  rt character varying,
  rw character varying,
  kelurahan character varying,
  kecamatan character varying,
  kota character varying DEFAULT 'Surabaya'::character varying,
  provinsi character varying DEFAULT 'Jawa Timur'::character varying,
  nomor_telepon character varying,
  role public.user_role NOT NULL DEFAULT 'warga'::public.user_role,
  desil_saat_ini integer DEFAULT 5,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 4. TABEL LAINNYA
CREATE TABLE IF NOT EXISTS public.biometric_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lokasi character varying NOT NULL,
  tanggal date NOT NULL,
  jam_mulai time without time zone NOT NULL,
  jam_selesai time without time zone NOT NULL,
  kuota_maksimal integer NOT NULL DEFAULT 50,
  kuota_terisi integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT biometric_schedules_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.ktp_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nomor_tiket character varying NOT NULL UNIQUE,
  user_id uuid NOT NULL,
  jenis_pengajuan character varying NOT NULL,
  dokumen_kk_url text,
  dokumen_akta_url text,
  surat_kehilangan_url text,
  schedule_id uuid,
  waktu_kehadiran_biometrik timestamp with time zone,
  status public.ktp_submission_status NOT NULL DEFAULT 'menunggu_verifikasi'::public.ktp_submission_status,
  catatan_petugas text,
  petugas_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ktp_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT ktp_submissions_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.biometric_schedules(id) ON DELETE SET NULL,
  CONSTRAINT ktp_submissions_petugas_id_fkey FOREIGN KEY (petugas_id) REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT ktp_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.desil_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nomor_tiket character varying NOT NULL UNIQUE,
  user_id uuid NOT NULL,
  desil_lama integer NOT NULL,
  desil_diajukan integer NOT NULL,
  jumlah_tanggungan integer NOT NULL DEFAULT 0,
  pekerjaan_kepala_keluarga character varying,
  penghasilan_bulanan numeric NOT NULL DEFAULT 0,
  pengeluaran_bulanan numeric NOT NULL DEFAULT 0,
  daya_listrik_va integer,
  sumber_air character varying,
  status_kepemilikan_rumah character varying,
  luas_lantai_m2 integer,
  jenis_lantai character varying,
  jenis_dinding character varying,
  foto_rumah_depan_url text,
  foto_ruang_tengah_url text,
  foto_dapur_url text,
  bukti_slip_gaji_url text,
  bukti_rekening_listrik_url text,
  status public.desil_submission_status NOT NULL DEFAULT 'menunggu_verifikasi'::public.desil_submission_status,
  desil_hasil_peninjauan integer,
  catatan_verifikasi text,
  petugas_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT desil_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT desil_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT desil_submissions_petugas_id_fkey FOREIGN KEY (petugas_id) REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  judul character varying NOT NULL,
  pesan text NOT NULL,
  tipe character varying DEFAULT 'info'::character varying,
  is_read boolean DEFAULT false,
  tautan_aksi text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- ========================================================
-- 5. ROW LEVEL SECURITY (RLS) & POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins and officers can view all profiles" ON public.profiles;
CREATE POLICY "Admins and officers can view all profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'petugas')
  )
);

-- ========================================================
-- 6. TRIGGER OTOMATIS: BUAT PROFIL SAAT USER MENDAFTAR
-- ========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    nik,
    nama_lengkap,
    nomor_telepon,
    role,
    desil_saat_ini,
    kota,
    provinsi,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nik', substring(new.email from '^([0-9]{16})')),
    COALESCE(new.raw_user_meta_data->>'nama_lengkap', new.raw_user_meta_data->>'full_name', 'Warga Baru'),
    new.raw_user_meta_data->>'nomor_telepon',
    'warga'::public.user_role,
    5,
    'Surabaya',
    'Jawa Timur',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    nik = EXCLUDED.nik,
    nama_lengkap = EXCLUDED.nama_lengkap,
    nomor_telepon = EXCLUDED.nomor_telepon,
    updated_at = now();

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();