"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  instansi: "dinsos" | "dukcapil";
  roleTitle: string;
  instansiName: string;
  adminName?: string;
  basePath: string;
}

export function AdminDashboardLayout({
  children,
  instansi,
  roleTitle,
  instansiName,
  adminName = "Petugas Desil 14",
  basePath,
}: AdminDashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-row"
      style={{
        backgroundImage: "url('/bg-dash.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Sidebar Admin Instansi (Responsive Desktop + Mobile Drawer) */}
      <AdminSidebar
        instansi={instansi}
        roleTitle={roleTitle}
        basePath={basePath}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all">
        {/* Top Header */}
        <AdminHeader
          instansiName={instansiName}
          roleBadge={`${instansiName} • ${roleTitle}`}
          adminName={adminName}
          onToggleSidebar={() => setMobileMenuOpen((prev) => !prev)}
        />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 flex justify-center">
          <div className="w-full max-w-5xl mx-auto min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
