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

    let formattedDate = "";
    if (submission?.created_at) {
      try {
        const d = new Date(submission.created_at);
        formattedDate = d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      } catch {
        formattedDate = new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    }

    const fallbackNama =
      profile?.nama_lengkap ||
      authData?.user?.user_metadata?.nama_lengkap ||
      "Warga";
    const rawNik = profile?.nik || authData?.user?.user_metadata?.nik || "3578012304950002";
    const maskedNik =
      rawNik.length >= 8
        ? `NIK: ********${rawNik.slice(-4)}`
        : `NIK: ********0002`;

    // Map status database ke status tampilan UI
    let statusText = "Menunggu Verifikasi";
    let statusBadgeText = "Diproses";
    if (submission?.status === "selesai") {
      statusText = "KTP Selesai Dicetak";
      statusBadgeText = "Selesai";
    } else if (submission?.status === "diproses") {
      statusText = "Perekaman Biometrik";
      statusBadgeText = "Terkonfirmasi";
    } else if (submission?.status === "ditolak") {
      statusText = "Pengajuan Ditolak";
      statusBadgeText = "Ditolak";
    }

    return {
      hasSubmission: !!submission,
      submissionRaw: submission,
      tracking: {
        nomorPengajuan: submission?.nomor_tiket || "",
        statusSaatIni: statusText,
        tanggalPengajuan: formattedDate || "Hari ini",
        statusBadge: statusBadgeText,
      },
      profile: {
        nama: fallbackNama,
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

  // Jika user belum pernah mengajukan KTP sama sekali, tampilkan kartu informatif dengan tombol ajukan
  if (!pageData?.hasSubmission) {
    return (
      <div className="flex flex-col w-full max-w-2xl pb-10">
        <div className="flex items-center gap-3.5 mb-6">
          <a
            href="/dashboard/layanan-ktp"
            className="w-10 h-10 rounded-full bg-[#1b2b54] hover:bg-[#142040] flex items-center justify-center transition-all duration-200 shadow-sm flex-shrink-0 group cursor-pointer"
            aria-label="Kembali ke Layanan KTP"
          >
            <span className="text-white font-bold">&larr;</span>
          </a>
          <div>
            <h1 className="text-xl md:text-[22px] font-bold text-gray-900 dark:text-white leading-tight">
              Tracking Pengajuan KTP
            </h1>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
              Pantau status dan proses pengajuan KTP Anda secara real-time.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm p-8 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 text-2xl font-black">
            📋
          </div>
          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-2">
            Belum Ada Pengajuan KTP
          </h3>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6 leading-relaxed">
            Halo <span className="font-semibold text-gray-700 dark:text-gray-200">{pageData?.profile.nama}</span>, Anda belum memiliki riwayat pengajuan pembuatan atau pembaruan KTP.
          </p>
          <a
            href="/dashboard/layanan-ktp/ajukan"
            className="bg-[#0E4FA8] hover:bg-[#0B3F88] active:scale-[0.98] text-white font-semibold text-xs md:text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer select-none"
          >
            Ajukan KTP Baru Sekarang &rarr;
          </a>
        </div>
      </div>
    );
  }

  const trackingData = pageData.tracking;
  const citizenProfile = pageData.profile;

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
