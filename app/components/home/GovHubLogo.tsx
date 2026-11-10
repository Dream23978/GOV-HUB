import Image from "next/image";
import Link from "next/link";

export function GovHubLogo() {
  return (
    <Link href="/" className="flex items-center gap-4 group">
      <div className="w-[50px] h-[50px] md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-white/40 group-hover:ring-white/70 transition-all">
        <Image
          src="/logo.png"
          alt="GOV-HUB Icon"
          width={50}
          height={50}
          className="w-full h-full object-center"
          priority
        />
      </div>

      {/* Brand text */}
      <div className="flex flex-col leading-tight">
        <span className="text-[2.2rem] md:text-[2.5rem] font-black tracking-tight leading-none">
          <span className="text-gray-900">GOV-</span>
          <span className="text-blue-600">HUB</span>
        </span>
        <span className="text-sm text-gray-600 font-medium mt-0.5 leading-tight">
          Satu NIK, Satu Akses
          <br />
          untuk Berbagai Layanan Publik
        </span>
      </div>
    </Link>
  );
}
