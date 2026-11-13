import React from "react";
import { AdminHeroSection } from "@/app/components/admin/AdminHeroSection";

export const metadata = {
  title: "Portal Administrator & Petugas Verifikasi | GOV-HUB",
  description: "Pusat Kendali Pengelolaan Layanan Terpadu Bansos, DTKS, dan Dukcapil Pemerintah Republik Indonesia.",
};

export default function AdminHomePage() {
  return (
    <main>
      <AdminHeroSection />
    </main>
  );
}

