import Image from "next/image";
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

export async function DashboardTopbar() {
  const user = await getUserData();

  // Ambil nama dari user_metadata atau email
  const nama =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Pengguna";

  // Format NIK: tampilkan sebagian tersembunyi
  const nik =
    user.user_metadata?.nik ||
    user.user_metadata?.phone ||
    "****************";

  // Masking NIK: tampilkan awalan + ***002
  const maskedNik =
    nik.length >= 16
      ? `NIK:${nik.substring(0, 2)}**********${nik.substring(nik.length - 3)}`
      : `NIK:${nik}`;

  // Inisial untuk avatar
  const initials = nama
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-[60px] bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-6 shadow-sm">
      {/* Left: Logo area (already in sidebar, here we show brand in topbar for main content area) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Image
            src="/garuda.png"
            alt="Garuda Indonesia"
            width={32}
            height={32}
            className="object-contain"
          />
          <div className="w-px h-7 bg-gray-300 dark:bg-slate-600" />
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Gov-Hub"
              width={22}
              height={22}
              className="object-contain"
            />
            <span className="text-gray-800 dark:text-white font-bold text-lg">
              GOV-<span className="text-blue-600">HUB</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Avatar */}
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white dark:border-slate-700 cursor-pointer hover:scale-105 transition-transform">
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt={nama}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
      </div>
    </header>
  );
}
