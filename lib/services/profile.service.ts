import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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
 * Mencari profil berdasarkan NIK, Email, atau Nomor Telepon
 * Memastikan sistem dapat mendeteksi akun dan NIK pemiliknya secara akurat
 */
export async function findProfileByIdentifier(
  identifier: string
): Promise<{ profile: Profile | null; matchedNik: string | null; matchedEmail: string | null }> {
  const supabase = await createClient();
  const clean = identifier.trim();

  // 1. Cek jika identifier adalah 16 digit NIK
  if (/^\d{16}$/.test(clean)) {
    const profile = await getProfileByNik(clean);
    if (profile) {
      return {
        profile,
        matchedNik: profile.nik,
        matchedEmail: profile.email || null,
      };
    }
  }

  // 2. Cek berdasarkan Email di tabel profiles
  if (clean.includes("@")) {
    const { data: profileByEmail } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", clean)
      .maybeSingle();

    if (profileByEmail) {
      return {
        profile: profileByEmail as Profile,
        matchedNik: profileByEmail.nik,
        matchedEmail: profileByEmail.email,
      };
    }
  }

  // 3. Cek berdasarkan Nomor Telepon di tabel profiles
  const { data: profileByPhone } = await supabase
    .from("profiles")
    .select("*")
    .eq("nomor_telepon", clean)
    .maybeSingle();

  if (profileByPhone) {
    return {
      profile: profileByPhone as Profile,
      matchedNik: profileByPhone.nik,
      matchedEmail: profileByPhone.email || null,
    };
  }

  // 4. Fallback: Cari di auth.users user_metadata melalui Admin Client jika tersedia
  const adminClient = createAdminClient();
  if (adminClient) {
    const { data: usersData } = await adminClient.auth.admin.listUsers();
    if (usersData?.users) {
      const foundUser = usersData.users.find(
        (u) =>
          u.user_metadata?.nik === clean ||
          u.user_metadata?.email_kontak === clean ||
          u.user_metadata?.nomor_telepon === clean ||
          u.email === clean
      );

      if (foundUser) {
        const userNik = foundUser.user_metadata?.nik || foundUser.email?.replace("@govhub.id", "");
        let profile = null;
        if (userNik) {
          profile = await getProfileByNik(userNik);
        }

        return {
          profile,
          matchedNik: userNik || null,
          matchedEmail: foundUser.user_metadata?.email_kontak || foundUser.email || null,
        };
      }
    }
  }

  return {
    profile: null,
    matchedNik: null,
    matchedEmail: null,
  };
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
