import { DashboardSidebar } from "@/app/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/app/components/dashboard/DashboardTopbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col ml-[152px]">
        {/* Topbar */}
        <DashboardTopbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
