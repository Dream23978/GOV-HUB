"use client";

import { useCallback, useEffect, useRef } from "react";
import type { DesilAdminRow } from "@/lib/services/admin.service";

export interface DesilCountsSummary {
  total: number;
  perluVerifikasi: number;
  disetujui: number;
  ditolak: number;
}

export function getDesilBadgeClass(statusRaw?: string) {
  switch (statusRaw) {
    case "disetujui":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60";
    case "ditolak":
      return "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60";
    case "diproses":
      return "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60";
    default:
      return "bg-[#E0F2FE] text-[#0284C7] border-sky-200/70 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60";
  }
}

/**
 * Menjaga daftar pengajuan desil pada dashboard/halaman admin tetap sinkron
 * dengan database Supabase secara otomatis (polling + focus/visibility refresh).
 */
export function useLiveDesilSync<T>(
  mapRows: (rows: DesilAdminRow[]) => T[],
  onSynced: (items: T[], counts?: DesilCountsSummary) => void,
  intervalMs = 5000
) {
  const mapRef = useRef(mapRows);
  const onSyncedRef = useRef(onSynced);

  useEffect(() => {
    mapRef.current = mapRows;
    onSyncedRef.current = onSynced;
  }, [mapRows, onSynced]);

  const syncNow = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/desil-submissions", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json?.success && Array.isArray(json.data)) {
        onSyncedRef.current(mapRef.current(json.data), json.counts);
      }
    } catch {
      // Abaikan gangguan jaringan sementara pada background polling
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") {
        void syncNow();
      }
    }, intervalMs);

    const handleFocusOrVisibility = () => {
      if (document.visibilityState === "visible") {
        void syncNow();
      }
    };

    window.addEventListener("focus", handleFocusOrVisibility);
    document.addEventListener("visibilitychange", handleFocusOrVisibility);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", handleFocusOrVisibility);
      document.removeEventListener("visibilitychange", handleFocusOrVisibility);
    };
  }, [intervalMs, syncNow]);

  return { syncNow };
}
