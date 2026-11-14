"use client";

import React from "react";
import { LayananBansosHeader } from "./LayananBansosHeader";
import { DesilStatusCard } from "./DesilStatusCard";
import { LayananBansosSection } from "./LayananBansosSection";

interface LayananBansosContentProps {
  initialDesil?: number | string;
  initialPenetapan?: string;
}

export function LayananBansosContent({
  initialDesil = "-",
  initialPenetapan = "-",
}: LayananBansosContentProps) {
  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header with Back Button */}
      <LayananBansosHeader />

      {/* Top Status Card: Desil Saat Ini */}
      <DesilStatusCard
        desil={initialDesil}
        penetapanTerakhir={initialPenetapan}
        sumberData={["DTKS", "BPS", "Dukcapil"]}
        statusText="Terdaftar dalam Data Kesejahteraan"
      />

      {/* Layanan Section */}
      <LayananBansosSection />
    </div>
  );
}

