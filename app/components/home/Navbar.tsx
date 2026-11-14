import Link from "next/link";

export function Navbar() {
  return (
    <nav className="w-full bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-7 h-7"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold tracking-tight text-gray-800">
              GOV-<span className="text-blue-600">HUB</span>
            </span>
            <span className="text-[10px] text-gray-500 font-medium leading-none">
              Satu NIK, Satu Akses untuk Berbagai Layanan Publik
            </span>
          </div>
        </Link>

        {/* Right side nav items (optional for future) */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600 font-medium">
          <Link href="#layanan" className="hover:text-blue-600 transition-colors">
            Layanan
          </Link>
          <Link href="#tentang" className="hover:text-blue-600 transition-colors">
            Tentang
          </Link>
          <Link href="#bantuan" className="hover:text-blue-600 transition-colors">
            Bantuan
          </Link>
        </div>
      </div>
    </nav>
  );
}
