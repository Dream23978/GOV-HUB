import Image from "next/image";
import type { ReactNode } from "react";

export function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #e8f4fb 0%, #c8e6f5 40%, #a8d4ef 100%)",
      }}
    >
      {/* Background cityscape */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.png"
          alt="City Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(180,220,245,0.3) 0%, rgba(180,220,245,0.5) 50%, rgba(180,220,245,0.4) 100%)",
          }}
        />
      </div>

      {/* Dotted pattern */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 z-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #2563eb 1.2px, transparent 1.2px)",
          backgroundSize: "14px 14px",
          maskImage: "linear-gradient(to left, rgba(0,0,0,0.6) 0%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.6) 0%, transparent 80%)",
        }}
      />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-3xl mx-4 rounded-3xl overflow-hidden shadow-2xl flex min-h-[420px]">
        {/* Left — Garuda image */}
        <div className="hidden md:block relative w-[42%] flex-shrink-0">
          <Image
            src="/garuda.png"
            alt="Garuda Pancasila"
            fill
            sizes="(max-width: 768px) 0px, 320px"
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Right — slot */}
        <div className="flex-1 bg-white/90 backdrop-blur-sm flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
