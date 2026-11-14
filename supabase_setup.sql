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
    CREATE TYPE public.ktp_submission_status AS ENUM ('menunggu_verifikasi', 'diproses', 'menunggu_cetak', 'selesai', 'ditolak', 'pengajuan_ulang');
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
  kota character varying DEFAULT 'Pontianak'::character varying,
  provinsi character varying DEFAULT 'Kalimantan Barat'::character varying,
  nomor_telepon character varying,
  agama character varying,
  pekerjaan character varying,
  jumlah_tanggungan integer DEFAULT 0,
  penghasilan_bulanan numeric DEFAULT 0,
  instansi character varying,
  tingkat character varying,
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
  completed_at timestamp with time zone,
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

-- Helper SECURITY DEFINER di skema privat (tidak diekspos via PostgREST)
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'petugas')
  );
$$;

REVOKE ALL ON FUNCTION private.is_staff() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.is_staff() TO authenticated, service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ktp_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desil_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Admins and officers can view all profiles" ON public.profiles;
CREATE POLICY "Admins and officers can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING ((SELECT private.is_staff()));

-- Cegah warga biasa menaikkan role/instansi/tingkat, mengubah desil, atau mengganti NIK
CREATE OR REPLACE FUNCTION public.guard_profile_sensitive_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF (SELECT auth.uid()) IS NOT NULL AND NOT (SELECT private.is_staff()) THEN
    IF TG_OP = 'INSERT' THEN
      NEW.role := 'warga'::public.user_role;
      NEW.desil_saat_ini := 5;
      NEW.instansi := NULL;
      NEW.tingkat := NULL;
    ELSE
      NEW.role := OLD.role;
      NEW.desil_saat_ini := OLD.desil_saat_ini;
      NEW.nik := OLD.nik;
      NEW.instansi := OLD.instansi;
      NEW.tingkat := OLD.tingkat;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.guard_profile_sensitive_columns() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_guard_profile_columns ON public.profiles;
CREATE TRIGGER trg_guard_profile_columns
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_sensitive_columns();

CREATE OR REPLACE FUNCTION public.set_ktp_completed_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.status = 'selesai'::public.ktp_submission_status AND NEW.completed_at IS NULL THEN
    NEW.completed_at := now();
  ELSIF NEW.status <> 'selesai'::public.ktp_submission_status THEN
    NEW.completed_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_ktp_completed_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_set_ktp_completed_at ON public.ktp_submissions;
CREATE TRIGGER trg_set_ktp_completed_at
  BEFORE INSERT OR UPDATE ON public.ktp_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_ktp_completed_at();

CREATE OR REPLACE FUNCTION public.guard_notification_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF (SELECT auth.uid()) IS NOT NULL AND NOT (SELECT private.is_staff()) THEN
    NEW.user_id := OLD.user_id;
    NEW.judul := OLD.judul;
    NEW.pesan := OLD.pesan;
    NEW.tipe := OLD.tipe;
    NEW.tautan_aksi := OLD.tautan_aksi;
    NEW.created_at := OLD.created_at;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.guard_notification_update() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_guard_notification_update ON public.notifications;
CREATE TRIGGER trg_guard_notification_update
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.guard_notification_update();

-- Kebijakan RLS ktp_submissions
DROP POLICY IF EXISTS "Users can view own ktp submissions" ON public.ktp_submissions;
CREATE POLICY "Users can view own ktp submissions"
ON public.ktp_submissions FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own ktp submissions" ON public.ktp_submissions;
CREATE POLICY "Users can insert own ktp submissions"
ON public.ktp_submissions FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id AND status = 'menunggu_verifikasi'::public.ktp_submission_status);

DROP POLICY IF EXISTS "Admins and officers can manage all ktp submissions" ON public.ktp_submissions;
CREATE POLICY "Admins and officers can manage all ktp submissions"
ON public.ktp_submissions FOR ALL TO authenticated
USING ((SELECT private.is_staff()));

-- Kebijakan RLS desil_submissions
DROP POLICY IF EXISTS "Users can view own desil submissions" ON public.desil_submissions;
CREATE POLICY "Users can view own desil submissions"
ON public.desil_submissions FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own desil submissions" ON public.desil_submissions;
CREATE POLICY "Users can insert own desil submissions"
ON public.desil_submissions FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id AND status = 'menunggu_verifikasi'::public.desil_submission_status);

DROP POLICY IF EXISTS "Admins and officers can manage all desil submissions" ON public.desil_submissions;
CREATE POLICY "Admins and officers can manage all desil submissions"
ON public.desil_submissions FOR ALL TO authenticated
USING ((SELECT private.is_staff()));

-- Kebijakan RLS notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins and officers can manage all notifications" ON public.notifications;
CREATE POLICY "Admins and officers can manage all notifications"
ON public.notifications FOR ALL TO authenticated
USING ((SELECT private.is_staff()));

-- Kebijakan RLS biometric_schedules
DROP POLICY IF EXISTS "Anyone can view active biometric schedules" ON public.biometric_schedules;
CREATE POLICY "Anyone can view active biometric schedules"
ON public.biometric_schedules FOR SELECT TO authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Admins and officers can manage biometric schedules" ON public.biometric_schedules;
CREATE POLICY "Admins and officers can manage biometric schedules"
ON public.biometric_schedules FOR ALL TO authenticated
USING ((SELECT private.is_staff()));

-- RPC Atomik Jadwal Biometrik & OTP
CREATE OR REPLACE FUNCTION public.book_biometric_schedule(p_schedule_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_updated integer;
BEGIN
  UPDATE public.biometric_schedules
  SET kuota_terisi = kuota_terisi + 1
  WHERE id = p_schedule_id
    AND is_active = true
    AND kuota_terisi < kuota_maksimal;
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;

CREATE OR REPLACE FUNCTION public.release_biometric_schedule(p_schedule_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.biometric_schedules
  SET kuota_terisi = GREATEST(0, kuota_terisi - 1)
  WHERE id = p_schedule_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_otp_attempt(p_reset_id uuid, p_max_attempts integer DEFAULT 5)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_attempts integer;
BEGIN
  UPDATE public.password_resets
  SET attempts = attempts + 1
  WHERE id = p_reset_id
    AND used_at IS NULL
    AND attempts < p_max_attempts
  RETURNING attempts INTO v_attempts;
  RETURN v_attempts;
END;
$$;

REVOKE ALL ON FUNCTION public.book_biometric_schedule(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.release_biometric_schedule(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_otp_attempt(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.book_biometric_schedule(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_biometric_schedule(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_otp_attempt(uuid, integer) TO service_role;

-- Bucket Penyimpanan Privat Dokumen & Foto
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'govhub-documents',
  'govhub-documents',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

-- Indeks Lookup & Foreign Keys
CREATE INDEX IF NOT EXISTS idx_profiles_nik ON public.profiles(nik);
CREATE INDEX IF NOT EXISTS idx_profiles_email_lower ON public.profiles(lower(email));
CREATE INDEX IF NOT EXISTS idx_ktp_submissions_user_created ON public.ktp_submissions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ktp_submissions_schedule_id ON public.ktp_submissions(schedule_id);
CREATE INDEX IF NOT EXISTS idx_desil_submissions_user_created ON public.desil_submissions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_password_resets_identifier ON public.password_resets(identifier, created_at DESC);

-- Pembatasan Izin Prinsip Hak Akses Minimal
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON public.password_resets FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.password_resets TO service_role;

-- ========================================================
-- 6. TRIGGER OTOMATIS: SINKRONISASI PROFIL WARGA BARU
-- ========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, nik, nama_lengkap, email, nomor_telepon, role, desil_saat_ini, kota, provinsi, created_at, updated_at
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nik', substring(new.email from '^([0-9]{16})')),
    COALESCE(new.raw_user_meta_data->>'nama_lengkap', new.raw_user_meta_data->>'full_name', 'Warga Baru'),
    COALESCE(new.raw_user_meta_data->>'email_kontak', new.email),
    new.raw_user_meta_data->>'nomor_telepon',
    'warga'::public.user_role,
    5,
    'Pontianak',
    'Kalimantan Barat',
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
