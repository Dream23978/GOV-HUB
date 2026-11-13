import { ProfilContent } from "@/app/components/profil/ProfilContent";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Profil Saya | GOV-HUB",
  description: "Kelola informasi akun dan data dari Anda.",
};

async function getProfileData() {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .maybeSingle();

    return {
      userId: authData.user.id,
      profile,
      user: authData.user,
    };
  } catch {
    return null;
  }
}

export default async function ProfilPage() {
  const profileData = await getProfileData();
  const profile = profileData?.profile;
  const user = profileData?.user;

  // Mask NIK if available: e.g. 357*********002
  const rawNik = profile?.nik || user?.user_metadata?.nik || "3578012304950002";
  const maskedNik =
    rawNik.length >= 6
      ? `${rawNik.slice(0, 3)}*********${rawNik.slice(-3)}`
      : "357*********002";

  const fallbackNama =
    profile?.nama_lengkap ||
    user?.user_metadata?.nama_lengkap ||
    user?.user_metadata?.full_name ||
    "Warga";

  const initialData = {
    namaLengkap: fallbackNama,
    nik: maskedNik,
    tempatTanggalLahir:
      profile?.tempat_lahir && profile?.tanggal_lahir
        ? `${profile.tempat_lahir}, ${profile.tanggal_lahir}`
        : "Surabaya, 12 Juni 2000",
    jenisKelamin: profile?.jenis_kelamin || "Laki - Laki",
    alamat: profile?.alamat || "Jl. Basuki Rahmat No. 10, Surabaya",
    noTelepon:
      profile?.nomor_telepon ||
      user?.user_metadata?.nomor_telepon ||
      "081234567890",
    email: profile?.email || user?.email || "warga@govhub.id",
  };

  return <ProfilContent initialData={initialData} />;
}

