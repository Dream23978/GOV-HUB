"use client";

import Link from "next/link";
import { ForgotPasswordLayout } from "@/app/components/forgot-password/ForgotPasswordLayout";
import ScrollAnimate from "@/app/components/ScrollAnimate";

export default function ResetSuccessPage() {
  return (
    <ForgotPasswordLayout>
      <ScrollAnimate direction="up" duration={0.5}>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e2d6b] mb-3">
          Ganti Sandi
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Kata sandi Anda telah berhasil direset
        </p>
      </ScrollAnimate>

      <ScrollAnimate direction="up" duration={0.5} delay={0.15}>
        <Link
          href="/auth/login"
          className="block w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 text-sm text-center"
        >
          Kembali ke halaman login
        </Link>
      </ScrollAnimate>
    </ForgotPasswordLayout>
  );
}
