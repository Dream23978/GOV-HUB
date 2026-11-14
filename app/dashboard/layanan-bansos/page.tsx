import { LayananBansosContent } from "@/app/components/layanan-bansos/LayananBansosContent";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Layanan Bansos & Desil | GOV-HUB",
  description: "Informasi penetapan desil kesejahteraan dan layanan peninjauan desil.",
};

async function getDesilData(): Promise<{ desil: number | string; penetapan: string }> {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { desil: "-", penetapan: "-" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("desil_saat_ini, updated_at, created_at")
      .eq("id", authData.user.id)
      .maybeSingle();

    const dateStr = profile?.updated_at || profile?.created_at;
    const penetapan = dateStr
      ? new Date(dateStr).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

    return { desil: profile?.desil_saat_ini ?? "-", penetapan };
  } catch {
    return { desil: "-", penetapan: "-" };
  }
}

export default async function LayananBansosPage() {
  const { desil, penetapan } = await getDesilData();
  return <LayananBansosContent initialDesil={desil} initialPenetapan={penetapan} />;
}

