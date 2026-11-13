"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, User, CheckCircle2, Building, ChevronDown, Layers } from "lucide-react";
import ScrollAnimate from "@/app/components/ScrollAnimate";

export interface AdminLoginFormPanelProps {
  initialInstansi?: "dinsos" | "dukcapil";
  initialTingkat?: "kecamatan" | "kota" | "provinsi";
  lockInstansi?: boolean;
  lockTingkat?: boolean;
  targetRedirectUrl?: string;
  title?: string;
  subtitle?: string;
  badgeText?: string;
}

export function AdminLoginFormPanel({
  initialInstansi = "dinsos",
  initialTingkat = "kecamatan",
  lockInstansi = false,
  lockTingkat = false,
  targetRedirectUrl,
  title = "Login Administrator",
  subtitle = "Masuk ke sistem pengelolaan GOV-HUB untuk meninjau dan memvalidasi pengajuan warga.",
  badgeText = "Akses Khusus Aparatur / Petugas",
}: AdminLoginFormPanelProps) {
  const router = useRouter();
  const [instansi, setInstansi] = useState<"dinsos" | "dukcapil">(initialInstansi);
  const [tingkat, setTingkat] = useState<"kecamatan" | "kota" | "provinsi">(initialTingkat);
  const [nip, setNip] = useState("198905142014021003");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nip || nip.length < 8) {
      setError("Nomor Induk Pegawai (NIP) tidak valid (minimal 8 karakter).");
      return;
    }
    if (!password || password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setError(null);
    setIsLoading(true);

    // Tentukan URL tujuan
    let finalTarget = targetRedirectUrl;
    if (!finalTarget) {
      if (instansi === "dinsos") {
        if (tingkat === "kecamatan") finalTarget = "/petugas/dinsos/kecamatan/dashboard";
        else if (tingkat === "kota") finalTarget = "/petugas/dinsos/kota/dashboard";
        else finalTarget = "/petugas/dinsos/provinsi/dashboard";
      } else {
        if (tingkat === "kecamatan") finalTarget = "/petugas/dukcapil/kecamatan/dashboard";
        else finalTarget = "/petugas/dukcapil/kota/dashboard";
      }
    }

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push(finalTarget as string);
      }, 700);
    }, 600);
  };

  return (
    <div className="flex flex-col justify-center h-full px-8 md:px-12 lg:px-14 py-8">
      {/* Header Badge */}
      <ScrollAnimate direction="up" duration={0.5} delay={0.05}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 border border-blue-200 text-blue-700 text-xs font-semibold w-fit mb-3">
          <ShieldCheck size={14} />
          <span>{badgeText}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1.5">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-gray-600 mb-4 leading-relaxed max-w-sm">
          {subtitle}
        </p>
      </ScrollAnimate>

      {/* Success Notification Alert */}
      {isSuccess && (
        <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">Autentikasi Berhasil!</span>
            <span>Mengarahkan ke Dashboard {instansi === "dinsos" ? "Dinas Sosial" : "Dinas Dukcapil"} ({tingkat.toUpperCase()})...</span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Instansi & Tingkat Wilayah Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Instansi Selection */}
          <ScrollAnimate direction="left" duration={0.5} delay={0.1}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Instansi Pelayanan {lockInstansi && <span className="text-blue-600 font-normal">(Terkunci)</span>}
              </label>
              <div className="relative">
                <select
                  value={instansi}
                  disabled={lockInstansi}
                  onChange={(e) => setInstansi(e.target.value as "dinsos" | "dukcapil")}
                  className={`w-full px-3 py-2 pl-9 pr-7 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-gray-900 shadow-2xs appearance-none font-medium ${
                    lockInstansi ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white cursor-pointer"
                  }`}
                >
                  <option value="dinsos">Dinas Sosial (Bansos & Desil)</option>
                  <option value="dukcapil">Dinas Dukcapil (KTP & KK)</option>
                </select>
                <Building
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                {!lockInstansi && (
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                )}
              </div>
            </div>
          </ScrollAnimate>

          {/* Tingkat Wilayah Selection */}
          <ScrollAnimate direction="left" duration={0.5} delay={0.12}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tingkat Wilayah {lockTingkat && <span className="text-blue-600 font-normal">(Terkunci)</span>}
              </label>
              <div className="relative">
                <select
                  value={tingkat}
                  disabled={lockTingkat}
                  onChange={(e) => setTingkat(e.target.value as "kecamatan" | "kota" | "provinsi")}
                  className={`w-full px-3 py-2 pl-9 pr-7 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-gray-900 shadow-2xs appearance-none font-medium ${
                    lockTingkat ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white cursor-pointer"
                  }`}
                >
                  <option value="kecamatan">Admin Kecamatan</option>
                  <option value="kota">Admin Kota</option>
                  {instansi === "dinsos" && !lockTingkat && (
                    <option value="provinsi">Admin Provinsi / Pusat</option>
                  )}
                </select>
                <Layers
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                {!lockTingkat && (
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                )}
              </div>
            </div>
          </ScrollAnimate>
        </div>

        {/* NIP Input */}
        <ScrollAnimate direction="left" duration={0.5} delay={0.15}>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nomor Induk Pegawai (NIP) / ID Petugas
            </label>
            <div className="relative">
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="Contoh: 198905142014021003"
                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white shadow-2xs"
                required
              />
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </ScrollAnimate>

        {/* Password Input */}
        <ScrollAnimate direction="left" duration={0.5} delay={0.2}>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Kata Sandi Kedinasan
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi akun kedinasan"
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white shadow-2xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </ScrollAnimate>

        {/* Remember me + Helper */}
        <ScrollAnimate direction="up" duration={0.5} delay={0.25}>
          <div className="flex items-center justify-between text-xs mt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-gray-700">Ingat Sesi Ini</span>
            </label>

            <span className="text-gray-400 cursor-help" title="Hubungi Pusdatin Dukcapil / Dinsos untuk reset sandi kedinasan">
              Bantuan Akun?
            </span>
          </div>
        </ScrollAnimate>

        {/* Submit button */}
        <ScrollAnimate direction="up" duration={0.5} delay={0.3}>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1b3a6b] hover:bg-[#152e55] active:scale-98 disabled:opacity-70 text-white font-semibold py-3 rounded-xl transition-all duration-200 mt-2 text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? "Memverifikasi Kredensial..." : "Masuk ke Dashboard Petugas"}
          </button>
        </ScrollAnimate>
      </form>
    </div>
  );
}
