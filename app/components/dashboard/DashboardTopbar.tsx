import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function getProfileData() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    redirect("/auth/login");
  }

  const user = authData.user;

  const { data: profile } = await supabase
    .from("profiles")
    .select("nama_lengkap, nik, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    user,
    profile,
  };
}

export async function DashboardTopbar() {
  const { user, profile } = await getProfileData();

  // Ambil nama dari profil, fallback ke metadata
  const nama =
    profile?.nama_lengkap ||
    user.user_metadata?.nama_lengkap ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Warga";

  // Inisial untuk avatar
  const initials = nama
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="relative h-[60px] bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-b border-white/30 dark:border-slate-700 flex items-center justify-between px-3.5 sm:px-6 shadow-sm">
      {/* Left: Brand logo */}
      {/* 1. Foto Background */}
      <Image 
        src="/navbar.png" 
        alt="Navbar Background" 
        fill
        sizes="100vw"
        priority
        className="object-cover -z-10"
      />
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <Image
            src="/garuda (2).png"
            alt="Garuda Indonesia"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0"
          />
          <div className="w-px h-6 sm:h-7 bg-gray-300 dark:bg-slate-600 flex-shrink-0" />
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Image
              src="/logo.png"
              alt="Gov-Hub"
              width={56}
              height={56}
              className="w-10 h-10 sm:w-14 sm:h-14 object-contain flex-shrink-0"
            />
            <span className="text-gray-800 dark:text-white font-bold text-base sm:text-2xl truncate">
              GOV-<span className="text-blue-600">HUB</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Avatar & Role */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">
            {nama}
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">
            {profile?.role || "warga"}
          </span>
        </div>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow border-2 border-white dark:border-slate-700 select-none">
          {initials || "W"}
        </div>
      </div>
    </header>
  );
}
