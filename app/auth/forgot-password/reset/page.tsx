"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { ForgotPasswordLayout } from "@/app/components/forgot-password/ForgotPasswordLayout";
import { PasswordField } from "@/app/components/forgot-password/PasswordField";
import { PasswordRulesChecklist } from "@/app/components/forgot-password/PasswordRulesChecklist";
import ScrollAnimate from "@/app/components/ScrollAnimate";
import { createClient } from "@/lib/supabase/client";
import { updateUserPasswordAction } from "@/app/actions/auth";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Kata sandi minimal harus 8 karakter" })
      .regex(/[A-Z]/, { message: "Kata sandi harus mengandung minimal 1 huruf besar" })
      .regex(/[a-z]/, { message: "Kata sandi harus mengandung minimal 1 huruf kecil" })
      .regex(/[0-9]/, { message: "Kata sandi harus mengandung minimal 1 angka" })
      .regex(/[^A-Za-z0-9]/, { message: "Kata sandi harus mengandung minimal 1 karakter khusus ( @, #, $, %, !, ?,)" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Konfirmasi kata sandi wajib diisi" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({});

  const validateLive = (newPassword: string, newConfirm: string) => {
    const result = resetPasswordSchema.safeParse({ password: newPassword, confirmPassword: newConfirm });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const formErrors = result.error.flatten().formErrors;
      setErrors({
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0] ?? formErrors[0],
      });
    } else {
      setErrors({});
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    validateLive(val, confirm);
  };

  const handleConfirmChange = (val: string) => {
    setConfirm(val);
    validateLive(password, val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    validateLive(password, confirm);
    const result = resetPasswordSchema.safeParse({ password, confirmPassword: confirm });
    if (!result.success) return;

    setLoading(true);
    setErrors({});

    try {
      // 1. Coba update via browser client (jika ada recovery session)
      const supabase = createClient();
      const clientRes = await supabase.auth.updateUser({ password });

      if (!clientRes.error) {
        router.push("/auth/forgot-password/success");
        return;
      }

      // 2. Jika client belum memiliki session, gunakan Server Action
      const serverUpdate = await updateUserPasswordAction(password, email);

      if (serverUpdate.success) {
        router.push("/auth/forgot-password/success");
        return;
      }

      // Jika keduanya gagal
      setErrors({
        general:
          serverUpdate.error ||
          clientRes.error?.message ||
          "Gagal memperbarui kata sandi. Pastikan SUPABASE_SERVICE_ROLE_KEY valid di .env.local.",
      });
      setLoading(false);
    } catch {
      setErrors({
        general: "Terjadi kesalahan saat memperbarui kata sandi. Silakan coba kembali.",
      });
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordLayout>
      <ScrollAnimate direction="up" duration={0.5}>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e2d6b] mb-3">
          Tetapkan kata sandi baru
        </h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-xs">
          Buat kata sandi baru. Pastikan kata sandi tersebut berbeda dari kata sandi sebelumnya demi keamanan.
        </p>
      </ScrollAnimate>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ScrollAnimate direction="left" duration={0.5} delay={0.1}>
          <PasswordField
            id="new-password"
            label="Password"
            placeholder="Buat password anda"
            value={password}
            onChange={handlePasswordChange}
            error={undefined}
          />
          <PasswordRulesChecklist password={password} />
        </ScrollAnimate>

        <ScrollAnimate direction="left" duration={0.5} delay={0.2}>
          <PasswordField
            id="confirm-password"
            label="Konfirmasi Password"
            placeholder="Masukkan kembali password anda"
            value={confirm}
            onChange={handleConfirmChange}
            error={errors.confirmPassword}
          />
        </ScrollAnimate>

        <ScrollAnimate direction="up" duration={0.5} delay={0.3}>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 text-sm mt-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? "Menyimpan..." : "Perbarui Kata Sandi"}
          </button>
        </ScrollAnimate>
      </form>
    </ForgotPasswordLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
