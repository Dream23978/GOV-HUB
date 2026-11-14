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
  basePath: string;
  showRoleSubtitle?: boolean;
}

export function AdminDashboardLayout({
  children,
  instansi,
  roleTitle,
  instansiName,
  adminName = "Petugas",
  basePath,
  showRoleSubtitle = false,
}: AdminDashboardLayoutProps) {
  const [liveAdminName, setLiveAdminName] = React.useState(adminName);
  const [liveRoleBadge, setLiveRoleBadge] = React.useState(`${instansiName} • ${roleTitle}`);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("govhub_admin_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.nama) setLiveAdminName(parsed.nama);
        if (parsed.wilayah) setLiveRoleBadge(`${instansiName} • ${roleTitle} (${parsed.wilayah})`);
      }
    } catch {
      // ignore
    }
  }, [instansiName, roleTitle]);

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
      <AutoRefresh intervalMs={3000} />
      {/* Sidebar Admin Instansi */}
      <AdminSidebar
        instansi={instansi}
        roleTitle={roleTitle}
        basePath={basePath}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        showRoleSubtitle={showRoleSubtitle}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all">
        {/* Top Header */}
        <AdminHeader
          instansiName={instansiName}
          roleBadge={liveRoleBadge}
          adminName={liveAdminName}
          profileHref={`${basePath}/pengaturan`}
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center">
          <div className="w-full max-w-5xl mx-auto min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

