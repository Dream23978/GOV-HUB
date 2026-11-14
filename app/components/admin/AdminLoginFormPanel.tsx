"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  CheckCircle2,
} from "lucide-react";
import ScrollAnimate from "@/app/components/ScrollAnimate";
import { adminLoginAction } from "@/app/actions/admin";

export function AdminLoginFormPanel() {
  const router = useRouter();
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    instansi: string;
    tingkat: string;
    wilayahLabel: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNip = nip.trim();
    if (!cleanNip || cleanNip.length < 8) {
      setError("Nomor Induk Pegawai (NIP) tidak valid (minimal 8 karakter).");
      return;
    }
    if (!password || password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const authRes = await adminLoginAction({ nip: cleanNip, password });
      if (!authRes.success || !authRes.user) {
        setError(authRes.error || "Autentikasi gagal. NIP atau kata sandi tidak cocok.");
        setIsLoading(false);
        return;
      }

      setSuccessInfo({
        instansi: authRes.user.instansi,
        tingkat: authRes.user.tingkat,
        wilayahLabel: authRes.user.wilayahLabel,
      });
      setIsLoading(false);

      router.push(authRes.user.targetUrl);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat masuk.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full px-6 sm:px-8 md:px-12 lg:px-14 py-8">
      <ScrollAnimate direction="up" duration={0.5} delay={0.05}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 border border-blue-200 text-blue-700 text-xs font-semibold w-fit mb-3">
          <ShieldCheck size={14} />
          <span>Akses Khusus Aparatur / Petugas</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1.5">
          Login Administrator
        </h1>
        <p className="text-xs md:text-sm text-gray-600 mb-5 leading-relaxed max-w-sm">
          Masuk dengan NIP dan kata sandi kedinasan Anda. Portal instansi dan wilayah tugas akan diarahkan otomatis setelah autentikasi.
        </p>
      </ScrollAnimate>

      {successInfo && (
        <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">Autentikasi Berhasil!</span>
            <span>
              Mengarahkan ke portal {successInfo.instansi.toUpperCase()} ({successInfo.wilayahLabel})...
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ScrollAnimate direction="left" duration={0.5} delay={0.1}>
          <div>
            <label htmlFor="admin-nip" className="block text-xs font-semibold text-gray-700 mb-1">
              Nomor Induk Pegawai (NIP) / ID Petugas
            </label>
            <div className="relative">
              <input
                id="admin-nip"
                type="text"
                inputMode="numeric"
                autoComplete="username"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="Masukkan NIP kedinasan Anda"
                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-300 text-sm text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </ScrollAnimate>

        <ScrollAnimate direction="left" duration={0.5} delay={0.15}>
          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold text-gray-700 mb-1">
              Kata Sandi Kedinasan
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi akun kedinasan"
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white shadow-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </ScrollAnimate>

        <ScrollAnimate direction="up" duration={0.5} delay={0.2}>
          <button
            type="submit"
            disabled={isLoading || Boolean(successInfo)}
            className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#1b3a6b] to-[#0d2448] hover:from-[#152e55] hover:to-[#081730] text-white font-bold text-sm shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Memverifikasi Kredensial...</span>
            ) : (
              <>
                <ShieldCheck size={17} />
                <span>Masuk ke Portal Admin</span>
              </>
            )}
          </button>
        </ScrollAnimate>
      </form>
    </div>
  );
}
