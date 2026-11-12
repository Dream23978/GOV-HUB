import React from "react";
import { GreenExclamationIcon } from "./KtpIcons";
import { KtpIllustration } from "./KtpIllustration";

export function InformasiLayananCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300 dark:border-slate-700 shadow-sm p-5 md:p-6 w-full">
      {/* Title */}
      <h3 className="text-sm md:text-[15px] font-bold text-gray-900 dark:text-white mb-3 md:mb-3.5">
        Informasi Layanan
      </h3>

      {/* Content */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
        {/* Left: Green Exclamation icon + Explanation text */}
        <div className="flex items-start gap-3.5 flex-1">
          <GreenExclamationIcon />
          <p className="text-xs md:text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
            Seluruh data kependudukan Anda ditarik otomatis berdasarkan NIK dari
            database kependudukan nasional. Anda tidak perlu mengisi ulang data
            yang sudah tersedia. Cukup datang sesuai jadwal dengan membawa diri
            Anda.
          </p>
        </div>

        {/* Right: KTP & Security Shield illustration */}
        <KtpIllustration />
      </div>
    </div>
  );
}

