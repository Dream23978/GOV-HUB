import React from "react";

export interface TimelineStep {
  id: string;
  title: string;
  timestamp?: string;
  statusTag?: string;
  description: string;
  state: "completed" | "current" | "pending";
}

const DEFAULT_TIMELINE_STEPS: TimelineStep[] = [
  {
    id: "1",
    title: "Pengajuan Diterima",
    timestamp: "28 September 2026 • 09.00",
    description: "Data pengajuan berhasil diterima sistem.",
    state: "completed",
  },
  {
    id: "2",
    title: "Verifikasi Data",
    timestamp: "28 September 2026 • 09.15",
    description: "Data kependudukan berhasil diverifikasi.",
    state: "completed",
  },
  {
    id: "3",
    title: "Perekaman Biometrik",
    statusTag: "Proses saat ini",
    description:
      "Silakan datang sesuai jadwal perekaman foto dan sidik jari yang terkonfirmasi.",
    state: "current",
  },
  {
    id: "4",
    title: "Menunggu Cetak",
    description: "Menunggu proses pencetakan.",
    state: "pending",
  },
  {
    id: "5",
    title: "KTP Selesai",
    description: "Pengambilan atau penyerahan sesuai layanan yang tersedia.",
    state: "pending",
  },
];

interface TrackingTimelineCardProps {
  steps?: TimelineStep[];
}

export function TrackingTimelineCard({
  steps = DEFAULT_TIMELINE_STEPS,
}: TrackingTimelineCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-5 md:p-6 mb-4 w-full">
      {/* Title */}
      <h2 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-5 leading-tight">
        Status Proses Pengajuan
      </h2>

      {/* Vertical Timeline */}
      <div className="flex flex-col">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          // Dot Color
          let dotColorClass = "bg-gray-400 dark:bg-slate-600";
          if (step.state === "completed") {
            dotColorClass = "bg-[#107C41]";
          } else if (step.state === "current") {
            dotColorClass = "bg-[#2563EB]";
          }

          // Line Color
          let lineColorClass = "bg-gray-200 dark:bg-slate-700";
          if (step.state === "completed") {
            lineColorClass = "bg-[#107C41]";
          }

          return (
            <div key={step.id} className="flex gap-3.5 relative">
              {/* Node Column */}
              <div className="flex flex-col items-center flex-shrink-0">
                {/* Dot */}
                <div
                  className={`w-3.5 h-3.5 rounded-full ${dotColorClass} flex-shrink-0 z-10 mt-1 shadow-xs`}
                />
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`w-[2px] flex-1 min-h-[38px] ${lineColorClass} my-0.5`}
                  />
                )}
              </div>

              {/* Content Column */}
              <div className={`flex flex-col flex-1 ${!isLast ? "pb-4" : "pb-1"}`}>
                {/* Step Title & Timestamp or Status Tag */}
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`text-xs md:text-[13px] font-bold leading-tight ${
                      step.state === "pending"
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {step.title}
                  </h3>
                </div>

                {step.timestamp && (
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                    {step.timestamp}
                  </span>
                )}

                {step.statusTag && (
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                    {step.statusTag}
                  </span>
                )}

                {/* Description */}
                <p
                  className={`text-xs leading-relaxed mt-0.5 ${
                    step.state === "pending"
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

