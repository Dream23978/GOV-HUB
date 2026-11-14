import React from "react";

export interface TimelineStep {
  id: string;
  title: string;
  timestamp?: string;
  statusTag?: string;
  description: string;
  state: "completed" | "current" | "pending";
}

interface TrackingTimelineCardProps {
  steps?: TimelineStep[];
  statusRaw?: string;
}

function buildStepsFromStatus(statusRaw?: string): TimelineStep[] {
  const s = statusRaw || "menunggu_verifikasi";
  const isRejected = s === "ditolak";
  const isVerifCurrent = s === "menunggu_verifikasi" || s === "pengajuan_ulang";
  const isBioCurrent = s === "diproses";
  const isCetakCurrent = s === "menunggu_cetak";
  const isDone = s === "selesai";

  return [
    {
      id: "1",
      title: "Pengajuan Diterima",
      description: "Data pengajuan berhasil diterima sistem.",
      state: "completed",
    },
    {
      id: "2",
      title: "Verifikasi Data",
      statusTag: isRejected ? "Ditolak" : isVerifCurrent ? "Proses saat ini" : undefined,
      description: isRejected
        ? "Pengajuan ditolak saat proses verifikasi petugas."
        : isVerifCurrent
        ? "Data kependudukan sedang diverifikasi oleh petugas."
        : "Data kependudukan berhasil diverifikasi.",
      state: isRejected || isVerifCurrent ? "current" : "completed",
    },
    {
      id: "3",
      title: "Perekaman Biometrik",
      statusTag: isBioCurrent ? "Proses saat ini" : undefined,
      description:
        "Silakan datang sesuai jadwal perekaman foto dan sidik jari yang terkonfirmasi.",
      state: isRejected || isVerifCurrent ? "pending" : isBioCurrent ? "current" : "completed",
    },
    {
      id: "4",
      title: "Menunggu Cetak",
      statusTag: isCetakCurrent ? "Proses saat ini" : undefined,
      description: isCetakCurrent
        ? "Perekaman biometrik selesai. KTP-el sedang dalam proses pencetakan."
        : "Menunggu proses pencetakan.",
      state: isDone ? "completed" : isCetakCurrent ? "current" : "pending",
    },
    {
      id: "5",
      title: "KTP Selesai",
      statusTag: isDone ? "Selesai" : undefined,
      description: "Pengambilan atau penyerahan sesuai layanan yang tersedia.",
      state: isDone ? "completed" : "pending",
    },
  ];
}

export function TrackingTimelineCard({
  steps,
  statusRaw,
}: TrackingTimelineCardProps) {
  const resolvedSteps = steps ?? buildStepsFromStatus(statusRaw);
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-5 md:p-6 mb-4 w-full">
      {/* Title */}
      <h2 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-5 leading-tight">
        Status Proses Pengajuan
      </h2>

      {/* Vertical Timeline */}
      <div className="flex flex-col">
        {resolvedSteps.map((step, index) => {
          const isLast = index === resolvedSteps.length - 1;

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

