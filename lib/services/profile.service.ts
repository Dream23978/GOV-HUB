import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types/database";

/**
 * Service untuk operasi tabel public.profiles di Supabase
 */
export async function getProfileById(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Gagal mengambil profil:", error.message);
    return null;
  }

  return data as Profile | null;
}

/**
 * Mengambil profil berdasarkan nomor NIK 16 digit
 */
export async function getProfileByNik(nik: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("nik", nik)
    .maybeSingle();

  if (error) {
    console.error("Gagal mengambil profil via NIK:", error.message);
    return null;
  }

  return data as Profile | null;
}

/**
 * Menyimpan atau memperbarui profil warga
 */
export async function upsertProfile(
  profileData: Partial<Profile> & { id: string; nik: string; nama_lengkap: string }
): Promise<{ success: boolean; error?: string; data?: Profile }> {
  const supabase = await createClient();

  const payload: Partial<Profile> = {
    ...profileData,
    kota: profileData.kota || "Surabaya",
    provinsi: profileData.provinsi || "Jawa Timur",
    role: profileData.role || "warga",
    desil_saat_ini: profileData.desil_saat_ini ?? 5,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.error("Gagal menyimpan profil:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as Profile };
}
