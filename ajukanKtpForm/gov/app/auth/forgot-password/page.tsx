"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ForgotPasswordLayout } from "@/app/components/forgot-password/ForgotPasswordLayout";
import ScrollAnimate from "@/app/components/ScrollAnimate";
import Link from "next/link";
import { requestPasswordResetAction } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setLoading(true);
    setErrorMessage("");
    try {
      const res = await requestPasswordResetAction(contact);
      if (!res.success) {
        setErrorMessage(res.error || "Akun tidak ditemukan.");
        setLoading(false);
        return;
      }
      router.push(`/auth/forgot-password/verify?email=${encodeURIComponent(contact)}`);
    } catch {
      router.push(`/auth/forgot-password/verify?email=${encodeURIComponent(contact)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordLayout>
      {sent ? (
        <ScrollAnimate direction="up" duration={0.5}>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e2d6b] mb-4">
            Email terkirim!
          </h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Kami telah mengirim kode OTP ke{" "}
            <span className="font-medium text-gray-700">{contact}</span>.{" "}
            Silakan cek inbox Anda.
          </p>
          <button
            type="button"
            className="w-full bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm cursor-pointer"
            onClick={() => setSent(false)}
          >
            Kirim ulang
          </button>
        </ScrollAnimate>
      ) : (
        <>
          <ScrollAnimate direction="up" duration={0.5}>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1e2d6b] mb-3">
              Lupa kata sandi
            </h1>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-xs">
              Silakan masukkan Email Anda untuk mengatur ulang kata sandi.
            </p>
          </ScrollAnimate>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ScrollAnimate direction="left" duration={0.5} delay={0.15}>
              <input
                id="contact-input"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Masukan Email/No Handphone anda"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </ScrollAnimate>

            <ScrollAnimate direction="up" duration={0.5} delay={0.25}>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm cursor-pointer disabled:opacity-70"
              >
                {loading ? "Mengirim..." : "Kirim Kode OTP"}
              </button>
            </ScrollAnimate>
          </form>
        </>
      )}
    </ForgotPasswordLayout>
  );
}
