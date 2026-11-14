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

  const rawNik = profile?.nik || user?.user_metadata?.nik || "";
  const maskedNik =
    rawNik.length >= 6
      ? `${rawNik.slice(0, 3)}*********${rawNik.slice(-3)}`
      : rawNik || "-";

  const fallbackNama =
    profile?.nama_lengkap ||
    user?.user_metadata?.nama_lengkap ||
    user?.user_metadata?.full_name ||
    "Warga";

  const formattedTglLahir = profile?.tanggal_lahir
    ? new Date(profile.tanggal_lahir).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const formatAccountDate = (iso?: string | null, withTime = false) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    if (withTime) {
      return `${d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}, ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
    }
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const initialData = {
    namaLengkap: fallbackNama,
    nik: maskedNik,
    tempatTanggalLahir:
      [profile?.tempat_lahir, formattedTglLahir].filter(Boolean).join(", ") || "-",
    jenisKelamin: profile?.jenis_kelamin || "-",
    alamat: profile?.alamat || "-",
    noTelepon:
      profile?.nomor_telepon ||
      user?.user_metadata?.nomor_telepon ||
      "-",
    email: profile?.email || user?.email || "-",
  };

  return (
    <ProfilContent
      initialData={initialData}
      initialTerdaftarSejak={formatAccountDate(profile?.created_at || user?.created_at)}
      initialTerakhirLogin={formatAccountDate(user?.last_sign_in_at, true)}
    />
  );
}

