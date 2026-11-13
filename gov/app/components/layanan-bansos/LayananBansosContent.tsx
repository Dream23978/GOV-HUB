"use client";

import React from "react";
import { LayananBansosHeader } from "./LayananBansosHeader";
import { DesilStatusCard } from "./DesilStatusCard";
import { LayananBansosSection } from "./LayananBansosSection";

interface LayananBansosContentProps {
  initialDesil?: number;
}

export function LayananBansosContent({
  initialDesil = 4,
}: LayananBansosContentProps) {
  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header with Back Button */}
      <LayananBansosHeader />

      {/* Top Status Card: Desil Saat Ini */}
      <DesilStatusCard
        desil={initialDesil}
        penetapanTerakhir="12 Maret 2025"
        sumberData={["DTKS", "BPS", "Dukcapil"]}
        statusText="Terdaftar dalam Data Kesejahteraan"
      />

      {/* Layanan Section */}
      <LayananBansosSection />
    </div>
  );
}

