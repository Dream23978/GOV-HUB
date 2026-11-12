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

  // Mask NIK if available: e.g. 610*********002
  const rawNik = profile?.nik || "6105438987667002";
  const maskedNik =
    rawNik.length >= 6
      ? `${rawNik.slice(0, 3)}*********${rawNik.slice(-3)}`
      : "610*********002";

  const initialData = {
    namaLengkap: profile?.nama_lengkap || "Hapis Khairullah",
    nik: maskedNik,
    tempatTanggalLahir:
      profile?.tempat_lahir && profile?.tanggal_lahir
        ? `${profile.tempat_lahir}, ${profile.tanggal_lahir}`
        : "Pontianak, 06 Mei 2026",
    jenisKelamin: profile?.jenis_kelamin || "Laki - Laki",
    alamat: profile?.alamat || "Jl. Merdeka No. 12, Pontianak",
    noTelepon: profile?.no_hp || profile?.phone || "0812334561579",
    email: profileData?.user?.email || "hapisramatullah@gmail.com",
  };

  return <ProfilContent initialData={initialData} />;
}

