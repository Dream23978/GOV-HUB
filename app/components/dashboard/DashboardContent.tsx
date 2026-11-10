import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function getUserData() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }
  return data.user;
}

export async function DashboardContent() {
  const user = await getUserData();

  const nama =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Pengguna";

  const nik: string =
    user.user_metadata?.nik ||
    user.user_metadata?.phone ||
    "0000000000000002";

  // Masking NIK
  const maskedNik =
    nik.length >= 3
      ? `NIK:**********${nik.substring(nik.length - 3)}`
      : `NIK:${nik}`;

  // Kapitalisasi nama
  const displayNama = nama
    .split(" ")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Halo, {displayNama}!
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {maskedNik}
        </p>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-400 to-blue-300 shadow-md min-h-[130px]">
        <div className="absolute inset-0">
          <Image
            src="/dashboard-banner.png"
            alt="Semua Layanan Publik"
            fill
            className="object-cover object-center opacity-80"
            priority
          />
        </div>
        <div className="relative z-10 p-5 max-w-[55%]">
          <h2 className="text-white font-bold text-lg md:text-xl leading-tight drop-shadow">
            Semua Layanan Publik,{" "}
            <span className="block">Dalam Satu Hub.</span>
          </h2>
          <p className="text-white/90 text-xs mt-2 leading-relaxed drop-shadow">
            Akses layanan kependudukan dan bantuan sosial tanpa antre dan tanpa
            berkas berulang
          </p>
        </div>
      </div>

      {/* Data Kependudukan Terverifikasi Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={22} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-green-600 dark:text-green-400 font-semibold text-sm">
              Data kependudukan Terverifikasi
            </p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-gray-600 dark:text-gray-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                NIK aktif
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                KK Terdaftar
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                Data keluarga tersinkronisasi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Layanan KTP & Dukcapil */}
        <Link href="/protected/layanan-ktp" className="group">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 flex flex-col items-center gap-3 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 cursor-pointer">
            <div className="w-24 h-24 relative">
              <Image
                src="/ktp-dukcapil-icon.png"
                alt="Layanan KTP & Dukcapil"
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="text-center">
              <p className="text-gray-700 dark:text-gray-200 font-bold text-sm leading-tight">
                Layanan
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-bold text-sm leading-tight">
                KTP & Dukcapil
              </p>
            </div>
          </div>
        </Link>

        {/* Layanan Desil & Bansos */}
        <Link href="/protected/layanan-bansos" className="group">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 flex flex-col items-center gap-3 hover:shadow-md hover:border-green-200 dark:hover:border-green-700 transition-all duration-200 cursor-pointer">
            <div className="w-24 h-24 relative">
              <Image
                src="/bansos-desil-icon.png"
                alt="Layanan Desil & Bansos"
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="text-center">
              <p className="text-gray-700 dark:text-gray-200 font-bold text-sm leading-tight">
                Layanan
              </p>
              <p className="text-green-600 dark:text-green-400 font-bold text-sm leading-tight">
                Desil & Bansos
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
