import { ProfilContent } from "@/app/components/profil/ProfilContent";
import { createClient } from "@/lib/supabase/server";
import { maskNik } from "@/lib/format";

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

  let initialAvatarUrl = "";
  const rawAvatarPath = user?.user_metadata?.avatar_url;
  if (typeof rawAvatarPath === "string" && rawAvatarPath.trim()) {
    if (rawAvatarPath.startsWith("https://")) {
      initialAvatarUrl = rawAvatarPath;
    } else {
      try {
        const supabase = await createClient();
        const { data: signed } = await supabase.storage
          .from("govhub-documents")
          .createSignedUrl(rawAvatarPath, 3600);
        if (signed?.signedUrl) {
          initialAvatarUrl = signed.signedUrl;
        }
      } catch {
        // Fallback ke inisial bila gagal sign URL
      }
    }
  }

  const rawNik = profile?.nik || user?.user_metadata?.nik || "";
  const maskedNik = rawNik ? maskNik(rawNik) : "-";

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
        timeZone: "Asia/Jakarta",
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
        timeZone: "Asia/Jakarta",
      })}, ${d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      })}`;
    }
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    });
  };

  const normalizedGender =
    profile?.jenis_kelamin && /laki/i.test(profile.jenis_kelamin)
      ? "Laki-laki"
      : profile?.jenis_kelamin && /perempuan/i.test(profile.jenis_kelamin)
      ? "Perempuan"
      : profile?.jenis_kelamin || "-";

  const initialData = {
    namaLengkap: fallbackNama,
    nik: maskedNik,
    tempatTanggalLahir:
      [profile?.tempat_lahir, formattedTglLahir].filter(Boolean).join(", ") || "-",
    jenisKelamin: normalizedGender,
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
      initialAvatarUrl={initialAvatarUrl}
      initialTempatLahir={profile?.tempat_lahir || ""}
      initialTanggalLahirIso={profile?.tanggal_lahir ? String(profile.tanggal_lahir).slice(0, 10) : ""}
      initialTerdaftarSejak={formatAccountDate(profile?.created_at || user?.created_at)}
      initialTerakhirLogin={formatAccountDate(user?.last_sign_in_at, true)}
    />
  );
}

