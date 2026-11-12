import { LayananKtpContent } from "@/app/components/layanan-ktp/LayananKtpContent";
import { Suspense } from "react";

export const metadata = {
  title: "Layanan KTP & Dukcapil | GOV-HUB",
  description: "Kelola layanan administrasi kependudukan anda dengan mudah.",
};

export default function LayananKtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6 animate-pulse w-full">
          {/* Header skeleton */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700" />
            <div>
              <div className="h-6 w-52 bg-gray-200 dark:bg-slate-700 rounded-md mb-2" />
              <div className="h-4 w-72 bg-gray-200 dark:bg-slate-700 rounded-md" />
            </div>
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-[260px] bg-gray-200 dark:bg-slate-700 rounded-2xl" />
            <div className="h-[260px] bg-gray-200 dark:bg-slate-700 rounded-2xl" />
          </div>

          {/* Bottom card skeleton */}
          <div className="h-[120px] bg-gray-200 dark:bg-slate-700 rounded-2xl" />
        </div>
      }
    >
      <LayananKtpContent />
    </Suspense>
  );
}

