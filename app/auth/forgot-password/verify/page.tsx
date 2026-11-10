"use client";

import { Suspense, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ForgotPasswordLayout } from "@/app/components/forgot-password/ForgotPasswordLayout";
import ScrollAnimate from "@/app/components/ScrollAnimate";
import { createClient } from "@/lib/supabase/client";
import { verifyPasswordResetOtpAction } from "@/app/actions/auth";

function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (!paste) return;
    const newOtp = paste.split("").concat(Array(5).fill("")).slice(0, 5);
    setOtp(newOtp);
    inputRefs.current[Math.min(paste.length, 4)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 5) {
      setErrorMsg("Masukkan 5 digit kode OTP.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Verifikasi kode OTP di database via Server Action
      const res = await verifyPasswordResetOtpAction(email, code);
      if (!res.success) {
        setErrorMsg(res.error || "Kode verifikasi salah atau kedaluwarsa.");
        setLoading(false);
        return;
      }

      // 2. Berhasil diverifikasi, lanjut ke halaman penetapan kata sandi baru
      router.push(`/auth/forgot-password/reset?email=${encodeURIComponent(email)}`);
    } catch {
      router.push(`/auth/forgot-password/reset?email=${encodeURIComponent(email)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordLayout>
      <ScrollAnimate direction="up" duration={0.5}>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e2d6b] mb-3">
          Lupa kata sandi
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-xs">
          Kami mengirimkan kode OTP ke{" "}
          <span className="font-medium text-gray-700">{email || "email Anda"}</span>,{" "}
          masukkan kode 5 digit yang disebutkan dalam email
        </p>
      </ScrollAnimate>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* OTP boxes */}
        <ScrollAnimate direction="up" duration={0.5} delay={0.15}>
          <div className="flex gap-3 justify-start" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-gray-800 bg-white"
              />
            ))}
          </div>
        </ScrollAnimate>

        <ScrollAnimate direction="up" duration={0.5} delay={0.25}>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 text-sm cursor-pointer disabled:opacity-70"
          >
            {loading ? "Memverifikasi..." : "Lanjutkan"}
          </button>
        </ScrollAnimate>
      </form>
    </ForgotPasswordLayout>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpContent />
    </Suspense>
  );
}
