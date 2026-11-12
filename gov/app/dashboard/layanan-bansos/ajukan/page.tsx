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
      .select("nama_lengkap, nik")
      .eq("id", authData.user.id)
      .maybeSingle();

    return profile;
  } catch {
    return null;
  }
}

export default async function AjukanDesilPage() {
  const profile = await getUserProfile();

  const rawNik = profile?.nik || "6105438987661234";
  const maskedNik =
    rawNik.length >= 4
      ? `**********${rawNik.slice(-4)}`
      : "**********1234";

  const nama = profile?.nama_lengkap || "Hapis Khairullah";

  return <AjukanDesilContent initialNama={nama} initialNik={maskedNik} />;
}

