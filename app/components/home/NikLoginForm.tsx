"use client";

import Link from "next/link";
import { motion } from "motion/react";

// Tombol CTA di landing page — klik langsung navigasi ke halaman login
export function NikLoginForm() {
  return (
    <Link href="/auth/login">
      <motion.div
        className="flex items-stretch bg-white rounded-2xl shadow-xl overflow-hidden max-w-[420px] border border-white/60 cursor-pointer"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{
          scale: 1.03,
          boxShadow: "0 20px 40px rgba(37, 99, 235, 0.18)",
        }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Left: icon + text content */}
        <div className="flex items-center gap-3 flex-1 px-4 py-3">
          {/* Person icon */}
          <motion.div
            className="flex-shrink-0 text-blue-500"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>

          {/* Text block */}
          <div className="flex flex-col">
            <span className="text-blue-600 font-semibold text-sm md:text-base">
              Login dengan NIK
            </span>
            <span className="text-[11px] text-gray-400 leading-none mt-0.5 whitespace-nowrap">
              Login menggunakan NIK mengakses Layanan
            </span>
          </div>
        </div>

        {/* Right: Masuk button */}
        <motion.div
          className="bg-blue-600 text-white font-semibold text-sm md:text-base px-6 py-3 flex-shrink-0 flex items-center"
          whileHover={{ backgroundColor: "#1d4ed8" }}
          transition={{ duration: 0.2 }}
        >
          Masuk
        </motion.div>
      </motion.div>
    </Link>
  );
}
