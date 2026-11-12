import { AjukanKtpForm } from "@/app/components/layanan-ktp/AjukanKtpForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Ajukan KTP Baru | GOV-HUB",
  description: "Pengajuan KTP Elektronil tanpa fotokopi berkas.",
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

export default async function AjukanKtpPage() {
  const profileData = await getProfileData();
  const profile = profileData?.profile;

  // Nilai awal: gunakan data profil Supabase jika ada, atau fallback ke data desain screenshot
  const initialProfile = {
    nama: profile?.nama_lengkap || "Ferdian Iswara",
    nik: profile?.nik || "6105438987667002",
    tempatTglLahir:
      profile?.tempat_lahir && profile?.tanggal_lahir
        ? `${profile.tempat_lahir}, ${profile.tanggal_lahir}`
        : "Singkawang, 12 Juni 2004",
    jenisKelamin: profile?.jenis_kelamin || "Laki-Laki",
    alamat:
      profile?.alamat ||
      "Jl. Tj. Raya II Gg. Karya 1,\nSaigon, Kec. Pontianak\nTim., Kota Pontianak.",
    agama: "Islam",
    statusPerkawinan: "Belum Menikah",
    pekerjaan: "Wirasuasta",
    kewarganegaraan: "WNI",
  };

  return (
    <AjukanKtpForm
      initialProfile={initialProfile}
      userId={profileData?.userId}
    />
  );
}
