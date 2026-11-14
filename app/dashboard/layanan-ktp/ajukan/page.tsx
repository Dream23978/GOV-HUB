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
  const user = profileData?.user;

  const fallbackNama =
    profile?.nama_lengkap ||
    user?.user_metadata?.nama_lengkap ||
    user?.user_metadata?.full_name ||
    "Warga";
  const fallbackNik = profile?.nik || user?.user_metadata?.nik || "";
  const fallbackAlamat = profile?.alamat || "";
  const formattedTglLahir = profile?.tanggal_lahir
    ? new Date(profile.tanggal_lahir).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Nilai awal: gunakan data profil asli Supabase
  const initialProfile = {
    nama: fallbackNama,
    nik: fallbackNik,
    tempatTglLahir:
      [profile?.tempat_lahir, formattedTglLahir].filter(Boolean).join(", ") || "",
    jenisKelamin: profile?.jenis_kelamin || "Laki-Laki",
    alamat: fallbackAlamat,
    agama: profile?.agama || "Islam",
    statusPerkawinan: "Belum Menikah",
    pekerjaan: profile?.pekerjaan || "",
    kewarganegaraan: "WNI",
  };

  return (
    <AjukanKtpForm
      initialProfile={initialProfile}
      userId={profileData?.userId}
    />
  );
}
