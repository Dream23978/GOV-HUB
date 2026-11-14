import { LoginHero } from "@/app/components/login/LoginHero";
import { LoginFormPanel } from "@/app/components/login/LoginFormPanel";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#E8EFF7] p-4 md:p-8">
      {/* Card container */}
      <div className="w-full max-w-[780px] min-h-[520px] flex rounded-3xl overflow-hidden shadow-2xl bg-[#EEF3F9]">
        
        {/* Left — Garuda hero image (~38% width) */}
        <div className="hidden md:flex w-[38%] flex-shrink-0 relative">
          <LoginHero />
        </div>

        {/* Vertical divider */}
        <div className="hidden md:block w-px bg-gray-200 flex-shrink-0" />

        {/* Right — Login form (~62% width) */}
        <div className="flex-1 flex flex-col">
          <LoginFormPanel />
        </div>
      </div>
    </main>
  );
}
