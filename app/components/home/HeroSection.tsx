import Image from "next/image";
import { GovHubLogo } from "./GovHubLogo";
import { NikLoginForm } from "./NikLoginForm";
import ScrollAnimate from "@/app/components/ScrollAnimate";

// Dekorasi gelombang SVG di bagian bawah hero
function BottomWaves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
      <svg
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        className="w-full h-20 md:h-28"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,55 C180,100 360,10 540,55 C720,100 900,10 1080,55 C1260,100 1350,30 1440,55 L1440,110 L0,110 Z"
          fill="#60A5FA"
          opacity="0.55"
        />
        <path
          d="M0,70 C200,30 400,110 600,70 C800,30 1000,110 1200,70 C1350,42 1400,80 1440,70 L1440,110 L0,110 Z"
          fill="#3B82F6"
          opacity="0.65"
        />
        <path
          d="M0,85 C240,50 480,110 720,85 C960,60 1200,110 1440,85 L1440,110 L0,110 Z"
          fill="#2563EB"
        />
      </svg>
    </div>
  );
}

// Halaman utama (landing) — berisi background kota, logo, headline, dan form login NIK
export function HeroSection() {
  return (
    <section
      className="relative w-full min-h-screen overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(160deg, #cce9f8 0%, #b8ddf2 40%, #9ccfe9 100%)",
      }}
    >
      {/* ── Background cityscape illustration ── */}
      <div className="absolute inset-0">
        <Image
          src="/background.png"
          alt="Jakarta Cityscape"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Left-to-right gradient to keep text on left readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(200,233,248,0.88) 0%, rgba(200,233,248,0.60) 38%, rgba(200,233,248,0.15) 58%, transparent 75%)",
          }}
        />

        {/* Top fade to blend sky */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(204,233,248,0.45) 0%, transparent 40%)",
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col flex-1 px-5 pt-8 pb-32 sm:px-8 sm:pt-10 md:px-14 md:pt-12 lg:px-20 lg:pt-14">
        {/* Logo */}
        <ScrollAnimate direction="down" duration={0.5}>
          <GovHubLogo />
        </ScrollAnimate>

        {/* Headline + form */}
        <div className="mt-10 md:mt-14 lg:mt-16 max-w-lg">
          <ScrollAnimate direction="up" duration={0.6} delay={0.1}>
            <h1 className="text-[2.15rem] sm:text-[2.4rem] md:text-[3rem] lg:text-[3.4rem] font-black text-gray-900 leading-[1.15] tracking-tight">
              Lebih Mudah,
              <br />
              Lebih Cepat,{" "}
              <span className="text-blue-600">Lebih Terpadu</span>
            </h1>
          </ScrollAnimate>

          <ScrollAnimate direction="up" duration={0.6} delay={0.2}>
            <p className="mt-4 text-[0.95rem] md:text-base text-gray-700 font-medium">
              GOV-HUB menghubungkan layanan Pemerintah.
            </p>
          </ScrollAnimate>

          <ScrollAnimate direction="up" duration={0.6} delay={0.35}>
            <div className="mt-6 md:mt-8">
              <NikLoginForm />
            </div>
          </ScrollAnimate>
        </div>
      </div>

      {/* ── Bottom wave decoration ── */}
      <BottomWaves />
    </section>
  );
}
