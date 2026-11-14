import React from "react";
import { TrackingPengajuanContent } from "@/app/components/layanan-bansos/TrackingPengajuanContent";
import { getCitizenDesilTrackingData } from "@/lib/services/bansos.service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tracking Pengajuan Desil | GOV-HUB",
  description: "Pantau status verifikasi dan hasil peninjauan desil bansos Anda secara real-time.",
};

export default async function TrackingPengajuanPage() {
  const tracking = await getCitizenDesilTrackingData();

  return (
    <TrackingPengajuanContent
      hasSubmissions={tracking.hasSubmissions}
      submissionId={tracking.submissionId}
      nomorPengajuan={tracking.nomorPengajuan}
      tanggalPengajuan={tracking.tanggalPengajuan}
      namaPemohon={tracking.namaPemohon}
      nikPemohon={tracking.nikPemohon}
      desilAwal={tracking.desilAwal}
      desilBaru={tracking.desilBaru}
      statusTerakhir={tracking.statusTerakhir}
      statusRaw={tracking.statusRaw}
      catatanVerifikasi={tracking.catatanVerifikasi}
      housePhoto={tracking.housePhoto}
    />
  );
}

