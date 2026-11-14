import React from "react";
import { TrackingPengajuanContent } from "@/app/components/layanan-bansos/TrackingPengajuanContent";
import { getCitizenDesilTrackingData } from "@/lib/services/bansos.service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengajuan Saya - Tracking Pengajuan | GOV-HUB",
  description: "Pantau status pengajuan layanan publik dan peninjauan desil bansos Anda.",
};

export default async function PengajuanSayaPage() {
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

