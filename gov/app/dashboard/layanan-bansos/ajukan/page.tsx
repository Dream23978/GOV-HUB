import { AjukanDesilContent } from "@/app/components/layanan-bansos/AjukanDesilContent";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Ajukan Peninjauan Desil | GOV-HUB",
  description: "Verifikasi kondisi keluarga Anda untuk peninjauan desil.",
};

async function getUserProfile() {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("nama_lengkap, nik, alamat, jumlah_tanggungan, pekerjaan, desil_saat_ini")
      .eq("id", authData.user.id)
      .maybeSingle();

    return {
      profile,
      user: authData.user,
    };
  } catch {
    return null;
  }
}

export default async function AjukanDesilPage() {
  const profileData = await getUserProfile();
  const profile = profileData?.profile;
  const user = profileData?.user;

  const rawNik = profile?.nik || user?.user_metadata?.nik || "3578012304950002";
  const maskedNik =
    rawNik.length >= 4
      ? `**********${rawNik.slice(-4)}`
      : "**********0002";

  const nama =
    profile?.nama_lengkap ||
    user?.user_metadata?.nama_lengkap ||
    user?.user_metadata?.full_name ||
    "Warga";

  const alamat =
    profile?.alamat ||
    "Jl. Basuki Rahmat No. 10, Surabaya";

  const pekerjaan = profile?.pekerjaan || "Wiraswasta / Pekerja Lepas";
  const tanggungan = profile?.jumlah_tanggungan || 3;

  return (
    <AjukanDesilContent
      initialNama={nama}
      initialNik={maskedNik}
      initialAlamat={alamat}
      initialPekerjaan={pekerjaan}
      initialTanggungan={tanggungan}
      initialDesil={profile?.desil_saat_ini || 4}
    />
  );
}

