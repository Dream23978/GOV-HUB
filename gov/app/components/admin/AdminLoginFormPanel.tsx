"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  CheckCircle2,
  Building,
  ChevronDown,
  Layers,
  Lock,
  Loader2,
} from "lucide-react";
import ScrollAnimate from "@/app/components/ScrollAnimate";
import { adminLoginAction, lookupAdminByNipAction } from "@/app/actions/admin";

export function AdminLoginFormPanel() {
  const router = useRouter();
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [instansi, setInstansi] = useState<"dinsos" | "dukcapil" | "">("");
  const [tingkat, setTingkat] = useState<"kecamatan" | "kota" | "provinsi" | "pusat" | "">("");
  const [wilayahDetail, setWilayahDetail] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [designatedUrl, setDesignatedUrl] = useState("");
  const [isCheckingNip, setIsCheckingNip] = useState(false);
  const [nipStatus, setNipStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [nipFeedback, setNipFeedback] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Otomatis deteksi Instansi & Tingkat Wilayah saat NIP dimasukkan
  useEffect(() => {
    const cleanNip = nip.trim();
    if (cleanNip.length < 8) {
      setInstansi("");
      setTingkat("");
      setWilayahDetail("");
      setOfficerName("");
      setDesignatedUrl("");
      setNipStatus("idle");
      setNipFeedback(null);
      return;
    }

    setNipStatus("loading");
    setIsCheckingNip(true);
    setNipFeedback(null);

    const timer = setTimeout(async () => {
      try {
        const res = await lookupAdminByNipAction(cleanNip);
        if (res.found && res.instansi && res.tingkat) {
          setInstansi(res.instansi);
          setTingkat(res.tingkat);
          setWilayahDetail(res.wilayahLabel || "");
          setOfficerName(res.nama_lengkap || "");
          setDesignatedUrl(res.targetUrl || "");
          setNipStatus("valid");
          setNipFeedback(null);
        } else {
          setInstansi("");
          setTingkat("");
          setWilayahDetail("");
          setOfficerName("");
          setDesignatedUrl("");
          setNipStatus("invalid");
          setNipFeedback(res.error || "NIP tidak terdaftar dalam database aparatur.");
        }
      } catch {
        setNipStatus("invalid");
        setNipFeedback("Gagal memeriksa NIP aparatur.");
      } finally {
        setIsCheckingNip(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [nip]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nip || nip.length < 8) {
      setError("Nomor Induk Pegawai (NIP) tidak valid (minimal 8 karakter).");
      return;
    }
    if (nipStatus !== "valid" || !instansi || !tingkat) {
      setError("NIP belum terverifikasi atau tidak terdaftar di database aparatur.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const authRes = await adminLoginAction({ nip, password });
      if (!authRes.success || !authRes.user) {
        setError(authRes.error || "Autentikasi gagal. NIP atau kata sandi tidak cocok.");
        setIsLoading(false);
        return;
      }

      const targetUrl =
        authRes.user.targetUrl ||
        designatedUrl ||
        (instansi === "dukcapil"
          ? "/admin/dukcapil/dashboard"
          : "/admin/dinsos/dashboard");

      // Simpan sesi aparatur secara lokal dan cookie
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "govhub_admin_session",
            JSON.stringify({
              id: authRes.user.id,
              nip: authRes.user.nik,
              nama: authRes.user.nama_lengkap,
              role: authRes.user.role,
              instansi: authRes.user.instansi,
              tingkat: authRes.user.tingkat,
              wilayah: authRes.user.wilayahLabel,
              adminName: authRes.user.nama_lengkap,
              loginTime: new Date().toISOString(),
            })
          );
          document.cookie = `govhub_admin_session=${authRes.user.instansi}_${authRes.user.tingkat}; path=/; max-age=86400; SameSite=Lax`;
        } catch (e) {
          console.warn("Storage warning:", e);
        }
      }

      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push(targetUrl);
      }, 700);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat masuk.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full px-8 md:px-12 lg:px-14 py-8">
      {/* Header Badge */}
      <ScrollAnimate direction="up" duration={0.5} delay={0.05}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 border border-blue-200 text-blue-700 text-xs font-semibold w-fit mb-3">
          <ShieldCheck size={14} />
          <span>Akses Khusus Aparatur / Petugas</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1.5">
          Login Administrator
        </h1>
        <p className="text-xs md:text-sm text-gray-600 mb-4 leading-relaxed max-w-sm">
          Masuk ke sistem pengelolaan GOV-HUB untuk meninjau dan memvalidasi pengajuan warga.
        </p>
      </ScrollAnimate>

      {/* Success Notification Alert */}
      {isSuccess && (
        <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold block">Autentikasi Berhasil!</span>
            <span>
              Mengarahkan ke Dashboard {instansi === "dinsos" ? "Dinas Sosial" : "Dinas Dukcapil"} ({tingkat.toUpperCase()})...
            </span>
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
        {/* NIP Input */}
        <ScrollAnimate direction="left" duration={0.5} delay={0.1}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700">
                Nomor Induk Pegawai (NIP) / ID Petugas
              </label>
              {isCheckingNip && (
                <span className="text-[10px] text-blue-600 flex items-center gap-1 font-medium">
                  <Loader2 size={11} className="animate-spin" /> Memeriksa data...
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="Masukkan NIP (contoh: 198905142014021001)"
                className={`w-full px-4 py-2.5 pl-10 pr-9 rounded-xl border text-sm text-gray-900 bg-white shadow-2xs focus:outline-none transition-all ${
                  nipStatus === "valid"
                    ? "border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                    : nipStatus === "invalid"
                    ? "border-red-400 focus:ring-2 focus:ring-red-400"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                }`}
                required
              />
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              {nipStatus === "valid" && (
                <CheckCircle2
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600"
                />
              )}
            </div>
            {nipFeedback && (
              <p className="text-[11px] text-red-600 mt-1 font-medium">{nipFeedback}</p>
            )}
          </div>
        </ScrollAnimate>

        {/* Instansi & Tingkat Wilayah Grid (Otomatis & Terkunci) */}
        <ScrollAnimate direction="left" duration={0.5} delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Instansi Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700">
                  Instansi Pelayanan
                </label>
                <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                  <Lock size={10} /> Terkunci
                </span>
              </div>
              <div className="relative">
                <select
                  value={instansi}
                  disabled
                  aria-readonly="true"
                  className="w-full px-3 py-2 pl-9 pr-7 rounded-xl border border-gray-200 focus:outline-none text-xs text-gray-700 bg-gray-100/80 shadow-2xs appearance-none cursor-not-allowed font-medium select-none"
                >
                  <option value="">— Menunggu Input NIP —</option>
                  <option value="dinsos">Dinas Sosial (Bansos & Desil)</option>
                  <option value="dukcapil">Dinas Dukcapil (KTP & KK)</option>
                </select>
                <Building
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Tingkat Wilayah Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700">
                  Tingkat Wilayah
                </label>
                <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                  <Lock size={10} /> Terkunci
                </span>
              </div>
              <div className="relative">
                <select
                  value={tingkat}
                  disabled
                  aria-readonly="true"
                  className="w-full px-3 py-2 pl-9 pr-7 rounded-xl border border-gray-200 focus:outline-none text-xs text-gray-700 bg-gray-100/80 shadow-2xs appearance-none cursor-not-allowed font-medium select-none"
                >
                  <option value="">— Menunggu Input NIP —</option>
                  <option value="kecamatan">Admin Kecamatan</option>
                  <option value="kota">Admin Kota</option>
                  <option value="provinsi">Admin Provinsi / Pusat</option>
                </select>
                <Layers
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Wilayah detail banner */}
          {nipStatus === "valid" && wilayahDetail && (
            <div className="mt-2 p-2 rounded-xl bg-blue-50/90 border border-blue-200/80 text-[11px] text-blue-900 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-blue-600 flex-shrink-0" />
              <div className="leading-tight">
                <span className="font-bold">{officerName}</span>
                <span className="text-blue-700"> &bull; Wilayah Tugas: <strong>{wilayahDetail}</strong></span>
              </div>
            </div>
          )}
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

            <span
              className="text-gray-400 cursor-help"
              title="Hubungi Pusdatin Dukcapil / Dinsos untuk reset sandi kedinasan"
            >
              Bantuan Akun?
            </span>
          </div>
        </ScrollAnimate>

        {/* Submit button */}
        <ScrollAnimate direction="up" duration={0.5} delay={0.3}>
          <button
            type="submit"
            disabled={isLoading || nipStatus !== "valid"}
            className="w-full bg-[#1b3a6b] hover:bg-[#152e55] active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 mt-2 text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? "Memverifikasi Kredensial..." : "Masuk ke Dashboard Petugas"}
          </button>
        </ScrollAnimate>
      </form>
    </div>
  );
}
