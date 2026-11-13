import { LayananBansosContent } from "@/app/components/layanan-bansos/LayananBansosContent";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Layanan Bansos & Desil | GOV-HUB",
  description: "Informasi penetapan desil kesejahteraan dan layanan peninjauan desil.",
};

async function getDesilData() {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return 4;

    const { data: profile } = await supabase
      .from("profiles")
      .select("desil_saat_ini")
      .eq("id", authData.user.id)
      .maybeSingle();

    return profile?.desil_saat_ini ?? 4;
  } catch {
    return 4;
  }
}

export default async function LayananBansosPage() {
  const desil = await getDesilData();
  return <LayananBansosContent initialDesil={desil} />;
}

