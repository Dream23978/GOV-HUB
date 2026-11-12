import React from "react";

export function KtpIllustration() {
  return (
    <div className="relative w-[150px] md:w-[165px] h-[85px] md:h-[92px] flex-shrink-0 select-none">
      <svg
        viewBox="0 0 170 95"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain"
      >
        {/* === Layer 1: Background Skyscrapers / City Buildings === */}
        <g opacity="0.85">
          {/* Tall building center-right */}
          <rect x="108" y="12" width="22" height="74" rx="2" fill="#E2E8F0" />
          {/* Windows on tall building */}
          <rect x="112" y="18" width="4" height="4" rx="0.5" fill="#CBD5E1" />
          <rect x="122" y="18" width="4" height="4" rx="0.5" fill="#CBD5E1" />
          <rect x="112" y="26" width="4" height="4" rx="0.5" fill="#CBD5E1" />
          <rect x="122" y="26" width="4" height="4" rx="0.5" fill="#CBD5E1" />
          <rect x="112" y="34" width="4" height="4" rx="0.5" fill="#CBD5E1" />
          <rect x="122" y="34" width="4" height="4" rx="0.5" fill="#CBD5E1" />
          <rect x="112" y="42" width="4" height="4" rx="0.5" fill="#CBD5E1" />
          <rect x="122" y="42" width="4" height="4" rx="0.5" fill="#CBD5E1" />
          <rect x="112" y="50" width="4" height="4" rx="0.5" fill="#CBD5E1" />
          <rect x="122" y="50" width="4" height="4" rx="0.5" fill="#CBD5E1" />

          {/* Building behind right */}
          <rect x="132" y="26" width="18" height="60" rx="2" fill="#EAEFF5" />
          <rect x="136" y="32" width="3.5" height="3.5" rx="0.5" fill="#CBD5E1" />
          <rect x="143" y="32" width="3.5" height="3.5" rx="0.5" fill="#CBD5E1" />
          <rect x="136" y="40" width="3.5" height="3.5" rx="0.5" fill="#CBD5E1" />
          <rect x="143" y="40" width="3.5" height="3.5" rx="0.5" fill="#CBD5E1" />
          <rect x="136" y="48" width="3.5" height="3.5" rx="0.5" fill="#CBD5E1" />
          <rect x="143" y="48" width="3.5" height="3.5" rx="0.5" fill="#CBD5E1" />

          {/* Building mid-left */}
          <rect x="92" y="22" width="16" height="64" rx="2" fill="#DFE7F1" />
          <rect x="96" y="28" width="3.5" height="3.5" rx="0.5" fill="#CBD5E1" />
          <rect x="101" y="28" width="3.5" height="3.5" rx="0.5" fill="#CBD5E1" />
          <rect x="96" y="36" width="3.5" height="3.5" rx="0.5" fill="#CBD5E1" />
          <rect x="101" y="36" width="3.5" height="3.5" rx="0.5" fill="#CBD5E1" />
        </g>

        {/* === Layer 2: e-KTP Card === */}
        {/* Card shadow */}
        <rect
          x="3"
          y="19"
          width="112"
          height="66"
          rx="8"
          fill="#000000"
          fillOpacity="0.06"
        />

        {/* Card body */}
        <rect
          x="2"
          y="17"
          width="112"
          height="66"
          rx="8"
          fill="#D6E6FA"
          stroke="#BFDBFE"
          strokeWidth="1"
        />

        {/* User photo avatar on card left */}
        <g>
          {/* Head */}
          <circle cx="21" cy="36" r="6" fill="#1D4ED8" />
          {/* Shoulders */}
          <path
            d="M13 52C13 46.8 16.5 44.5 21 44.5C25.5 44.5 29 46.8 29 52H13Z"
            fill="#1D4ED8"
          />
        </g>

        {/* Text lines on card right */}
        {/* Header / NIK line */}
        <rect x="36" y="28" width="40" height="3.5" rx="1.75" fill="#1D4ED8" />
        {/* Nama */}
        <rect x="36" y="35" width="50" height="2.5" rx="1.25" fill="#2563EB" />
        {/* Tempat/Tgl Lahir */}
        <rect x="36" y="41" width="36" height="2.5" rx="1.25" fill="#3B82F6" />
        {/* Alamat */}
        <rect x="36" y="47" width="44" height="2.5" rx="1.25" fill="#60A5FA" />
        {/* Agama / Status */}
        <rect x="36" y="53" width="28" height="2.5" rx="1.25" fill="#93C5FD" />

        {/* Small Garuda / Bird emblem silhouette in top right */}
        <path
          d="M74 23C75 22 77 21 79 22C80 21 82 22 83 23C81.5 24 81 25.5 80 26C78.5 25.5 77 24.5 74 23Z"
          fill="#3B82F6"
          opacity="0.8"
        />

        {/* === Layer 3: Foreground Security Shield with Checkmark === */}
        {/* Shield drop shadow */}
        <path
          d="M112 43C112 43 123 41 127 39C131 41 142 43 142 43C142 59 133 71.5 127 77.5C121 71.5 112 59 112 43Z"
          fill="#000000"
          fillOpacity="0.1"
          transform="translate(1, 2)"
        />

        {/* Shield base */}
        <path
          d="M112 43C112 43 123 41 127 39C131 41 142 43 142 43C142 59 133 71.5 127 77.5C121 71.5 112 59 112 43Z"
          fill="#1D4ED8"
          stroke="#FFFFFF"
          strokeWidth="1.8"
        />

        {/* Shield inner highlight */}
        <path
          d="M114.5 44.5C118 43.5 124 42 127 41C130 42 136 43.5 139.5 44.5C139.5 57.5 132 67.5 127 72.5C122 67.5 114.5 57.5 114.5 44.5Z"
          fill="#2563EB"
        />

        {/* Checkmark inside shield */}
        <path
          d="M121 57.5L125 61.5L133.5 52.5"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

