import { DashboardContent } from "@/app/components/dashboard/DashboardContent";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6 animate-pulse">
          {/* Skeleton greeting */}
          <div>
            <div className="h-7 w-48 bg-gray-200 dark:bg-slate-700 rounded-lg mb-2" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded-lg" />
          </div>

          {/* Skeleton banner */}
          <div className="h-[130px] bg-gray-200 dark:bg-slate-700 rounded-2xl" />

          {/* Skeleton verification card */}
          <div className="h-[72px] bg-gray-200 dark:bg-slate-700 rounded-2xl" />

          {/* Skeleton service cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-[170px] bg-gray-200 dark:bg-slate-700 rounded-2xl" />
            <div className="h-[170px] bg-gray-200 dark:bg-slate-700 rounded-2xl" />
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
