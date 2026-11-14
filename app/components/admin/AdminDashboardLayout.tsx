"use client";

import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AutoRefresh } from "@/app/components/AutoRefresh";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  instansi: "dinsos" | "dukcapil" | "pusat";
  roleTitle: string;
  instansiName: string;
  adminName?: string;
  wilayahLabel?: string;
  basePath: string;
  showRoleSubtitle?: boolean;
}

export function AdminDashboardLayout({
  children,
  instansi,
  roleTitle,
  instansiName,
  adminName = "Petugas",
  wilayahLabel,
  basePath,
  showRoleSubtitle = false,
}: AdminDashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  const roleBadge = wilayahLabel
    ? `${instansiName} • ${roleTitle} (${wilayahLabel})`
    : `${instansiName} • ${roleTitle}`;

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundImage: "url('/bg-dash.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <AutoRefresh intervalMs={5000} />
      <AdminSidebar
        instansi={instansi}
        roleTitle={roleTitle}
        basePath={basePath}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        showRoleSubtitle={showRoleSubtitle}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all">
        <AdminHeader
          instansiName={instansiName}
          roleBadge={roleBadge}
          adminName={adminName}
          profileHref={`${basePath}/pengaturan`}
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center">
          <div className="w-full max-w-5xl mx-auto min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
