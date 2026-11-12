import { DashboardSidebar } from "@/app/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/app/components/dashboard/DashboardTopbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:ml-[152px] ml-0 min-w-0 transition-all">
        {/* Topbar */}
        <DashboardTopbar />

        {/* Page content — Centered horizontally */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8 flex justify-center">
          <div className="w-full max-w-2xl mx-auto min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
