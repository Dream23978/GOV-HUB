import React from "react";
import { AdminDashboardLayout } from "@/app/components/admin/AdminDashboardLayout";
import { UploadBlangkoContent } from "@/app/components/admin/dukcapil/UploadBlangkoContent";

export const metadata = {
  title: "Upload Data Blangko KTP - Disdukcapil Kota | GOV-HUB",
  description: "Manajemen dan unggah data ketersediaan blangko KTP Disdukcapil Kota.",
};

export default function DukcapilKotaUploadBlangkoPage() {
  return (
    <AdminDashboardLayout
      instansi="dukcapil"
      instansiName="Dinas Dukcapil"
      roleTitle="Disdukcapil Kota"
      adminName="Operator Dukcapil Kota"
      basePath="/admin/dukcapil/kota/dashboard"
    >
      <UploadBlangkoContent />
    </AdminDashboardLayout>
  );
}
