import React from "react";

export function NoUploadNotice() {
  return (
    <div className="bg-[#E8F1FC] dark:bg-blue-950/40 rounded-xl border border-[#C6DDFC] dark:border-blue-900/50 p-3.5 px-4 flex items-center gap-3.5 shadow-sm mb-4">
      {/* Green circular exclamation icon */}
      <div className="w-8 h-8 rounded-full bg-[#107C41] flex items-center justify-center flex-shrink-0 select-none shadow-sm">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 7V13.5"
            stroke="white"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="17.5" r="1.5" fill="white" />
        </svg>
      </div>

      {/* Notice text */}
      <div>
        <p className="font-bold text-xs md:text-[13px] text-gray-900 dark:text-white leading-tight">
          Tidak perlu upload fotokopi kk, Akta atau ijazah
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 leading-tight">
          Data di tarik data database kependudukan.
        </p>
      </div>
    </div>
  );
}

