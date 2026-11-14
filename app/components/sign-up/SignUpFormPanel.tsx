"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import ScrollAnimate from "@/app/components/ScrollAnimate";
import { NikInputField } from "@/app/components/login/NikInputField";
import { EmailPhoneInputField } from "./EmailPhoneInputField";
import { SignUpPasswordInputField } from "./SignUpPasswordInputField";
import { PasswordRulesChecklist } from "@/app/components/forgot-password/PasswordRulesChecklist";
import { signUpAction } from "@/app/actions/auth";

// Skema validasi Zod untuk form registrasi
const signUpSchema = z
  .object({
    nik: z
      .string()
      .length(16, "NIK harus tepat 16 digit")
      .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
    emailPhone: z
      .string()
      .min(1, "Email/No Handphone wajib diisi")
      .refine(
        (val) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^[0-9+\-\s]{8,15}$/.test(val),
        "Masukkan email yang valid"
      ),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf kapital")
      .regex(/[a-z]/, "Password harus mengandung minimal 1 huruf kecil")
      .regex(/[0-9]/, "Password harus mengandung minimal 1 angka")
      .regex(/[^A-Za-z0-9]/, "Password harus mengandung minimal 1 simbol khusus"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

type SignUpFormErrors = {
  nik?: string;
  emailPhone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export function SignUpFormPanel() {
  const router = useRouter();
  const [nik, setNik] = useState("");
  const [emailPhone, setEmailPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<SignUpFormErrors>({});

  // Validasi dengan Zod, lalu panggil backend auth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = signUpSchema.safeParse({ nik, emailPhone, password, confirmPassword });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const formErrors = result.error.flatten().formErrors;
      setErrors({
        nik: fieldErrors.nik?.[0],
        emailPhone: fieldErrors.emailPhone?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0] ?? formErrors?.[0],
      });
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const response = await signUpAction({
        nik,
        emailPhone,
        password,
      });

      if (!response.success) {
        setErrors({ general: response.error });
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrors({ general: "Terjadi kesalahan pada server. Silakan coba lagi." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full px-6 sm:px-10 md:px-14 lg:px-16 py-10 sm:py-12">
      {/* Heading */}
      <ScrollAnimate direction="up" duration={0.5} delay={0.05}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Selamat Datang
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-xs">
          Daftarkan akun GOV-HUB Anda untuk mengakses layanan publik dengan
          mudah dan aman.
        </p>
      </ScrollAnimate>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {errors.general}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* NIK input */}
        <ScrollAnimate direction="left" duration={0.5} delay={0.1}>
          <NikInputField value={nik} onChange={setNik} />
          {errors.nik && (
            <p className="text-red-500 text-xs mt-1 px-1">{errors.nik}</p>
          )}
        </ScrollAnimate>

        {/* Email/No Handphone input */}
        <ScrollAnimate direction="left" duration={0.5} delay={0.15}>
          <EmailPhoneInputField
            value={emailPhone}
            onChange={setEmailPhone}
            error={errors.emailPhone}
          />
        </ScrollAnimate>

        {/* Password input + checklist rule */}
        <ScrollAnimate direction="left" duration={0.5} delay={0.2}>
          <SignUpPasswordInputField
            id="signup-password"
            label="Password"
            placeholder="Buat password anda"
            value={password}
            onChange={setPassword}
            error={errors.password}
          />
          {/* Muncul otomatis saat user mulai mengetik password */}
          <PasswordRulesChecklist password={password} />
        </ScrollAnimate>

        {/* Konfirmasi Password input */}
        <ScrollAnimate direction="left" duration={0.5} delay={0.25}>
          <SignUpPasswordInputField
            id="signup-confirm-password"
            label="Konfirmasi Password"
            placeholder="Masukkan kembali password anda"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
          />
        </ScrollAnimate>

        {/* Ingat Saya + Lupa Password */}
        <ScrollAnimate direction="up" duration={0.5} delay={0.3}>
          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="signup-remember"
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

        {/* Tombol Daftar */}
        <ScrollAnimate direction="up" duration={0.5} delay={0.4}>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 text-white font-semibold py-3 rounded-2xl transition-colors duration-200 mt-2 text-base cursor-pointer"
          >
            {isLoading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </ScrollAnimate>

        {/* Link ke login */}
        <ScrollAnimate direction="up" duration={0.5} delay={0.5}>
          <p className="text-sm text-gray-500 text-center mt-1">
            Sudah punya akun?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Masuk
            </Link>
          </p>
        </ScrollAnimate>
      </form>
    </div>
  );
}
