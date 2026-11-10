"use client";

import { useState } from "react";
import { ForgotPasswordLayout } from "@/app/components/forgot-password/ForgotPasswordLayout";
import ScrollAnimate from "@/app/components/ScrollAnimate";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setSent(true);
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
            className="w-full bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm"
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
              <Link
                href={`/auth/forgot-password/verify?email=${encodeURIComponent(contact)}`}
                className=" flex  items-center justify-center w-full bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm"
              >
                Kirim Kode OTP
              </Link>
            </ScrollAnimate>
          </form>
        </>
      )}
    </ForgotPasswordLayout>
  );
}
