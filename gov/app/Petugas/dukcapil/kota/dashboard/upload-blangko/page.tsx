import React from "react";
import { AdminDashboardLayout } from "@/app/components/petugas/AdminDashboardLayout";
import { UploadBlangkoContent } from "@/app/components/petugas/dukcapil/UploadBlangkoContent";

export const metadata = {
  title: "Blangko KTP - Disdukcapil Kota | GOV-HUB",
  description: "Konfirmasi pembuatan dan pengelolaan blangko KTP Disdukcapil Kota.",
};

export default function DukcapilKotaUploadBlangkoPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Disdukcapil Kota"
      adminName="Operator KTP 07"
      basePath="/petugas/dukcapil/kota/dashboard"
    >
      <UploadBlangkoContent />
    </AdminDashboardLayout>
  );
}

