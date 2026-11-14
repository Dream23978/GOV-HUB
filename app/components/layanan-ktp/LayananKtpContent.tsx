import React from "react";
import { LayananKtpHeader } from "./LayananKtpHeader";
import { KtpServiceCard } from "./KtpServiceCard";
import { InformasiLayananCard } from "./InformasiLayananCard";
import { AjukanKtpIcon, TrackingKtpIcon } from "./KtpIcons";

export function LayananKtpContent() {
  return (
    <div className="flex flex-col w-full">
      {/* Page Header with Back Button */}
      <LayananKtpHeader />

      {/* Two Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mb-5 md:mb-6">
        {/* Card 1: Ajukan KTP Baru */}
        <KtpServiceCard
          icon={<AjukanKtpIcon />}
          title="Ajukan KTP Baru"
          description={<p>Ajukan Pembuatan KTP Eletronik</p>}
          href="/dashboard/layanan-ktp/ajukan"
        />

        {/* Card 2: Tracking Pengajuan KTP */}
        <KtpServiceCard
          icon={<TrackingKtpIcon />}
          title="Tracking Pengajuan KTP"
          description={
            <p>
              Lihat status dan proses
              <br className="hidden sm:inline" /> pengajuan KTP Anda secara
              real-time
            </p>
          }
          href="/dashboard/layanan-ktp/tracking"
        />
      </div>

      {/* Informasi Layanan Card */}
      <InformasiLayananCard />
    </div>
  );
}

