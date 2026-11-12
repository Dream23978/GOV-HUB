export function IndonesiaMap() {
  return (
    <svg
      viewBox="0 0 320 130"
      className="w-64 md:w-80 h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="dotPattern"
          x="0"
          y="0"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2.5" cy="2.5" r="1.8" fill="#93C5FD" opacity="0.85" />
        </pattern>
      </defs>

      {/* Sumatra — large diagonal NW-SE island */}
      <polygon
        points="15,28 24,8 42,4 60,10 78,24 98,42 110,58 112,67 96,70 78,58 58,42 36,26 18,26"
        fill="url(#dotPattern)"
      />

      {/* Java — long thin horizontal island */}
      <polygon
        points="62,74 80,67 112,67 142,70 160,76 156,86 122,87 88,84 64,82"
        fill="url(#dotPattern)"
      />

      {/* Kalimantan — large central island */}
      <polygon
        points="108,10 140,2 170,5 184,18 190,45 184,72 162,76 136,73 110,60 103,33"
        fill="url(#dotPattern)"
      />

      {/* Sulawesi — K / spider shape */}
      <polygon
        points="192,10 204,17 202,32 213,44 224,55 220,66 209,62 201,50 193,55 182,49 184,34 190,22"
        fill="url(#dotPattern)"
      />

      {/* Bali + Nusa Tenggara chain */}
      <ellipse cx="163" cy="87" rx="4" ry="2.5" fill="url(#dotPattern)" />
      <ellipse cx="174" cy="89" rx="3.5" ry="2" fill="url(#dotPattern)" />
      <ellipse cx="184" cy="91" rx="3" ry="2" fill="url(#dotPattern)" />
      <ellipse cx="193" cy="92" rx="2.5" ry="1.8" fill="url(#dotPattern)" />
      <ellipse cx="201" cy="93" rx="2" ry="1.6" fill="url(#dotPattern)" />
      <ellipse cx="209" cy="93" rx="1.8" ry="1.4" fill="url(#dotPattern)" />

      {/* Maluku — small scattered islands */}
      <ellipse cx="230" cy="35" rx="5" ry="4" fill="url(#dotPattern)" />
      <ellipse cx="238" cy="48" rx="4" ry="3.5" fill="url(#dotPattern)" />
      <ellipse cx="233" cy="60" rx="3.5" ry="3" fill="url(#dotPattern)" />
      <ellipse cx="225" cy="71" rx="4" ry="3" fill="url(#dotPattern)" />

      {/* Papua — large far-right island */}
      <polygon
        points="242,14 272,8 298,24 302,54 292,74 268,80 246,76 236,60 234,38"
        fill="url(#dotPattern)"
      />

      {/* Small eastern islands */}
      <ellipse cx="305" cy="80" rx="5" ry="3" fill="url(#dotPattern)" />
      <ellipse cx="314" cy="90" rx="3.5" ry="2" fill="url(#dotPattern)" />
    </svg>
  );
}
