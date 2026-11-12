import { Suspense } from "react";
import { TrackingKtpContent } from "@/app/components/layanan-ktp/TrackingKtpContent";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Tracking Pengajuan KTP | GOV-HUB",
  description: "Kelola layanan administrasi kependudukan anda dengan mudah.",
};

async function getTrackingPageData() {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    let profile = null;
    let submission = null;

    if (authData?.user) {
      const { data: p } = await supabase
        .from("profiles")
        .select("nama_lengkap, nik")
        .eq("id", authData.user.id)
        .maybeSingle();
      profile = p;

      const { data: s } = await supabase
        .from("ktp_submissions")
        .select("*")
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      submission = s;
    }

    let formattedDate = "28 September 2026";
    if (submission?.created_at) {
      try {
        const d = new Date(submission.created_at);
        formattedDate = d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      } catch {
        formattedDate = "28 September 2026";
      }
    }

    const rawNik = profile?.nik || "6105438987661234";
    const maskedNik =
      rawNik.length >= 8
        ? `NIK: ********${rawNik.slice(-4)}`
        : `NIK: ********1234`;

    return {
      tracking: {
        nomorPengajuan: submission?.nomor_tiket || "KTP-2026-00124",
        statusSaatIni: "Pembuatan KTP EL",
        tanggalPengajuan: formattedDate,
        statusBadge: "Terkonfirmasi",
      },
      profile: {
        nama: profile?.nama_lengkap || "Hapis Khairullah",
        maskedNik: maskedNik,
      },
    };
  } catch {
    return null;
  }
}

export default async function TrackingKtpPage({
  searchParams,
}: {
  searchParams?: Promise<{ detail?: string }>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const defaultOpen = sp?.detail === "true" || sp?.detail === "1";

  const pageData = await getTrackingPageData();

  const trackingData = pageData?.tracking || {
    nomorPengajuan: "KTP-2026-00124",
    statusSaatIni: "Pembuatan KTP EL",
    tanggalPengajuan: "28 September 2026",
    statusBadge: "Terkonfirmasi",
  };

  const citizenProfile = pageData?.profile || {
    nama: "Hapis Khairullah",
    maskedNik: "NIK: ********1234",
  };

  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-5 animate-pulse w-full max-w-2xl">
          <div className="h-10 w-64 bg-gray-200 dark:bg-slate-700 rounded-xl" />
          <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-2xl" />
        </div>
      }
    >
      <TrackingKtpContent
        initialData={trackingData}
        profileData={citizenProfile}
        defaultOpen={defaultOpen}
      />
    </Suspense>
  );
}
