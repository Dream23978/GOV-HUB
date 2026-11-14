-- ========================================================
-- GOV-HUB FULL DATABASE INITIALIZATION & MIGRATION
-- ========================================================

-- 1. Ekstensi UUID & Kriptografi
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

-- 3. TABEL PROFILES (dengan kolom email & password_hash)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  nik character varying NOT NULL UNIQUE,
  nama_lengkap character varying NOT NULL,
  email character varying,
  password_hash text,
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

-- Pastikan kolom email & password_hash ditambahkan jika tabel profiles sudah ada sebelumnya
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email character varying;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash text;

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

CREATE TABLE IF NOT EXISTS public.password_resets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  identifier character varying NOT NULL,
  token character varying NOT NULL,
  reset_token character varying,
  attempts integer NOT NULL DEFAULT 0,
  used_at timestamp with time zone,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT password_resets_pkey PRIMARY KEY (id)
);

-- ========================================================
-- 5. ROW LEVEL SECURITY (RLS) & POLICIES
-- ========================================================

-- Helper SECURITY DEFINER untuk mengecek role tanpa memicu infinite recursion di RLS profiles
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'petugas')
  );
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ktp_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desil_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins and officers can view all profiles" ON public.profiles;
CREATE POLICY "Admins and officers can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_staff());

-- Cegah warga biasa menaikkan role, mengubah desil, atau mengganti NIK miliknya sendiri
CREATE OR REPLACE FUNCTION public.guard_profile_sensitive_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_staff() THEN
    NEW.role := OLD.role;
    NEW.desil_saat_ini := OLD.desil_saat_ini;
    NEW.nik := OLD.nik;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_profile_columns ON public.profiles;
CREATE TRIGGER trg_guard_profile_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_sensitive_columns();

-- password_resets: hanya boleh diakses oleh service_role di backend (tanpa policy anon/authenticated)
DROP POLICY IF EXISTS "Allow anon insert and select password resets" ON public.password_resets;

-- Kebijakan RLS untuk ktp_submissions
DROP POLICY IF EXISTS "Users can view own ktp submissions" ON public.ktp_submissions;
CREATE POLICY "Users can view own ktp submissions"
ON public.ktp_submissions FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ktp submissions" ON public.ktp_submissions;
CREATE POLICY "Users can insert own ktp submissions"
ON public.ktp_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins and officers can manage all ktp submissions" ON public.ktp_submissions;
CREATE POLICY "Admins and officers can manage all ktp submissions"
ON public.ktp_submissions FOR ALL
USING (public.is_staff());

-- Kebijakan RLS untuk desil_submissions
DROP POLICY IF EXISTS "Users can view own desil submissions" ON public.desil_submissions;
CREATE POLICY "Users can view own desil submissions"
ON public.desil_submissions FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own desil submissions" ON public.desil_submissions;
CREATE POLICY "Users can insert own desil submissions"
ON public.desil_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins and officers can manage all desil submissions" ON public.desil_submissions;
CREATE POLICY "Admins and officers can manage all desil submissions"
ON public.desil_submissions FOR ALL
USING (public.is_staff());

-- Kebijakan RLS untuk notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins and officers can manage all notifications" ON public.notifications;
CREATE POLICY "Admins and officers can manage all notifications"
ON public.notifications FOR ALL
USING (public.is_staff());

-- Kebijakan RLS untuk biometric_schedules
DROP POLICY IF EXISTS "Anyone can view active biometric schedules" ON public.biometric_schedules;
CREATE POLICY "Anyone can view active biometric schedules"
ON public.biometric_schedules FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins and officers can manage biometric schedules" ON public.biometric_schedules;
CREATE POLICY "Admins and officers can manage biometric schedules"
ON public.biometric_schedules FOR ALL
USING (public.is_staff());

-- Kebijakan RLS untuk ktp_submissions
ALTER TABLE public.ktp_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ktp submissions" ON public.ktp_submissions;
CREATE POLICY "Users can view own ktp submissions"
ON public.ktp_submissions FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ktp submissions" ON public.ktp_submissions;
CREATE POLICY "Users can insert own ktp submissions"
ON public.ktp_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins and officers can manage all ktp submissions" ON public.ktp_submissions;
CREATE POLICY "Admins and officers can manage all ktp submissions"
ON public.ktp_submissions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'petugas')
  )
);

-- Izin Skema Publik
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
REVOKE ALL ON public.password_resets FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- ========================================================
-- 6. TRIGGER OTOMATIS: SINKRONISASI PROFIL, EMAIL, & PASSWORD HASH
-- ========================================================

CREATE OR REPLACE FUNCTION public.handle_user_sync()
RETURNS trigger AS $$
BEGIN
  -- Insert atau perbarui data profil saat user baru terdaftar atau diupdate
  INSERT INTO public.profiles (
    id,
    nik,
    nama_lengkap,
    email,
    password_hash,
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
    COALESCE(new.raw_user_meta_data->>'email_kontak', new.email),
    new.encrypted_password, -- Password hash terenkripsi dari auth.users
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
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    nomor_telepon = EXCLUDED.nomor_telepon,
    updated_at = now();

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger saat user baru dibuat di auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_sync();

-- Trigger saat password user diubah di auth.users
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF encrypted_password, raw_user_meta_data, email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_sync();
