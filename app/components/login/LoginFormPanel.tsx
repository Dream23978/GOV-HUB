"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NikInputField } from "./NikInputField";
import { PasswordInputField } from "./PasswordInputField";
import { z } from "zod";
import ScrollAnimate from "@/app/components/ScrollAnimate";
import { signInAction } from "@/app/actions/auth";

// Validasi form login: NIK wajib 16 digit, password minimal 8 karakter
const loginSchema = z.object({
  nik: z.string().min(16, "NIK harus 16 karakter"),
  password: z.string().min(8, "password minimal 8 karakter"),
});

export function LoginFormPanel() {
  const router = useRouter();
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ nik?: string; password?: string; general?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ nik, password });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        nik: fieldErrors.nik?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const response = await signInAction({ nik, password });
      if (!response.success) {
        setErrors({ nik: response.error || "NIK atau password salah" });
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrors({ general: "Terjadi gangguan pada koneksi server." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full px-10 md:px-14 lg:px-16 py-12">
      {/* Heading */}
      <ScrollAnimate direction="up" duration={0.5} delay={0.05}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Selamat Datang
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-xs">
          Masuk ke akun GOV-HUB Anda untuk mengakses layanan publik dengan mudah aman.
        </p>
      </ScrollAnimate>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* NIK input */}
        <ScrollAnimate direction="left" duration={0.5} delay={0.1}>
          <NikInputField value={nik} onChange={setNik} />
          {errors.nik && <p className="text-red-500 text-xs mt-1">{errors.nik}</p>}
        </ScrollAnimate>

        {/* Password input */}
        <ScrollAnimate direction="left" duration={0.5} delay={0.2}>
          <PasswordInputField value={password} onChange={setPassword} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </ScrollAnimate>

        {/* Remember me + forgot password */}
        <ScrollAnimate direction="up" duration={0.5} delay={0.3}>
          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Ingat Saya</span>
            </label>

            <Link
              href="/auth/forgot-password"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Lupa Password
            </Link>
          </div>
        </ScrollAnimate>

        {/* Submit button */}
        <ScrollAnimate direction="up" duration={0.5} delay={0.4}>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 text-white font-semibold py-3 rounded-2xl transition-colors duration-200 mt-2 text-base cursor-pointer"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </ScrollAnimate>

        {/* Register link */}
        <ScrollAnimate direction="up" duration={0.5} delay={0.5}>
          <p className="text-sm text-gray-500 text-center mt-1">
            Belum punya akun?{" "}
            <Link
              href="/auth/sign-up"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Daftar sekarang
            </Link>
          </p>
        </ScrollAnimate>
      </form>
    </div>
  );
}
