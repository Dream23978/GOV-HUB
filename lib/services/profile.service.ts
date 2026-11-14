import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Profile } from "@/types/database";

const SAFE_PROFILE_COLUMNS =
  "id, nik, nama_lengkap, no_kk, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, rt, rw, kelurahan, kecamatan, kota, provinsi, nomor_telepon, email, agama, pekerjaan, jumlah_tanggungan, penghasilan_bulanan, role, instansi, tingkat, desil_saat_ini, created_at, updated_at";

/**
 * Mengambil profil aman berdasarkan user ID (tanpa password_hash)
 */
export async function getProfileById(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(SAFE_PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data as Profile | null;
}

/**
 * Mengambil profil aman berdasarkan nomor NIK 16 digit (via client terautentikasi)
 */
export async function getProfileByNik(nik: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(SAFE_PROFILE_COLUMNS)
    .eq("nik", nik)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data as Profile | null;
}

/**
 * Mencari profil berdasarkan NIK, Email, atau Nomor Telepon menggunakan indexed DB query (server-only)
 */
export async function findProfileByIdentifier(
  identifier: string
): Promise<{ profile: Profile | null; matchedNik: string | null; matchedEmail: string | null }> {
  const clean = identifier.trim();
  if (!clean) {
    return { profile: null, matchedNik: null, matchedEmail: null };
  }

  const db = createAdminClient() || (await createClient());

  if (/^\d{16}$/.test(clean)) {
    const { data } = await db
      .from("profiles")
      .select(SAFE_PROFILE_COLUMNS)
      .eq("nik", clean)
      .maybeSingle();

    if (data) {
      const p = data as Profile;
      return { profile: p, matchedNik: p.nik, matchedEmail: p.email || null };
    }
  }

  if (clean.includes("@")) {
    const { data } = await db
      .from("profiles")
      .select(SAFE_PROFILE_COLUMNS)
      .ilike("email", clean)
      .maybeSingle();

    if (data) {
      const p = data as Profile;
      return { profile: p, matchedNik: p.nik, matchedEmail: p.email || null };
    }
  }

  const { data: byPhone } = await db
    .from("profiles")
    .select(SAFE_PROFILE_COLUMNS)
    .eq("nomor_telepon", clean)
    .maybeSingle();

  if (byPhone) {
    const p = byPhone as Profile;
    return { profile: p, matchedNik: p.nik, matchedEmail: p.email || null };
  }

  return { profile: null, matchedNik: null, matchedEmail: null };
}

/**
 * Menyimpan atau memperbarui profil warga (selalu memaksa role 'warga')
 */
export async function upsertProfile(
  profileData: Partial<Profile> & { id: string; nik: string; nama_lengkap: string }
): Promise<{ success: boolean; error?: string; data?: Profile }> {
  const supabase = await createClient();

  const safeData = { ...profileData };
  delete safeData.role;
  delete safeData.desil_saat_ini;
  delete safeData.instansi;
  delete safeData.tingkat;
  delete safeData.password_hash;

  const payload = {
    ...safeData,
    kota: safeData.kota || "Surabaya",
    provinsi: safeData.provinsi || "Jawa Timur",
    role: "warga" as const,
    desil_saat_ini: 5,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select(SAFE_PROFILE_COLUMNS)
    .single();

  if (error) {
    return { success: false, error: "Gagal menyimpan profil warga." };
  }

  return { success: true, data: data as Profile };
}
