import React from "react";

/**
 * Icon for "Ajukan KTP Baru"
 * Document with folded corner, horizontal text lines, and a blue '+' circular badge.
 */
export function AjukanKtpIcon() {
  return (
    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#EBF3FF] dark:bg-blue-950/60 flex items-center justify-center mb-4 transition-transform group-hover:scale-105 select-none">
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Document sheet */}
        <path
          d="M8 5C8 3.89543 8.89543 3 10 3H21.5L28 9.5V27C28 28.1046 27.1046 29 26 29H10C8.89543 29 8 28.1046 8 27V5Z"
          fill="#3B82F6"
        />
        {/* Folded corner */}
        <path
          d="M21.5 3V8C21.5 8.82843 22.1716 9.5 23 9.5H28L21.5 3Z"
          fill="#93C5FD"
        />
        {/* Lines */}
        <rect x="12" y="13.5" width="10" height="2" rx="1" fill="white" />
        <rect x="12" y="17.5" width="8" height="2" rx="1" fill="white" />
        <rect x="12" y="21.5" width="6" height="2" rx="1" fill="white" />
        {/* Plus Badge */}
        <circle
          cx="25.5"
          cy="25.5"
          r="6.5"
          fill="#1D4ED8"
          stroke="white"
          strokeWidth="1.5"
        />
        <path
          d="M25.5 22.5V28.5M22.5 25.5H28.5"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Icon for "Tracking Pengajuan KTP"
 * Document with folded corner, horizontal text lines, and a blue magnifying glass circular badge.
 */
export function TrackingKtpIcon() {
  return (
    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#EBF3FF] dark:bg-blue-950/60 flex items-center justify-center mb-4 transition-transform group-hover:scale-105 select-none">
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Document sheet */}
        <path
          d="M8 5C8 3.89543 8.89543 3 10 3H21.5L28 9.5V27C28 28.1046 27.1046 29 26 29H10C8.89543 29 8 28.1046 8 27V5Z"
          fill="#3B82F6"
        />
        {/* Folded corner */}
        <path
          d="M21.5 3V8C21.5 8.82843 22.1716 9.5 23 9.5H28L21.5 3Z"
          fill="#93C5FD"
        />
        {/* Lines */}
        <rect x="12" y="13.5" width="10" height="2" rx="1" fill="white" />
        <rect x="12" y="17.5" width="8" height="2" rx="1" fill="white" />
        <rect x="12" y="21.5" width="6" height="2" rx="1" fill="white" />
        {/* Search Badge */}
        <circle
          cx="25.5"
          cy="25.5"
          r="6.5"
          fill="#1D4ED8"
          stroke="white"
          strokeWidth="1.5"
        />
        {/* Magnifying Glass Lens */}
        <circle
          cx="24.5"
          cy="24.5"
          r="2.4"
          stroke="white"
          strokeWidth="1.3"
        />
        {/* Magnifying Glass Handle */}
        <path
          d="M26.5 26.5L28.5 28.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Green circular alert icon with exclamation mark for "Informasi Layanan"
 */
export function GreenExclamationIcon() {
  return (
    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#107C41] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm select-none">
      <svg
        width="20"
        height="20"
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
  );
}

